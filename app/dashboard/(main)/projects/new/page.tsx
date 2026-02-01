
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Layout, CheckSquare, Users, Calendar, Rocket,
    ArrowRight, ArrowLeft, Wand2, Plus, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Mock Data ---

const PROJECT_TYPES = [
    { id: "web", title: "Web Development", desc: "Responsive websites & web apps", icon: Layout, color: "bg-blue-500" },
    { id: "mobile", title: "Mobile App", desc: "iOS & Android applications", icon: Layout, color: "bg-green-500" }, // Using Layout as placeholder
    { id: "ai", title: "AI Solution", desc: "Machine learning & automation", icon: Wand2, color: "bg-purple-500" },
];

const TEMPLATES = [
    { id: 1, name: "E-commerce Store", tags: ["Next.js", "Shopify"], image: "bg-blue-900" },
    { id: 2, name: "SaaS Dashboard", tags: ["React", "Tailwind"], image: "bg-indigo-900" },
    { id: 3, name: "Portfolio Site", tags: ["Framer", "Minimal"], image: "bg-purple-900" },
];

const TEAM_MEMBERS = [
    { id: 1, name: "Alex Morgan", role: "Full Stack", avatar: "AM", status: "available" },
    { id: 2, name: "Sarah Jenkins", role: "UI/UX Designer", avatar: "SJ", status: "busy" },
    { id: 3, name: "Mike Thompson", role: "DevOps", avatar: "MT", status: "available" },
];

