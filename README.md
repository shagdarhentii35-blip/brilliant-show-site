# DIAMOND Promotions

A standalone promotions page for DIAMOND: welcome bonus, daily gifts, missions, scratch cards, mystery box, ranking race, and weekend boost. Promotion cards open local detail dialogs. There is no account or promotions backend connected.

The page is in Mongolian and is built as a single index route.

## Stack

- TanStack Start
- React 19
- TypeScript
- Tailwind CSS

## Run locally

```sh
npm install
npm run dev
```

The dev server listens on [http://127.0.0.1:43123](http://127.0.0.1:43123). Production build:

```sh
npm run build
npm run preview
```

## Deploy to Netlify

`netlify.toml` is the site config. Connect the repo and let Netlify run the build; do not publish `dist` by itself. The Nitro `netlify` preset writes the server function to `.netlify/functions-internal`, which Netlify picks up from the build directory.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node | 22 (`NODE_VERSION` in `netlify.toml`) |

No application environment variables are required. Leave Netlify’s Functions directory unset so the generated internal function is used.
