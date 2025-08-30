/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { IDigitalProductData } from "@/types/digital-product";
import { useDeleteDigitalProductMutation } from "@/redux/api-queries/digital-product";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

const ProductActions = ({ product }: { product: IDigitalProductData }) => {
  // delete product dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // === delete product api mutation hook ===
  const [deleteProduct, { isLoading }] = useDeleteDigitalProductMutation();

  // === handle delete product ===
  const handleDeleteProduct = async () => {
    try {
      const res: any = await deleteProduct({ productId: product?._id });
      if (res?.data?.success) {
        setOpenDeleteDialog(false);
        toast.success("Product deleted successfully!");
      } else if (res?.error?.data?.message) {
        toast.error(res?.error?.data?.message || "Failed to delete product!");
      }
    } catch (error) {
      console.error("DELETE PRODUCT ERROR: ", error);
      toast.error("Somthing went wrong! Please try again.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {/* view product */}
        <Dialog>
          <DialogTrigger className="border border-sm p-2 rounded-sm cursor-pointer !text-xs text-[#09090b] font-medium">
            View
          </DialogTrigger>
          <DialogContent className="!max-w-[50%]">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
              <ProductDetails product={product} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {/* view product end */}
        <Link href={`/dashboard/update-digital-product/${product?._id}`}>
          <Button variant="outline" size="icon">
            <SquarePen />
          </Button>
        </Link>

        <Button
          variant="outline"
          size="icon"
          className="hover:text-destructive"
          onClick={() => setOpenDeleteDialog(true)}
        >
          <Trash />
        </Button>
      </div>
      {/* delete product dialog */}
      <ConfirmActionDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        actionName="Delete"
        itemName={product?.name}
        onConfirm={handleDeleteProduct}
        isLoading={isLoading}
      />
    </>
  );
};

export default ProductActions;

export const ProductDetails = ({ product }: { product?: any }) => {
  const [selectedImage, setSelectedImage] = useState(product?.thumbnail);
  const allImages = [product?.thumbnail, ...product?.slider_images];

  const discountPercentage =
    product?.regular_price > 0
      ? Math.round(
          ((product?.regular_price - product?.sale_price) /
            product?.regular_price) *
            100
        )
      : 0;

  return (
    <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-2 text-black">
      {/* Product Image */}
      <div className="flex justify-center">
        <div className="w-48 h-48 relative rounded-lg border overflow-hidden">
          <Image
            src={selectedImage || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Image Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 justify-center">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`w-12 h-12 rounded border-2 overflow-hidden ${
                selectedImage === image ? "border-primary" : "border-gray-200"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${product?.name} ${index + 1}`}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{product?.name}</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">SKU:</span>
          <Badge variant="outline" className="text-xs">
            {product?.sku}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-medium mb-1">Description</h4>
        <div
          className="text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>

      <Separator />

      {/* Product Overview */}
      <div className="space-y-2">
        <h4 className="font-medium">Overview</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Slug:</span>
            <span>{product?.slug}</span>
          </div>{" "}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Sold:</span>
            <span>{product?.total_sold}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Views:</span>
            <span className="font-medium text-primary">{product?.views}</span>
          </div>
          {product?.file_links.length > 0 && (
            <div>
              <span className="text-muted-foreground text-sm">
                Download Links:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {product?.file_links.map((tag: string, index: string) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Pricing */}
      <div className="space-y-2">
        <h4 className="font-medium">Pricing</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Regular Price:</span>
            <span
              className={
                product.regular_price !== product.sale_price
                  ? "line-through text-muted-foreground"
                  : ""
              }
            >
              ${product.regular_price}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sale Price:</span>
            <span className="font-medium text-primary">
              ${product.sale_price}
            </span>
          </div>
          {discountPercentage > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount:</span>
              <Badge variant="destructive" className="text-xs">
                {discountPercentage}% OFF
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {(product?.search_tags.length > 0 || product?.offer_tags.length > 0) && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium">Tags</h4>
            <div className="space-y-2">
              {product?.offer_tags.length > 0 && (
                <div>
                  <span className="text-muted-foreground text-sm">Offers:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product?.offer_tags.map((tag: string, index: string) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="text-xs"
                      >
                        {tag.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {product?.search_tags.length > 0 && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Search Tags:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product?.search_tags.map((tag: string, index: string) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium">Variants</h4>
            <div className="space-y-3">
              {product?.variants.map((variant: any, index: number) => (
                <div key={index} className="border rounded p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">${variant.price}</span>
                    <Badge variant="outline" className="text-xs">
                      {variant?.sku}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Available: </span>
                    <span>{variant?.available_quantity}</span>
                  </div>
                  {variant.discount > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Discount: </span>
                      <span>${variant?.discount}</span>
                    </div>
                  )}
                  <div className="space-y-1">
                    {Object.entries(variant.attribute_values).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {key}:
                          </span>
                          <span>{value as string}</span>
                        </div>
                      )
                    )}
                  </div>
                  {variant.image && (
                    <div className="flex justify-center mt-2">
                      <Image
                        src={variant.image || "/placeholder.svg"}
                        alt={variant.sku}
                        width={60}
                        height={60}
                        className="rounded border"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Order Information */}
      <Separator />
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Published:</span>
          <span
            className={product.is_published ? "text-green-600" : "text-red-600"}
          >
            {product.is_published ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
};
