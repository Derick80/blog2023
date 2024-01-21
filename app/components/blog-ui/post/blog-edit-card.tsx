import { Form, useActionData, useFetcher } from '@remix-run/react'
import { P } from '~/components/ui/typography'
import { DraftType, Post } from '~/server/schemas/schemas'
import PublishToggle from './publish-toggle'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { ActionInput, action } from '~/routes/blog_.drafts_.$postId'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import TipTap from '~/components/tiptap/tip-tap'
import FeaturedToggle from './featured-toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'


export const BlogEditCard = ({ post }: { post: DraftType }) => {
    const actionData = useActionData<{ errors: Record<string, string> }>()
    const { title, description, content, published, id, userId, categories, postImages } = post


    const deleteFetcher = useFetcher()

    const handleDelete = () => {
        deleteFetcher.submit({
            intent: 'delete',
            postId: id
        }, {
            method: 'POST',
            action: `/blog/drafts/${id}`,
        }

        )
    }


    return (<Card>
        <CardHeader>
            <CardTitle>
                Edit this post
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Form method='POST'
                className='flex flex-col gap-5'
            >
                <input type='hidden' name='postId' value={ id } />

                <Label htmlFor='title'>Title</Label>
                <Input id='title' name='title' defaultValue={ title }
                    aria-invalid={ Boolean(actionData?.errors?.title) || undefined }
                    aria-errormessage={
                        actionData?.errors?.title ? 'title-error' : undefined
                    }

                />
                { actionData?.errors?.title && (
                    <p id='title-error' className='text-red-500'>
                        { actionData?.errors?.title }
                    </p>
                ) }
                <Label htmlFor='description'>Description</Label>
                <Input id='description' name='description' defaultValue={ description }
                    aria-invalid={ Boolean(actionData?.errors?.description) || undefined }
                    aria-errormessage={
                        actionData?.errors?.description ? 'description-error' : undefined
                    }
                />
                { actionData?.errors?.description && (
                    <p id='description-error' role='alert' className='text-red-500'>
                        { actionData?.errors?.description }
                    </p>
                ) }
                <Label htmlFor='content'>Content</Label>
                <TipTap content={ content } />
                { actionData?.errors?.content && (
                    <p id='content-error' role='alert' className='text-red-500'>
                        { actionData?.errors?.content }
                    </p>
                ) }


                <FeaturedToggle isFeatured={ post.featured } postId={ id } />
                <Button
                    type='button'
                    name='intent'
                    value='delete'
                    onClick={ handleDelete }
                    variant='destructive'
                >
                    Delete
                </Button>
                <TooltipProvider>

                    <Tooltip >
                        <TooltipTrigger asChild>
                            <Button
                                type='submit'
                                name='intent'
                                value='update'
                            >
                                save
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className='text-sm'>
                                Saving a post will update the post but not publish it. To publish the post, toggle the publish button.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <PublishToggle isPublished={ published } postId={ id } />
            </Form>
        </CardContent>
    </Card>
    )
}