import { Form } from '@remix-run/react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '~/components/ui/accordion'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

const CreateProjectComponent = () => {
    return (
        <Accordion type='single'>
            <AccordionItem value='create'>
                <AccordionTrigger>Create Project</AccordionTrigger>

                <AccordionContent>
                    <Form method='POST'>
                        <Label htmlFor='title'> Title</Label>
                        <Input type='text' id='title' name='title' required />

                        <Button
                            type='submit'
                            variant='default'
                            size='default'
                            name='_intent'
                            value='create-project'
                        >
                            Create Project
                        </Button>
                    </Form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default CreateProjectComponent
