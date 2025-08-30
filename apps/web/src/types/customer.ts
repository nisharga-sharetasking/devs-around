export interface ICustomer {
  _id: string;
  full_name: string;
  email: string;
  role: "USER" | "ADMIN"; // Adjust based on your system's roles
  status: string; // Common status values
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  returned_orders: number;
  cancelled_orders: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  id: string;
}