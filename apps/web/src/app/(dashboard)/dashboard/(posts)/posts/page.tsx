"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ProductsTable } from "./_components/products-table";
import Pagination from "@/components/shared/pagination";
import GlobalLoader from "@/components/shared/global-loader";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetAllDigitalProductsQuery } from "@/redux/api-queries/digital-product";

const ProductsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  // === get all products ===
  const [filters, setFilters] = useState({
    search_query: searchInput,
    page: 1,
    limit: 10,
  });
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search_query: searchInput,
      page: 1, // Optional: reset to page 1 when searching
    }));
  }, [searchInput]);

  // === get all products ===
  const { data, isLoading, isFetching } =
    useGetAllDigitalProductsQuery(filters);
  const products = data?.data?.data;

  if (isLoading) return <GlobalLoader />;

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-medium text-2xl">
          All Digital Products ({data?.data?.meta?.total})
        </h1>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search Via Product Name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button asChild className="ms-auto">
            <Link href="/dashboard/add-new-digital-product">
              Add new Product
            </Link>
          </Button>
        </div>
      </div>
      {/* table */}
      <ProductsTable
        products={products}
        isLoading={isLoading}
        isFetching={isFetching}
        page={data?.data?.meta.page}
      />

      {/* pagination */}
      <div className="flex items-center justify-end pb-4">
        {products && (
          <Pagination
            page={data?.data.meta.page}
            limit={data?.data.meta.limit}
            total={data?.data.meta?.total}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
