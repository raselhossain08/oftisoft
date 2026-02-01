
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const gallery = [
    { id: 1, src: "/office-1.jpg", category: "Workspace", caption: "Our open concept workspace" },
    { id: 2, src: "/office-2.jpg", category: "Meeting", caption: "Brainstorming session" },
    { id: 3, src: "/office-3.jpg", category: "Culture", caption: "Team lunch friday" },
    { id: 4, src: "/office-4.jpg", category: "Workspace", caption: "Deep work zone" },
    { id: 5, src: "/office-5.jpg", category: "Culture", caption: "Annual Hackathon" },
    { id: 6, src: "/office-6.jpg", category: "Meeting", caption: "Client presentation" },
];

export default function OfficeCulture() {
    const [selectedImage, setSelectedImage] = useState<typeof gallery[0] | null>(null);

    return (
        <section className="py-24 bg-background">
            <div className="container px-4 mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Life at Ofitsoft</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {gallery.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedImage(item)}
                            className="relative aspect-square bg-muted rounded-xl overflow-hidden cursor-pointer group"
                        >
                            {/* Placeholder */}
                            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-700 font-bold text-lg">
                                PHOTO {item.id}
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                                <ZoomIn className="w-8 h-8 text-white mb-2" />
                                <span className="text-white text-sm font-medium">{item.category}</span>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white text-sm">{item.caption}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                            onClick={() => setSelectedImage(null)}
                        >
                            <button className="absolute top-8 right-8 text-white p-2 bg-white/10 rounded-full hover:bg-white/20">
                                <X className="w-6 h-6" />
                            </button>

                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                className="relative max-w-4xl max-h-[80vh] w-full bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center aspect-video"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="text-white text-4xl font-bold opacity-20">PHOTO {selectedImage.id} FULLSCREEN</div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/60 backdrop-blur-sm">
                                    <h3 className="text-xl font-bold text-white">{selectedImage.category}</h3>
                                    <p className="text-gray-300">{selectedImage.caption}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
