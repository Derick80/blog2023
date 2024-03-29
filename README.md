# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/future/vite) for details on supported features.

## Tech Stack
- [Remix](https://remix.run/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Fly.io](https://fly.io/)
- [Cloudinary](https://cloudinary.com/)


  ## Additional Packages
  - [Prettier Tailwind](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
  - [tsx](https://www.npmjs.com/package/tsx)

## Getting Started

- use ```openssl rand -hex 32``` to generate a secret key for the .env file

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
