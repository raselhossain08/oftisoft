
"use client";

import { useState } from "react";
import { UploadCloud, FileType, CheckCircle2, Download, RefreshCw, FileImage, FileAudio, FileVideo, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const FORMATS = {
    image: ["PNG", "JPG", "WEBP", "SVG"],
    document: ["PDF", "DOCX", "TXT", "MD"],
    audio: ["MP3", "WAV", "AAC"],
};

export default function FileConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [converting, setConverting] = useState(false);
    const [complete, setComplete] = useState(false);
    const [targetFormat, setTargetFormat] = useState("");

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
    }

    const handleConvert = () => {
        if (!file || !targetFormat) return;
        setConverting(true);
        setTimeout(() => {
            setConverting(false);
            setComplete(true);
        }, 2000);
    }

    const reset = () => {
        setFile(null);
        setComplete(false);
        setTargetFormat("");
    }

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Universal File Converter</h1>
                <p className="text-muted-foreground">Convert images, documents, and audio instantly.</p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm min-h-[400px] flex flex-col items-center justify-center">

                <AnimatePresence mode="wait">

                    {/* Upload State */}
                    {!file && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-xl"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            <div className="border-3 border-dashed border-border rounded-3xl p-12 text-center hover:bg-muted/30 hover:border-primary/50 transition-all cursor-pointer group">
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <UploadCloud className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Drag & Drop or Click to Upload</h3>
                                <p className="text-muted-foreground text-sm">Supports JPG, PNG, PDF, MP3, and more.</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer" />
                            </div>
                        </motion.div>
                    )}

                    {/* Confirm State */}
                    {file && !complete && (
                        <motion.div
                            key="confirm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-md space-y-8"
                        >
                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border">
                                <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center border border-border">
                                    {file.type.includes('image') ? <FileImage className="w-6 h-6 text-blue-500" /> : <FileText className="w-6 h-6 text-orange-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button onClick={reset} className="text-xs text-red-500 hover:underline">Remove</button>
                            </div>

                            <div>
                                <label className="text-sm font-bold mb-3 block">Convert to:</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(file.type.includes('image') ? FORMATS.image : FORMATS.document).map(fmt => (
                                        <button
                                            key={fmt}
                                            onClick={() => setTargetFormat(fmt)}
                                            className={cn(
                                                "py-2 rounded-lg text-sm font-bold border transition-colors",
                                                targetFormat === fmt ? "bg-primary text-white border-primary" : "bg-card border-border hover:border-primary/50"
                                            )}
                                        >
                                            {fmt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleConvert}
                                disabled={!targetFormat || converting}
                                className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {converting ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" /> Converting...
                                    </>
                                ) : (
                                    "Start Conversion"
                                )}
                            </button>
                        </motion.div>
                    )}

                    {/* Success State */}
                    {complete && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Conversion Complete!</h2>
                            <p className="text-muted-foreground mb-8">
                                Your file has been successfully converted to <span className="font-bold text-foreground">{targetFormat}</span>.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                    <Download className="w-5 h-5" /> Download File
                                </button>
                                <button
                                    onClick={reset}
                                    className="px-8 py-3 text-muted-foreground font-bold hover:text-foreground"
                                >
                                    Convert Another File
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>

            </div>
        </div>
    );
}
