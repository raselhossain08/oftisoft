
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

    // Added state for timeline
    const [timeline, setTimeline] = useState([
        { id: 1, title: "Project Kickoff", duration: "1 week" },
        { id: 2, title: "Design Phase", duration: "2 weeks" },
        { id: 3, title: "Development", duration: "4 weeks" }
    ]);
    const [newMilestone, setNewMilestone] = useState("");

    const addMilestone = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMilestone.trim()) {
            setTimeline([...timeline, { id: Date.now(), title: newMilestone, duration: "1 week" }]);
            setNewMilestone("");
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            {/* Step Indicator (unchanged)... */}
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
                                    <h2 className="text-3xl font-bold mb-2">Let's build something amazing.</h2>
                                    <p className="text-muted-foreground">What kind of project are you starting?</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {PROJECT_TYPES.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setProjectType(type.id)}
                                            className={cn(
                                                "relative p-6 rounded-3xl border text-left transition-all hover:shadow-xl hover:-translate-y-1 group overflow-hidden",
                                                projectType === type.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card hover:border-primary/50"
                                            )}
                                        >
                                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg", type.color)}>
                                                <type.icon size={24} />
                                            </div>
                                            <h3 className="font-bold text-lg mb-1">{type.title}</h3>
                                            <p className="text-sm text-muted-foreground">{type.desc}</p>
                                            {projectType === type.id && (
                                                <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
                                                    <CheckSquare size={14} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
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
                                <div className="text-center mb-6">
                                    <h2 className="text-3xl font-bold mb-2">Project Scope</h2>
                                    <p className="text-muted-foreground">Choose a template or define custom requirements.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    {TEMPLATES.map((tpl) => (
                                        <div key={tpl.id} className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer" onClick={() => {}}>
                                            <div className={cn("absolute inset-0 transition-transform group-hover:scale-110", tpl.image)} />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                                            <div className="absolute bottom-0 left-0 p-4 w-full">
                                                <h4 className="font-bold text-white mb-1">{tpl.name}</h4>
                                                <div className="flex gap-2">
                                                    {tpl.tags.map(t => <span key={t} className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">{t}</span>)}
                                                </div>
                                            </div>
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 p-2 rounded-full backdrop-blur text-white hover:bg-white hover:text-primary">
                                                <Plus size={16} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-muted/30 border border-border rounded-3xl p-6">
                                    <h3 className="font-bold mb-4">Custom Requirements</h3>
                                    <form onSubmit={addRequirement} className="flex gap-2 mb-4">
                                        <input 
                                            value={reqInput}
                                            onChange={(e) => setReqInput(e.target.value)}
                                            placeholder="Add a feature (e.g. 'Stripe Integration')..."
                                            className="flex-1 bg-card border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                        <button className="px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
                                            Add
                                        </button>
                                    </form>
                                    <div className="flex flex-wrap gap-2">
                                        {requirements.length === 0 && <span className="text-sm text-muted-foreground italic">No requirements added yet.</span>}
                                        {requirements.map((req, i) => (
                                            <span key={i} className="bg-card border border-border pl-3 pr-2 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                                                {req}
                                                <button onClick={() => setRequirements(requirements.filter((_, idx) => idx !== i))} className="hover:bg-muted rounded-full p-0.5">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
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
                                className="space-y-8"
                            >
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-bold mb-2">Assemble Your Team</h2>
                                    <p className="text-muted-foreground">Select members to invite to this project.</p>
                                </div>

                                <div className="space-y-4">
                                    {TEAM_MEMBERS.map((member) => (
                                        <div 
                                            key={member.id}
                                            onClick={() => {
                                                if (selectedTeam.includes(member.id)) setSelectedTeam(selectedTeam.filter(id => id !== member.id));
                                                else setSelectedTeam([...selectedTeam, member.id]);
                                            }}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all",
                                                selectedTeam.includes(member.id) ? "bg-primary/5 border-primary shadow-sm" : "bg-card border-border hover:border-primary/30"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                                    {member.avatar}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{member.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={cn(
                                                    "text-xs px-2 py-0.5 rounded-full border",
                                                    member.status === 'available' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                                )}>
                                                    {member.status}
                                                </span>
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                                    selectedTeam.includes(member.id) ? "bg-primary border-primary text-white" : "border-muted-foreground/30"
                                                )}>
                                                    {selectedTeam.includes(member.id) && <CheckSquare size={14} />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Timeline */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-bold mb-2">Project Timeline</h2>
                                    <p className="text-muted-foreground">Map out your milestones and phases.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {/* Timeline Visualizer */}
                                    <div className="relative pl-8 border-l-2 border-dashed border-border space-y-8">
                                        {timeline.map((phase, i) => (
                                            <motion.div 
                                                key={phase.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="relative group"
                                            >
                                                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-primary border-4 border-card shadow-lg shadow-primary/20 z-10" />
                                                <div className="bg-muted/30 border border-border rounded-2xl p-4 hover:border-primary/50 transition-colors flex justify-between items-center group-hover:bg-card group-hover:shadow-md">
                                                    <div>
                                                        <h4 className="font-bold">{phase.title}</h4>
                                                        <p className="text-xs text-muted-foreground">{phase.duration}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => setTimeline(timeline.filter(t => t.id !== phase.id))}
                                                        className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                        <div className="absolute -left-[41px] bottom-0 w-5 h-5 rounded-full bg-green-500 border-4 border-card animate-pulse" />
                                    </div>

                                    {/* Timeline Editor */}
                                    <div className="space-y-6">
                                        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-primary" /> Add Phase
                                            </h3>
                                            <form onSubmit={addMilestone} className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-muted-foreground uppercase">Phase Name</label>
                                                    <input 
                                                        value={newMilestone}
                                                        onChange={(e) => setNewMilestone(e.target.value)}
                                                        placeholder="e.g. Beta Testing"
                                                        className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none"
                                                    />
                                                </div>
                                                <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                                    <Plus size={18} /> Add to Timeline
                                                </button>
                                            </form>
                                        </div>
                                        
                                        <div className="bg-card border border-border rounded-2xl p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">
                                                    AI
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">AI Planner</h4>
                                                    <p className="text-xs text-muted-foreground">Generate a schedule based on requirements.</p>
                                                </div>
                                            </div>
                                            <button className="w-full py-2 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-colors">
                                                Generate Schedule <Wand2 className="w-3 h-3 inline ml-1" />
                                            </button>
                                        </div>
                                    </div>
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
