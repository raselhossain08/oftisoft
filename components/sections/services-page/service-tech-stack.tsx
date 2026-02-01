
"use client";

import { motion } from "framer-motion";

const groups = [
    {
        title: "Frontend",
        skills: ["React", "Next.js", "Vue.js", "Tailwind CSS", "Framer Motion", "Redux", "TypeScript"]
    },
    {
        title: "Backend",
        skills: ["Node.js", "NestJS", "Express", "Python", "Django", "Go", "Java"]
    },
    {
        title: "Database",
        skills: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Prisma", "Supabase"]
    },
    {
        title: "DevOps & Cloud",
        skills: ["AWS", "Docker", "Kubernetes", "Vercel", "GitHub Actions", "Terraform"]
    },
    {
        title: "AI & ML",
        skills: ["OpenAI API", "TensorFlow", "PyTorch", "LangChain", "Hugging Face"]
    }
];

export default function ServiceTechStack() {
    return (
        <section className="py-24 bg-card/30">
            <div className="container px-4 mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Technology Stack</h2>

                <div className="space-y-16">
                    {groups.map((group, groupIndex) => (
                        <div key={group.title}>
                            <motion.h3
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-2xl font-bold mb-8 border-l-4 border-primary pl-4"
                            >
                                {group.title}
                            </motion.h3>

                            <div className="flex flex-wrap gap-4">
                                {group.skills.map((skill, i) => (
                                    <motion.div
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ y: -5, scale: 1.05 }}
                                        className="px-6 py-3 bg-background border border-border rounded-lg shadow-sm hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all cursor-default"
                                    >
                                        <span className="font-medium text-foreground">{skill}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
