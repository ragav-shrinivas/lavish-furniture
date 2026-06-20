'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Category } from '@/lib/categories';
import type { AdminProduct } from '@/types/admin';
import { siteConfig } from '@/lib/config';

const EASE = [0.16, 1, 0.3, 1] as const;

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.9, ease: EASE, delay },
  };
}

function ProductCard({ product, index }: { product: AdminProduct; index: number }) {
  const waText = encodeURIComponent(
    `Hi Lavish Furniture, I'm interested in your product "${product.name}". Could you share more details and pricing?`,
  );
  const waHref = `https://wa.me/${siteConfig.whatsapp}?text=${waText}`;

  return (
    <motion.div className="product-card" {...reveal((index % 3) * 0.07)}>
      {product.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt={product.name} className="product-card-img" loading="lazy" />
      )}
      <div className="product-card-body">
        {product.featured && <span className="product-badge">Featured</span>}
        <h4 className="product-card-name">{product.name}</h4>
        {product.description && <p className="product-card-desc">{product.description}</p>}
        {product.price && <div className="product-card-price">{product.price}</div>}
        <a className="product-card-cta" href={waHref} target="_blank" rel="noopener">
          Enquire on WhatsApp →
        </a>
      </div>
    </motion.div>
  );
}

export function CategoryView({
  category,
  images,
  adminProducts = [],
}: {
  category: Category;
  images: string[];
  adminProducts?: AdminProduct[];
}) {
  const waText = encodeURIComponent(
    `Hi Lavish Furniture, I'm interested in your ${category.name} collection. Could you share more details and pricing?`,
  );
  const waHref = `https://wa.me/${siteConfig.whatsapp}?text=${waText}`;

  const hasProducts = adminProducts.length > 0;
  const hasImages = images.length > 0;
  // Images that came from the file system (not already shown via product cards)
  const adminImageUrls = new Set(adminProducts.map((p) => p.image).filter(Boolean));
  const galleryImages = images.filter((img) => !adminImageUrls.has(img));
  const feature = !hasProducts && galleryImages.length > 0 ? galleryImages[0] : null;
  const galleryRest = !hasProducts && galleryImages.length > 0 ? galleryImages.slice(1) : galleryImages;

  return (
    <article className="cat-page">

      {/* HERO BANNER */}
      <header className="cat-hero" style={{ backgroundImage: category.gradient }}>
        <div className="cat-hero-inner">
          <Link href="/#categories" className="cat-back">
            <span className="back-arrow">←</span>
            Back to Collections
          </Link>

          <div className="eyebrow" style={{ color: 'var(--walnut)' }}>{category.tag}</div>
          <h1>{category.name}</h1>
          <p>{category.tagline}</p>
        </div>
      </header>

      {/* DESCRIPTION + HIGHLIGHTS */}
      <section className="block cat-intro">
        <div className="wrap cat-intro-grid">
          <motion.div {...reveal()}>
            <div className="eyebrow">The Collection</div>
            <h2 className="cat-h2">{category.name}</h2>
            <p className="cat-desc">{category.description}</p>

            <div style={{ marginTop: 28 }}>
              <a className="btn-reviews" href={siteConfig.googleReviews} target="_blank" rel="noopener">
                <em className="star">★</em> View Google Reviews
              </a>
            </div>
          </motion.div>

          <motion.ul className="cat-highlights" {...reveal(0.1)}>
            {category.highlights.map((h) => (
              <li key={h}>
                <span className="dot" />
                {h}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ADMIN PRODUCTS GRID */}
      {hasProducts && (
        <section className="block cat-gallery-section">
          <div className="wrap">
            <motion.div className="section-head center" {...reveal()}>
              <div className="eyebrow">The Collection</div>
              <h3>Pieces from this collection</h3>
            </motion.div>

            <div className="product-grid">
              {adminProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY — file-based or placeholder */}
      {(!hasProducts || galleryRest.length > 0) && (
        <section className="block cat-gallery-section">
          <div className="wrap">
            {!hasProducts && (
              <motion.div className="section-head center" {...reveal()}>
                <div className="eyebrow">The Gallery</div>
                <h3>Pieces from this collection</h3>
              </motion.div>
            )}

            {galleryImages.length > 0 ? (
              <>
                {feature && (
                  <motion.div className="gallery-feature" {...reveal()}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={feature} alt={`${category.name} feature`} loading="lazy" />
                  </motion.div>
                )}
                <div className="gallery-grid">
                  {galleryRest.map((src, i) => (
                    <motion.div key={src} className="gallery-item" {...reveal((i % 3) * 0.06)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`${category.name} ${i + 2}`} loading="lazy" />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : !hasProducts ? (
              <>
                <div className="gallery-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="gallery-item placeholder"
                      style={{ backgroundImage: category.gradient }}
                      {...reveal((i % 3) * 0.06)}
                    >
                      <span>Photos coming soon</span>
                    </motion.div>
                  ))}
                </div>
                <p className="cat-hint">
                  Add products via the admin panel — they appear here automatically.
                </p>
              </>
            ) : null}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="block cat-cta">
        <motion.div className="wrap cat-cta-inner" {...reveal()}>
          <h3>
            Bring the <span className="serif-italic">{category.name}</span> collection home
          </h3>
          <p>
            Message us for pricing and availability, or visit our 30,000 sq.ft showroom in Velachery, Chennai.
          </p>
          <div className="cat-cta-actions">
            <a className="btn" href={waHref} target="_blank" rel="noopener">
              Enquire on WhatsApp <span className="arrow">→</span>
            </a>
            <a className="btn ghost" href={siteConfig.maps} target="_blank" rel="noopener">
              Visit Showroom
            </a>
          </div>
          <div className="cat-cta-reviews">
            <a className="btn-reviews" href={siteConfig.googleReviews} target="_blank" rel="noopener">
              <em className="star">★</em> See 1100+ Customer Reviews
            </a>
          </div>
        </motion.div>
      </section>
    </article>
  );
}
