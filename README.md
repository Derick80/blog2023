# Welcome to Remix

- [Remix Docs](https://remix.run/docs)

## Prisma Seeding in Development

- Until form login is working again login with discord and then copy paste the userId from prisma studio into the seed file

## Component References

- Accordian - <https://github.com/AllanSimoyi/PersonalWebsite/blob/main/app/core/components/AccordionItem.tsx>
- Post Editor - [TipTap](https://tiptap.dev/)
- 

## Database Setup

I use [Render](https://render.com/) for hosting a postgress database using Prisma ORM.
Create a new database and then add the following environment variables to your `.env` file.

```sh
DATABASE_URL=''
```

## Image Upload Setup
Create a [Cloudinary](https://cloudinary.com/) account and add the following environment variables to your `.env` file.

CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=


## Fly Setup

1. [Install `flyctl`](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

```sh
flyctl auth signup
```

3. Setup Fly. It might ask if you want to deploy, say no since you haven't built the app yet.

```sh
flyctl launch
```

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run deploy
```

You can run `flyctl info` to get the url and ip address of your server.

Check out the [fly docs](https://fly.io/docs/getting-started/node/) for more information.
