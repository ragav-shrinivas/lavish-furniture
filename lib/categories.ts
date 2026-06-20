export type Category = {
  slug: string;
  name: string;
  tag: string;
  tagline: string;
  description: string;
  highlights: string[];
  gradient: string;
};

/* Order matters — this is the homepage reveal order. */
export const categories: Category[] = [
  {
    slug: 'carving-sofas',
    name: 'Carving Sofas',
    tag: 'Heritage',
    tagline: 'Hand-carved sofa sets that command a room',
    description:
      'Intricately hand-carved frames in solid hardwood, upholstered in premium fabrics and fine leathers. The centrepiece of a grand living space — built by master artisans to last generations.',
    highlights: ['Solid hardwood carved frames', 'Premium fabric & leather options', 'Custom sizing & finishes'],
    gradient: 'linear-gradient(150deg,#efe3cd,#cdb488)',
  },
  {
    slug: 'luxury-sofas',
    name: 'Luxury Sofas',
    tag: 'Living',
    tagline: 'Contemporary comfort, impeccably tailored',
    description:
      'Modern modular and fixed sofas with deep seating, designer silhouettes and fabrics chosen for both comfort and longevity — the heart of a refined modern home.',
    highlights: ['Modular & fixed configurations', 'Deep, supportive seating', 'Designer fabric library'],
    gradient: 'linear-gradient(150deg,#e9dcc2,#c4a978)',
  },
  {
    slug: 'recliners',
    name: 'Recliners',
    tag: 'Comfort',
    tagline: 'Effortless relaxation, engineered beautifully',
    description:
      'Powered and manual recliners with smooth motion mechanisms, plush cushioning and refined upholstery that never compromises on style.',
    highlights: ['Powered & manual motion', 'Plush multi-density cushioning', 'Premium upholstery'],
    gradient: 'linear-gradient(150deg,#f1e6d2,#d2bb92)',
  },
  {
    slug: 'bedroom',
    name: 'Bedroom Collections',
    tag: 'Bedroom',
    tagline: 'Restful luxury, designed end to end',
    description:
      'Beds, nightstands and dressers crafted as coordinated collections — for a serene, sophisticated bedroom where every piece belongs together.',
    highlights: ['Coordinated bedroom sets', 'Solid wood construction', 'Soft-close storage'],
    gradient: 'linear-gradient(150deg,#e7d8bb,#bfa372)',
  },
  {
    slug: 'dining-sets',
    name: 'Dining Sets',
    tag: 'Dining',
    tagline: 'Gather in elegant comfort',
    description:
      'Statement dining tables and chairs in wood, marble and glass — built for memorable gatherings and everyday elegance alike.',
    highlights: ['4 to 12 seater options', 'Wood, marble & glass tops', 'Matching chair collections'],
    gradient: 'linear-gradient(150deg,#eee0c6,#caae7e)',
  },
  {
    slug: 'office-furniture',
    name: 'Office Furniture',
    tag: 'Workspace',
    tagline: 'Executive presence, everyday comfort',
    description:
      'Executive desks, ergonomic chairs and storage that bring a premium, considered feel to any workspace — from home offices to boardrooms.',
    highlights: ['Executive desks & workstations', 'Ergonomic seating', 'Integrated storage'],
    gradient: 'linear-gradient(150deg,#e4d3b2,#b89a66)',
  },
  {
    slug: 'wardrobes',
    name: 'Wardrobes',
    tag: 'Storage',
    tagline: 'Luxury storage, beautifully organised',
    description:
      'Sliding and hinged wardrobes with bespoke internals, premium finishes and soft-close everything — storage designed as a statement.',
    highlights: ['Sliding & hinged designs', 'Bespoke internal layouts', 'Premium laminate & veneer'],
    gradient: 'linear-gradient(150deg,#ece0c8,#c8ab74)',
  },
  {
    slug: 'luxury-chairs',
    name: 'Luxury Chairs',
    tag: 'Accent',
    tagline: 'Sculptural seating as art',
    description:
      'Accent and lounge chairs that double as sculpture — the perfect finishing note that elevates any corner of the home.',
    highlights: ['Accent & lounge styles', 'Sculptural silhouettes', 'Statement upholstery'],
    gradient: 'linear-gradient(150deg,#f0e6d0,#cdb079)',
  },
  {
    slug: 'wooden-decor',
    name: 'Wooden Decor',
    tag: 'Decor',
    tagline: 'Handcrafted wooden artistry',
    description:
      'Carved panels, consoles and decorative pieces that bring warmth, heritage and craftsmanship into your interiors.',
    highlights: ['Hand-carved panels & consoles', 'Heritage motifs', 'Artisan finishes'],
    gradient: 'linear-gradient(150deg,#e8dabd,#c0a36c)',
  },
  {
    slug: 'coffee-side-tables',
    name: 'Coffee & Side Tables',
    tag: 'Tables',
    tagline: 'The details that tie a room together',
    description:
      'Coffee and side tables in wood, marble and metal — functional pieces with a designer edge that complete a luxury living space.',
    highlights: ['Wood, marble & metal', 'Nesting & single designs', 'Designer detailing'],
    gradient: 'linear-gradient(150deg,#efe4ce,#cbae77)',
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
