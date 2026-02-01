
"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { TrendingUp, Users, Zap, DollarSign } from "lucide-react";

export default function SuccessStories() {
    return (
        <section className="py-24 bg-card/30">
            <div className="container px-4 mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Impact By The Numbers</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Revenue */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-background p-8 rounded-2xl border border-border relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign className="w-24 h-24 text-green-500" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-bold text-green-500 mb-2">
                                +<CountUp end={250} duration={3} />%
                            </h3>
                            <p className="font-bold text-lg mb-2">Revenue Growth</p>
                            <p className="text-sm text-muted-foreground">Average revenue increase for our e-commerce clients within 6 months.</p>
                        </div>
                    </motion.div>

                    {/* User Growth */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-background p-8 rounded-2xl border border-border relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users className="w-24 h-24 text-blue-500" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-bold text-blue-500 mb-2">
                                <CountUp end={10} duration={3} suffix="M+" />
                            </h3>
                            <p className="font-bold text-lg mb-2">Users Onboarded</p>
                            <p className="text-sm text-muted-foreground">Total active users across platforms built by our team.</p>
                        </div>
                    </motion.div>

                    {/* Performance */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-background p-8 rounded-2xl border border-border relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="w-24 h-24 text-yellow-500" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-bold text-yellow-500 mb-2">
                                <CountUp end={99.9} decimals={1} duration={3} suffix="%" />
                            </h3>
                            <p className="font-bold text-lg mb-2">Uptime Guaranteed</p>
                            <p className="text-sm text-muted-foreground">Reliability metrics for our enterprise cloud solutions.</p>
                        </div>
                    </motion.div>

                    {/* ROI */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-background p-8 rounded-2xl border border-border relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-24 h-24 text-purple-500" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-bold text-purple-500 mb-2">
                                <CountUp end={5} duration={3} suffix="x" />
                            </h3>
                            <p className="font-bold text-lg mb-2">Return on Investment</p>
                            <p className="text-sm text-muted-foreground">Clients see 5x ROI on average in the first year of deployment.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
