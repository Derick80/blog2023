import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './ui/select'


const CreateProject = () => {

    return (
        <Card >
            <CardHeader>
                <CardTitle>
                    Create a new project
                </CardTitle>
                <CardDescription>
                    Create a new project to demonstrate your skills
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Label htmlFor='project-name'>Project Title</Label>
                <Input id='title' name='title' type='text' placeholder='Project Title' />
                <Label htmlFor='project-description'>Project Description</Label>
                <Input id='description' name='description' type='text' placeholder='Project Description' />
                <Label htmlFor='project-technologies'>Project Technologies</Label>
                <Input id='technologies' name='technologies' type='text' placeholder='Project Technologies' />
                <Label htmlFor='projectUrl'>Project Repository</Label>
                <Input id='projectUrl' name='projectUrl' type='text' placeholder='Live project url' />
                <Label htmlFor='githubUrl'>Github Repository</Label>
                <Input id='githubUrl' name='githubUrl' type='text' placeholder='Github repository url' />
                <Label htmlFor='status'>Status</Label>
                <Select>
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="In Progress">
                            In Progress
                        </SelectItem>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="Abandoned">Abandoned</SelectItem>
                    </SelectContent>
                </Select>
            </CardContent>
            <CardFooter>
                <Button
                    variant='default'
                    size='sm'
                >
                    Create Project
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CreateProject