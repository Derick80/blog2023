import { useActionData, useFetcher } from '@remix-run/react'
import React from 'react'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'



const FeaturedToggle = ({ isFeatured, postId }: { isFeatured: boolean, postId: string }) => {
    const [isChecked, setChecked] = React.useState(isFeatured)


    const actionData = useActionData<{ errors: Record<string, string> }>()
    const featuredFetcher = useFetcher()

    const handleFeaturedToggle = () => {

        setChecked(!isChecked)

        featuredFetcher.submit({
            intent: 'featured',
            postId,
            featured: !isChecked
        }, {
            method: 'POST',
            action: `/blog/drafts/${postId}`,
        }

        )
    }

    return (
        <div className="flex items-center space-x-4">
            <Switch
                onCheckedChange={ handleFeaturedToggle }
                className='w-8 h-4'
                checked={ isChecked }
                aria-label='featured'
                aria-invalid={ Boolean(actionData?.errors?.featured) || undefined }
                aria-errormessage={
                    actionData?.errors?.featured ? 'featured-error' : undefined
                }

            />
            <Label

            >
                Featured Post
            </Label>
            <input type='hidden' name='featured' value={ isChecked.toString() } />
        </div>
    )
}

export default FeaturedToggle