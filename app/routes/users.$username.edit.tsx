

import type { ActionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import {json} from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

import type { LoaderArgs } from '@remix-run/node'
import { redirect} from '@remix-run/node';
import ImageUploader from '~/components/blog-ui/image-fetcher';
import { User } from '~/server/schemas/schemas';
import React from 'react';
import { prisma } from '~/server/auth/prisma.server';
import { commitSession, getSession, setErrorMessage, setSuccessMessage } from '~/server/auth/session.server';
import { z } from 'zod';
import { zx } from 'zodix';
import { validateAction } from '~/utilities';
export async function loader({request, params}: LoaderArgs) {
 const {username} = params;
const user = await isAuthenticated(request);
if (!user) {
return redirect('/login')
}

const currentUser = await prisma.user.findUnique({
where: {
username
},
select: {
id: true,
username: true,
email: true,
avatarUrl: true,
}
})

if(!currentUser) {
return json({error: 'No user found'})
}

return json({currentUser})
}

const schema = z.object({
    imageUrl: z.string().url().min(3 ).max(1000)
})
type ActionInput = z.infer<typeof schema>
export async function action({request, params}: ActionArgs) {
 const {username} = zx.parseParams(params, {username: z.string()});
 if(!username) {
    return json({error: 'No username provided'})
    }
const session = await getSession(request.headers.get('Cookie'));

const user = await isAuthenticated(request);
if (!user) {
return json({error: 'Not authenticated'})
}
const {formData, errors} = await validateAction({request, schema});

if(errors) {
    return json({errors}, {status: 422})
}

const {imageUrl} = formData as ActionInput;

const updatedUser = await prisma.user.update({
where: {
username
},
data: {

avatarUrl: imageUrl
}
})

if(!updatedUser) {
    setErrorMessage(session, 'No user found')
    return redirect('/login')
} else {
    setSuccessMessage(session, 'User updated')
    return redirect(`/users/${updatedUser.username}`, {
        headers: {
            'Set-Cookie': await commitSession(session)
        }
    })
}


}

export default function UserEdit() {
    const actionData = useActionData<{
        errors?: {
            imageUrl?: string
        }

    }>()
    const data = useLoaderData<{
        currentUser: User
    }>()
    const [url, setUrl] = React.useState(data.currentUser.avatarUrl || '')

  return (
    <div
className=''
>
    <ImageUploader setUrl={setUrl} />
    <Form method='post' >
    
   
    <input type='text' name='imageUrl'
        value={url}
        onChange={(e) => setUrl(e.target.value)}
    />
{actionData?.errors?.imageUrl && <p>{actionData?.errors?.imageUrl}</p>
}
    <button type='submit'>Submit</button>

    </Form>
      
    </div>
  );
}