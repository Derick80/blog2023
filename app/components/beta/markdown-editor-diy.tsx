import { Link, useFetcher, useSearchParams } from '@remix-run/react'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'


const MarkdownEditorDiy = ({ content }: {
    content?: string

}) => {
    const fetcher = useFetcher()
    console.log(fetcher?.data,'fetcher?.data');

    const [searchParams] = useSearchParams({ tab: "edit" })

    return (
        <div
        >
<div>
        <Link to="?tab=edit">Edit</Link>
        <Link to="?tab=preview"> Preview </Link>
            </div>


            { searchParams.get("tab") === "edit" ? (

            <fetcher.Form
                method='POST'
                onChange={ (event) => {
                    fetcher.submit(event.currentTarget, {

                        })
                } }
            >
                <Label
                    htmlFor='content'
                />
                <Textarea
                    id='content'
                    name='content'
                    placeholder='Write your markdown here'
                    rows={ 8 }
defaultValue={content || ''}
                />
                <div
                >
                    <Button
                        type='submit'
                        variant='default'
                    >
                        Save
                    </Button>
                </div>

                </fetcher.Form>
            ):(
            <div
                dangerouslySetInnerHTML={ {
                    __html: fetcher.data  || ''
                } }
                    />
                )
            }
            <div
                dangerouslySetInnerHTML={ {
                    __html: fetcher.data || ''
                } }
            />
        </div>

    )
}

export default MarkdownEditorDiy