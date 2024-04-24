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
import { H2, H3, P, Small } from '~/components/ui/typography'
import { Project } from '../../content/projects/projects'

const ProjectCard = ({ project }: { project: Project }) => {
    return (
        <Card key={project.id} className='w-full bg-secondary'>
            <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
            </CardHeader>

            <CardContent>
                <H2>Features</H2>
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
            <CardFooter className='flex flex-row border-t-2 border-accent-foreground justify-between items-center gap-2'>
                <div className='flex flex-col gap-2 items-start'>
                    <H3>See the code on </H3>
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
                </div>
                <div className='flex flex-col gap-2 items-start'>
                    <H3>Visit the live site</H3>
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
                                <Small className='sm:hidden md:block'>
                                    Live
                                </Small>
                                <ExternalLinkIcon />
                            </Link>
                        )}
                    </Button>
                </div>
                <div className='flex flex-col gap-2 items-start'>
                    <H3>Status</H3>
                    {project.status && (
                        <Badge
                            className={
                                project.status === 'In Progress'
                                    ? 'bg-green-500'
                                    : project.status === 'Completed'
                                      ? 'bg-purple-500'
                                      : project.status === 'Archived'
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500' // Default to red for 'inactive' or any other status
                            }
                        >
                            {project.status}
                        </Badge>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}

export default ProjectCard
