import { Form, useActionData } from '@remix-run/react'
import { P } from '~/components/ui/typography'
import { DraftType, Post } from '~/server/schemas/schemas'
import PublishToggle from './publish-toggle'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { ActionInput, action } from '~/routes/blog_.drafts_.$postId'


export const BlogEditCard = ({ post }: { post: DraftType }) => {
    const actionData = useActionData<ActionInput>()
    const { title, description, content, published, id, userId, categories, postImages } = post

    return (
        <Form method='POST'>
            <Label htmlFor='title'>Title</Label>
            <Input id='title' name='title' defaultValue={ title }
                aria-invalid={ Boolean(actionData?.errors?.title) || undefined }
                aria-errormessage={
                    actionData?.errors?.title ? 'title-error' : undefined
                }

            />
            <PublishToggle isPublished={ published } postId={ id } />
        </Form>
    )
}