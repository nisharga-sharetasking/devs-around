/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorToolbar } from "@/components/tiptap/editor-toolbar";
import {
  useGetDigitalProductByIdQuery,
  useUpdateDigitalProductMutation,
} from "@/redux/api-queries/digital-product";
import {
  IDigitalProductData,
  OFFER_TAG_OPTIONS,
} from "@/types/digital-product";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploadInputWithImgBB } from "@/app/(dashboard)/dashboard/(products)/add-new-product/_components/image-upload-input";
import { Loader, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploadInput } from "@/components/file-upload/file-upload-input";
import { ImageUploadInput } from "@/components/ui/image-upload-input";
import { useUploadFileMutation } from "@/redux/api-queries/aws-upload-api";

const UpdateDigitalProductForm = () => {
  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateDigitalProductMutation();

  const [formData, setFormData] = useState<IDigitalProductData | any>(null);
  const [originalData, setOriginalData] = useState<IDigitalProductData | null>(
    null
  );

  const [currentSearchTag, setCurrentSearchTag] = useState("");
  const [bookSample, setBookSample] = useState<(string | File)[]>([]);

  const router = useRouter();
  const { id } = useParams(); // productId from URL
  const productId = id as string;

  const { data, isLoading: isFetching } = useGetDigitalProductByIdQuery({
    id: productId,
  });

  // === file upload api mutation hook ===
  const [uploadFile, { isLoading: isUploadFileLoading }] =
    useUploadFileMutation();

  // add remove search tag
  const addSearchTag = () => {
    if (!currentSearchTag.trim()) return;

    if (!formData?.search_tags.includes(currentSearchTag.trim())) {
      handleInputChange("search_tags", [
        ...formData.search_tags,
        currentSearchTag.trim(),
      ]);
    }
    setCurrentSearchTag("");
  };
  const removeSearchTag = (index: number) => {
    const updated = [...formData.search_tags];
    updated.splice(index, 1);
    handleInputChange("search_tags", updated);
  };

  // offer
  const addOfferTag = (tag: string) => {
    if (!formData?.offer_tags.includes(tag)) {
      handleInputChange("offer_tags", [...formData.offer_tags, tag]);
    }
  };
  const removeOfferTag = (index: number) => {
    const updated = [...formData.offer_tags];
    updated.splice(index, 1);
    handleInputChange("offer_tags", updated);
  };
  const editor = useEditor({
    extensions: [StarterKit],
    content: formData?.description || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleInputChange("description", html);
    },
  });

  const handleInputChange = (field: keyof IDigitalProductData, value: any) => {
    setFormData((prev: any) => (prev ? { ...prev, [field]: value } : prev));
  };

  // Load initial data
  useEffect(() => {
    if (data?.data) {
      setFormData(data.data);
      setOriginalData(data.data);
    }
  }, [data]);
  useEffect(() => {
    if (editor && formData?.description) {
      editor.commands.setContent(formData.description);
    }
  }, [editor, formData?.description]);

  // set all data
  useEffect(() => {
    if (data?.data) {
      const defaulted = {
        ...data.data,
        search_tags: data.data.search_tags || [],
        offer_tags: data.data.offer_tags || [],
        file_links: data.data.file_links || [],
        book_inside_samples: data.data.book_inside_samples || [],
      };
      setFormData(defaulted);
      setOriginalData(defaulted);
    }
  }, [data]);

  const getUpdatedFields = () => {
    const updatedFields: Partial<IDigitalProductData> = {};
    if (!formData || !originalData) return updatedFields;

    for (const key in formData) {
      const formValue = (formData as any)[key];
      const originalValue = (originalData as any)[key];

      if (key === "book_inside_samples") {
        const hasFile = (formValue as any[]).some(
          (item) => item instanceof File
        );
        if (
          hasFile ||
          JSON.stringify(formValue) !== JSON.stringify(originalValue)
        ) {
          updatedFields[key as keyof IDigitalProductData] = formValue;
        }
      } else {
        if (JSON.stringify(formValue) !== JSON.stringify(originalValue)) {
          updatedFields[key as keyof IDigitalProductData] = formValue;
        }
      }
    }

    return updatedFields;
  };

  const handleUpdate = async () => {
    if (!formData) return;

    const updatedSample: string[] = [];

    for (const item of bookSample) {
      if (typeof item === "string") {
        // Already a URL, keep it
        updatedSample.push(item);
      } else if (item instanceof File) {
        // It's a file, so upload it
        const formData = new FormData();
        formData.append("file", item);

        try {
          const response: any = await uploadFile({ file: formData });

          if (response?.data?.success) {
            updatedSample.push(response.data.data.display_url);
          } else {
            console.error("❌ Upload failed for:", item.name);
          }
        } catch (error) {
          console.error("❌ Error uploading file:", item.name, error);
        }
      }
    }

    let payload = getUpdatedFields();
    if (Object.keys(payload).length === 0) {
      toast.info("No changes detected.");
      return;
    }
    payload.book_inside_samples = updatedSample;
    console.log("payload:", payload);

    try {
      const response = await updateProduct({ productId, payload }).unwrap();
      toast.success("Product updated successfully!");
      console.log("🚀 ~ handleUpdate ~ response:", response);
      router.replace("/dashboard/digital-products");
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed");
      console.error("Update error:", error);
    }
  };

  useEffect(() => {
    if (bookSample.length > 0 && formData) {
      setFormData((prev: any) => ({
        ...prev,
        book_inside_samples: bookSample,
      }));
    }
  }, [bookSample]);

  if (isFetching || !formData)
    return (
      <div className="w-fit mx-auto py-4">
        <Loader className="size-5 animate-spin" />
      </div>
    );

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Product Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>SKU *</Label>
            <Input
              value={formData.sku}
              onChange={(e) => handleInputChange("sku", e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          {editor && <EditorToolbar editor={editor} />}
          <div className="border rounded p-4">
            <EditorContent editor={editor} className="prose" />
          </div>
        </div>

        {/* ===== book Sample ===== */}
        <div className="col-span-2 gap-2">
          <h3 className="text-sm font-medium mb-2">Add Book Sample</h3>
          <ImageUploadInput
            mode="multiple"
            inputId="book-image-upload"
            defaultValue={data?.data?.book_inside_samples || []}
            onChange={setBookSample}
          />
        </div>

        {/* Thumbnail Slider */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Thumbnail Upload */}
          <div className="space-y-2 flex-1">
            <Label>Thumbnail Image *</Label>
            <ImageUploadInputWithImgBB
              inputId="thumbnail-upload"
              defaultValue={formData.thumbnail ? [formData.thumbnail] : []}
              onChange={(urls: string[]) =>
                handleInputChange("thumbnail", urls[0])
              }
            />
          </div>

          {/* Slider Images Upload */}
          <div className="space-y-2 flex-1">
            <Label>Slider Images</Label>
            <ImageUploadInputWithImgBB
              inputId="slider-upload"
              defaultValue={formData.slider_images}
              onChange={(urls: string[]) =>
                handleInputChange("slider_images", urls[0])
              }
            />
          </div>
        </div>

        {/* Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Regular Price</Label>
            <Input
              type="number"
              value={formData.regular_price}
              onChange={(e) =>
                handleInputChange("regular_price", Number(e.target.value))
              }
            />
          </div>
          <div>
            <Label>Sale Price</Label>
            <Input
              type="number"
              value={formData.sale_price}
              onChange={(e) =>
                handleInputChange("sale_price", Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* Search Tags - offertag */}
        <div className="flex gap-4 flex-col lg:flex-row">
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

        {/* Published */}
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.is_published}
            onCheckedChange={(checked) =>
              handleInputChange("is_published", checked)
            }
          />
          <Label>Published</Label>
        </div>

        <Button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="w-full block"
        >
          {isUpdating || isUploadFileLoading ? "Updating..." : "Update Product"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpdateDigitalProductForm;
