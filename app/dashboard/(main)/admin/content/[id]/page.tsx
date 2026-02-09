"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    ArrowLeft, Save, Eye, Globe, RefreshCcw, Check, Clock,
    Image as ImageIcon, Plus, Trash2, GripVertical, ChevronDown, ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CMS_SCHEMA, PageKey } from "@/lib/cms/schema";
import { usePageContent, useUpdatePageContent, usePublishPageContent, useUploadFile } from "@/lib/api/content-queries";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function DynamicPageEditor() {
    const params = useParams();
    const pageKey = params.id as PageKey;
    const router = useRouter();
    
    // Validate Page Key
    const schema = CMS_SCHEMA[pageKey];
    
    // Queries
    const { data: serverContent, isLoading, error } = usePageContent(pageKey);
    const updateMutation = useUpdatePageContent();
    const publishMutation = usePublishPageContent();
    
    // Local State
    const [formData, setFormData] = useState<any>(null);
    const [isDirty, setIsDirty] = useState(false);

    // Sync server data to local state
    useEffect(() => {
        if (serverContent && serverContent.content) {
            setFormData(serverContent.content);
        } else if (serverContent && !formData) {
             // Initialize empty if needed, or wait
             setFormData({});
        }
    }, [serverContent]);

    // Auto-save mechanism
    useEffect(() => {
        if (!isDirty || !formData) return;

        const timeoutId = setTimeout(() => {
            updateMutation.mutate(
                { pageKey, content: formData },
                { onSuccess: () => setIsDirty(false) }
            );
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [formData, isDirty, pageKey, updateMutation]);

    if (!schema) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
                <p className="text-muted-foreground mb-8">The content node "{pageKey}" does not exist in the schema.</p>
                <Link href="/dashboard/admin/content">
                    <Button>Return to Content Forge</Button>
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
             <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <RefreshCcw className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground font-medium">Loading content node...</p>
                </div>
            </div>
        );
    }

    if (error) {
         return (
             <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4 text-red-500">Error Loading Content</h1>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );
    }

    const handleSave = () => {
        if (!formData) return;
        updateMutation.mutate(
            { pageKey, content: formData },
            { onSuccess: () => setIsDirty(false) }
        );
    };

    const handlePublish = async () => {
        await publishMutation.mutateAsync(pageKey);
    };

    // Generic Update Function
    const updateField = (path: string[], value: any) => {
        setFormData((prev: any) => {
            const newData = JSON.parse(JSON.stringify(prev || {}));
            let current = newData;
            
            // Filter out _root from path to access root properties directly
            const realPath = path.filter(p => p !== "_root");
            
            for (let i = 0; i < realPath.length - 1; i++) {
                if (!current[realPath[i]]) current[realPath[i]] = {};
                current = current[realPath[i]];
            }
            if (realPath.length > 0) {
                current[realPath[realPath.length - 1]] = value;
            }
            return newData;
        });
        setIsDirty(true);
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white pb-20 selection:bg-primary selection:text-white">
             {/* Header */}
             <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-3xl border-b border-white/5 shadow-2xl">
                <div className="container mx-auto px-10 py-6">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-8">
                            <Button variant="ghost" size="icon" asChild className="h-14 w-14 rounded-2xl border border-white/5 hover:bg-white/5 transition-all">
                                <Link href="/dashboard/admin/content">
                                    <ArrowLeft className="w-6 h-6" />
                                </Link>
                            </Button>
                            <div>
                                <div className="flex items-center gap-4">
                                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">
                                        {schema.label} <span className="text-primary italic">Forge</span>
                                    </h1>
                                    <Badge className={cn(
                                        "font-black text-[9px] tracking-widest px-4 h-7 rounded-lg uppercase italic border-none shadow-sm",
                                        serverContent?.status === 'published' ? "bg-primary/20 text-primary" : "bg-amber-500/20 text-amber-500"
                                    )}>
                                        {serverContent?.status === 'published' ? 'NODE_LIVE' : 'DRAFT_INIT'}
                                    </Badge>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2 flex items-center gap-3 opacity-60">
                                    <span className="font-mono">ID: {pageKey}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                    {updateMutation.isPending ? (
                                        <span className="text-primary italic animate-pulse flex items-center gap-2">
                                            <RefreshCcw className="w-3 h-3 animate-spin" /> SYNCHRONIZING_CORE...
                                        </span>
                                    ) : (
                                        <span>LAST_SYNC: {new Date(serverContent?.updatedAt || Date.now()).toLocaleTimeString()}</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                             <Button
                                variant="outline"
                                onClick={handleSave}
                                disabled={!isDirty || updateMutation.isPending}
                                className="h-14 px-8 rounded-[1.5rem] gap-3 font-black text-[11px] uppercase tracking-widest border-white/10 bg-white/5 hover:bg-white/10 transition-all italic"
                            >
                                {updateMutation.isPending ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                                COMMIT_DRAFT
                            </Button>
                             <Button
                                onClick={handlePublish}
                                disabled={publishMutation.isPending}
                                className="h-14 px-10 rounded-[1.5rem] gap-3 bg-primary text-white shadow-2xl shadow-primary/20 font-black text-[11px] uppercase tracking-widest italic hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                {publishMutation.isPending ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                DEPLOY_TO_EDGE
                            </Button>
                        </div>
                    </div>
                </div>
             </div>

             {/* Main Editor */}
             <div className="container mx-auto px-10 py-12">
                 <div className="mx-auto space-y-12 max-w-6xl">
                    {/* Render Sections based on Schema */}
                    {schema.sections.map((section: any) => (
                        <Card key={section.id} className="border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[40px] overflow-hidden shadow-2xl group/card hover:border-white/10 transition-all duration-700">
                            <CardHeader className="p-10 border-b border-white/5 bg-white/[0.01]">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">{section.label}</CardTitle>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 opacity-40 group-hover/card:opacity-100 transition-opacity">
                                        <Check className="w-5 h-5" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                {section.fields?.map((field: any) => (
                                    <FieldRenderer 
                                        key={field.name}
                                        field={field}
                                        value={
                                            section.id === "_root" 
                                                ? formData?.[field.name] 
                                                : formData?.[section.id]?.[field.name]
                                        }
                                        onChange={(val) => updateField([section.id, field.name], val)}
                                        path={[section.id, field.name]}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                 </div>
             </div>
        </div>
    );
}

// --- Field Renderers ---

function FieldRenderer({ field, value, onChange, path }: { field: any, value: any, onChange: (val: any) => void, path: string[] }) {
    
    if (field.type === 'text') {
        return (
            <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-primary/60 italic tracking-[0.2em] ml-2">{field.label}</Label>
                <Input 
                    value={value || ''} 
                    onChange={(e) => onChange(e.target.value)} 
                    className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-black italic text-base px-6 focus-visible:ring-primary/20 transition-all focus-visible:bg-white/[0.05]"
                    placeholder={`ID_NODE_${field.label.toUpperCase()}...`}
                />
            </div>
        );
    }

    if (field.type === 'number') {
        return (
            <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-muted-foreground">{field.label}</Label>
                <Input 
                    type="number"
                    value={value || ''} 
                    onChange={(e) => onChange(Number(e.target.value))} 
                    className="h-12 rounded-xl"
                />
            </div>
        );
    }

    if (field.type === 'textarea' || field.type === 'rich-text') {
        return (
             <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-muted-foreground">{field.label}</Label>
                <Textarea 
                    value={value || ''} 
                    onChange={(e) => onChange(e.target.value)} 
                    className="min-h-[120px] rounded-xl font-mono text-sm"
                    placeholder={`Enter ${field.label.toLowerCase()} content...`}
                />
                {field.type === 'rich-text' && <p className="text-[10px] text-muted-foreground">* HTML tags supported</p>}
            </div>
        );
    }

    if (field.type === 'boolean') {
        return (
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50">
                <Label className="text-sm font-bold">{field.label}</Label>
                <Switch checked={!!value} onCheckedChange={onChange} />
            </div>
        );
    }

    if (field.type === 'image' || field.type === 'video') {
         return (
            <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-muted-foreground">{field.label}</Label>
                <MediaUploader 
                    value={value} 
                    onChange={onChange} 
                    type={field.type} 
                />
            </div>
         );
    }

    if (field.type === 'tags') {
        // Simple comma separated for now
        return (
            <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-muted-foreground">{field.label} (Comma separated)</Label>
                <Input 
                    value={Array.isArray(value) ? value.join(', ') : (value || '')} 
                    onChange={(e) => onChange(e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))} 
                    className="h-12 rounded-xl"
                    placeholder="tag1, tag2, tag3"
                />
            </div>
        );
    }

    if (field.type === 'group') {
        return (
            <div className="p-6 rounded-2xl border border-border/50 bg-muted/10 space-y-4">
                <Label className="text-sm font-black italic text-primary">{field.label} Group</Label>
                <div className="grid gap-4">
                    {field.fields.map((subField: any) => (
                        <FieldRenderer 
                            key={subField.name}
                            field={subField}
                            value={value?.[subField.name]}
                            onChange={(val) => {
                                const newValue = { ...(value || {}), [subField.name]: val };
                                onChange(newValue);
                            }}
                            path={[...path, subField.name]}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (field.type === 'array') {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-black uppercase text-muted-foreground">{field.label}</Label>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                            const newItem = {}; 
                            onChange([...(value || []), newItem]);
                        }}
                        className="h-8 rounded-lg gap-2 text-xs"
                    >
                        <Plus size={14} /> Add {field.itemLabel}
                    </Button>
                </div>
                
                <div className="space-y-3 pl-4 border-l-2 border-border/50">
                    {(value || []).map((item: any, index: number) => (
                        <Accordion type="single" collapsible key={index} className="bg-card/50 border border-border/50 rounded-xl overflow-hidden">
                            <AccordionItem value={`item-${index}`} className="border-none">
                                <div className="flex items-center p-2">
                                    <div className="cursor-move p-2 text-muted-foreground"><GripVertical size={16} /></div>
                                    <AccordionTrigger className="hover:no-underline py-2 pr-4 flex-1">
                                        <span className="font-bold text-sm">
                                            {item.title || item.name || item.id || `${field.itemLabel} ${index + 1}`}
                                        </span>
                                    </AccordionTrigger>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent accordion toggle
                                            const newArray = [...value];
                                            newArray.splice(index, 1);
                                            onChange(newArray);
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                                <AccordionContent className="p-4 pt-0 border-t border-border/50 bg-background/50">
                                    <div className="space-y-4 pt-4">
                                        {field.fields.map((subField: any) => (
                                            <FieldRenderer 
                                                key={subField.name}
                                                field={subField}
                                                value={item?.[subField.name]}
                                                onChange={(val) => {
                                                    const newArray = [...value];
                                                    newArray[index] = { ...newArray[index], [subField.name]: val };
                                                    onChange(newArray);
                                                }}
                                                path={[...path, String(index), subField.name]}
                                            />
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))}
                    {(!value || value.length === 0) && (
                        <div className="text-center py-6 text-sm text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/50">
                            No items yet. Click add to create one.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return <div>Unknown field type: {field.type}</div>;
}

// --- Media Uploader ---
function MediaUploader({ value, onChange, type }: { value: string, onChange: (val: string) => void, type: 'image' | 'video' }) {
    const uploadMutation = useUploadFile();
    const [isHovering, setIsHovering] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const result = await uploadMutation.mutateAsync(e.target.files[0]);
                onChange(result.url); 
            } catch (err) {
                // handled by mutation
            }
        }
    };

    return (
        <div 
            className="relative group border-2 border-dashed border-white/5 rounded-3xl p-2 hover:border-primary/40 transition-all duration-500 bg-white/[0.02] w-full flex flex-col items-center justify-center min-h-[160px] shadow-inner"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
             <input 
                type="file" 
                accept={type === 'image' ? "image/*" : "video/*"} 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
            />
            
            {value ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-black/5">
                    {type === 'image' ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <video src={value} className="w-full h-full object-cover" controls />
                    )}
                    
                    <div className={cn(
                        "absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-200",
                        isHovering ? "opacity-100" : "opacity-0"
                    )}>
                        <p className="text-white font-bold text-xs">Click to Replace</p>
                    </div>
                </div>
            ) : (
                <div className="text-center p-4">
                    {uploadMutation.isPending ? (
                        <RefreshCcw className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    )}
                    <p className="text-xs font-bold text-muted-foreground">{uploadMutation.isPending ? "Uploading..." : `Upload ${type}`}</p>
                </div>
            )}
        </div>
    );
}
