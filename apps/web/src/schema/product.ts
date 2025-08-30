import { z } from "zod";


export const CreateProductSchema = z.object({
  // Basic Info
  name: z.string({
    required_error: "Product Name is required",
  }).min(3, { message: "Product Name must be at least 3 characters" }),

  description: z.string().optional(),

  sku: z.string({
    required_error: "SKU is required",
  }),

  // Images
  thumbnail: z.string().url({ message: "Thumbnail must be a valid URL" }).optional(),
  slider_images: z.array(z.string().url({ message: "Slide image must be a valid URL" })).optional(),

  // Pricing & Units
  unit: z.string().optional(),
  regular_price: z.coerce.number({
    required_error: "Regular price is required",
  }),

  sale_price: z.coerce.number({
    required_error: "Sell amount is required",
  }).min(0, { message: "Sell must be zero or more" }),

  discount_type: z.enum(["FLAT", "PERCENTAGE"], {
    required_error: "Discount type is required",
  }).optional(),

  // Shipping
  shipping_cost: z.coerce.number({
    required_error: "Shipping cost is required",
  }).min(0).optional(),

  shipping_cost_per_unit: z.coerce.number().min(0).default(0).optional(),

  // Quantity
  min_order_qty: z.coerce.number().min(1).default(1),
  max_order_qty: z.coerce.number().min(1).optional(),
  current_stock_qty: z.coerce.number().min(0, { message: "Stock must be 0 or more" }).optional(),
  total_stock_qty: z.coerce.number().min(0, { message: "Total Stock must be 0 or more" }).optional(),

  total_sold: z.coerce.number().min(0).optional(),
  coin_per_order: z.coerce.number().min(0).optional(),

  // Delivery & Incentives
  approximately_delivery_time: z.string({
    required_error: "Delivery time is required",
  }),

  is_free_delivery: z.boolean().default(false),
 

  // Policies
  warranty: z.string().optional(),
  return_policy: z.string().optional(),
  order_from: z.string().optional(), 

  // Ratings
  total_rating: z.coerce.number().min(0).optional(),

  // Tags
  search_tags: z.array(z.string()).optional(),
  offer_tags: z.array(z.string()).optional(),

  // Attributes (flat structure like from dropdowns or checkboxes)
  attributes: z.array(z.string()).optional(),

  // Variants
  variants: z.array(
    z.object({
      attribute_values: z.record(z.string(), z.string()), // e.g. { Size: "M", Color: "Red" }
      price: z.coerce.number({ required_error: "Variant price is required" }),
      sku: z.string({ required_error: "Variant SKU is required" }),
      available_quantity: z.coerce.number({
        required_error: "Available quantity is required",
      }).min(0, { message: "Available quantity cannot be negative" }),
      image: z.string().url().optional(),
    })
  ).optional(),

  // Social Links
  social_links: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    youtube: z.string().url().optional(),
    tiktok: z.string().url().optional(),
  }).optional(),

  book_inside_samples: z.array(z.string().url()).optional(),

  // Relations (with ObjectId format)
  category: z.string({
    required_error: "Category ID is required",
  }),

  subcategory: z.string({
    required_error: "Sub-category ID is required",
  }),
});



// export const CreateProductVariationSchema = z.object({
//   attribute: z.string({
//     required_error: "Attribute is required.",
//     invalid_type_error: "Attribute must be a string.",
//   }),
//   value: z.string({
//     required_error: "Value is required.",
//     invalid_type_error: "Value must be a string.",
//   }),
//   price: z.coerce.number({
//     required_error: "Price is required.",
//     invalid_type_error: "Price must be a number.",
//   }),
//   stock: z.coerce.number().int({
//     message: "Stock is required.",
//   }),
// });