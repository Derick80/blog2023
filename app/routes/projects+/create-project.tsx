import { Form } from '@remix-run/react'
import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '~/components/ui/accordion'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

const CreateProjectComponent = () => {
    return (
        <Accordion type='single'>
            <AccordionItem value='create'>
                <AccordionTrigger>Create Project</AccordionTrigger>

                <AccordionContent>
                    <Form method='POST'>
                        <Label htmlFor='title'> Title</Label>
                        <Input type='text' id='title' name='title' required />
                        <Label htmlFor='description'> Description</Label>
                        <Input
                            type='text'
                            id='description'
                            name='description'
                            required
                        />
                        <Label htmlFor='projectUrl'> Project URL</Label>
                        <Input
                            type='text'
                            id='projectUrl'
                            name='projectUrl'
                            required
                        />
                        <Label htmlFor='githubUrl'> Github URL</Label>
                        <Input
                            type='text'
                            id='githubUrl'
                            name='githubUrl'
                            required
                        />
                        <Label htmlFor='status'> Status</Label>
                        <Select  name='status' required>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                                <SelectItem value="Todo">To Do</SelectItem>
                            </SelectContent>
                        </Select>

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
