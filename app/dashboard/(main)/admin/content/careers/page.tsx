"use client";

import { useState, useEffect, useRef } from "react";
import { useCareersContentStore, type JobPosition } from "@/lib/store/careers-content";
import { useCareersContent, useUpdateCareersContent } from "@/lib/api/careers-content-queries";
import { toast } from "sonner";
import {
  Plus,
  Save,
  Trash2,
  Briefcase,
  Globe,
  Cpu,
  Sparkles,
  Terminal,
  Rocket,
  Flame,
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
  { value: "Cpu", label: "Cpu", icon: Cpu },
  { value: "Sparkles", label: "Sparkles", icon: Sparkles },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Terminal", label: "Terminal", icon: Terminal },
  { value: "Briefcase", label: "Briefcase", icon: Briefcase },
  { value: "Rocket", label: "Rocket", icon: Rocket },
  { value: "Flame", label: "Flame", icon: Flame },
];

export default function CareersContentEditor() {
  const {
    content,
    setContent,
    addJob,
    updateJob,
    deleteJob,
    updateHero,
    updateContact,
    updateCultureValue,
    resetToDefaults,
  } = useCareersContentStore();

  const { data: apiContent } = useCareersContent();
  const updateMutation = useUpdateCareersContent();

  const [activeTab, setActiveTab] = useState<"jobs" | "hero">("jobs");
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });
  const hasHydrated = useRef(false);

  const [jobForm, setJobForm] = useState<Partial<JobPosition>>({
    title: "",
    team: "",
    type: "Full-Time / Remote",
    location: "Remote",
    description: "",
    requirements: [],
    iconName: "Briefcase",
    color: "text-primary",
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
        Initializing Careers Hub...
      </div>
    );
  }

  const jobs = content.jobs || [];

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

  const handleCreateJob = () => {
    const newId = `job-${Date.now()}`;
    addJob({
      id: newId,
      title: jobForm.title || "New Position",
      team: jobForm.team || "Engineering",
      type: jobForm.type || "Full-Time / Remote",
      location: jobForm.location || "Remote",
      description: jobForm.description || "Description...",
      requirements: jobForm.requirements ?? [],
      iconName: jobForm.iconName || "Briefcase",
      color: jobForm.color || "text-primary",
      isActive: true,
    });
    toast.success("Job position created");
    setIsCreateDialogOpen(false);
    setEditingJobId(newId);
    setJobForm({
      title: "",
      team: "",
      type: "Full-Time / Remote",
      location: "Remote",
      description: "",
      requirements: [],
      iconName: "Briefcase",
      color: "text-primary",
    });
  };

  const handleDeleteJob = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    openConfirm(
      "Delete job posting",
      job ? `Remove "${job.title}"?` : "Remove this job?",
      () => {
        deleteJob(id);
        if (editingJobId === id) setEditingJobId(null);
        toast.success("Job deleted");
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
                  Careers CMS
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-sky-500/10 text-sky-500 border-none"
                >
                  TALENT_ACTIVE
                </Badge>
              </div>
              <CardDescription className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                Jobs & page content
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
                  "Reset all careers content to defaults? This cannot be undone.",
                  () => {
                    resetToDefaults();
                    toast.success("Careers defaults restored");
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
            variant={activeTab === "jobs" ? "default" : "outline"}
            onClick={() => setActiveTab("jobs")}
            className="rounded-xl"
          >
            <Briefcase className="w-4 h-4 mr-2" /> Jobs
          </Button>
          <Button
            variant={activeTab === "hero" ? "default" : "outline"}
            onClick={() => setActiveTab("hero")}
            className="rounded-xl"
          >
            <Sparkles className="w-4 h-4 mr-2" /> Page Content
          </Button>
        </div>

        {activeTab === "jobs" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Open Positions</CardTitle>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="rounded-xl bg-sky-500/20 text-sky-500 hover:bg-sky-500/30 border-0"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Position</DialogTitle>
                      <DialogDescription>
                        Add a new job opening to the careers page.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                          value={jobForm.title}
                          onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                          placeholder="e.g. Senior Frontend Engineer"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Team</Label>
                          <Input
                            value={jobForm.team}
                            onChange={(e) => setJobForm({ ...jobForm, team: e.target.value })}
                            placeholder="e.g. Product Design"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Input
                            value={jobForm.type}
                            onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                            placeholder="Full-Time / Remote"
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={jobForm.location}
                          onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                          placeholder="e.g. Remote"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={jobForm.description}
                          onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                          placeholder="Brief role description..."
                          rows={2}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select
                            value={jobForm.iconName}
                            onValueChange={(val) => setJobForm({ ...jobForm, iconName: val })}
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
                            value={jobForm.color}
                            onChange={(e) => setJobForm({ ...jobForm, color: e.target.value })}
                            placeholder="text-sky-500"
                            className="rounded-xl font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateJob} className="rounded-xl">
                        Create Position
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between group",
                      editingJobId === job.id
                        ? "bg-sky-500/10 border-sky-500/30"
                        : "bg-card/50 border-border/40"
                    )}
                    onClick={() => setEditingJobId(job.id)}
                  >
                    <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          job.isActive ? "bg-green-500" : "bg-muted-foreground/50"
                        )}
                      />
                      <div className="min-w-0">
                        <div className="font-bold truncate text-sm">{job.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {job.team} • {job.type}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No jobs found. Create one to get started.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-border/40 rounded-[24px] overflow-hidden">
              {editingJobId ? (
                (() => {
                  const job = jobs.find((j) => j.id === editingJobId);
                  if (!job) return null;
                  return (
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-border/40">
                        <div>
                          <h2 className="text-xl font-bold">Edit Position</h2>
                          <p className="text-sm text-muted-foreground">ID: {job.id}</p>
                        </div>
                        <Button
                          variant={job.isActive ? "default" : "secondary"}
                          size="sm"
                          className="rounded-xl"
                          onClick={() => updateJob(job.id, { isActive: !job.isActive })}
                        >
                          {job.isActive ? "Active" : "Hidden"}
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Job Title</Label>
                          <Input
                            value={job.title}
                            onChange={(e) => updateJob(job.id, { title: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Team / Department</Label>
                          <Input
                            value={job.team}
                            onChange={(e) => updateJob(job.id, { team: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Employment Type</Label>
                          <Input
                            value={job.type}
                            onChange={(e) => updateJob(job.id, { type: e.target.value })}
                            placeholder="e.g. Full-Time / Remote"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={job.location}
                            onChange={(e) => updateJob(job.id, { location: e.target.value })}
                            placeholder="e.g. Remote"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select
                            value={job.iconName}
                            onValueChange={(val) => updateJob(job.id, { iconName: val })}
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
                            value={job.color}
                            onChange={(e) => updateJob(job.id, { color: e.target.value })}
                            placeholder="text-sky-500"
                            className="rounded-xl font-mono text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={job.description}
                          onChange={(e) =>
                            updateJob(job.id, { description: e.target.value })
                          }
                          rows={3}
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Requirements (one per line)</Label>
                        <Textarea
                          value={job.requirements?.join("\n") ?? ""}
                          onChange={(e) =>
                            updateJob(job.id, {
                              requirements: e.target.value.split("\n").filter(Boolean),
                            })
                          }
                          rows={4}
                          placeholder="e.g. 5+ years React experience..."
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[400px]">
                  <Briefcase className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">Select a job to edit details</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "hero" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Hero Section</CardTitle>
                <CardDescription>
                  Main headline and description of the careers page.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Page Badge</Label>
                    <Input
                      value={content.hero.badge}
                      onChange={(e) => updateHero({ badge: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title Prefix</Label>
                    <Input
                      value={content.hero.titlePrefix}
                      onChange={(e) => updateHero({ titlePrefix: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Highlighted Word</Label>
                    <Input
                      value={content.hero.titleHighlight}
                      onChange={(e) => updateHero({ titleHighlight: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title Suffix</Label>
                    <Input
                      value={content.hero.titleSuffix}
                      onChange={(e) => updateHero({ titleSuffix: e.target.value })}
                      placeholder="."
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={content.hero.description}
                    onChange={(e) => updateHero({ description: e.target.value })}
                    rows={4}
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Contact CTA</CardTitle>
                <CardDescription>
                  Bottom section for speculative applications.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content.contact.title}
                    onChange={(e) => updateContact({ title: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={content.contact.description}
                    onChange={(e) => updateContact({ description: e.target.value })}
                    rows={3}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input
                    value={content.contact.buttonText}
                    onChange={(e) => updateContact({ buttonText: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Culture Values</CardTitle>
                <CardDescription>Edit culture value cards (title, description, icon, color).</CardDescription>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.cultureValues.map((val) => {
                  const Icon =
                    (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[
                      val.iconName
                    ] ?? Rocket;
                  return (
                    <div
                      key={val.id}
                      className="p-6 rounded-xl border border-border/40 space-y-4 bg-muted/5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            (val.color?.replace?.("text-", "bg-") || "bg-primary") + "/20",
                            val.color || "text-primary"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Label className="text-xs text-muted-foreground">Title</Label>
                          <Input
                            value={val.title}
                            onChange={(e) =>
                              updateCultureValue(val.id, { title: e.target.value })
                            }
                            className="rounded-xl mt-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Description</Label>
                        <Textarea
                          value={val.description}
                          onChange={(e) =>
                            updateCultureValue(val.id, { description: e.target.value })
                          }
                          rows={2}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Icon</Label>
                          <Select
                            value={val.iconName}
                            onValueChange={(v) =>
                              updateCultureValue(val.id, { iconName: v })
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
                          <Label className="text-xs">Color class</Label>
                          <Input
                            value={val.color}
                            onChange={(e) =>
                              updateCultureValue(val.id, { color: e.target.value })
                            }
                            placeholder="text-sky-500"
                            className="rounded-xl font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              <CardTitle className="text-lg font-black italic">Careers Preview</CardTitle>
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
                    {content.hero.badge}
                  </Badge>
                  <h1 className="text-4xl font-black italic tracking-tight">
                    {content.hero.titlePrefix}{" "}
                    <span className="text-sky-500">{content.hero.titleHighlight}</span>
                    {content.hero.titleSuffix}
                  </h1>
                  <p className="text-muted-foreground">{content.hero.description}</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {content.jobs.filter((j) => j.isActive).slice(0, 4).map((job) => {
                    const Icon =
                      (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[
                        job.iconName ?? "Briefcase"
                      ] ?? Briefcase;
                    return (
                      <div
                        key={job.id}
                        className="p-4 rounded-xl border border-border/40 flex gap-3 items-center"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            job.color?.replace?.("text-", "bg-") + "/20",
                            job.color
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold">{job.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {job.team} • {job.type} • {job.location}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {content.cultureValues.map((v) => {
                    const Icon =
                      (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[
                        v.iconName
                      ] ?? Rocket;
                    return (
                      <div
                        key={v.id}
                        className="p-4 rounded-xl border border-border/40"
                      >
                        <Icon className="w-8 h-8 text-sky-500 mb-2" />
                        <div className="font-bold text-sm">{v.title}</div>
                        <p className="text-xs text-muted-foreground mt-1">{v.description}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="p-6 rounded-2xl border border-border/40 bg-muted/20 text-center">
                  <h2 className="text-xl font-bold">{content.contact.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2">{content.contact.description}</p>
                  <Button className="rounded-xl mt-4">{content.contact.buttonText}</Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
