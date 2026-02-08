"use client";

import { useState, useEffect, useRef } from "react";
import { useChangelogContentStore, type ChangelogUpdate } from "@/lib/store/changelog-content";
import { useChangelogContent, useUpdateChangelogContent } from "@/lib/api/changelog-content-queries";
import { toast } from "sonner";
import {
  Plus,
  Save,
  Trash2,
  GitBranch,
  Zap,
  Sparkles,
  ShieldCheck,
  Box,
  Clock,
  Package,
  ArrowLeft,
  RefreshCcw,
  LayoutTemplate,
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
  { value: "Sparkles", label: "Sparkles", icon: Sparkles },
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "ShieldCheck", label: "ShieldCheck", icon: ShieldCheck },
  { value: "Box", label: "Box", icon: Box },
  { value: "GitBranch", label: "Branch", icon: GitBranch },
  { value: "Package", label: "Package", icon: Package },
];

const categoryOptions: ChangelogUpdate["category"][] = ["Major", "Update", "Feature", "Patch"];

export default function ChangelogContentEditor() {
  const {
    content,
    setContent,
    addUpdate,
    updateUpdate,
    deleteUpdate,
    updateHeader,
    resetToDefaults,
  } = useChangelogContentStore();

  const { data: apiContent } = useChangelogContent();
  const updateMutation = useUpdateChangelogContent();

  const [activeTab, setActiveTab] = useState<"updates" | "header">("updates");
  const [editingUpdateId, setEditingUpdateId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });
  const hasHydrated = useRef(false);

  const [updateForm, setUpdateForm] = useState<Partial<ChangelogUpdate>>({
    version: "",
    title: "",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    description: "",
    category: "Update",
    changes: [],
    iconName: "Sparkles",
    isActive: true,
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
        Initializing Changelog...
      </div>
    );
  }

  const updates = content.updates || [];

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

  const handleCreateUpdate = () => {
    const newId = `update-${Date.now()}`;
    addUpdate({
      id: newId,
      version: updateForm.version || "v1.0.0",
      title: updateForm.title || "New Release",
      date: updateForm.date || "Jan 01, 2026",
      description: updateForm.description || "Release notes...",
      category: updateForm.category || "Update",
      changes: updateForm.changes ?? [],
      iconName: updateForm.iconName || "Sparkles",
      isActive: true,
    });
    toast.success("Changelog update created");
    setIsCreateDialogOpen(false);
    setEditingUpdateId(newId);
    setUpdateForm({
      version: "",
      title: "",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      description: "",
      category: "Update",
      changes: [],
      iconName: "Sparkles",
    });
  };

  const handleDeleteUpdate = (id: string) => {
    const update = updates.find((u) => u.id === id);
    openConfirm(
      "Delete changelog entry",
      update ? `Remove "${update.version} – ${update.title}"?` : "Remove this entry?",
      () => {
        deleteUpdate(id);
        if (editingUpdateId === id) setEditingUpdateId(null);
        toast.success("Update deleted");
      }
    );
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
                  Changelog CMS
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-sky-500/10 text-sky-500 border-none"
                >
                  EVOLUTION_LOG
                </Badge>
              </div>
              <CardDescription className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                Release notes & page header
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
                  "Reset all changelog content to defaults? This cannot be undone.",
                  () => {
                    resetToDefaults();
                    toast.success("Changelog defaults restored");
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
            variant={activeTab === "updates" ? "default" : "outline"}
            onClick={() => setActiveTab("updates")}
            className="rounded-xl"
          >
            <GitBranch className="w-4 h-4 mr-2" /> Updates
          </Button>
          <Button
            variant={activeTab === "header" ? "default" : "outline"}
            onClick={() => setActiveTab("header")}
            className="rounded-xl"
          >
            <Clock className="w-4 h-4 mr-2" /> Page Header
          </Button>
        </div>

        {activeTab === "updates" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Release History</CardTitle>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="rounded-xl bg-sky-500/20 text-sky-500 hover:bg-sky-500/30 border-0"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Release
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>New Release Entry</DialogTitle>
                      <DialogDescription>Add a new version to the changelog.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Version</Label>
                          <Input
                            value={updateForm.version}
                            onChange={(e) =>
                              setUpdateForm({ ...updateForm, version: e.target.value })
                            }
                            placeholder="v2.5.0"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input
                            value={updateForm.date}
                            onChange={(e) =>
                              setUpdateForm({ ...updateForm, date: e.target.value })
                            }
                            placeholder="Mon DD, YYYY"
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={updateForm.title}
                          onChange={(e) =>
                            setUpdateForm({ ...updateForm, title: e.target.value })
                          }
                          placeholder="Feature Release Title"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select
                            value={updateForm.category}
                            onValueChange={(val) =>
                              setUpdateForm({ ...updateForm, category: val })
                            }
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select
                            value={updateForm.iconName}
                            onValueChange={(val) =>
                              setUpdateForm({ ...updateForm, iconName: val })
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
                      </div>
                      <div className="space-y-2">
                        <Label>Summary Description</Label>
                        <Textarea
                          value={updateForm.description}
                          onChange={(e) =>
                            setUpdateForm({ ...updateForm, description: e.target.value })
                          }
                          placeholder="Release notes summary..."
                          rows={2}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateUpdate} className="rounded-xl">
                        Add Entry
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between group",
                      editingUpdateId === update.id
                        ? "bg-sky-500/10 border-sky-500/30"
                        : "bg-card/50 border-border/40"
                    )}
                    onClick={() => setEditingUpdateId(update.id)}
                  >
                    <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                      <div
                        className={cn(
                          "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase shrink-0",
                          update.isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {update.version}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold truncate text-sm">{update.title}</div>
                        <div className="text-xs text-muted-foreground">{update.date}</div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUpdate(update.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-border/40 rounded-[24px] overflow-hidden">
              {editingUpdateId ? (
                (() => {
                  const update = updates.find((u) => u.id === editingUpdateId);
                  if (!update) return null;
                  return (
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-border/40">
                        <div>
                          <h2 className="text-xl font-bold">Edit Release Note</h2>
                          <p className="text-sm text-muted-foreground">
                            {update.version} • {update.date}
                          </p>
                        </div>
                        <Button
                          variant={update.isActive ? "default" : "secondary"}
                          size="sm"
                          className="rounded-xl"
                          onClick={() =>
                            updateUpdate(update.id, { isActive: !update.isActive })
                          }
                        >
                          {update.isActive ? "Published" : "Draft"}
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Version Tag</Label>
                          <Input
                            value={update.version}
                            onChange={(e) =>
                              updateUpdate(update.id, { version: e.target.value })
                            }
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Release Date</Label>
                          <Input
                            value={update.date}
                            onChange={(e) =>
                              updateUpdate(update.id, { date: e.target.value })
                            }
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Update Title</Label>
                          <Input
                            value={update.title}
                            onChange={(e) =>
                              updateUpdate(update.id, { title: e.target.value })
                            }
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select
                            value={update.category}
                            onValueChange={(val) =>
                              updateUpdate(update.id, { category: val })
                            }
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Detail Icon</Label>
                          <Select
                            value={update.iconName}
                            onValueChange={(val) =>
                              updateUpdate(update.id, { iconName: val })
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
                      </div>

                      <div className="space-y-2">
                        <Label>Summary Description</Label>
                        <Textarea
                          value={update.description}
                          onChange={(e) =>
                            updateUpdate(update.id, { description: e.target.value })
                          }
                          rows={3}
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Detailed Changes (one per line)</Label>
                        <Textarea
                          value={update.changes?.join("\n") ?? ""}
                          onChange={(e) =>
                            updateUpdate(update.id, {
                              changes: e.target.value.split("\n").filter(Boolean),
                            })
                          }
                          rows={6}
                          placeholder="- Fixed bug X..."
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[400px]">
                  <GitBranch className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">Select a release to edit details</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "header" && (
          <Card className="border-border/40 rounded-[24px] overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/5">
              <CardTitle className="font-black italic">Page Header Content</CardTitle>
              <CardDescription>Customize the changelog page introduction.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content.header.badge}
                    onChange={(e) => updateHeader({ badge: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title Prefix</Label>
                  <Input
                    value={content.header.titlePrefix}
                    onChange={(e) => updateHeader({ titlePrefix: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title Suffix</Label>
                  <Input
                    value={content.header.titleSuffix}
                    onChange={(e) => updateHeader({ titleSuffix: e.target.value })}
                    placeholder="."
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content.header.description}
                  onChange={(e) => updateHeader({ description: e.target.value })}
                  rows={4}
                  className="rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
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
              <CardTitle className="text-lg font-black italic">Changelog Preview</CardTitle>
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
              <div className="mx-auto max-w-2xl space-y-10">
                <div className="text-center space-y-4">
                  <Badge className="bg-sky-500/20 text-sky-500 border-none">
                    {content.header.badge}
                  </Badge>
                  <h1 className="text-4xl font-black italic tracking-tight">
                    {content.header.titlePrefix}
                    <span className="text-sky-500">{content.header.titleSuffix}</span>
                  </h1>
                  <p className="text-muted-foreground">{content.header.description}</p>
                </div>
                <div className="space-y-6">
                  {content.updates.slice(0, 5).map((u) => {
                    const Icon =
                      (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[
                        u.iconName ?? "Sparkles"
                      ] ?? Sparkles;
                    return (
                      <div
                        key={u.id}
                        className="p-6 rounded-2xl border border-border/40 bg-card/50 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-500">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-lg">{u.version}</span>
                              <Badge
                                variant="secondary"
                                className="text-[10px] rounded-full"
                              >
                                {u.category}
                              </Badge>
                              {!u.isActive && (
                                <Badge variant="outline" className="text-[10px]">
                                  Draft
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{u.date}</div>
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">{u.title}</h3>
                        <p className="text-sm text-muted-foreground">{u.description}</p>
                        {u.changes && u.changes.length > 0 && (
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {u.changes.slice(0, 3).map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        )}
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
