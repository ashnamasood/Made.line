# MADE.line

Next.js (App Router) + Tailwind v4 frontend.

```bash
npm install
npm run dev
```

## Assets not in the repo

`/public/video` is gitignored (the source clip is 97MB). Drop the hero clip at
`public/video/hero.mp4` — the home page hero expects it there. Compress before
deploying:

```bash
ffmpeg -i hero.mp4 -vf scale=-2:1080 -crf 28 hero-web.mp4
```

Still placeholders (dashed `Slot` boxes in `src/app/page.tsx`):

- 3 product shots → `public/products/`
- 1 lifestyle image → `public/images/`

The wordmark in `src/components/Logo.tsx` is set in type (Archivo Black +
Playfair Display) as a stand-in. Drop the real files in `public/logos/` and
swap the component body — the replacement line is in the comment.
