## Environment variables

Set `GEMINI_API_KEY` in `.env.local` with a key from Google AI Studio to enable the chat assistant. To deliver website enquiries by email, set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to a verified sender address in Resend. Configure these variables in the deployment environment as well as locally. Restart the development server after changing environment variables.

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS domain for correct sitemap URLs. Keep `.env.local` private and never commit real credentials. Bundled files under `public/images/` and `public/videos/` are deployed with the application.

## Admin sign-in

Set `ADMIN_EMAIL` to the single email address allowed to sign in and `ADMIN_SESSION_SECRET` to a random secret of at least 32 characters. Admin sign-in sends a six-digit, ten-minute code using the existing `RESEND_API_KEY` and `RESEND_FROM_EMAIL` configuration. Set all four variables locally and in the production deployment environment. Admin sessions expire after 12 hours.

Generate a session secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`. Keep it private and never commit it.

### Dynamic content and media

The admin content manager stores Services, Design Library entries, and Projects in Firestore and uploads media to Firebase Storage. Create a Firebase project, enable Firestore and Storage, and create a service account with Firestore read/write and Storage object read/write permissions. Add these server-only environment variables locally and to Vercel:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (preserve PEM newlines as `\n` when entering the value)
- `FIREBASE_STORAGE_BUCKET` (the bucket name, without `gs://`)

The existing production JSON content is used to seed each Firestore collection the first time it is read while that collection is empty. Existing `/uploads/` media referenced by the seed content is copied into Firebase Storage as part of that first seed. Subsequent content edits and uploads are stored in Firebase; credentials never reach the browser.

Direct browser uploads use short-lived, single-object signed URLs to report upload progress without sending large videos through a Vercel function. Apply [firebase-storage-cors.json](./firebase-storage-cors.json) to the bucket and add your production, preview, and local development site origins before testing uploads. For example, using Google Cloud CLI:

```sh
gcloud storage buckets update gs://YOUR_STORAGE_BUCKET --cors-file=firebase-storage-cors.json
```

Until Firebase credentials are configured, the public site continues to use its bundled production content and the admin manager explains that Firebase setup is required.
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
