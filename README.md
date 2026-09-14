## Environment variables

Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` with a key from Google AI Studio. Set `LEAD_WEBHOOK_URL` as well if you want enquiry forms to deliver leads to your mail or CRM webhook. Restart the development server after changing environment variables.

## Admin panel

Set these values in `.env.local` before using `/admin/login`:

```env
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=use_a_long_random_password
ADMIN_SESSION_SECRET=use_a_different_long_random_secret
```

When deploying from GitHub, `.env.local` is not committed to the repository. Add the same three variables to the deployment provider's environment settings, for the production environment, then redeploy. For Vercel, open Project Settings > Environment Variables, add `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` under Production, and redeploy. The values must be entered as secrets; do not commit `.env.local` or real credentials to GitHub.

If the login page reports that the admin variables are not set, the deployment has not received these environment variables. If the deployment returns 404 for `/admin/login`, it is pointing at a different project or deployment than this repository.

The admin panel stores edited content in `data/content-overrides.json` and uploaded images in `public/uploads/`. The public project, service and design-library routes read those files at request time, so changes appear immediately on a self-hosted or persistent filesystem deployment. The filesystem on serverless deployments such as Vercel is ephemeral; use a persistent volume or commit the generated files to the project for changes to survive redeployments.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
"# orchid-interiors"
"# orchid-sabarish"
