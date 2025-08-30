export interface IDigitalProductData {
  _id: string;
  name: string;
  sku: string;
  description: string;
  thumbnail: string;
  slider_images: string[];
  regular_price: string;
  sale_price: string;
  search_tags: string[];
  offer_tags: string[];
  file_links: string[];
  is_published: boolean;
  total_sold?: number;
  views?: number;
  book_inside_samples?: string[];
}

export const OFFER_TAG_OPTIONS = ["NEW_ARRIVAL", "BEST_PRICE"];