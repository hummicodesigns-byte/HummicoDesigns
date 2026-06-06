// ─────────────────────────────────────────────────────────────────────────────
// SEO / structured-data helpers — single source of truth for JSON-LD schemas.
// All builders return plain objects; BaseLayout serializes them into
// <script type="application/ld+json"> blocks in the <head>.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: 'Hummico Designs',
  url: 'https://hummicodesigns.com',
  email: 'Hummicodesigns@gmail.com',
  logo: 'https://hummicodesigns.com/logo.png',
  defaultImage: '/og-default.jpg',
  social: [
    'https://www.instagram.com/hummico_designs/',
    'https://www.etsy.com/shop/HummicoDesigns',
    'https://www.pinterest.com/hummicodesigns/',
  ],
} as const;

/** Stable @id anchors so schemas can cross-reference each other. */
const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

/** Turn a path (or already-absolute URL) into an absolute URL on the production domain. */
export function absUrl(path: string): string {
  if (!path) return SITE.url;
  return path.startsWith('http') ? path : `${SITE.url}${path}`;
}

/** Escape "<" so a JSON string can never break out of the surrounding <script>. */
export function jsonLdString(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

// ── Site-wide schemas (output on every page by BaseLayout) ──
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.name,
  url: SITE.url,
  logo: SITE.logo,
  email: SITE.email,
  sameAs: [...SITE.social],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE.name,
  url: SITE.url,
  publisher: { '@id': ORG_ID },
};

// ── Homepage: LocalBusiness (city-level only, no street address) ──
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE.name,
  url: SITE.url,
  logo: SITE.logo,
  image: absUrl(SITE.defaultImage),
  email: SITE.email,
  areaServed: 'Houston, Texas',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Houston',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  sameAs: [...SITE.social],
};

// ── BreadcrumbList ──
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absUrl(item.path),
    })),
  };
}

// ── BlogPosting ──
export function blogPostingSchema(opts: {
  title: string;
  description: string;
  image: string;
  datePublished: Date;
  dateModified?: Date;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    image: absUrl(opts.image || SITE.defaultImage),
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    author: { '@type': 'Organization', name: SITE.name },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: SITE.logo },
    },
    mainEntityOfPage: absUrl(opts.path),
  };
}

// ── FAQPage ──
export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

// ── Product (no aggregateRating/review — placeholder ratings risk a manual penalty) ──
export function productSchema(opts: {
  name: string;
  description: string;
  image: string;
  url: string;
  price: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    image: absUrl(opts.image || SITE.defaultImage),
    brand: { '@type': 'Brand', name: SITE.name },
    offers: {
      '@type': 'Offer',
      url: opts.url,
      priceCurrency: 'USD',
      // strip any currency symbol so the value is a schema-valid numeric string
      price: opts.price.replace(/[^0-9.]/g, ''),
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: SITE.name },
    },
  };
}
