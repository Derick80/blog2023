import { ExternalLinkIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import { Link } from '@remix-run/react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '~/components/ui/card'
import { P, Small } from '~/components/ui/typography'
import { Project } from './projects'

const ProjectCard = ({ project }: { project: Project }) => {
    return (
        <Card key={project.id} className='w-full md:w-3/4 lg:w-1/2 xl:w-1/3'>
            <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
            </CardHeader>

            <CardContent>
                <P>Features</P>
                <ul>
                    {project.features.map((feature) => (
                        <li key={feature.id}>{feature.value}</li>
                    ))}
                </ul>
                <div className='flex flex-row gap-2 w-full flex-wrap'>
                    {project.technologyStacks.map((tech) => (
                        <Badge key={tech.id}>
                            <Link
                                prefetch='intent'
                                to={tech.url}
                                target='_blank'
                                rel='noreferrer'
                            >
                                {tech.value}
                            </Link>
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className='flex flex-row justify-between items-center gap-2'>
                <Button
                    variant='ghost'
                    size='default'
                    className='flex flex-row items-center gap-1'
                    asChild
                >
                    {project.githubUrl && (
                        <Link
                            prefetch='intent'
                            to={project.githubUrl}
                            target='_blank'
                            rel='noreferrer'
                            className='flex flex-row items-center gap-1'
                        >
                            <Small>GitHub</Small>
                            <GitHubLogoIcon />
                        </Link>
                    )}
                </Button>
                <Button
                    variant='ghost'
                    size='default'
                    className='flex flex-row items-center gap-1'
                    asChild
                >
                    {project.projectUrl && (
                        <Link
                            prefetch='intent'
                            to={project.projectUrl}
                            target='_blank'
                            rel='noreferrer'
                            className='flex flex-row items-center gap-1'
                        >
                            <Small className='sm:hidden md:block'>Live</Small>
                            <ExternalLinkIcon />
                        </Link>
                    )}
                </Button>
                {project.status && project.status}
            </CardFooter>
        </Card>
    )
}

export default ProjectCard
