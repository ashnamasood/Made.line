# MADE.line

Next.js (App Router) + Tailwind v4 frontend.

```bash
pnpm install
pnpm dev
```

## Assets

`public/video/hero.mp4` is a web cut of the source clip — 12s, 1012x1920, 13MB.
The 97MB original lives in `_assets/` (gitignored). To recut it:

```bash
avconvert -s _assets/hero-source.mp4 -o public/video/hero.mp4 \
  -p Preset1920x1080 --duration 12 --replace
```

Still placeholders (dashed `Slot` boxes in `src/app/page.tsx`):

- 3 product shots → `public/products/`
- 1 lifestyle image → `public/images/`

The wordmark in `src/components/Logo.tsx` is set in type (Archivo Black +
Playfair Display) as a stand-in. Drop the real files in `public/logos/` and
swap the component body — the replacement line is in the comment.
