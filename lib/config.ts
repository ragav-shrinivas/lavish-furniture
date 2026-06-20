export const siteConfig = {
  name: 'Lavish Furniture',
  tagline: 'Crafting Luxury Living',
  description:
    "Lavish Furniture — a 30,000 sq.ft luxury showroom in Velachery, Chennai. 26+ years of premium modern and carved furniture collections, crafted for sophisticated living.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://lavishfurniture.in',
  ogImage: '/og-image.png',
  location: 'Velachery, Chennai',
  established: 1998,

  // ── Local-business / SEO data ──
  // NOTE: update streetAddress + geo coordinates with the exact showroom values
  // (Google Maps → your business → right-click the pin → copy lat,lng).
  address: {
    street: 'Velachery Main Road, Near Phoenix Marketcity',
    locality: 'Velachery',
    region: 'Tamil Nadu',
    postalCode: '600042',
    country: 'IN',
  },
  geo: { lat: 12.9784, lng: 80.2179 }, // approx Velachery — replace with exact
  openingHours: { opens: '10:00', closes: '21:00' }, // confirm exact hours
  priceRange: '₹₹₹',
  ratingValue: 4.8, // confirm from your Google listing
  reviewCount: 1100,
  areaServed: ['Velachery', 'Adyar', 'Guindy', 'OMR', 'Tambaram', 'Chromepet', 'Chennai'],
  keywords: [
    'luxury furniture Chennai',
    'furniture showroom Velachery',
    'carved furniture Chennai',
    'sofa showroom Chennai',
    'wooden furniture Chennai',
    'premium furniture Velachery',
    'dining sets Chennai',
    'recliners Chennai',
    'wardrobes Chennai',
    'bedroom furniture Chennai',
    'teak wood furniture Chennai',
    'Lavish Furniture',
  ],
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919384720033',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'lavishfurn@gmail.com',
  instagram: 'https://www.instagram.com/lavishfurniturechennai',
  instagramHandle: '@lavishfurniturechennai',
  facebook: 'https://share.google/zWT0EGSHPLF5nu2iH',
  maps: 'https://maps.app.goo.gl/e7fbXZQyTBaMPuze8',
  googleReviews: 'https://maps.app.goo.gl/e7fbXZQyTBaMPuze8',
  nav: [
    { label: 'Collections', href: '/#categories' },
    { label: 'Carved', href: '/#hero-carved' },
    { label: 'Reviews', href: '/#testimonials' },
    { label: 'Contact', href: '/#contact' },
  ],
} as const;
