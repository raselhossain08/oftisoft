"use client";

import { useState, useEffect, useRef } from "react";
import { useFeaturesContentStore, type FeatureItem } from "@/lib/store/features-content";
import { useFeaturesContent, useUpdateFeaturesContent } from "@/lib/api/features-content-queries";
import { toast } from "sonner";
import {
  Plus,
  Save,
  Trash2,
  LayoutTemplate,
  Zap,
  ShieldCheck,
  Globe,
  Layers,
  Cpu,
  Box,
  Terminal,
  Search,
  Monitor,
  Code2,
  Database,
  ArrowLeft,
  RefreshCcw,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";

const iconOptions = [
  { value: "Cpu", label: "CPU", icon: Cpu },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "ShieldCheck", label: "Security", icon: ShieldCheck },
  { value: "Layers", label: "Layers", icon: Layers },
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "Terminal", label: "Terminal", icon: Terminal },
  { value: "Code2", label: "Code", icon: Code2 },
  { value: "Database", label: "Database", icon: Database },
  { value: "Box", label: "Box", icon: Box },
  { value: "Monitor", label: "Monitor", icon: Monitor },
  { value: "Search", label: "Search", icon: Search },
];

export default function FeaturesContentEditor() {
  const {
    content,
    setContent,
    updateHeader,
    updateShowcase,
    addFeature,
    updateFeature,
    deleteFeature,
    resetToDefaults,
  } = useFeaturesContentStore();

  const { data: apiContent } = useFeaturesContent();
  const updateMutation = useUpdateFeaturesContent();

  const [activeTab, setActiveTab] = useState<"items" | "page">("items");
  const [editingFeatId, setEditingFeatId] = useState<string | null>(null);
  const [isCreateFeatOpen, setIsCreateFeatOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });
  const hasHydrated = useRef(false);

  const [featForm, setFeatForm] = useState<Partial<FeatureItem>>({
    title: "",
    description: "",
    iconName: "Zap",
    color: "text-primary",
    order: 1,
  });

  useEffect(() => {
    if (apiContent && !hasHydrated.current) {
      setContent(apiContent);
      hasHydrated.current = true;
    }
  }, [apiContent, setContent]);

  if (!content) {
    return (
      <div className="p-20 text-center font-black animate-pulse text-muted-foreground uppercase tracking-widest">
        Initializing Features Forge...
      </div>
    );
  }

  const features = content.features || [];

  const handleSave = async () => {
    await updateMutation.mutateAsync(content);
  };

  const openConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirmDialog({ open: true, title, description, onConfirm });
  };
  const closeConfirm = () => setConfirmDialog((prev) => ({ ...prev, open: false }));
  const handleConfirm = () => {
    confirmDialog.onConfirm();
    closeConfirm();
  };

  const handleCreateFeature = () => {
    const newId = `feat-${Date.now()}`;
    addFeature({
      id: newId,
      title: featForm.title || "New Feature",
      description: featForm.description || "Feature description...",
      iconName: featForm.iconName || "Zap",
      color: featForm.color || "text-primary",
      order: features.length + 1,
    });
    toast.success("Feature added");
    setIsCreateFeatOpen(false);
    setEditingFeatId(newId);
    setFeatForm({ title: "", description: "", iconName: "Zap", color: "text-primary", order: 1 });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" asChild className="h-12 w-12 rounded-2xl">
              <Link href="/dashboard/admin/content">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl font-black italic tracking-tight underline decoration-cyan-500/30 underline-offset-4 text-white">
                  Features CMS
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-cyan-500/10 text-cyan-500 border-none"
                >
                  MATRIX_ACTIVE
                </Badge>
              </div>
              <CardDescription className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                Feature Cards & Page Content
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-xl font-bold border-border/50 hover:bg-muted/50 transition-colors"
              onClick={() =>
                openConfirm(
                  "Reset to defaults",
                  "Reset all features content to defaults? This cannot be undone.",
                  () => {
                    resetToDefaults();
                    toast.success("Features defaults restored");
                  }
                )
              }
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button
              variant="outline"
              className="rounded-xl font-bold bg-cyan-500/5 border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/10 transition-all"
              onClick={() => setPreviewOpen(true)}
            >
              <LayoutTemplate className="w-4 h-4 mr-2" /> Live Preview
            </Button>
            <Button
              className="rounded-xl font-black italic bg-cyan-500 text-white shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all px-8 h-11"
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}{" "}
              {updateMutation.isPending ? "Syncing…" : "Sync Matrix"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-6">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "items" ? "default" : "outline"}
            onClick={() => setActiveTab("items")}
            className="rounded-xl"
          >
            <Zap className="w-4 h-4 mr-2" /> Feature Cards
          </Button>
          <Button
            variant={activeTab === "page" ? "default" : "outline"}
            onClick={() => setActiveTab("page")}
            className="rounded-xl"
          >
            <LayoutTemplate className="w-4 h-4 mr-2" /> Page Content
          </Button>
        </div>

        {activeTab === "items" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Feature List</CardTitle>
                <Dialog open={isCreateFeatOpen} onOpenChange={setIsCreateFeatOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="rounded-xl bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30 border-0"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Feature
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>New Feature</DialogTitle>
                      <DialogDescription>Add a feature card to the list.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={featForm.title}
                          onChange={(e) => setFeatForm({ ...featForm, title: e.target.value })}
                          placeholder="e.g. Real-time Sync"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={featForm.description}
                          onChange={(e) =>
                            setFeatForm({ ...featForm, description: e.target.value })
                          }
                          placeholder="Brief description..."
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select
                          value={featForm.iconName}
                          onValueChange={(val) => setFeatForm({ ...featForm, iconName: val })}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                <div className="flex items-center gap-2">
                                  <opt.icon className="w-4 h-4" />
                                  <span>{opt.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Color class</Label>
                        <Input
                          value={featForm.color}
                          onChange={(e) => setFeatForm({ ...featForm, color: e.target.value })}
                          placeholder="text-cyan-500"
                          className="rounded-xl font-mono text-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateFeature} className="rounded-xl">
                        Add Feature
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {features.map((feat) => (
                  <div
                    key={feat.id}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between group",
                      editingFeatId === feat.id
                        ? "bg-cyan-500/10 border-cyan-500/30"
                        : "bg-card/50 border-border/40"
                    )}
                    onClick={() => setEditingFeatId(feat.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          feat.color?.replace?.("text-", "bg-") || "bg-primary"
                        )}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{feat.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {feat.description}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        openConfirm(
                          "Delete feature",
                          `Remove "${feat.title}"?`,
                          () => {
                            deleteFeature(feat.id);
                            if (editingFeatId === feat.id) setEditingFeatId(null);
                            toast.success("Feature deleted");
                          }
                        );
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-border/40 rounded-[24px] overflow-hidden">
              {editingFeatId ? (
                (() => {
                  const feat = features.find((f) => f.id === editingFeatId);
                  if (!feat) return null;
                  return (
                    <div className="p-6 space-y-6">
                      <div className="pb-4 border-b border-border/40">
                        <h2 className="text-xl font-bold">Edit Feature</h2>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={feat.title}
                            onChange={(e) => updateFeature(feat.id, { title: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Color Class</Label>
                          <Input
                            value={feat.color}
                            onChange={(e) => updateFeature(feat.id, { color: e.target.value })}
                            placeholder="text-cyan-500"
                            className="rounded-xl font-mono text-sm"
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={feat.description}
                            onChange={(e) =>
                              updateFeature(feat.id, { description: e.target.value })
                            }
                            rows={3}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select
                            value={feat.iconName}
                            onValueChange={(val) => updateFeature(feat.id, { iconName: val })}
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex items-center gap-2">
                                    <opt.icon className="w-4 h-4" />
                                    <span>{opt.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
                  <Zap className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">Select a feature to edit details</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "page" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Page Header</CardTitle>
                <CardDescription>Main title and description.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content.header.badge}
                    onChange={(e) => updateHeader({ badge: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title Prefix</Label>
                    <Input
                      value={content.header.titlePrefix}
                      onChange={(e) => updateHeader({ titlePrefix: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Highlight</Label>
                    <Input
                      value={content.header.titleHighlight}
                      onChange={(e) => updateHeader({ titleHighlight: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={content.header.description}
                    onChange={(e) => updateHeader({ description: e.target.value })}
                    rows={3}
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Visual Showcase</CardTitle>
                <CardDescription>Bottom visual section text.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content.showcase.title}
                    onChange={(e) => updateShowcase({ title: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={content.showcase.description}
                    onChange={(e) => updateShowcase({ description: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status Badge</Label>
                    <Input
                      value={content.showcase.statusText}
                      onChange={(e) => updateShowcase({ statusText: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Op Badge</Label>
                    <Input
                      value={content.showcase.badgeText}
                      onChange={(e) => updateShowcase({ badgeText: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && closeConfirm()}>
        <DialogContent className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black italic">{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeConfirm} className="rounded-xl">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} className="rounded-xl">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(6,182,212,0.2)]">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-md">
              <CardTitle className="text-lg font-black italic">Features Preview</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewOpen(false)}
                className="rounded-full"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-12">
              <div className="mx-auto max-w-4xl space-y-10">
                <div className="text-center space-y-4">
                  <Badge className="bg-cyan-500/20 text-cyan-500 border-none">
                    {content.header.badge}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-black italic tracking-tight">
                    {content.header.titlePrefix}{" "}
                    <span className="text-cyan-500">{content.header.titleHighlight}</span>
                  </h1>
                  <p className="text-muted-foreground">{content.header.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.features.slice(0, 4).map((f) => {
                    const Icon = (LucideIcons as any)[f.iconName] || Zap;
                    return (
                      <div
                        key={f.id}
                        className="p-6 rounded-2xl border border-border/40 bg-card/50 flex gap-4"
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                            f.color?.replace?.("text-", "bg-") + "/20",
                            f.color
                          )}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">{f.title}</div>
                          <p className="text-sm text-muted-foreground mt-1">{f.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/40 text-center">
                  <h2 className="text-xl font-bold">{content.showcase.title}</h2>
                  <p className="text-muted-foreground mt-2">{content.showcase.description}</p>
                  <div className="flex gap-2 justify-center mt-4">
                    <Badge variant="secondary" className="rounded-full">
                      {content.showcase.badgeText}
                    </Badge>
                    <Badge variant="outline" className="rounded-full">
                      {content.showcase.statusText}
                    </Badge>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
