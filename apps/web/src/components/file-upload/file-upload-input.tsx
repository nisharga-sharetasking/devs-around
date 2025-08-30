"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ENV } from "@/constants/env";

interface Props {
  inputId: string;
  defaultValue?: string[];
  onChange?: (urls: string[]) => void;
  className?: string;
}

export const FileUploadInput = ({
  inputId,
  defaultValue = [],
  onChange,
  className,
}: Props) => {
  const [fileUrls, setFileUrls] = useState<string[]>(defaultValue);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setLoading(true);
    const uploaded: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(
          `${ENV.NEXT_PUBLIC_BASE_SERVER_API}/upload/single`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        if (data?.success) {
          uploaded.push(data.data.url);
        } else {
          toast.error(`❌ Upload failed: ${file.name}`);
        }
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Upload failed.");
      }
    }

    const newFiles = [...fileUrls, ...uploaded];
    setFileUrls(newFiles);
    onChange?.(newFiles);
    setLoading(false);
  };

  const handleRemove = (index: number) => {
    const updated = [...fileUrls];
    updated.splice(index, 1);
    setFileUrls(updated);
    onChange?.(updated);
  };

  useEffect(() => {
    setFileUrls(defaultValue);
  }, [defaultValue]);

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 rounded-lg border border-input p-4",
        className
      )}
    >
      <div
        onClick={() => !loading && document.getElementById(inputId)?.click()}
        className="flex items-center justify-center gap-4 w-full cursor-pointer"
      >
        <div className="size-10 rounded-md grid place-items-center bg-secondary">
          <Plus size={16} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {loading ? "Uploading..." : "Click to upload"}
          </span>
          <span className="text-xs text-muted-foreground">
            Supported: PDF, DOCX, ZIP, etc.
          </span>
        </div>
      </div>

      {fileUrls.length > 0 && (
        <div className="space-y-2">
          {fileUrls.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-secondary rounded"
            >
              <div className="flex-1 text-sm truncate px-2">
                <span className="text-black">Download Link:</span>{" "}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  {url}
                </a>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleRemove(index)}
              >
                <XCircle size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Input
        id={inputId}
        type="file"
        className="hidden"
        multiple
        onChange={handleUpload}
      />
    </div>
  );
};
