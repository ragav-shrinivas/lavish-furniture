# Lavish Furniture — Next.js 14

Premium light-luxury showroom site. Same cinematic engine as the EVO9 stack:
**Next.js 14 (App Router) · TypeScript · Framer Motion · Lenis · next/font**.

Two scroll-scrubbed canvas heroes drive the story:
`startingherovideo` → Modern Collections, `carved-herovideo` → Carved Collections.

---

## Quick start (Windows / PowerShell — one command per line)

```powershell
cd lavish-furniture
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000

---

## Add the frame sequences

The site reads frames from `public/frames/`:

```
public/frames/
  starting/   ezgif-frame-001.png … ezgif-frame-286.png   (startingherovideo)
  carved/     ezgif-frame-001.png … ezgif-frame-286.png   (carved-herovideo)
```

Copy them straight from your Desktop (PowerShell):

```powershell
Copy-Item "$env:USERPROFILE\OneDrive\Desktop\lavish_video\startingherovideo\*" "public\frames\starting\"
Copy-Item "$env:USERPROFILE\OneDrive\Desktop\lavish_video\carved-herovideo\*"  "public\frames\carved\"
```

The filenames already match the config in `lib/frames.ts`, so they load as-is.
Until frames are present, each hero shows an elegant champagne fallback wash.

---

## IMPORTANT — optimise before deploying

Raw frames are **286 PNGs ≈ 90 MB per sequence (~180 MB total)** — far too heavy for the web.
Convert to downscaled JPGs (≈3–5 MB per sequence) with ffmpeg:

```powershell
ffmpeg -i "public\frames\starting\ezgif-frame-%03d.png" -vf "scale=1600:-1" -q:v 4 "public\frames\starting\opt-%03d.jpg"
ffmpeg -i "public\frames\carved\ezgif-frame-%03d.png"   -vf "scale=1600:-1" -q:v 4 "public\frames\carved\opt-%03d.jpg"
```

Then update `lib/frames.ts`:

- `startingSequence` → `prefix: 'opt-'`, `ext: '.jpg'`
- `carvedSequence`   → `prefix: 'opt-'`, `ext: '.jpg'`

(Delete the heavy PNGs afterward so they don't ship.)

---

## Where everything lives

```
app/
  layout.tsx        fonts (Cormorant + Syne + Jost), metadata, Navbar/Footer, Lenis
  page.tsx          composes the whole page
  globals.css       full light-luxury design system + tokens

components/
  layout/           Navbar · Footer · SmoothScroll (Lenis)
  sections/         FrameSequenceHero · CollectionCards · Credibility ·
                    About · Collections · Showroom · Testimonials · Contact
  ui/               MagneticButton · Reveal · Parallax

lib/
  config.ts         brand + contact details (env-overridable)
  frames.ts         ← ALL hero/frame settings + card copy live here
  cn.ts             classnames helper
```

### Tuning knobs (all in `lib/frames.ts` + the hero component)
- **Frame source:** `basePath`, `prefix`, `pad`, `ext`, `count`, `start`
- **Overlay timing:** each overlay's `range: [start, end]` (0–1 of hero scroll)
- **Overlay entrance:** `anim: 'left' | 'right' | 'up'`
- **Scroll smoothing:** `useSpring({ stiffness, damping })` in `FrameSequenceHero.tsx`
- **Tilt strength:** `MAX` in `CollectionCards.tsx`

---

## Env + OG

Copy `.env.local.example` → `.env.local`. Add `public/og-image.png` (1200×630) for social cards.

## Deploy
`vercel` (or push to GitHub → import in Vercel). Mumbai (bom1) region recommended for Chennai traffic.
