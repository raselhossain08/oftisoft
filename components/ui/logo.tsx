import { cn } from "@/lib/utils";
import React from "react";

interface LogoProps {
    className?: string; // Container class
    textClassName?: string;
    iconClassName?: string;
    showText?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "default" | "white"; // "white" forces text to be white (for dark headers)
}

export const Logo = ({ className, showText = true, size = "md", variant = "default", iconClassName, textClassName }: LogoProps) => {
    // Size logic
    const sizes = {
        sm: { icon: "w-6 h-6 text-sm rounded-md", text: "text-lg" },
        md: { icon: "w-8 h-8 text-lg rounded-lg", text: "text-xl" },
        lg: { icon: "w-10 h-10 text-xl rounded-xl", text: "text-2xl" },
        xl: { icon: "w-16 h-16 text-3xl rounded-2xl", text: "text-4xl" },
    };
    
    const { icon: iconSize, text: textSize } = sizes[size];

    return (
         <div className={cn("flex items-center gap-2 group select-none", className)}>
            <div className={cn(
                "bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105",
                iconSize,
                iconClassName
            )}>
               <span className="">O</span>
            </div>
            {showText && (
                <span className={cn(
                    "font-bold tracking-tight",
                    textSize,
                    variant === "white" ? "text-white" : "text-foreground",
                    textClassName
                )}>
                    Oftisoft
                </span>
            )}
        </div>
    );
};
