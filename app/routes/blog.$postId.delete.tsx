import type { ActionArgs} from '@remix-run/node';
import { redirect } from '@remix-run/node'
import { isAuthenticated, setUserSessionAndCommit } from '~/server/auth/auth.server'
import { prisma } from '~/server/auth/prisma.server'
import { commitSession, getSession, setErrorMessage, setSuccessMessage } from '~/server/auth/session.server'



export async function action({request, params}:ActionArgs){

    const user = await isAuthenticated(request)
    if(!user){
        return new Response('Unauthorized', {status: 401})
    }
    const session = await getSession(request.headers.get('Cookie'))
    const postId = params.postId
    if(typeof postId !== 'string'){
        return new Response('Invalid postId', {status: 400})
    }

    const post = await prisma.post.delete({
        where: {
            id: postId,

        }
    })


    if(!post){
        setErrorMessage(session, 'Could not delete post')
    }else{
        setSuccessMessage(session, 'post deleted successfully')
    }

    return redirect('/blog', {headers:{
        'Set-Cookie': await commitSession(session)
    }})


}