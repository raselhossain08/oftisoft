
"use client";

import { useState } from "react";
import {
    Play, Plus, Save, Trash2, ChevronRight, ChevronDown,
    Globe, Database, Server, Code, RotateCcw, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

const COLLECTIONS = [
    { id: 1, name: "Auth Service", requests: ["Login User", "Register", "Refresh Token"] },
    { id: 2, name: "Project API", requests: ["Get Projects", "Create Project", "Update Status"] },
    { id: 3, name: "Payment Gateway", requests: ["Create Invoice", "Process Payment"] },
];

export default function ApiTester() {
    const [method, setMethod] = useState("GET");
    const [url, setUrl] = useState("https://api.ofitsoft.com/v1/projects");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);

    const handleSend = () => {
        setLoading(true);
        setResponse(null);
        setTimeout(() => {
            setLoading(false);
            setResponse({
                status: 200,
                time: "124ms",
                size: "1.2KB",
                data: {
                    success: true,
                    message: "Data fetched successfully",
                    items: [
                        { id: 1, name: "Project Alpha", status: "Active" },
                        { id: 2, name: "Project Beta", status: "Pending" }
                    ]
                }
            });
        }, 1500);
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex border border-border rounded-2xl overflow-hidden bg-card shadow-sm">

            {/* Sidebar */}
            <div className="w-64 border-r border-border bg-muted/10 flex flex-col">
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <span className="font-bold text-sm">Collections</span>
                    <button className="p-1 hover:bg-muted rounded"><Plus className="w-4 h-4" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {COLLECTIONS.map((col) => (
                        <div key={col.id} className="mb-2">
                            <div className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-muted-foreground hover:text-foreground cursor-pointer">
                                <ChevronRight className="w-3 h-3" /> {col.name}
                            </div>
                            <div className="ml-4 pl-2 border-l border-border space-y-1 mt-1">
                                {col.requests.map((req, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md hover:bg-muted/50 cursor-pointer">
                                        <span className={cn(
                                            "font-mono text-[9px] px-1 rounded",
                                            i === 0 ? "text-green-500 bg-green-500/10" : "text-blue-500 bg-blue-500/10"
                                        )}>{i === 0 ? "GET" : "POST"}</span>
                                        <span>{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">

                {/* Request Bar */}
                <div className="p-4 border-b border-border bg-card">
                    <div className="flex gap-2">
                        <div className="relative group">
                            <button className="h-10 px-4 bg-muted border border-border rounded-l-lg font-bold text-sm flex items-center gap-2 min-w-[100px]">
                                {method} <ChevronDown className="w-3 h-3 ml-auto opacity-50" />
                            </button>
                            {/* Dropdown Mock */}
                            <div className="absolute top-full left-0 mt-1 w-full bg-popover border border-border rounded-lg shadow-lg hidden group-hover:block z-50">
                                {METHODS.map(m => (
                                    <button key={m} onClick={() => setMethod(m)} className="w-full text-left px-4 py-2 text-xs hover:bg-muted first:rounded-t-lg last:rounded-b-lg">
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 h-10 px-4 bg-background border-y border-r border-border focus:outline-none font-mono text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="h-10 px-6 bg-primary text-white rounded-r-lg font-bold hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {loading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            Send
                        </button>
                    </div>
                </div>

                {/* Params / Body Tabs */}
                <div className="border-b border-border bg-muted/30 px-4">
                    <div className="flex gap-6">
                        {["Params", "Authorization", "Headers", "Body"].map((tab, i) => (
                            <button key={tab} className={cn(
                                "py-3 text-xs font-bold border-b-2 transition-colors",
                                i === 3 ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                            )}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Split View: Editor & Response */}
                <div className="flex-1 grid grid-rows-2 md:grid-rows-1 md:grid-cols-2">

                    {/* Request Body */}
                    <div className="border-b md:border-b-0 md:border-r border-border flex flex-col">
                        <div className="p-2 border-b border-border bg-muted/10 text-xs font-bold text-muted-foreground flex justify-between">
                            <span>JSON Body</span>
                            <button className="text-primary hover:underline">Prettify</button>
                        </div>
                        <textarea
                            className="flex-1 w-full p-4 bg-transparent border-none resize-none font-mono text-xs focus:outline-none"
                            defaultValue={`{\n  "status": "active",\n  "sort": "desc"\n}`}
                        />
                    </div>

                    {/* Response */}
                    <div className="flex flex-col bg-muted/5 relative">
                        <div className="p-2 border-b border-border bg-muted/10 flex justify-between items-center text-xs">
                            <span className="font-bold text-muted-foreground">Response</span>
                            {response && (
                                <div className="flex gap-4">
                                    <span className="text-green-500 font-bold">Status: {response.status} OK</span>
                                    <span className="text-muted-foreground">Time: {response.time}</span>
                                    <span className="text-muted-foreground">Size: {response.size}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 p-4 overflow-auto">
                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                    <LoaderBar />
                                    <p className="text-xs mt-4">Sending Request...</p>
                                </div>
                            ) : response ? (
                                <pre className="text-xs font-mono text-green-400">
                                    {JSON.stringify(response.data, null, 4)}
                                </pre>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                    <Globe className="w-10 h-10 mb-2" />
                                    <p className="text-sm">Enter URL and click Send</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

const LoaderBar = () => (
    <div className="flex gap-1">
        {[0, 1, 2].map(i => (
            <motion.div
                key={i}
                animate={{ height: [10, 24, 10] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                className="w-2 bg-primary rounded-full"
            />
        ))}
    </div>
)
