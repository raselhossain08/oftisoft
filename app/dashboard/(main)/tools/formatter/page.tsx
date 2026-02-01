
"use client";

import { useState } from "react";
import { Play, Copy, Check, RotateCcw, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const LANGUAGES = [
    { id: "json", label: "JSON" },
    { id: "js", label: "JavaScript" },
    { id: "css", label: "CSS" },
    { id: "html", label: "HTML" },
];

export default function CodeFormatter() {
    const [lang, setLang] = useState("json");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    const handleFormat = () => {
        // Mock formatting for demo
        try {
            if (lang === "json") {
                const obj = JSON.parse(input);
                setOutput(JSON.stringify(obj, null, 4));
            } else {
                setOutput(input.replace(/;/g, ";\n").replace(/{/g, "{\n  ").replace(/}/g, "\n}"));
            }
        } catch (e) {
            setOutput("Error: Invalid Syntax");
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">

            <div className="flex justify-between items-center px-2">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Code className="w-6 h-6 text-primary" /> Code Formatter
                    </h1>
                </div>
                <div className="flex bg-muted p-1 rounded-lg">
                    {LANGUAGES.map(l => (
                        <button
                            key={l.id}
                            onClick={() => setLang(l.id)}
                            className={cn(
                                "px-3 py-1.5 text-sm font-bold rounded-md transition-all",
                                lang === l.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Input */}
                <div className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-3 border-b border-border bg-muted/30 flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Input</span>
                        <button
                            onClick={() => setInput("")}
                            className="text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1"
                        >
                            <RotateCcw className="w-3 h-3" /> Clear
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 p-4 bg-transparent border-none resize-none font-mono text-sm focus:outline-none placeholder:text-muted-foreground/50"
                        placeholder={`Paste your ${lang.toUpperCase()} here...`}
                        spellCheck={false}
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative">
                    <div className="p-3 border-b border-border bg-muted/30 flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Output</span>
                        {output && (
                            <button
                                onClick={copyToClipboard}
                                className={cn(
                                    "text-xs font-bold flex items-center gap-1 transition-colors",
                                    copied ? "text-green-500" : "text-primary hover:text-primary/80"
                                )}
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        )}
                    </div>
                    <pre className="flex-1 p-4 bg-muted/10 overflow-auto font-mono text-sm text-foreground/80">
                        {output}
                    </pre>

                    {/* Format Button (Centered if empty) */}
                    {!output && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="pointer-events-auto">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleFormat}
                                    disabled={!input}
                                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Play className="w-4 h-4" /> Format Code
                                </motion.button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}
