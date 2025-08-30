import { TSubCategory } from "./sub-category";

export type TCategory = {
  _id: string;
  name_en: string;
  name_bn: string;
  description_en?: string;
  description_bn?: string;
  slug?: string;
  image_url?: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  subcategories: TSubCategory[];
};
