
"use client";

import { useState } from "react";
import { Camera, Mail, Phone, MapPin, Globe, Loader2, Save } from "lucide-react";

export default function ProfileSettings() {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">My Profile</h2>
                <p className="text-muted-foreground">Manage your personal information and public profile.</p>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-8 border-b border-border">
                <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary border-4 border-card shadow-xl overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg">Alex Morgan</h3>
                    <p className="text-muted-foreground text-sm mb-2">Senior Developer</p>
                    <div className="flex gap-2">
                        <button className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 font-medium">Change Avatar</button>
                        <button className="text-xs border border-border px-3 py-1.5 rounded-lg hover:bg-muted font-medium">Remove</button>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input type="text" defaultValue="Alex Morgan" className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title</label>
                    <input type="text" defaultValue="Senior Developer" className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                    </label>
                    <input type="email" defaultValue="alex@ofitsoft.com" className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" /> Phone Number
                    </label>
                    <input type="tel" defaultValue="+1 (555) 000-1234" className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea rows={4} className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border resize-none" defaultValue="Passionate developer with 5+ years of experience in building scalable web applications." />
                    <p className="text-xs text-muted-foreground text-right">200 characters left</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" /> Location
                    </label>
                    <input type="text" defaultValue="San Francisco, CA" className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" /> Website
                    </label>
                    <input type="url" defaultValue="https://alexmorgan.dev" className="input-field w-full p-3 rounded-xl bg-muted/50 border border-border" />
                </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-border flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

        </div>
    );
}