export default function CreateProjectPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [projectType, setProjectType] = useState("");
    const [requirements, setRequirements] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<number[]>([]);

    const [reqInput, setReqInput] = useState("");

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleLaunch = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push("/dashboard/projects");
        }, 2000);
    };

    const addRequirement = (e: React.FormEvent) => {
        e.preventDefault();
        if (reqInput.trim()) {
            setRequirements([...requirements, reqInput]);
            setReqInput("");
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-8">

            {/* Step Indicator */}
            <div className="mb-12">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10" />
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-500`} style={{ width: `${((step - 1) / 4) * 100}%` }} />

                    {["Basics", "Requirements", "Team", "Timeline", "Launch"].map((label, i) => {
                        const stepNum = i + 1;
                        const active = step >= stepNum;
                        const current = step === stepNum;
                        return (
                            <div key={i} className="flex flex-col items-center bg-background px-2">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300",
                                    active ? "bg-primary border-primary text-white" : "bg-card border-border text-muted-foreground",
                                    current && "ring-4 ring-primary/20 scale-110"
                                )}>
                                    {stepNum}
                                </div>
                                <span className={cn("text-xs mt-2 font-medium transition-colors", active ? "text-primary" : "text-muted-foreground")}>
                                    {label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl min-h-[500px] flex flex-col">
                <div className="flex-1 p-8 md:p-12">
                    <AnimatePresence mode="wait">

                        {/* Step 1: Basics */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-bold mb-2">Let's start with the basics</h2>
                                    <p className="text-muted-foreground">What kind of project are you building today?</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {PROJECT_TYPES.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setProjectType(type.id)}
                                            className={cn(
                                                "relative group p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg",
                                                projectType === type.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card"
                                            )}
                                        >
                                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-md", type.color)}>
                                                <type.icon className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold text-lg mb-1">{type.title}</h3>
                                            <p className="text-sm text-muted-foreground">{type.desc}</p>

                                            {projectType === type.id && (
                                                <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                    <CheckSquare className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-12">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                        <Wand2 className="w-5 h-5 text-purple-500" /> Start from a Template
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {TEMPLATES.map((tmpl) => (
                                            <div key={tmpl.id} className="group relative rounded-xl overflow-hidden cursor-pointer border border-border">
                                                <div className={`h-32 ${tmpl.image} relative`}>
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                                </div>
                                                <div className="p-4 bg-card">
                                                    <h4 className="font-bold">{tmpl.name}</h4>
                                                    <div className="flex gap-2 mt-2">
                                                        {tmpl.tags.map(t => (
                                                            <span key={t} className="text-[10px] bg-muted px-2 py-1 rounded">{t}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button className="text-white font-bold border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors">
                                                        Use Template
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Requirements */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-bold mb-2">Define Requirements</h2>
                                    <p className="text-muted-foreground">List out the key features and goals.</p>
                                </div>

                                <div className="max-w-2xl mx-auto">
                                    <form onSubmit={addRequirement} className="flex gap-2 mb-8">
                                        <input
                                            value={reqInput}
                                            onChange={(e) => setReqInput(e.target.value)}
                                            placeholder="Add a feature (e.g., 'User Authentication')"
                                            className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <button type="submit" className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90">
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </form>

                                    <div className="bg-muted/30 rounded-2xl p-6 min-h-[200px]">
                                        {requirements.length === 0 ? (
                                            <div className="text-center text-muted-foreground py-10">
                                                <p>No requirements added yet.</p>
                                                <p className="text-sm mt-2">Use the AI Assistant to generate suggestions.</p>
                                                <button className="mt-4 text-purple-500 font-bold flex items-center justify-center gap-2 mx-auto hover:underline">
                                                    <Wand2 className="w-4 h-4" /> Auto-Generate
                                                </button>
                                            </div>
                                        ) : (
                                            <ul className="space-y-3">
                                                {requirements.map((req, i) => (
                                                    <motion.li
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="flex items-center justify-between bg-card border border-border p-3 rounded-lg group"
                                                    >
                                                        <span>{req}</span>
                                                        <button
                                                            onClick={() => setRequirements(requirements.filter((_, idx) => idx !== i))}
                                                            className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Team */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold mb-2">Assemble Your Team</h2>
                                    <p className="text-muted-foreground">Select the best people for the job.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {TEAM_MEMBERS.map((member) => (
                                        <div
                                            key={member.id}
                                            onClick={() => {
                                                if (selectedTeam.includes(member.id)) {
                                                    setSelectedTeam(selectedTeam.filter(id => id !== member.id));
                                                } else {
                                                    setSelectedTeam([...selectedTeam, member.id]);
                                                }
                                            }}
                                            className={cn(
                                                "bg-card border-2 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg relative",
                                                selectedTeam.includes(member.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center font-bold text-muted-foreground">
                                                    {member.avatar}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{member.name}</h4>
                                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span>Workload</span>
                                                    <span className={member.status === 'busy' ? "text-orange-500" : "text-green-500"}>
                                                        {member.status === 'busy' ? '80%' : '20%'}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-1.5">
                                                    <div
                                                        className={cn("h-full rounded-full", member.status === 'busy' ? "bg-orange-500" : "bg-green-500")}
                                                        style={{ width: member.status === 'busy' ? '80%' : '20%' }}
                                                    />
                                                </div>
                                            </div>

                                            {selectedTeam.includes(member.id) && (
                                                <div className="absolute top-4 right-4 text-primary">
                                                    <CheckSquare className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Timeline (Simplified) */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center py-10"
                            >
                                <h2 className="text-3xl font-bold mb-6">Timeline Planning</h2>
                                <div className="bg-muted/20 p-8 rounded-2xl border border-dashed border-border mb-8">
                                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-lg font-bold">Interactive Timeline Component</p>
                                    <p className="text-muted-foreground">Drag and drop to set milestones and deadlines.</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Launch */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                {loading ? (
                                    <div className="flex flex-col items-center">
                                        <Rocket className="w-20 h-20 text-primary animate-bounce mb-8" />
                                        <h2 className="text-3xl font-bold mb-2">Launching Project...</h2>
                                        <p className="text-muted-foreground">Initializing repository and setting up environment.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-8">
                                            <Rocket className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h2 className="text-3xl font-bold mb-4">Ready to Launch?</h2>
                                        <p className="text-muted-foreground max-w-md mx-auto mb-8">
                                            You are about to create <strong>{projectType.toUpperCase()}</strong> project with <strong>{selectedTeam.length} team members</strong>.
                                        </p>
                                        <button
                                            onClick={handleLaunch}
                                            className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl shadow-lg shadow-primary/30 hover:scale-105 transition-transform flex items-center gap-3"
                                        >
                                            <Rocket className="w-5 h-5" /> Launch Project
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                {!loading && step < 5 && (
                    <div className="bg-muted/30 p-6 border-t border-border flex justify-between items-center">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        <button
                            onClick={nextStep}
                            disabled={step === 1 && !projectType}
                            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {step === 4 ? "Review & Launch" : "Next Step"} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
