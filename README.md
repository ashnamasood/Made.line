# MADE.line

Next.js (App Router) + Tailwind v4 frontend.

```bash
pnpm install
pnpm dev
```

## Contact form

`POST /api/contact` validates the payload and inserts into a Postgres table
`contact_messages`, created on first request. Set `DATABASE_URL` (see
`.env.example`) locally in `.env.local` and in the Vercel project settings —
without it the route returns 500 and the form shows an error.

Read the messages with:

```sql
SELECT * FROM contact_messages ORDER BY created_at DESC;
```

## Assets

`public/video/hero.mp4` is a web cut of the source clip — 12s, 1012x1920, 13MB.
The 97MB original lives in `_assets/` (gitignored). To recut it:

```bash
avconvert -s _assets/hero-source.mp4 -o public/video/hero.mp4 \
  -p Preset1920x1080 --duration 12 --replace
```

`public/products/*.jpg` are the supplied renders cropped to 3:4 and scaled
down onto their own background so the bottle sits about half the panel
height, as in the design. `public/images/comb.jpg` is the lifestyle shot.
Originals are in `_assets/`.

## Fonts

`src/fonts/` holds the design's own faces, wired via `next/font/local`:
TT Commons Pro Black for `MADE.` and Catchye for the script half. **Both are
demo cuts, licensed for personal use only** — buy a licence before launch
(Catchye: https://mjtype.com/product/catchye/).

Body and UI text is Alte Haas Grotesk (Yann Le Coroller), the design's third
font — freeware, and its licence file must travel with it, so it sits beside
the TTFs as `AlteHaasGrotesk-LICENCE.rtf`. Only 400 and 700 ship, so don't
use `font-extrabold` or `font-black`: the browser would synthesise them.

## Logos

`public/logos/wordmark.png` and `monogram.png` are the supplied brand PNGs
cropped to their artwork (the originals in `_assets/` are 1920x1080 with the
logo floating in transparent padding, so they can't be sized by CSS as-is).
