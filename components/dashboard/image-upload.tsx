"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    disabled?: boolean;
    maxSize?: number; // in MB
    accept?: string;
    className?: string;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    disabled = false,
    maxSize = 5,
    accept = "image/*",
    className
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = async (files: FileList) => {
        const file = files[0];

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            toast.error(`File size must be less than ${maxSize}MB`);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            // Simulate upload progress
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            // Convert to base64 for local storage (temporary solution)
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                clearInterval(interval);
                setProgress(100);
                
                setTimeout(() => {
                    onChange(base64String);
                    setUploading(false);
                    setProgress(0);
                    toast.success('Image uploaded successfully!');
                }, 500);
            };
            reader.readAsDataURL(file);

            // TODO: Replace with actual upload to Cloudinary/S3
            // const formData = new FormData();
            // formData.append('file', file);
            // const response = await fetch('/api/upload', {
            //     method: 'POST',
            //     body: formData
            // });
            // const data = await response.json();
            // onChange(data.url);

        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
            setUploading(false);
            setProgress(0);
        }
    };

    const handleRemove = () => {
        if (onRemove) {
            onRemove();
        } else {
            onChange('');
        }
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={cn("w-full", className)}>
            {value ? (
                <Card className="relative group overflow-hidden rounded-3xl border-2 border-border/50">
                    <CardContent className="p-0">
                        <div className="relative aspect-video w-full">
                            <Image
                                src={value}
                                alt="Uploaded image"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleRemove}
                                    disabled={disabled}
                                    className="rounded-2xl"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div
                    className={cn(
                        "relative border-2 border-dashed rounded-3xl transition-all",
                        dragActive ? "border-primary bg-primary/5" : "border-border/50",
                        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !disabled && inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        onChange={handleChange}
                        disabled={disabled}
                        className="hidden"
                    />
                    
                    <div className="p-12 flex flex-col items-center justify-center gap-4">
                        {uploading ? (
                            <>
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                <div className="w-full max-w-xs space-y-2">
                                    <Progress value={progress} className="h-2" />
                                    <p className="text-sm text-center text-muted-foreground">
                                        Uploading... {progress}%
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Upload className="w-8 h-8 text-primary" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-semibold">
                                        Drop your image here, or{" "}
                                        <span className="text-primary">browse</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        PNG, JPG, GIF up to {maxSize}MB
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
