import { siteConfig } from './config';
import { categories } from './categories';

const url = siteConfig.url;

/** FurnitureStore / LocalBusiness structured data — the key signal for local furniture SEO. */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FurnitureStore',
    '@id': `${url}/#store`,
    name: siteConfig.name,
    description: siteConfig.description,
    url,
    image: `${url}${siteConfig.ogImage}`,
    logo: `${url}${siteConfig.ogImage}`,
    telephone: `+${siteConfig.whatsapp}`,
    email: siteConfig.email,
    priceRange: siteConfig.priceRange,
    currenciesAccepted: 'INR',
    foundingDate: String(siteConfig.established),
    slogan: siteConfig.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    hasMap: siteConfig.maps,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: siteConfig.openingHours.opens,
        closes: siteConfig.openingHours.closes,
      },
    ],
    sameAs: [siteConfig.instagram, siteConfig.facebook, siteConfig.maps],
    areaServed: siteConfig.areaServed.map((name) => ({ '@type': 'City', name })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(siteConfig.ratingValue),
      reviewCount: String(siteConfig.reviewCount),
      bestRating: '5',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Furniture Collections',
      itemListElement: categories.map((c) => ({
        '@type': 'OfferCatalog',
        name: c.name,
        url: `${url}/collections/${c.slug}`,
      })),
    },
  };
}

/** Website schema with sitelinks search box potential. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name: siteConfig.name,
    url,
    publisher: { '@id': `${url}/#store` },
    inLanguage: 'en-IN',
  };
}

/** Breadcrumb trail for a category page. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** A furniture category modelled as a Product group (helps category rich results). */
export function categoryJsonLd(cat: (typeof categories)[number]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name: `${cat.name} — ${siteConfig.name}`,
    description: cat.description,
    url: `${url}/collections/${cat.slug}`,
    brand: { '@type': 'Brand', name: siteConfig.name },
    category: cat.name,
    seller: { '@id': `${url}/#store` },
  };
}
