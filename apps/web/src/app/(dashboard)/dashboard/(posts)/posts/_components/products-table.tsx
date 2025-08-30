"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import React from "react";
import ProductActions from "./product-actions";
import { getActualIndex } from "@/utils/formatDate";
import { IDigitalProductData } from "@/types/digital-product";

type ProductsTableProps = {
  products: IDigitalProductData[];
  isLoading: boolean;
  isFetching: boolean;
  page: number;
};

const PRODUCTS_TABLE_HEADERS = [
  "SL No.",
  "Thumbnail",
  "Name",
  "SKU",
  "Total Sold",
  "Views",
  "Is Published",
  "Actions",
];

export function ProductsTable({
  products,
  isLoading,
  isFetching,
  page,
}: ProductsTableProps) {
  return (
    <div className="bg-background p-2 rounded-lg shadow-md">
      <Table>
        {/* table header */}
        <TableHeader className="relative h-9 bg-sidebar">
          <TableRow className="border-b-primary/50">
            {PRODUCTS_TABLE_HEADERS.map((header, index) => (
              <TableHead
                key={header}
                className={cn("bg-primary/10 px-8", {
                  "text-center rounded-tr-md":
                    index === PRODUCTS_TABLE_HEADERS.length - 1,
                  "rounded-tl-md": index === 0,
                })}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* table body */}
        {products?.length > 0 && (
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="px-8">
                  {getActualIndex(index, page, 10)}
                </TableCell>
                <TableCell className="px-8">
                  <Image
                    src={product?.thumbnail || "/no_image.png"}
                    alt={product?.name}
                    height={32}
                    width={32}
                    className="rounded-md size-16"
                    unoptimized
                  />
                </TableCell>
                <TableCell className="px-8 w-[500px] break-words whitespace-normal">
                  {product?.name}
                </TableCell>
                <TableCell className="px-8">{product?.sku}</TableCell>
                <TableCell className="px-8">{product?.total_sold}</TableCell>
                <TableCell className="px-8">{product?.views}</TableCell>
                <TableCell className="px-8">
                  {product?.is_published ? "yes" : "no"}
                </TableCell>
                <TableCell className="px-8 text-center">
                  <ProductActions product={product} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      {/* loading data state */}
      {(isLoading || isFetching) && (
        <div className="w-fit mx-auto py-4">
          <Loader className="size-5 animate-spin" />
        </div>
      )}

      {/* empty data state */}
      {!isLoading && products?.length <= 0 && (
        <div className="text-center py-4">No data found!</div>
      )}
    </div>
  );
}
