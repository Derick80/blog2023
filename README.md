# Welcome to Remix + Vite

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
- [Zod](https://zod.dev/)

## Additional Packages

- [Prettier Tailwind](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [tsx](https://www.npmjs.com/package/tsx)
- [Remix Dev Tools](https://remix-development-tools.fly.dev/)
- [Remix Flat Routes](https://github.com/kiliman/remix-flat-routes)
- [Remix Auth](https://github.com/sergiodxa/remix-auth)

## ToDos

- [] Rewrite, refactor, or create new components derived from the original project.
  - [] brand-icon.tsx
  - [] user-placeholder.tsx
  - [] resume/index.ts
  - [] Prisma seed data
  - []

## Documentation


#zods stf
// This adds type narrowing by the intent property
const Schema = z.discriminatedUnion('intent', [
  z.object({ intent: z.literal('delete'), id: z.string() }),
  z.object({ intent: z.literal('create'), name: z.string() }),
]);

export async function action({ request }: ActionArgs) {
  const data = await zx.parseForm(request, Schema);
  switch (data.intent) {
    case 'delete':
      // data is now narrowed to { intent: 'delete', id: string }
      return;
    case 'create':
      // data is now narrowed to { intent: 'create', name: string }
      return;
    default:
      // data is now narrowed to never. This will error if a case is missing.
      const _exhaustiveCheck: never = data;
  }
};

### Images

- [Blur Data URL Generator](https://blurred.dev/)
-

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
