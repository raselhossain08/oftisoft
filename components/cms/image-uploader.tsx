"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  folder?: string;
  className?: string;
  previewClassName?: string;
}

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export function ImageUploader({
  value,
  onChange,
  label = "Image",
  accept = "image/jpeg,image/png,image/gif,image/webp,image/svg+xml",
  maxSize = 5,
  folder = "content",
  className,
  previewClassName,
}: ImageUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle", progress: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadState({ status: "uploading", progress });
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            setUploadState({ status: "success", progress: 100 });
            setTimeout(() => setUploadState({ status: "idle", progress: 0 }), 2000);
            resolve(response.url);
          } catch {
            setUploadState({ status: "error", progress: 0, error: "Invalid response" });
            reject(new Error("Invalid response"));
          }
        } else {
          setUploadState({ status: "error", progress: 0, error: "Upload failed" });
          reject(new Error("Upload failed"));
        }
      });

      xhr.addEventListener("error", () => {
        setUploadState({ status: "error", progress: 0, error: "Network error" });
        reject(new Error("Network error"));
      });

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      xhr.open("POST", `${apiUrl}/content/upload`);

      // Add auth token
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  };

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file type
    const allowedTypes = accept.split(",").map((t) => t.trim());
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload an image.");
      return;
    }

    // Validate file size
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(`File too large. Maximum size is ${maxSize}MB.`);
      return;
    }

    setUploadState({ status: "uploading", progress: 0 });

    try {
      const url = await uploadFile(file);
      onChange(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  }, [accept, maxSize, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemove = () => {
    onChange("");
    setUploadState({ status: "idle", progress: 0 });
  };

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            handleFileSelect(file);
          }
          break;
        }
      }
    },
    [handleFileSelect]
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-primary hover:bg-primary/10"
            onClick={() => inputRef.current?.click()}
            disabled={uploadState.status === "uploading"}
          >
            <Upload className="w-3.5 h-3.5 mr-1" />
            Replace
          </Button>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          uploadState.status === "uploading" && "border-primary bg-primary/5"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onPaste={handlePaste}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={uploadState.status === "uploading"}
        />

        {uploadState.status === "uploading" ? (
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <div className="text-center">
                <p className="font-medium">Uploading...</p>
                <p className="text-sm text-muted-foreground">{uploadState.progress}%</p>
              </div>
            </div>
            <Progress value={uploadState.progress} className="h-2" />
          </div>
        ) : value ? (
          <div className="relative group">
            <div
              className={cn(
                "relative overflow-hidden rounded-xl bg-muted",
                previewClassName || "aspect-video"
              )}
            >
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-image.png";
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => window.open(value, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-lg"
                  onClick={handleRemove}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full p-8 flex flex-col items-center gap-3 text-center cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-medium">Drop image here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG, GIF, WebP up to {maxSize}MB
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <kbd className="px-2 py-0.5 rounded bg-muted border">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-2 py-0.5 rounded bg-muted border">V</kbd>
              <span>to paste</span>
            </div>
          </button>
        )}
      </div>

      {/* Error State */}
      {uploadState.status === "error" && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          {uploadState.error || "Upload failed"}
        </div>
      )}

      {/* Success State */}
      {uploadState.status === "success" && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          Upload complete
        </div>
      )}

      {/* URL Input Fallback */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Or enter image URL manually:</p>
        <div className="flex gap-2">
          <input
            type="url"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 h-10 px-3 rounded-lg border bg-background text-sm"
            disabled={uploadState.status === "uploading"}
          />
          {value && (
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Multi-image uploader for arrays
interface MultiImageUploaderProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
  accept?: string;
  maxSize?: number;
  folder?: string;
  className?: string;
}

export function MultiImageUploader({
  value = [],
  onChange,
  label = "Images",
  maxImages = 10,
  accept = "image/jpeg,image/png,image/gif,image/webp,image/svg+xml",
  maxSize = 5,
  folder = "content",
  className,
}: MultiImageUploaderProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.url);
          } catch {
            reject(new Error("Invalid response"));
          }
        } else {
          reject(new Error("Upload failed"));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Network error")));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      xhr.open("POST", `${apiUrl}/content/upload`);

      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  };

  const handleAdd = async (file: File) => {
    if (value.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const allowedTypes = accept.split(",").map((t) => t.trim());
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type");
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${maxSize}MB.`);
      return;
    }

    setUploadingIndex(value.length);
    setProgress(0);

    try {
      const url = await uploadFile(file);
      onChange([...value, url]);
      toast.success("Image added");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingIndex(null);
      setProgress(0);
    }
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const handleReorder = (from: number, to: number) => {
    const newValue = [...value];
    const [item] = newValue.splice(from, 1);
    newValue.splice(to, 0, item);
    onChange(newValue);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {label} ({value.length}/{maxImages})
        </label>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {value.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-xl overflow-hidden bg-muted group"
          >
            <img
              src={url}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              {index > 0 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => handleReorder(index, index - 1)}
                >
                  ←
                </Button>
              )}
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => handleRemove(index)}
              >
                <X className="w-4 h-4" />
              </Button>
              {index < value.length - 1 && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => handleReorder(index, index + 1)}
                >
                  →
                </Button>
              )}
            </div>
            <div className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/60 text-white text-xs">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Upload Slot */}
        {value.length < maxImages && (
          <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer">
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAdd(file);
              }}
              disabled={uploadingIndex !== null}
            />
            {uploadingIndex !== null ? (
              <div className="text-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">{progress}%</p>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add Image</span>
              </>
            )}
          </label>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Drag images to reorder • PNG, JPG, GIF, WebP up to {maxSize}MB
      </p>
    </div>
  );
}