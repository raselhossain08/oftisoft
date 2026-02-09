"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdType, AdPosition, AdSize } from "@/lib/api";
import { useAds } from "@/hooks/useAds";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface AdDialogProps {
    isOpen: boolean;
    onClose: () => void;
    ad?: any;
}

export function AdDialog({ isOpen, onClose, ad }: AdDialogProps) {
    const { createAd, updateAd } = useAds();
    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            title: "",
            type: AdType.IMAGE,
            content: "",
            link: "",
            position: AdPosition.BLOG_SIDEBAR,
            size: AdSize.AUTO,
            isActive: true
        }
    });

    const adType = watch("type");

    useEffect(() => {
        if (ad) {
            reset({
                title: ad.title,
                type: ad.type,
                content: ad.content,
                link: ad.link || "",
                position: ad.position,
                size: ad.size,
                isActive: ad.isActive
            });
        } else {
            reset({
                title: "",
                type: AdType.IMAGE,
                content: "",
                link: "",
                position: AdPosition.BLOG_SIDEBAR,
                size: AdSize.AUTO,
                isActive: true
            });
        }
    }, [ad, reset, isOpen]);

    const onSubmit = (data: any) => {
        if (ad) {
            updateAd(ad.id, data);
            toast.success("Ad updated successfully");
        } else {
            createAd(data);
            toast.success("Ad created successfully");
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] rounded-[32px] border-border/50 bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic">{ad ? "Edit Ad Campaign" : "Create New Ad"}</DialogTitle>
                    <DialogDescription className="font-medium">
                        Configure your advertisement settings and deployment parameters.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-70">Campaign Title</Label>
                            <Input 
                                {...register("title", { required: true })} 
                                placeholder="Summer Sale Banner..." 
                                className="h-12 rounded-2xl bg-background border-border/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-70">Ad Type</Label>
                            <Select 
                                onValueChange={(v) => setValue("type", v as AdType)} 
                                defaultValue={watch("type")}
                                value={watch("type")}
                            >
                                <SelectTrigger className="h-12 rounded-2xl bg-background border-border/50 font-bold">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl">
                                    <SelectItem value={AdType.IMAGE} className="rounded-xl font-bold">Image Ad</SelectItem>
                                    <SelectItem value={AdType.GOOGLE_ADS} className="rounded-xl font-bold">Google Ads</SelectItem>
                                    <SelectItem value={AdType.CUSTOM_HTML} className="rounded-xl font-bold">Custom HTML</SelectItem>
                                    <SelectItem value={AdType.SCRIPT} className="rounded-xl font-bold">External Script</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-70">Deployment Position</Label>
                            <Select 
                                onValueChange={(v) => setValue("position", v as AdPosition)} 
                                defaultValue={watch("position")}
                                value={watch("position")}
                            >
                                <SelectTrigger className="h-12 rounded-2xl bg-background border-border/50 font-bold">
                                    <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl">
                                    {Object.values(AdPosition).map(p => (
                                        <SelectItem key={p} value={p} className="rounded-xl font-bold">
                                            {p.replace(/-/g, ' ').toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-70">Dimensions</Label>
                            <Select 
                                onValueChange={(v) => setValue("size", v as AdSize)} 
                                defaultValue={watch("size")}
                                value={watch("size")}
                            >
                                <SelectTrigger className="h-12 rounded-2xl bg-background border-border/50 font-bold">
                                    <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl">
                                    {Object.values(AdSize).map(s => (
                                        <SelectItem key={s} value={s} className="rounded-xl font-bold">
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                            <div className="space-y-0.5">
                                <Label className="text-xs font-black uppercase tracking-widest opacity-70">Active Status</Label>
                                <p className="text-[10px] text-muted-foreground font-bold">Enable or pause this ad campaign.</p>
                            </div>
                            <Switch 
                                checked={watch("isActive")} 
                                onCheckedChange={(v) => setValue("isActive", v)} 
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-70">
                                {adType === AdType.IMAGE ? "Image URL" : "Ad Script / HTML Content"}
                            </Label>
                            <Textarea 
                                {...register("content", { required: true })} 
                                placeholder={adType === AdType.IMAGE ? "https://example.com/banner.jpg" : "<script>...</script>"} 
                                className="min-h-[120px] rounded-2xl bg-background border-border/50 font-mono text-xs"
                            />
                        </div>

                        {adType === AdType.IMAGE && (
                            <div className="space-y-2 col-span-2">
                                <Label className="text-xs font-black uppercase tracking-widest opacity-70">Target Link (OnClick)</Label>
                                <Input 
                                    {...register("link")} 
                                    placeholder="https://example.com/shop" 
                                    className="h-12 rounded-2xl bg-background border-border/50"
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-12 font-bold px-8">Cancel</Button>
                        <Button type="submit" className="rounded-xl h-12 font-bold px-8 shadow-lg shadow-primary/20">{ad ? "Update Campaign" : "Deploy Ad"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
