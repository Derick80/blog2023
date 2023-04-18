import { faker } from '@faker-js/faker'
import { ActionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useFetcher } from '@remix-run/react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { useToast } from '~/components/toaster'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/auth/prisma.server'
import { commitSession, getSession, setErrorMessage, setSuccessMessage } from '~/server/auth/session.server'
import { useMatchesData, validateAction } from '~/utilities'


export const schema = z.object({
    title: z.string().min(1).max(100),
    content: z.string().min(1).max(1000),
    categories: z.array(z.string().min(1).max(100))

})


type ActionInput = z.infer<typeof schema>
export async function action({request}:ActionArgs){
const session = await getSession(request.headers.get('Cookie'))
    const user = await isAuthenticated(request)
    if(!user){
        return new Response('Unauthorized', {status: 401})
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const categories = formData.getAll('categories') as string[]
   if(typeof categories !== 'object'  || typeof content !== 'string' || typeof title !== 'string'){
         setErrorMessage(session, 'Invalid input')
    }

const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const cats = categories.map((category: string) =>{
        return { value: category }
    })



    const post = await prisma.post.create({
        data: {
            title,
            slug,
            content,
            imageUrl:faker.internet.avatar(),
            published: true,
            categories: {
                connectOrCreate: cats.map((category: { value: string }) => ({
                    where: { value: category.value },
                    create: { value: category.value,
                        label: category.value }
                }))

            },

            user: {
                connect: { id: user.id }
        }

    }
    })


    if(!post){

    setErrorMessage(session, 'Could not create post')
    }else{
        setSuccessMessage(session, 'Post created successfully')
    }

    return redirect('/blog/new',{
        headers: {
            'Set-Cookie': await commitSession(session)
        }
    })

}


export default function NewPostRoute(){
    const actionData = useActionData<typeof action>()
    console.log(actionData, 'actionData');
const categoryFetcher = useFetcher()
    useEffect(() => {
        if (categoryFetcher.state === "idle" && categoryFetcher.data == null) {
            categoryFetcher.load("/categories")
        }
    }, [categoryFetcher]);

    const categories = categoryFetcher.data

    console.log(categoryFetcher.data, 'categories');

    useEffect(() => {
        if(actionData?.post){
            toast('Post created', {icon: '🎉'})
        }
    }, [actionData])


    return (
        <div
            className='flex flex-col h-screen items-center border-2 w-full'
        >
            <Form
                className='flex flex-col h-screen items-center border-2 w-full'
            method='post'>
                <label htmlFor='title'>Title</label>
                <input
                    className='border-2'
                    id='title'
                    name='title'
                    type='text'
                    placeholder='Title'
                />
                {

                }
                <label htmlFor='content'>Content</label>
                <textarea

                    id='content'
                    name='content'
                    placeholder='Content'
                />
                <label htmlFor='categories'>Categories</label>
                <div>
                    <select name='categories' id='categories' multiple>
                        { categoryFetcher?.data?.categories.map(category => (
                            <option
                                key={ category.id }
                                value={ category.value }
                            >
                                { category.label }
                            </option>
                        )) }
                    </select>

                </div>
                <button type='submit'>Submit</button>
            </Form>
        </div>


    )
}