import { useActionData, useFetcher } from '@remix-run/react'
import React from 'react'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { action } from '~/routes/actions.cloudinary-delete'



const PublishToggle = ({ isPublished, postId }: { isPublished: boolean, postId: string }) => {
    const [isChecked, setChecked] = React.useState(isPublished)
    console.log(isChecked, 'isChecked from publish-component');

    const actionData = useActionData<{ errors: Record<string, string> }>()
    const publishFetcher = useFetcher()

    const handlePublish = () => {
        console.log(isChecked, 'isChecked from publish-toggle');

        setChecked(!isChecked)
        console.log(isChecked, 'isChecked from publish-toggle');
        publishFetcher.submit({
            intent: 'publish',
            postId,
            published: !isChecked
        }, {
            method: 'POST',
            action: `/blog/drafts/${postId}`,
        }

        )
    }

    return (
        <div className="flex items-center space-x-2">
            <Switch
                onCheckedChange={ handlePublish }
                className='w-8 h-4'
                checked={ isChecked }
                aria-label='publish'
                aria-invalid={ Boolean(actionData?.errors?.publish) || undefined }
                aria-errormessage={
                    actionData?.errors?.publish ? 'publish-error' : undefined
                }

            />
            <Label>
                Published
            </Label>
        </div>
    )
}

export default PublishToggle