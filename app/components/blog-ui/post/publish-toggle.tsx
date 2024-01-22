import { useActionData, useFetcher } from '@remix-run/react'
import { InfoIcon } from 'lucide-react'
import React from 'react'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '~/components/ui/tooltip'

const PublishToggle = ({
  isPublished,
  postId
}: {
  isPublished: boolean
  postId: string
}) => {
  const [isChecked, setChecked] = React.useState(isPublished)

  const actionData = useActionData<{ errors: Record<string, string> }>()
  const publishFetcher = useFetcher()

  const handlePublish = () => {
    setChecked(!isChecked)

    publishFetcher.submit(
      {
        intent: 'publish',
        postId,
        published: !isChecked
      },
      {
        method: 'POST',
        action: `/blog/drafts/${postId}`
      }
    )
  }

  return (
    <div className='flex items-center space-x-4'>
      <Switch
        onCheckedChange={handlePublish}
        className='w-8 h-4'
        checked={isChecked}
        aria-label='publish'
        aria-invalid={Boolean(actionData?.errors?.publish) || undefined}
        aria-errormessage={
          actionData?.errors?.publish ? 'publish-error' : undefined
        }
      />
      <Label>Publish Post</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className='w-4 h-4' />
          </TooltipTrigger>
          <TooltipContent>
            <p className='text-sm'>
              Publishing a post will make it visible to the public and redirect
              you to the post page.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <input type='hidden' name='published' value={isChecked.toString()} />
    </div>
  )
}

export default PublishToggle
