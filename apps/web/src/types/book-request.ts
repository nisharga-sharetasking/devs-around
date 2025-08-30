/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IBookRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  details: string;
  priority: 'low' | 'normal' | 'high'; // adjust if other values are possible
  status: 'pending' | 'approved' | 'rejected'; // adjust if other statuses exist
  replies: any[]; // replace `any` with appropriate type if you have reply structure
  createdAt: string; // or `Date` if parsed
  updatedAt: string; // or `Date` if parsed
}