import type { LoaderArgs } from '@remix-run/node'
import { isAuthenticated } from '~/server/auth/auth.server'
import { json, redirect } from '@remix-run/node'
import { prisma } from '~/server/auth/prisma.server'
import { useLoaderData } from '@remix-run/react'
import type { Post } from '~/server/schemas/schemas'
import { Card, Group, Image, Text } from '@mantine/core'
import Tags from '~/components/tags'
export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }
  const drafts = await prisma.post.findMany({
    where: {
      published: false,
      userId: user.id
    },
    include: {
      user: true,
      likes: true,
      favorites: true,
      categories: true
    }
  })
  if (!drafts) {
    return { json: { message: 'No drafts found' } }
  }

  return json({ drafts })
}

export default function DraftsRoute() {
  const { drafts } = useLoaderData<{
    drafts: Post[]
  }>()
  return (
    <div className='flex flex-col gap-2'>
      {drafts.map((draft: Post) => (
        // <BlogPreview key={draft.id} post={draft} />
        <Card key={draft.id} shadow='sm' padding='md' radius='md' withBorder>
          <Card.Section>
            <Image
              fit='cover'
              src={draft.imageUrl}
              alt={draft.title}
              height={160}
            />
          </Card.Section>
          <Group position='apart' mt='md' mb='xs'>
            <Text weight={500}>{draft.title}</Text>
            <Tags categories={draft.categories} />
          </Group>
          <Text size='sm' color='dimmed'>
            {draft.content}
          </Text>
          <Group position='apart' mt='md' mb='xs'>
            <Text size='sm' color='dimmed'>
              {draft.createdAt}
            </Text>
            <Text size='sm' color='dimmed'>
              {draft.updatedAt}
            </Text>
          </Group>
        </Card>
      ))}
    </div>
  )
}
