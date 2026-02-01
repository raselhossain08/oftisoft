
"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { TrendingUp, ArrowRight } from "lucide-react";

const popularPosts = [
    { id: 1, title: "10 AI Tools Every Developer Needs in 2026", image: "bg-purple-900" },
    { id: 2, title: "Next.js 15 vs Remix: The Ultimate Comparison", image: "bg-blue-900" },
    { id: 3, title: "How We Scaled to 1 Million Users with Serverless", image: "bg-green-900" },
    { id: 4, title: "The End of Third-Party Cookies: What Now?", image: "bg-orange-900" },
];

export default function PopularPosts() {
    return (
        <section className="py-24 bg-card/30">
            <div className="container px-4 mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold">Popular Reads</h2>
                </div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    className="pb-12"
                >
                    {popularPosts.map((post) => (
                        <SwiperSlide key={post.id} className="h-auto">
                            <div className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer">
                                {/* Background */}
                                <div className={`absolute inset-0 ${post.image} opacity-80`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:underline decoration-primary decoration-2 underline-offset-4 transition-all">
                                        {post.title}
                                    </h3>
                                    <div className="flex items-center text-white/80 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        Read Now <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
