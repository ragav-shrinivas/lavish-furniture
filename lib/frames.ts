export type Overlay = {
  eyebrow: string;
  title: string;
  subtitle: string;
  anim: 'left' | 'right' | 'up';
  range: [number, number]; // 0..1 of hero scroll progress
};

export type SequenceConfig = {
  id: string;
  basePath: string;
  prefix: string;
  pad: number;
  ext: string;
  count: number;
  start: number;
  loadingText: string;
  overlays: Overlay[];
};

/* ── Hero 1: startingherovideo → Modern intro ── */
export const startingSequence: SequenceConfig = {
  id: 'hero-modern',
  basePath: '/frames/starting/startingherovideo/',
  prefix: 'ezgif-frame-',
  pad: 3,
  ext: '.png',
  count: 286,
  start: 1,
  loadingText: 'Loading showroom…',
  overlays: [
    {
      eyebrow: 'Modern Collections',
      title: 'Crafting Luxury Living',
      subtitle: 'Furniture designed for sophisticated modern lifestyles.',
      anim: 'left',
      range: [0.3, 0.5],
    },
    {
      eyebrow: 'Timeless Design',
      title: 'Where Luxury Meets Lifestyle',
      subtitle: 'Timeless furniture crafted for elegant homes.',
      anim: 'right',
      range: [0.52, 0.72],
    },
    {
      eyebrow: 'Everyday Elegance',
      title: 'Designed for Elegant Living',
      subtitle: 'Modern collections that transform everyday spaces.',
      anim: 'up',
      range: [0.74, 0.96],
    },
  ],
};

/* ── Hero 2: carved-herovideo → Carved / heritage storytelling ── */
export const carvedSequence: SequenceConfig = {
  id: 'hero-carved',
  basePath: '/frames/carved/',
  prefix: 'ezgif-frame-',
  pad: 3,
  ext: '.png',
  count: 286,
  start: 1,
  loadingText: 'Loading craftsmanship…',
  overlays: [
    {
      eyebrow: 'Handcrafted Furniture',
      title: 'Timeless Carved Masterpieces',
      subtitle: 'Heritage craftsmanship, carved by hand into every detail.',
      anim: 'left',
      range: [0.06, 0.3],
    },
    {
      eyebrow: 'Royal Carved Collections',
      title: 'Furniture Fit for Palaces',
      subtitle: 'Regal silhouettes and intricate detailing, reimagined for modern homes.',
      anim: 'right',
      range: [0.34, 0.62],
    },
    {
      eyebrow: 'Luxury Wooden Artistry',
      title: 'Artistry in Every Grain',
      subtitle: 'Solid hardwoods shaped by master artisans into heirloom pieces.',
      anim: 'up',
      range: [0.66, 0.94],
    },
  ],
};
