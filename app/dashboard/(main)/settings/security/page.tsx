
"use client";

import { useState } from "react";
import { Check, Shield, Smartphone, Key, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SecuritySettings() {
    const [twoFactor, setTwoFactor] = useState(false);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Security</h2>
                <p className="text-muted-foreground">Protect your account and manage active sessions.</p>
            </div>

            {/* 2FA Section */}
            <div className="bg-muted/30 p-6 rounded-2xl border border-border">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Two-Factor Authentication</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                Add an extra layer of security to your account by requiring a code when logging in.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setTwoFactor(!twoFactor)}
                        className={cn(
                            "w-12 h-6 rounded-full transition-colors relative",
                            twoFactor ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                    >
                        <div className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                            twoFactor ? "left-7" : "left-1"
                        )} />
                    </button>
                </div>

                {twoFactor && (
                    <div className="bg-background border border-border p-4 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                            <Check className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">2FA is enabled</p>
                            <p className="text-xs text-muted-foreground">Your account is protected with Google Authenticator.</p>
                        </div>
                        <button className="ml-auto text-xs font-bold text-red-500 hover:underline">Disable</button>
                    </div>
                )}
            </div>

            {/* Change Password */}
            <div className="space-y-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Key className="w-5 h-5 text-muted-foreground" /> Change Password
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <input type="password" placeholder="••••••••" className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <input type="password" placeholder="••••••••" className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm Password</label>
                        <input type="password" placeholder="••••••••" className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className="px-6 py-2 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-colors">
                        Update Password
                    </button>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="pt-8 border-t border-border">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-muted-foreground" /> Active Sessions
                </h3>

                <div className="space-y-4">
                    {[
                        { device: "Chrome on Windows", loc: "San Francisco, US", ip: "192.168.1.1", active: true },
                        { device: "Safari on iPhone 13", loc: "Los Angeles, US", ip: "10.0.0.1", active: false },
                    ].map((session, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className={cn("w-2 h-2 rounded-full", session.active ? "bg-green-500" : "bg-muted-foreground")} />
                                <div>
                                    <p className="font-bold text-sm">{session.device}</p>
                                    <p className="text-xs text-muted-foreground">{session.loc} • {session.ip}</p>
                                </div>
                            </div>
                            {session.active ? (
                                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">Current</span>
                            ) : (
                                <button className="text-muted-foreground hover:text-red-500 transition-colors">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
