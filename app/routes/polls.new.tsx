import type { ActionArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import {json} from '@remix-run/node';
import { Form } from '@remix-run/react';
import { prisma } from '~/server/auth/prisma.server';
export async function action({request, params}: ActionArgs) {
 
const formData = await request.formData()
const title = formData.get('title')
const description = formData.get('description')
const options = formData.get('options')

const user = await isAuthenticated(request)

const opts = options?.toString().split(',')

const option = opts?.map((opt) => {
    return {
        value: opt
    }
})


const poll = await prisma.poll.create({
    data: {
        title: title as string,
        description: description as string,
        options: {
            create: option
    }
    }

})

return json({poll})
}

export default function PollCreationIndex() {
  return (
    <div
className='border-2 h-full w-full'
>   
<Form method='POST'
    className='flex flex-col  w-full rounded-md border-2'
>   
    <label htmlFor='title'>Title</label>
    <input type='text' name='title' placeholder='Title' />
    <label htmlFor='description'>Description</label>
    <input type='text' name='description' placeholder='Description' />
    <label htmlFor='options'>Options</label>
    <input type='text' name='options' placeholder='Options' />
    
    <button type='submit'>Submit</button>
</Form>

    </div>
  );
}