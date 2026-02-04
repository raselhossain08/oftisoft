
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, PlayCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    { 
        id: 1, 
        type: "video", 
        thumb: "bg-red-900", 
        title: "Annual Hackathon 2025", 
        location: "San Francisco HQ",
        size: "col-span-1 md:col-span-2 row-span-2" 
    },
    { 
        id: 2, 
        type: "image", 
        thumb: "bg-blue-900", 
        title: "Brainstorming Session", 
        location: "Design Studio",
        size: "col-span-1" 
    },
    { 
        id: 3, 
        type: "image", 
        thumb: "bg-green-900", 
        title: "Team Lunch Friday", 
        location: "Rooftop Lounge",
        size: "col-span-1" 
    },
    { 
        id: 4, 
        type: "image", 
        thumb: "bg-purple-900", 
        title: "Deep Work Zone", 
        location: "Quiet Area",
        size: "col-span-1" 
    },
    { 
        id: 5, 
        type: "image", 
        thumb: "bg-orange-900", 
        title: "Client Presentation", 
        location: "Conference Room A",
        size: "col-span-1" 
    },
];

export default function OfficeCulture() {
    const [selectedItem, setSelectedItem] = useState<typeof items[0] | null>(null);

    return (
        <section className="py-20 md:py-32 bg-transparent relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none" />

            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                         <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">
                            Life at Ofitsoft
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Where Culture Meets <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Creativity.
                            </span>
                        </h3>
                    </motion.div>
                </div>

                {/* Bento Grid Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:grid-rows-2 h-auto md:h-[600px]">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => setSelectedItem(item)}
                            className={cn(
                                "relative group overflow-hidden rounded-3xl cursor-pointer border border-white/5 bg-neutral-900/50",
                                item.size,
                                // Mobile override: all same size
                                "h-[300px] md:h-auto"
                            )}
                        >
                             {/* Image Placeholder */}
                            <div className={cn("absolute inset-0 transition-transform duration-700 group-hover:scale-105 opacity-80", item.thumb)} />
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                <div className="flex justify-end">
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 border border-white/10">
                                        {item.type === 'video' ? <PlayCircle className="w-5 h-5 text-white" /> : <ZoomIn className="w-5 h-5 text-white" />}
                                    </div>
                                </div>

                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2 uppercase tracking-wider">
                                        <MapPin className="w-3 h-3" />
                                        {item.location}
                                    </div>
                                    <h4 className="text-xl font-bold text-white leading-tight">{item.title}</h4>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Lightbox Overlay */}
                <AnimatePresence>
                    {selectedItem && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-12"
                            onClick={() => setSelectedItem(null)}
                        >
                            <button className="absolute top-6 right-6 z-10 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/10 text-white">
                                <X className="w-6 h-6" />
                            </button>

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-5xl aspect-video bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                            >
                                <div className={cn("absolute inset-0 flex items-center justify-center text-white/20 text-4xl font-bold uppercase", selectedItem.thumb)}>
                                    {selectedItem.title} Preview
                                </div>
                                
                                <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                                    <h3 className="text-3xl font-bold text-white mb-2">{selectedItem.title}</h3>
                                    <p className="text-white/60 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" /> {selectedItem.location}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
