import { Form, useActionData, useFetcher } from '@remix-run/react'
import { DraftType } from '~/server/schemas/schemas'
import PublishToggle from './publish-toggle'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import TipTap from '~/components/tiptap/tip-tap'
import FeaturedToggle from './featured-toggle'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'
import { useCategories } from '~/utilities'
import CheckSelect from '~/components/check-select'
import ImageController from '~/components/images/image-controller'
import { EditableText } from '~/components/editable-text'
import React from 'react'


export const INTENTS = {
  updateTitle: 'updateTitle' as const,
  updateDescription: 'updateDescription' as const,
  updateContent: 'update-content' as const,

}
const BlogEditCard = ({ post }: { post: DraftType }) => {
  const [content, setContent] = React.useState(post.content)
  const actionData = useActionData<{ errors: Record<string, string> }>()
  const allcategories = useCategories()
  const {
    title,
    description,
    published,
    id,
    userId,
    categories,
    postImages
  } = post

  const deleteFetcher = useFetcher()

  const handleDelete = () => {
    deleteFetcher.submit(
      {
        intent: 'delete',
        postId: id
      },
      {
        method: 'POST',
        action: `/blog/drafts/${id}`
      }
    )
  }

  return (
    <Card className='w-full h-fit'>
      <CardHeader>
        <CardTitle>Edit this post</CardTitle>
      </CardHeader>
      <CardContent>
        <Form method='POST' className='flex flex-col gap-5 w-full'>
          <input type='hidden' name='postId' value={id} />

          <Label htmlFor='title'>Title
          <EditableText
          value={title}
          fieldName="title"
          inputClassName="w-64 h-10 px-4 py-2 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          buttonClassName="my-4 font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-slate-800"
          buttonLabel={`Edit Post "${title}" title`}
          inputLabel="Edit Post Title"
        >
          <input type="hidden" name="intent" value={INTENTS.updateTitle} />
          <input type="hidden" name="postId" value={id} />
        </EditableText>

          {actionData?.errors?.title && (
            <p id='title-error' className='text-red-500'>
              {actionData?.errors?.title}
            </p>
          )}</Label>

          <Label htmlFor='description'>Description</Label>
          <Input
            id='description'
            name='description'
            defaultValue={description}
            aria-invalid={Boolean(actionData?.errors?.description) || undefined}
            aria-errormessage={
              actionData?.errors?.description ? 'description-error' : undefined
            }
          />
          {actionData?.errors?.description && (
            <p id='description-error' role='alert' className='text-red-500'>
              {actionData?.errors?.description}
            </p>
          )}
          {actionData?.errors?.newCategory && (
            <p id='title-error' className='text-red-500'>
              {actionData?.errors?.newCategory}
            </p>
          )}
          <Label htmlFor='content'>Content</Label>
          <TipTap content={ content }
            postId={id}
            setContent={setContent}
          />
          {actionData?.errors?.content && (
            <p id='content-error' role='alert' className='text-red-500'>
              {actionData?.errors?.content}
            </p>
          ) }
                            <ImageController post={post} />

          {actionData?.errors?.newCategory && (
            <p id='categories-error' role='alert' className='text-red-500'>
              {actionData?.errors?.newCategory}
            </p>
          )}
          <CheckSelect
            options={allcategories}
            picked={categories}
            postId={id}
          />
          <FeaturedToggle isFeatured={post.featured} postId={id} />
          <Button
            type='button'
            name='intent'
            value='delete'
            onClick={handleDelete}
            variant='destructive'
          >
            Delete
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type='submit' name='intent' value='update'>
                  save
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-sm'>
                  Saving a post will update the post but not publish it. To
                  publish the post, toggle the publish button.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <PublishToggle isPublished={published} postId={id} />
        </Form>

      </CardContent>
    </Card>
  )
}

export default BlogEditCard
