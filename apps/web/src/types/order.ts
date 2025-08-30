/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IOrder {
  _id: string;
  id: string;
  order_id: number;
  invoice_number: string;
  order_by: "GUEST" | "USER"; // adjust if other roles exist
  order_note: string;
  order_date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"; // adjust as needed

  user: null | string; // or a User object if present

  billing_address: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
  };

  payment_info: {
    session_id: string;
    session_url: string;
    payment_status: "paid" | "unpaid" | "refunded"; // adjust as needed
  };

  products: Array<{
    _id: string;
    product: {
      _id: string;
      name: string;
      slug: string;
      sku: string;
      thumbnail: string;
      [key: string]: any; // for other optional product fields
    };
    product_name: string;
    selected_variants: Array<{
      attribute_name: string;
      name: string;
    }>;
    price: number;
    discounted_price: number;
    discount: number;
    total_price: number;
    total_quantity: number;
  }>;

  sub_total: number;
  total_discount: number;
  shipping_charge: number;
  total_amount: number;
}
