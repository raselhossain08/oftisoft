
"use client";

const techStack = [
    "React", "Next.js", "TypeScript", "Node.js", "NestJS", "PostgreSQL",
    "MongoDB", "AWS", "Docker", "Kubernetes", "GraphQL", "Tailwind CSS",
    "Framer Motion", "Prisma", "Redis", "Python", "TensorFlow"
];

export default function TechStack() {
    return (
        <section className="py-12 bg-muted/30 overflow-hidden border-y border-border/50">
            <div className="relative flex overflow-x-hidden group">
                <div className="animate-loop-scroll flex gap-8 md:gap-16 whitespace-nowrap min-w-full px-4 group-hover:[animation-play-state:paused] transition-all">
                    {techStack.map((tech, index) => (
                        <span key={index} className="text-2xl md:text-3xl font-bold text-muted-foreground/50 hover:text-primary transition-colors cursor-default">
                            {tech}
                        </span>
                    ))}
                    {/* Duplicate for infinite loop */}
                    {techStack.map((tech, index) => (
                        <span key={`dup-${index}`} className="text-2xl md:text-3xl font-bold text-muted-foreground/50 hover:text-primary transition-colors cursor-default">
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Fade Edges */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
            </div>

            <style jsx>{`
        @keyframes loop-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-loop-scroll {
          animation: loop-scroll 40s linear infinite;
        }
      `}</style>
        </section>
    );
}
