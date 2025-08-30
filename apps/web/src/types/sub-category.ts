import { TCategory } from "./category";

export type TSubCategory = {
  _id: string;
  name_en: string;
  description_en?: string;
  slug?: string;
  image_url?: string;
  position: number;
  category?: TCategory;
  createdAt: Date;
  updatedAt: Date;
};
