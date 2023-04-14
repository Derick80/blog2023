import { faker } from '@faker-js/faker'
import { ActionArgs, json } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { z } from 'zod'
import { isAuthenticated } from '~/server/auth/auth.server'
import { prisma } from '~/server/auth/prisma.server'
import { useMatchesData, validateAction } from '~/utilities'


export const schema = z.object({
    title: z.string().min(1).max(100),
    content: z.string().min(1).max(1000),
    categories: z.string().min(1).max(1000).optional()
})


type ActionInput = z.infer<typeof schema>
export async function action({request}:ActionArgs){
    const user = await isAuthenticated(request)
    if(!user){
        return new Response('Unauthorized', {status: 401})
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const categories = formData.get('categories') as string
    if (!categories) {
        return json({ errors: { categories: 'Categories is required' } }, { status: 400 })
    }

const cats = categories?.split(',')
const category = cats.map((cat)=>{
    return {
        value:cat,
    }
})



    const post = await prisma.post.create({
        data: {
            title,
            content,
            imageUrl:faker.internet.avatar(),
            published: true,
            categories:c
            user: {
                connect: { id: user.id }
        }

    }
    })




    return json({ post })

}


export default function NewPostRoute(){
    const matchesData = useMatchesData('root')
    const { categories } = matchesData as { categories: { id: string, value: string, label: string }[] }
    console.log(categories, 'categories');


    return (
        <div
            className='flex flex-col h-screen items-center border-2 w-full'
        >
            <Form method='post'>
                <label htmlFor='title'>Title</label>
                <input
                    id='title'
                    name='title'
                    type='text'
                    placeholder='Title'
                />
                <label htmlFor='content'>Content</label>
                <textarea

                    id='content'
                    name='content'
                    placeholder='Content'
                />
                <label htmlFor='categories'>Categories</label>
                <select name='categories' id='categories' multiple>
{categories.map(category => (
                        <option
                            key={category.id}
                            value={category.value}
                        >
                            {category.label}
                        </option>
                    ))}
                    </select>

                <button type='submit'>Submit</button>
            </Form>
        </div>


    )
}