
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    CheckCircle2, ArrowRight, ArrowLeft, Building2, User, Globe,
    UploadCloud, Briefcase, CreditCard, PlayCircle, Edit2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import confetti from "canvas-confetti";

// --- Types & Schema ---

const registerSchema = z.object({
    // Step 1
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain uppercase")
        .regex(/[0-9]/, "Must contain number"),
    // Step 2
    companyName: z.string().min(2, "Company Name is required"),
    companySize: z.string(),
    // Step 3
    services: z.array(z.string()).min(1, "Select at least one service"),
    budget: z.number().min(1000, "Minimum budget is $1000"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const STEPS = [
    { id: 1, title: "Account Details", icon: User },
    { id: 2, title: "Company Info", icon: Building2 },
    { id: 3, title: "Services", icon: Briefcase },
    { id: 4, title: "Review", icon: CheckCircle2 },
];

const SERVICE_OPTIONS = [
    { id: "web", label: "Web Development", icon: Globe },
    { id: "mobile", label: "Mobile Apps", icon: Briefcase }, // Using briefcase as placeholder for phone
    { id: "ai", label: "AI Solutions", icon: UploadCloud }, // Placeholder for Brain
    { id: "ecommerce", label: "E-commerce", icon: CreditCard },
];

import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [complete, setComplete] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            services: [],
            budget: 5000,
            companySize: "1-10",
        }
    });

    const formData = watch();

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        setComplete(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#8b5cf6', '#10b981']
        });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Final destination: Login
        setTimeout(() => {
            router.push("/dashboard/login");
        }, 3000);
    };

    // --- Animations ---
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">

            {/* Container */}
            <div className="w-full max-w-4xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]">

                {/* Sidebar / Progress */}
                <div className="w-full md:w-1/3 bg-muted/30 border-r border-border p-8 flex flex-col justify-between">
                    <div>
                        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary block mb-12">
                            Ofitsoft
                        </Link>

                        <div className="space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border -z-10">
                                <motion.div 
                                    className="w-full bg-primary origin-top"
                                    initial={{ height: "0%" }}
                                    animate={{ height: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            {STEPS.map((s, i) => {
                                const isCompleted = step > s.id;
                                const isCurrent = step === s.id;

                                return (
                                    <div key={s.id} className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 z-10",
                                            isCompleted || isCurrent ? "bg-primary border-primary text-white" : "bg-card border-border text-muted-foreground"
                                        )}>
                                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                                        </div>
                                        <div className={cn(
                                            "transition-colors duration-300",
                                            isCurrent ? "text-foreground font-bold" : "text-muted-foreground"
                                        )}>
                                            {s.title}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="text-sm text-muted-foreground mt-8">
                        Already have an account? <Link href="/dashboard/login" className="text-primary hover:underline">Log in</Link>
                    </div>
                </div>

                {/* Form Area */}
                <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
                    {complete ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6"
                            >
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </motion.div>
                            <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>
                            <p className="text-muted-foreground mb-8 text-lg">
                                Welcome to Ofitsoft. Your account has been created successfully.
                            </p>
                            <div className="rounded-xl overflow-hidden border border-border shadow-lg relative group cursor-pointer w-full max-w-sm">
                                <div className="bg-slate-900 aspect-video flex items-center justify-center relative">
                                    <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="p-4 bg-card">
                                    <p className="font-bold">Welcome Message from CEO</p>
                                    <p className="text-xs text-muted-foreground">Rasel Hossain • 1:20s</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <h2 className="text-2xl font-bold mb-2">{STEPS.find(s => s.id === step)?.title}</h2>
                            <p className="text-muted-foreground mb-8">Please fill in the details below to proceed.</p>

                            <form className="flex-1 flex flex-col" onSubmit={(e) => e.preventDefault()}>
                                <AnimatePresence custom={step} mode="wait">
                                    <motion.div
                                        key={step}
                                        custom={step}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="flex-1"
                                    >
                                        {/* Step 1: Account */}
                                        {step === 1 && (
                                            <div className="space-y-4 max-w-md">
                                                <div>
                                                    <label className="text-sm font-medium mb-1 block">Full Name</label>
                                                    <input {...register("fullName")} className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" placeholder="John Doe" />
                                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium mb-1 block">Email Address</label>
                                                    <input {...register("email")} className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" placeholder="john@example.com" />
                                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium mb-1 block">Password</label>
                                                    <input type="password" {...register("password")} className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" placeholder="••••••••" />
                                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 2: Company */}
                                        {step === 2 && (
                                            <div className="space-y-6 max-w-md">
                                                <div>
                                                    <label className="text-sm font-medium mb-1 block">Company Name</label>
                                                    <input {...register("companyName")} className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" placeholder="Acme Inc." />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">Company Size</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {["1-10", "11-50", "51-200", "200+"].map(size => (
                                                            <button
                                                                key={size}
                                                                type="button"
                                                                onClick={() => setValue("companySize", size)}
                                                                className={cn(
                                                                    "p-3 rounded-xl border transition-all text-sm",
                                                                    formData.companySize === size ? "bg-primary/10 border-primary text-primary font-bold" : "bg-card border-border hover:border-primary/50"
                                                                )}
                                                            >
                                                                {size} Employees
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Mock Logo Upload */}
                                                <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/30 cursor-pointer transition-colors">
                                                    <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                                                    <p className="text-sm font-medium">Upload Company Logo</p>
                                                    <p className="text-xs text-muted-foreground">Drag & drop or click to browse</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 3: Services */}
                                        {step === 3 && (
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-sm font-medium mb-3 block">What are you looking for?</label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {SERVICE_OPTIONS.map(service => {
                                                            const isSelected = formData.services?.includes(service.id);
                                                            return (
                                                                <button
                                                                    key={service.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const current = formData.services || [];
                                                                        const newServices = isSelected
                                                                            ? current.filter(s => s !== service.id)
                                                                            : [...current, service.id];
                                                                        setValue("services", newServices);
                                                                    }}
                                                                    className={cn(
                                                                        "p-4 rounded-xl border text-left transition-all relative overflow-hidden group",
                                                                        isSelected ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary shadow-lg shadow-primary/10" : "bg-card border-border hover:border-primary/50"
                                                                    )}
                                                                >
                                                                    <service.icon className={cn("w-6 h-6 mb-3", isSelected ? "text-primary" : "text-muted-foreground")} />
                                                                    <div className="font-bold text-sm">{service.label}</div>
                                                                    {isSelected && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium mb-2 block flex justify-between">
                                                        <span>Estimated Budget</span>
                                                        <span className="text-primary font-bold">${formData.budget?.toLocaleString()}</span>
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="1000"
                                                        max="100000"
                                                        step="1000"
                                                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                                        {...register("budget", { valueAsNumber: true })}
                                                    />
                                                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                                        <span>$1k</span>
                                                        <span>$100k+</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Step 4: Review */}
                                        {step === 4 && (
                                            <div className="space-y-4">
                                                <div className="bg-card border border-border rounded-xl p-4 flex justify-between items-start">
                                                    <div>
                                                        <div className="text-xs text-muted-foreground uppercase tracking-wide font-bold mb-1">Account</div>
                                                        <div className="font-bold">{formData.fullName}</div>
                                                        <div className="text-sm text-muted-foreground">{formData.email}</div>
                                                    </div>
                                                    <button onClick={() => setStep(1)} className="p-2 hover:bg-muted rounded-full">
                                                        <Edit2 className="w-4 h-4 text-primary" />
                                                    </button>
                                                </div>
                                                <div className="bg-card border border-border rounded-xl p-4 flex justify-between items-start">
                                                    <div>
                                                        <div className="text-xs text-muted-foreground uppercase tracking-wide font-bold mb-1">Company</div>
                                                        <div className="font-bold">{formData.companyName}</div>
                                                        <div className="text-sm text-muted-foreground">{formData.companySize} Employees</div>
                                                    </div>
                                                    <button onClick={() => setStep(2)} className="p-2 hover:bg-muted rounded-full">
                                                        <Edit2 className="w-4 h-4 text-primary" />
                                                    </button>
                                                </div>
                                                <div className="bg-card border border-border rounded-xl p-4 flex justify-between items-start">
                                                    <div>
                                                        <div className="text-xs text-muted-foreground uppercase tracking-wide font-bold mb-1">Project</div>
                                                        <div className="font-bold flex gap-2 flex-wrap">
                                                            {formData.services?.map(s => (
                                                                <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">{SERVICE_OPTIONS.find(so => so.id === s)?.label}</span>
                                                            ))}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground mt-1">Budget: ${formData.budget?.toLocaleString()}</div>
                                                    </div>
                                                    <button onClick={() => setStep(3)} className="p-2 hover:bg-muted rounded-full">
                                                        <Edit2 className="w-4 h-4 text-primary" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation Actions */}
                                <div className="flex justify-between mt-8 pt-4 border-t border-border">
                                    {step > 1 ? (
                                        <button
                                            onClick={prevStep}
                                            type="button"
                                            className="px-6 py-3 border border-border rounded-xl font-bold hover:bg-muted transition-colors flex items-center gap-2"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                    ) : (
                                        <div></div> // Spacer
                                    )}

                                    {step < 4 ? (
                                        <button
                                            onClick={nextStep}
                                            type="button"
                                            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 flex items-center gap-2"
                                        >
                                            Next Step <ArrowRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSubmit(onSubmit)}
                                            className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/25 flex items-center gap-2"
                                        >
                                            Create Account <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
