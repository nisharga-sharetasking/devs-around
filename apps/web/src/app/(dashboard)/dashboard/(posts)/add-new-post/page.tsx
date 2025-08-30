import React from "react";
import AddNewProductForm from "./_components/add-new-product-form";

const AddNewProductPage = () => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium">Add New Digital Product</h1>
      <AddNewProductForm />
    </section>
  );
};

export default AddNewProductPage;
