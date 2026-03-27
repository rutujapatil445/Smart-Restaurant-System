export interface Settings {
  restaurant_name: string;
  restaurant_type: string;
  tagline: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  opening_hours: string; // JSON string
  address: string;
  phone: string;
  email: string;
  seo_title: string;
  seo_description: string;
}

export interface MenuCategory {
  id: number;
  name: string;
  sort_order: number;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_popular: boolean;
  is_available: boolean;
  variants?: string; // JSON string: { name: string; price: number }[]
  options?: string; // JSON string: { name: string; price: number }[]
}

export interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  table_number?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'seated';
  created_at: string;
}

export interface NewsletterSub {
  id: number;
  email: string;
  created_at: string;
}

export interface GalleryItem {
  id: number;
  image_url: string;
  caption: string;
  category?: string;
  created_at: string;
}

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  sort_order: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  code: string;
  expiry_date: string;
  is_active: boolean;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  type: 'blog' | 'event' | 'announcement';
  image_url: string;
  created_at: string;
}
