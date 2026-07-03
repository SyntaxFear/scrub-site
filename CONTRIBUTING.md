# Contributing to Scrub Website

Thanks for helping make the Scrub website clearer and safer.

## Good First Contributions

- Improve copy for non-technical Mac users.
- Clarify download or release notes.
- Improve accessibility, metadata, or SEO.
- Add tests for release/download behavior.
- Improve `.env.example` when a new environment variable is added.

## Local Development

```sh
npm install
cp .env.example .env.local
npm run dev
```

The site can run without production secrets. Auth, SES, and admin features need
deployment environment variables.

## Verification

```sh
npm run lint
npm run test
npm run build
```

`npm run verify` also runs browser contracts and may require Google Chrome.

## Pull Requests

Please keep changes focused. For behavior changes, describe:

- What changed
- Why it is safer or clearer
- How you tested it

Do not include `.env`, `.env.local`, Convex credentials, Vercel credentials,
Apple auth secrets, AWS SES credentials, or analytics secrets.
