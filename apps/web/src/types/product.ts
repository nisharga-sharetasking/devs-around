import { TCategory } from "./category";
import { TSubCategory } from "./sub-category";

export type TProduct = {
  _id: string;
  id: string;
  // Basic Info
  name: string;
  slug: string;
  sku: string;
  description: string;

  // Images
  thumbnail: string;
  slider_images?: string[];

  // Unit & Pricing
  unit?: string;
  unit_price?: number;
  regular_price?: number;
  sale_price?: number;
  discount_amount?: number;
  discount_type?: "FLAT" | "PERCENTAGE";

  // Stock & Order Constraints
  min_order_qty?: number;
  max_order_qty?: number;
  current_stock_qty: number;
  total_sold: number;
  total_quantity: number;
  default_shipping_charge: number;
  shipping_charge_per_qty: number;

  // Delivery & Offers
  approximately_delivery_time: string; // default is "4 to 5 days"
  is_free_delivery?: boolean;
  coin_per_order?: number;
  shipping_cost?: number;
  shipping_cost_per_unit?: number;

  // Policy
  warranty?: string;
  return_policy?: string;
  order_from?: string;

  // Ratings & Reviews
  total_rating?: number;
  reviews?: {
    rating: number;
    comment: string;
    user: unknown;
    images?: string[];
  }[];

  // Tags
  search_tags?: string[];
  offer_tags?: string[];

  // Social Links
  social_links?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };

  // order links
  order_links : [
    {
      name: string;
      link: string;
    }
  ]

  // Variant System
  attributes?: string[]; // e.g., ["Size", "Color", "Material"]
  variants?: IVariantCombination[]; // all possible combinations

  // Category Reference
  category: TCategory;
  subcategory: TSubCategory;

  // Visibility
  is_published?: boolean;

  createdAt: string;
  updatedAt: string;
}


type IVariantCombination = {
  attribute_values: {
    [key: string]: string; // e.g., { Size: "M", Color: "Red" }
  };
  price: number;
  discount: number;
  sku: string;
  available_quantity: number;
  image?: string; // optional: image for this variant
}

