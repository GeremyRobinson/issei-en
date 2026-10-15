# issei-en web

The ISSEI—EN site as a React + TypeScript app (Vite), built to be hosted on Vercel.
The layout matches the current site: three columns on desktop, two on mobile,
10px margins, one 14px text size, the sticky top line in difference mode.

```
npm install
npm run dev        # http://localhost:5173, with the vendor API running locally
npm test           # cart and vendor-session tests
npm run build      # type-check and build to dist/
```

## Pages

| Address | Page |
| --- | --- |
| `/` | Information |
| `/index` | Index: click a tea to zoom in, swipe (or ← →) to the next tea, Esc or pull down to zoom out |
| `/index/:slug` | Opens straight on that tea, so printed QR codes keep working |
| `/index/pricing` | Pricing. Trade prices appear only after a vendor signs in |
| `/terms` | Terms, Privacy, Purchase and Cookie policies |
| `/shop`, `/shop/:slug` | Redirect to the Index; the shop is now part of it |

The cart stays hidden until something is added, then appears at the bottom of
the screen and as `Cart (n)` in the nav.

## Where things are

- `src/components/` Header (nav, clock), Cart, Viewer (the Index zoom), TeaPage, Profile (tasting data), VendorLogin, RollingText (the rolling digits)
- `src/pages/` Information, IndexPage, Pricing, Terms, NotFound
- `src/data/teas.json` public tea data; `server/trade-prices.json` trade prices, read only by the API
- `api/vendor/` `login`, `prices`, `logout`: Vercel Functions; `npm run dev` serves them too
- `server/vendor-session.ts` vendor list and the signed session cookie

Motion is CSS wherever possible (rolling digits, tasting bars, the cart). JavaScript
only measures positions for the Index zoom and counts up the umami value.

## Data

`npm run import-cms` rebuilds both data files from the CMS export in `../project/cms`.
Images live in `public/images` as `<slug>-1.webp` (powder), `-2` (prepared), `-3` (origin).

## Vendor access

Set these in Vercel (Project Settings, Environment Variables) and in `.env` locally,
copying `.env.example`:

- `VENDOR_ACCESS`: `email:code` pairs separated by commas, e.g. `buyer@cafe.com:1234-5678`
- `VENDOR_SESSION_SECRET`: a long random string that signs the session cookie

Removing a vendor from `VENDOR_ACCESS` ends their access at once. Locally, with no
`VENDOR_ACCESS` set, any email with the code `0000-0000` signs in.

## Deploying

Create a Vercel project from this repository with **Root Directory** set to `web`.
`vercel.json` sends every page address to the app and keeps the old shop links working.

## Not built yet

- Stripe Checkout: `src/lib/checkout.ts` posts the cart to `/api/checkout`, which does not exist yet.
- The CMS: the data files above are where it will write.
- The Japanese translation.
