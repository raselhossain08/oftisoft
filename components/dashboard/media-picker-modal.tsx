"use client";

import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Image as ImageIcon, Link, Loader2 } from "lucide-react";
import { useMediaUpload, useMediaList } from "@/hooks/useMedia";

interface MediaPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  title?: string;
}

export function MediaPickerModal({
  open,
  onOpenChange,
  onSelect,
  title = "Select Media",
}: MediaPickerModalProps) {
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: mediaFiles = [], isLoading: isLoadingList } = useMediaList();
  const uploadMutation = useMediaUpload();

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const result = await uploadMutation.mutateAsync(file);
        onSelect(result.url);
        onOpenChange(false);
      } catch {
        // error handled by hook
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [uploadMutation, onSelect, onOpenChange]
  );

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      onSelect(urlInput.trim());
      onOpenChange(false);
      setUrlInput("");
    }
  }, [urlInput, onSelect, onOpenChange]);

  const handleSelectFile = useCallback(
    (url: string) => {
      onSelect(url);
      onOpenChange(false);
    },
    [onSelect, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Upload an image or choose from existing media
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="library">
              <ImageIcon className="w-4 h-4 mr-2" />
              Media Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 flex-1">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                {uploadMutation.isPending ? "Uploading..." : "Click to upload"}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF, WebP up to 5MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploadMutation.isPending}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or paste URL
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUrlSubmit();
                }}
              />
              <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
                <Link className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="library" className="flex-1 overflow-y-auto">
            {isLoadingList ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : mediaFiles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No media found</p>
                <p className="text-xs">Upload images to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 p-1">
                {mediaFiles.map((file) => (
                  <button
                    key={file.key}
                    onClick={() => handleSelectFile(file.url)}
                    className="group relative aspect-video rounded-lg overflow-hidden border bg-muted/20 hover:border-primary/50 transition-all"
                  >
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
