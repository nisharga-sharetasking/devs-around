/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { ImageUploadInputWithImgBB } from "../../../(products)/add-new-product/_components/image-upload-input";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorToolbar } from "@/components/tiptap/editor-toolbar";
import { useCreateDigitalProductMutation } from "@/redux/api-queries/digital-product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IDigitalProductData,
  OFFER_TAG_OPTIONS,
} from "@/types/digital-product";
import { useRouter } from "next/navigation";
import { FileUploadInput } from "@/components/file-upload/file-upload-input";

const AddNewProductForm = () => {
  const [currentSearchTag, setCurrentSearchTag] = useState("");
  const [currentOfferTag, setCurrentOfferTag] = useState("");
  const [bookSample, setBookSample] = useState<string[]>([]);
  console.log("🚀 ~ AddNewProductForm ~ bookSample:", bookSample);

  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    name: "",
    sku: "",
    description: "",
    thumbnail: "",
    slider_images: [],
    regular_price: "",
    sale_price: "",
    search_tags: [],
    offer_tags: [] as string[],
    file_links: [],
    is_published: true,
    book_inside_samples: [] as string[],
  });

  const [createProduct, { isLoading }] = useCreateDigitalProductMutation();

  const handleInputChange = (field: keyof IDigitalProductData, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleThumbnailUpload = (urls: string[]) => {
    if (urls.length > 0) {
      handleInputChange("thumbnail", urls[0]);
    }
  };

  const handleSliderImagesUpload = (urls: string[]) => {
    handleInputChange("slider_images", urls);
  };

  const addSearchTag = () => {
    if (
      currentSearchTag.trim() &&
      !formData.search_tags.includes(currentSearchTag?.trim())
    ) {
      handleInputChange("search_tags", [
        ...formData.search_tags,
        currentSearchTag.trim(),
      ]);
      setCurrentSearchTag("");
    }
  };

  const removeSearchTag = (index: number) => {
    const updated = [...formData.search_tags];
    updated.splice(index, 1);
    handleInputChange("search_tags", updated);
  };

  // offer tags
  const addOfferTag = (tagToAdd?: string) => {
    const tag = (tagToAdd ?? currentOfferTag).trim() as string;
    if (tag && !formData.offer_tags?.includes(tag)) {
      setFormData((prev: any) => ({
        ...prev,
        offer_tags: [...prev.offer_tags, tag],
      }));
    }
    setCurrentOfferTag("");
  };

  const removeOfferTag = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      offer_tags: prev.offer_tags.filter((_: any, i: number) => i !== index),
    }));
  };

  // Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.description,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev: any) => ({ ...prev, description: html }));
    },
  });

  const handleCreate = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.sku.trim()) {
      toast.error("SKU is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.thumbnail) {
      toast.error("Thumbnail image is required");
      return;
    }

    formData.regular_price = Number(formData?.regular_price);
    formData.sale_price = Number(formData?.sale_price);

    // === Create product ===
    try {
      const response = await createProduct({ payload: formData }).unwrap();
      if (response?.statusCode === 201) {
        toast.success("Product created successfully!");
        router.replace("/dashboard/digital-products");
      }
    } catch (error: any) {
      console.error("Product creation error:", error);
      toast.error(error?.data?.message || "Failed to create product");
    }
  };

  useEffect(() => {
    setFormData((prev: IDigitalProductData) => ({
      ...prev,
      book_inside_samples: bookSample,
    }));
  }, [bookSample]);

  return (
    <div className="">
      <Card>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="e.g., UIKIT-APP-001"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block font-medium">
              Description *
            </label>
            {editor && <EditorToolbar editor={editor} />} {/* Optional */}
            <div className="border p-4 rounded-lg">
              <EditorContent editor={editor} className="prose max-w-none" />
            </div>
          </div>

          {/* ===== book Sample ===== */}
          <div className="col-span-2 gap-2">
            <h3 className="text-sm font-medium mb-2">Add Book Sample</h3>
            <ImageUploadInputWithImgBB
              inputId="book-image-upload"
              defaultValue={bookSample!.map((sample) => sample)}
              onChange={setBookSample}
            />
          </div>

          <div className="flex gap-4 flex-col lg:flex-row">
            {/* Thumbnail Upload */}
            <div className="space-y-2 flex-1">
              <Label>Thumbnail Image *</Label>
              <ImageUploadInputWithImgBB
                inputId="thumbnail-upload"
                defaultValue={formData.thumbnail ? [formData.thumbnail] : []}
                onChange={handleThumbnailUpload}
              />
            </div>

            {/* Slider Images Upload */}
            <div className="space-y-2 flex-1">
              <Label>Slider Images</Label>
              <ImageUploadInputWithImgBB
                inputId="slider-upload"
                defaultValue={formData.slider_images}
                onChange={handleSliderImagesUpload}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="regular_price">Regular Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="regular_price"
                  type="number"
                  value={formData.regular_price}
                  onChange={(e) =>
                    handleInputChange("regular_price", e.target.value)
                  }
                  placeholder="0"
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale_price">Sale Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="sale_price"
                  type="number"
                  value={formData.sale_price}
                  onChange={(e) =>
                    handleInputChange("sale_price", e.target.value)
                  }
                  placeholder="0"
                  className="pl-7"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 flex-col lg:flex-row">
            {/* Search Tags */}
            <div className="space-y-2 flex-1">
              <Label>Search Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={currentSearchTag}
                  onChange={(e) => setCurrentSearchTag(e.target.value)}
                  placeholder="Add search tag"
                  onKeyPress={(e) => e.key === "Enter" && addSearchTag()}
                />
                <Button type="button" onClick={addSearchTag} size="icon">
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.search_tags.map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}

                    <button
                      type="button"
                      onClick={() => removeSearchTag(index)}
                      className="cursor-pointer hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            {/* Offer Tags */}
            <div className="space-y-2 flex-1">
              <Label>Offer Tags</Label>

              {/* Dropdown Select */}
              <Select onValueChange={addOfferTag}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select predefined offer tag" />
                </SelectTrigger>
                <SelectContent>
                  {OFFER_TAG_OPTIONS.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Display selected tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.offer_tags.map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 pr-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeOfferTag(index)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* File Links */}
          <div className="space-y-2">
            <Label>File Links</Label>
            <FileUploadInput
              inputId="file-upload"
              defaultValue={formData.file_links}
              onChange={(links) =>
                setFormData((prev: any) => ({ ...prev, file_links: links }))
              }
            />
          </div>

          {/* Published Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) =>
                handleInputChange("is_published", checked)
              }
            />
            <Label htmlFor="is_published">Published</Label>
          </div>

          {/* Create Button */}
          <Button
            onClick={handleCreate}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Product"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNewProductForm;
