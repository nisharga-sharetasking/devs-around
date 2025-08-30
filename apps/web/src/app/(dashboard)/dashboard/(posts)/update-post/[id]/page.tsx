import React from "react";
import UpdateProductForm from "./_components/update-product-form";

const UpdateProductPage = () => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">Update Product</h1>
      <UpdateProductForm />
    </section>
  );
};

export default UpdateProductPage;
