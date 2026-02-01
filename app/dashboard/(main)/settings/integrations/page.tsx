
"use client";

import { useState } from "react";
import { Check, Github, Slack, Database, Cloud, Trello, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const INTEGRATIONS = [
    { id: "github", name: "GitHub", cat: "Development", icon: Github, connected: true, desc: "Sync repositories and track commits." },
    { id: "slack", name: "Slack", cat: "Communication", icon: Slack, connected: true, desc: "Receive project updates in channels." },
    { id: "aws", name: "AWS S3", cat: "Storage", icon: Cloud, connected: false, desc: "Store and serve project assets." },
    { id: "jira", name: "Jira", cat: "Management", icon: Trello, connected: false, desc: "Sync issues and agile boards." }, // Using Trello icon as placeholder
    { id: "gmail", name: "Gmail", cat: "Communication", icon: Mail, connected: false, desc: "Send emails via SMTP." },
];

export default function IntegrationsSettings() {
    const [connected, setConnected] = useState(INTEGRATIONS.filter(i => i.connected).map(i => i.id));

    const toggle = (id: string) => {
        if (connected.includes(id)) setConnected(connected.filter(c => c !== id));
        else setConnected([...connected, id]);
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Integrations</h2>
                <p className="text-muted-foreground">Supercharge your workflow by connecting your favorite tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INTEGRATIONS.map((tool) => {
                    const isConnected = connected.includes(tool.id);
                    return (
                        <div
                            key={tool.id}
                            className={cn(
                                "border rounded-2xl p-6 flex flex-col transition-all",
                                isConnected ? "bg-card border-primary/50 shadow-sm" : "bg-card/50 border-border opacity-80 hover:opacity-100"
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                                    <tool.icon className="w-6 h-6" />
                                </div>
                                <div className={cn(
                                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                    isConnected ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                                )}>
                                    {isConnected ? "Connected" : "Disconnected"}
                                </div>
                            </div>

                            <h3 className="font-bold text-lg">{tool.name}</h3>
                            <p className="text-xs text-muted-foreground mb-6 h-8">{tool.desc}</p>

                            <button
                                onClick={() => toggle(tool.id)}
                                className={cn(
                                    "w-full py-2 rounded-lg font-bold text-sm transition-colors mt-auto",
                                    isConnected
                                        ? "bg-muted text-foreground hover:bg-red-500/10 hover:text-red-500"
                                        : "bg-primary text-white hover:bg-primary/90"
                                )}
                            >
                                {isConnected ? "Disconnect" : "Connect"}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
