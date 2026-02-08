"use client";

import { useState, useEffect, useRef } from "react";
import { useDocsContentStore, type DocCategory } from "@/lib/store/docs-content";
import { useDocsContent, useUpdateDocsContent } from "@/lib/api/docs-content-queries";
import { toast } from "sonner";
import {
  Plus,
  Save,
  Trash2,
  LayoutTemplate,
  Layers,
  Cpu,
  ShieldCheck,
  Terminal,
  Zap,
  Code2,
  BookOpen,
  MessageSquare,
  Box,
  Globe,
  FileText,
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
  { value: "Layers", label: "Layers", icon: Layers },
  { value: "Cpu", label: "CPU", icon: Cpu },
  { value: "ShieldCheck", label: "Security", icon: ShieldCheck },
  { value: "Terminal", label: "Terminal", icon: Terminal },
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "Code2", label: "Code", icon: Code2 },
  { value: "BookOpen", label: "Book", icon: BookOpen },
  { value: "MessageSquare", label: "Message", icon: MessageSquare },
  { value: "Box", label: "Box", icon: Box },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "FileText", label: "File", icon: FileText },
];

export default function DocsContentEditor() {
  const {
    content,
    setContent,
    updateHeader,
    updateCTA,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSupportCard,
    resetToDefaults,
  } = useDocsContentStore();

  const { data: apiContent } = useDocsContent();
  const updateMutation = useUpdateDocsContent();

  const [activeTab, setActiveTab] = useState<"categories" | "page">("categories");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [isCreateCatOpen, setIsCreateCatOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });
  const hasHydrated = useRef(false);

  const [catForm, setCatForm] = useState<Partial<DocCategory>>({
    title: "",
    count: "0 Articles",
    iconName: "FileText",
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
        Initializing Docs Forge...
      </div>
    );
  }

  const categories = content.categories || [];

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

  const handleCreateCategory = () => {
    const newId = `cat-${Date.now()}`;
    addCategory({
      id: newId,
      title: catForm.title || "New Category",
      count: catForm.count || "0 Articles",
      iconName: catForm.iconName || "FileText",
      color: catForm.color || "text-primary",
      order: categories.length + 1,
    });
    toast.success("Category added");
    setIsCreateCatOpen(false);
    setEditingCatId(newId);
    setCatForm({
      title: "",
      count: "0 Articles",
      iconName: "FileText",
      color: "text-primary",
      order: 1,
    });
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
                <CardTitle className="text-2xl font-black italic tracking-tight underline decoration-sky-500/30 underline-offset-4 text-white">
                  Documentation CMS
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-sky-500/10 text-sky-500 border-none"
                >
                  REPO_ACTIVE
                </Badge>
              </div>
              <CardDescription className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                Doc Categories & Page Content
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
                  "Reset all documentation content to defaults? This cannot be undone.",
                  () => {
                    resetToDefaults();
                    toast.success("Docs defaults restored");
                  }
                )
              }
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button
              variant="outline"
              className="rounded-xl font-bold bg-sky-500/5 border-sky-500/20 text-sky-500 hover:bg-sky-500/10 transition-all"
              onClick={() => setPreviewOpen(true)}
            >
              <LayoutTemplate className="w-4 h-4 mr-2" /> Live Preview
            </Button>
            <Button
              className="rounded-xl font-black italic bg-sky-500 text-white shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-95 transition-all px-8 h-11"
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}{" "}
              {updateMutation.isPending ? "Syncing…" : "Sync Repo"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-6">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "categories" ? "default" : "outline"}
            onClick={() => setActiveTab("categories")}
            className="rounded-xl"
          >
            <Layers className="w-4 h-4 mr-2" /> Categories
          </Button>
          <Button
            variant={activeTab === "page" ? "default" : "outline"}
            onClick={() => setActiveTab("page")}
            className="rounded-xl"
          >
            <LayoutTemplate className="w-4 h-4 mr-2" /> Page Content
          </Button>
        </div>

        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Doc Categories</CardTitle>
                <Dialog open={isCreateCatOpen} onOpenChange={setIsCreateCatOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="rounded-xl bg-sky-500/20 text-sky-500 hover:bg-sky-500/30 border-0"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>New Category</DialogTitle>
                      <DialogDescription>Add a documentation category.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={catForm.title}
                          onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
                          placeholder="e.g. API Reference"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Article Count Text</Label>
                        <Input
                          value={catForm.count}
                          onChange={(e) => setCatForm({ ...catForm, count: e.target.value })}
                          placeholder="e.g. 15 Articles"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select
                          value={catForm.iconName}
                          onValueChange={(val) => setCatForm({ ...catForm, iconName: val })}
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
                          value={catForm.color}
                          onChange={(e) => setCatForm({ ...catForm, color: e.target.value })}
                          placeholder="text-sky-500"
                          className="rounded-xl font-mono text-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateCategory} className="rounded-xl">
                        Add Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between group",
                      editingCatId === cat.id
                        ? "bg-sky-500/10 border-sky-500/30"
                        : "bg-card/50 border-border/40"
                    )}
                    onClick={() => setEditingCatId(cat.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          cat.color?.replace?.("text-", "bg-") || "bg-primary"
                        )}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{cat.title}</div>
                        <div className="text-xs text-muted-foreground">{cat.count}</div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        openConfirm(
                          "Delete category",
                          `Remove "${cat.title}"?`,
                          () => {
                            deleteCategory(cat.id);
                            if (editingCatId === cat.id) setEditingCatId(null);
                            toast.success("Category deleted");
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
              {editingCatId ? (
                (() => {
                  const cat = categories.find((c) => c.id === editingCatId);
                  if (!cat) return null;
                  return (
                    <div className="p-6 space-y-6">
                      <div className="pb-4 border-b border-border/40">
                        <h2 className="text-xl font-bold">Edit Category</h2>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={cat.title}
                            onChange={(e) => updateCategory(cat.id, { title: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Article Count</Label>
                          <Input
                            value={cat.count}
                            onChange={(e) => updateCategory(cat.id, { count: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Color Class</Label>
                          <Input
                            value={cat.color}
                            onChange={(e) => updateCategory(cat.id, { color: e.target.value })}
                            placeholder="text-sky-500"
                            className="rounded-xl font-mono text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select
                            value={cat.iconName}
                            onValueChange={(val) => updateCategory(cat.id, { iconName: val })}
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
                  <Layers className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">Select a category to edit details</p>
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
                <CardDescription>Main title and search placeholder.</CardDescription>
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
                    <Label>Title</Label>
                    <Input
                      value={content.header.title}
                      onChange={(e) => updateHeader({ title: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Highlight</Label>
                    <Input
                      value={content.header.highlight}
                      onChange={(e) => updateHeader({ highlight: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Search Placeholder</Label>
                  <Input
                    value={content.header.placeholder}
                    onChange={(e) => updateHeader({ placeholder: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">CTA Section</CardTitle>
                <CardDescription>Bottom call-to-action banner.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content.cta.title}
                    onChange={(e) => updateCTA({ title: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={content.cta.description}
                    onChange={(e) => updateCTA({ description: e.target.value })}
                    rows={3}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Btn</Label>
                    <Input
                      value={content.cta.primaryButton}
                      onChange={(e) => updateCTA({ primaryButton: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Btn</Label>
                    <Input
                      value={content.cta.secondaryButton}
                      onChange={(e) => updateCTA({ secondaryButton: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Support Cards</CardTitle>
                <CardDescription>Bottom support link configuration.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {content.support.map((card) => (
                  <div
                    key={card.id}
                    className="p-4 border border-border/40 rounded-xl space-y-4 bg-muted/5"
                  >
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={card.title}
                        onChange={(e) =>
                          updateSupportCard(card.id, { title: e.target.value })
                        }
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={card.description}
                        onChange={(e) =>
                          updateSupportCard(card.id, { description: e.target.value })
                        }
                        className="rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select
                          value={card.iconName}
                          onValueChange={(val) =>
                            updateSupportCard(card.id, { iconName: val })
                          }
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
                          value={card.color}
                          onChange={(e) =>
                            updateSupportCard(card.id, { color: e.target.value })
                          }
                          placeholder="text-sky-500"
                          className="rounded-xl font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
        <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(14,165,233,0.2)]">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-md">
              <CardTitle className="text-lg font-black italic">Docs Preview</CardTitle>
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
                  <Badge className="bg-sky-500/20 text-sky-500 border-none">
                    {content.header.badge}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-black italic tracking-tight">
                    {content.header.title} <span className="text-sky-500">{content.header.highlight}</span>
                  </h1>
                  <Input
                    readOnly
                    value={content.header.placeholder}
                    className="rounded-xl max-w-md mx-auto bg-muted/50"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {content.categories.slice(0, 6).map((c) => {
                    const Icon = (LucideIcons as any)[c.iconName] || FileText;
                    return (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl border border-border/40 bg-card/50 flex gap-3"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            c.color?.replace?.("text-", "bg-") + "/20",
                            c.color
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm">{c.title}</div>
                          <div className="text-xs text-muted-foreground">{c.count}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/40 text-center">
                  <h2 className="text-xl font-bold">{content.cta.title}</h2>
                  <p className="text-muted-foreground mt-2">{content.cta.description}</p>
                  <div className="flex gap-2 justify-center mt-4">
                    <Button variant="default" size="sm" className="rounded-xl">
                      {content.cta.primaryButton}
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      {content.cta.secondaryButton}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.support.map((s) => {
                    const Icon = (LucideIcons as any)[s.iconName] || MessageSquare;
                    return (
                      <div
                        key={s.id}
                        className="p-4 rounded-xl border border-border/40 flex gap-3"
                      >
                        <Icon className="w-8 h-8 text-sky-500 shrink-0" />
                        <div>
                          <div className="font-bold">{s.title}</div>
                          <p className="text-sm text-muted-foreground">{s.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
