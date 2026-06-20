export interface AdminProduct {
  id: string;
  categorySlug: string;
  name: string;
  description: string;
  price: string;
  image: string;
  featured: boolean;
  visible: boolean;
  createdAt: string;
}

export interface AdminReview {
  id: string;
  name: string;
  text: string;
  rating: number;
  photo: string;
  location: string;
  visible: boolean;
  createdAt: string;
}

export interface SiteContent {
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  googleReviewLink: string;
  heroHeadline: string;
  heroSubtitle: string;
  categoryDescriptions: Record<string, string>;
}
