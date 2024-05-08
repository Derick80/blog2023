import { json, LoaderFunctionArgs } from '@remix-run/node';
import { z } from 'zod';


const CategorySchema = z.object({
    category: z.string() || z.array(z.string())
})

export async function loader({ params }: LoaderFunctionArgs) {
    const { category } = CategorySchema.parse(params)
    if (!category) throw new Error('No category found')


    return json({ category })
}