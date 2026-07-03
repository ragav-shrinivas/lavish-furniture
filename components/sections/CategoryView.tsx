'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Category } from '@/lib/categories';
import type { AdminProduct } from '@/types/admin';
import { siteConfig } from '@/lib/config';
import { Lightbox } from '@/components/ui/Lightbox';
import { EASE, DUR, fadeRise, stagger, viewportOnce, STAGGER } from '@/lib/motion';

function ProductCard({ product, index }: { product: AdminProduct; index: number }) {
  const waText = encodeURIComponent(
    `Hi Lavish Furniture, I'm interested in your product "${product.name}". Could you share more details and pricing?`,
  );
  const waHref = `https://wa.me/${siteConfig.whatsapp}?text=${waText}`;

  return (
    <motion.article
      className="product-card"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 44 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: DUR.reveal, ease: EASE, delay: (index % 3) * 0.08 },
        },
      }}
    >
      {product.image && (
        <div className="product-card-media">
          {product.featured && <span className="product-badge">Featured</span>}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="product-card-body">
        {!product.image && product.featured && <span className="product-badge" style={{ position: 'static', display: 'inline-block', marginBottom: 10 }}>Featured</span>}
        <h4 className="product-card-name">{product.name}</h4>
        {product.description && <p className="product-card-desc">{product.description}</p>}
        {product.price && <div className="product-card-price">{product.price}</div>}
        <a className="product-card-cta" href={waHref} target="_blank" rel="noopener">
          Enquire on WhatsApp <span className="arrow">→</span>
        </a>
      </div>
    </motion.article>
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
  // Images that came from the file system (not already shown via product cards)
  const adminImageUrls = new Set(adminProducts.map((p) => p.image).filter(Boolean));
  const galleryImages = images.filter((img) => !adminImageUrls.has(img));
  const pieceCount = hasProducts ? adminProducts.length : galleryImages.length;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <article className="cat-page">
      {/* ── IMMERSIVE HERO — showroom still + editorial identity ── */}
      <header className="cat-hero">
        <motion.div
          className="cat-hero-img"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={category.image} alt="" style={{ objectPosition: category.focus }} />
        </motion.div>

        <div className="cat-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            <Link href="/#categories" className="cat-back">
              <span className="back-arrow">←</span>
              All Collections
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger(STAGGER.tight, 0.25)}
          >
            <motion.div className="eyebrow" variants={fadeRise}>
              {category.tag} · Collection
            </motion.div>
            <div style={{ overflow: 'hidden' }}>
              <motion.h1
                variants={{
                  hidden: { y: '70%', opacity: 0 },
                  show: { y: '0%', opacity: 1, transition: { duration: DUR.hero, ease: EASE } },
                }}
              >
                {category.name}
              </motion.h1>
            </div>
            <motion.div className="sub" variants={fadeRise}>
              <p>{category.tagline}</p>
              {pieceCount > 0 && (
                <span className="piece-count">
                  {pieceCount} {pieceCount === 1 ? 'Piece' : 'Pieces'}
                </span>
              )}
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* ── EDITORIAL INTRODUCTION ── */}
      <section className="block cat-intro">
        <div className="wrap cat-intro-grid">
          <motion.div
            variants={stagger(STAGGER.standard)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <motion.div className="eyebrow" variants={fadeRise}>The Collection</motion.div>
            <motion.h2 className="cat-h2" variants={fadeRise}>{category.name}</motion.h2>
            <motion.p className="cat-desc" variants={fadeRise}>{category.description}</motion.p>
            <motion.div style={{ marginTop: 28 }} variants={fadeRise}>
              <a className="btn-reviews" href={siteConfig.googleReviews} target="_blank" rel="noopener">
                <em className="star">★</em> View Google Reviews
              </a>
            </motion.div>
          </motion.div>

          <motion.ul
            className="cat-highlights"
            variants={stagger(STAGGER.standard, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {category.highlights.map((h) => (
              <motion.li key={h} variants={fadeRise}>
                <span className="dot" />
                {h}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ── ADMIN PRODUCTS ── */}
      {hasProducts && (
        <section className="block cat-gallery-section">
          <div className="wrap">
            <motion.div
              className="section-head center"
              variants={stagger(STAGGER.standard)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              <motion.div className="eyebrow" variants={fadeRise}>The Pieces</motion.div>
              <motion.h3 variants={fadeRise}>Pieces from this collection</motion.h3>
            </motion.div>

            <div className="product-grid">
              {adminProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY (file-based) with fullscreen viewer ── */}
      {(!hasProducts || galleryImages.length > 0) && (
        <section className="block cat-gallery-section">
          <div className="wrap">
            {!hasProducts && (
              <motion.div
                className="section-head center"
                variants={stagger(STAGGER.standard)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
              >
                <motion.div className="eyebrow" variants={fadeRise}>The Gallery</motion.div>
                <motion.h3 variants={fadeRise}>Pieces from this collection</motion.h3>
              </motion.div>
            )}

            {galleryImages.length > 0 ? (
              <>
                <div className="gallery-grid">
                  {galleryImages.map((src, i) => (
                    <motion.button
                      key={src}
                      type="button"
                      className="gallery-item"
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`View ${category.name} image ${i + 1} fullscreen`}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={{
                        hidden: { opacity: 0, y: 36 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: DUR.reveal, ease: EASE, delay: (i % 3) * 0.07 },
                        },
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`${category.name} ${i + 1}`} loading="lazy" decoding="async" />
                    </motion.button>
                  ))}
                </div>

                <Lightbox
                  images={galleryImages}
                  index={lightboxIndex}
                  alt={(i) => `${category.name} ${i + 1}`}
                  onClose={() => setLightboxIndex(null)}
                  onNavigate={setLightboxIndex}
                />
              </>
            ) : !hasProducts ? (
              <>
                <div className="gallery-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="gallery-item placeholder"
                      style={{ backgroundImage: category.gradient }}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={{
                        hidden: { opacity: 0, y: 36 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: DUR.reveal, ease: EASE, delay: (i % 3) * 0.07 },
                        },
                      }}
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

      {/* ── CTA ── */}
      <section className="block cat-cta">
        <motion.div
          className="wrap cat-cta-inner"
          variants={stagger(STAGGER.standard)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.h3 variants={fadeRise}>
            Bring the <span className="serif-italic">{category.name}</span> collection home
          </motion.h3>
          <motion.p variants={fadeRise}>
            Message us for pricing and availability, or visit our 30,000 sq.ft showroom in
            Velachery, Chennai.
          </motion.p>
          <motion.div className="cat-cta-actions" variants={fadeRise}>
            <a className="btn" href={waHref} target="_blank" rel="noopener">
              Enquire on WhatsApp <span className="arrow">→</span>
            </a>
            <a className="btn ghost" href={siteConfig.maps} target="_blank" rel="noopener">
              Visit Showroom
            </a>
          </motion.div>
          <motion.div className="cat-cta-reviews" variants={fadeRise}>
            <a className="btn-reviews" href={siteConfig.googleReviews} target="_blank" rel="noopener">
              <em className="star">★</em> See 1100+ Customer Reviews
            </a>
          </motion.div>
        </motion.div>
      </section>
    </article>
  );
}
