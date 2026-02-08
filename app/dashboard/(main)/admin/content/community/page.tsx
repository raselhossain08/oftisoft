"use client";

import { useState, useEffect, useRef } from "react";
import { useCommunityContentStore, type CommunityLink, type Statistic } from "@/lib/store/community-content";
import { useCommunityContent, useUpdateCommunityContent } from "@/lib/api/community-content-queries";
import { toast } from "sonner";
import {
  Plus,
  Save,
  Trash2,
  Github,
  Twitter,
  MessageSquare,
  Slack,
  Link as LinkIcon,
  Globe,
  Zap,
  Heart,
  Share2,
  LayoutTemplate,
  PieChart,
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
  { value: "Github", label: "Github", icon: Github },
  { value: "Twitter", label: "Twitter", icon: Twitter },
  { value: "MessageSquare", label: "Discord", icon: MessageSquare },
  { value: "Slack", label: "Slack", icon: Slack },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "Heart", label: "Heart", icon: Heart },
  { value: "Share2", label: "Share", icon: Share2 },
];

export default function CommunityContentEditor() {
  const {
    content,
    setContent,
    addLink,
    updateLink,
    deleteLink,
    addStat,
    updateStat,
    deleteStat,
    updateHeader,
    updateNewsletter,
    resetToDefaults,
  } = useCommunityContentStore();

  const { data: apiContent } = useCommunityContent();
  const updateMutation = useUpdateCommunityContent();

  const [activeTab, setActiveTab] = useState<"content" | "links" | "stats">("content");
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false);
  const [isCreateStatOpen, setIsCreateStatOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });
  const hasHydrated = useRef(false);

  const [linkForm, setLinkForm] = useState<Partial<CommunityLink>>({
    title: "",
    label: "",
    iconName: "Github",
    color: "text-white",
    url: "",
    isActive: true,
  });

  const [statForm, setStatForm] = useState<Partial<Statistic>>({
    value: "",
    label: "",
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
        Initializing Community Hub...
      </div>
    );
  }

  const links = content.links || [];
  const stats = content.stats || [];

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

  const handleCreateLink = () => {
    const newId = `link-${Date.now()}`;
    addLink({
      id: newId,
      title: linkForm.title || "New Link",
      label: linkForm.label || "Description",
      iconName: linkForm.iconName || "Github",
      color: linkForm.color || "text-white",
      url: linkForm.url || "#",
      isActive: true,
    });
    toast.success("Community link created");
    setIsCreateLinkOpen(false);
    setEditingLinkId(newId);
    setLinkForm({
      title: "",
      label: "",
      iconName: "Github",
      color: "text-white",
      url: "",
    });
  };

  const handleCreateStat = () => {
    const newId = `stat-${Date.now()}`;
    addStat({
      id: newId,
      value: statForm.value || "0",
      label: statForm.label || "Label",
      order: stats.length + 1,
    });
    toast.success("Statistic created");
    setIsCreateStatOpen(false);
    setStatForm({ value: "", label: "", order: 1 });
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
                  Community CMS
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-sky-500/10 text-sky-500 border-none"
                >
                  NEXUS_ACTIVE
                </Badge>
              </div>
              <CardDescription className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                Content, links & stats
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
                  "Reset all community content to defaults? This cannot be undone.",
                  () => {
                    resetToDefaults();
                    toast.success("Community defaults restored");
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
            variant={activeTab === "content" ? "default" : "outline"}
            onClick={() => setActiveTab("content")}
            className="rounded-xl"
          >
            <LayoutTemplate className="w-4 h-4 mr-2" /> Content
          </Button>
          <Button
            variant={activeTab === "links" ? "default" : "outline"}
            onClick={() => setActiveTab("links")}
            className="rounded-xl"
          >
            <LinkIcon className="w-4 h-4 mr-2" /> Links
          </Button>
          <Button
            variant={activeTab === "stats" ? "default" : "outline"}
            onClick={() => setActiveTab("stats")}
            className="rounded-xl"
          >
            <PieChart className="w-4 h-4 mr-2" /> Stats
          </Button>
        </div>

        {activeTab === "content" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Header Section</CardTitle>
                <CardDescription>Main page title and description.</CardDescription>
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
                      value={content.header.title}
                      onChange={(e) => updateHeader({ title: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Highlight Word</Label>
                    <Input
                      value={content.header.highlight}
                      onChange={(e) => updateHeader({ highlight: e.target.value })}
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
                <CardTitle className="font-black italic">Newsletter Section</CardTitle>
                <CardDescription>Customize the newsletter subscription area.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={content.newsletter.title}
                    onChange={(e) => updateNewsletter({ title: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={content.newsletter.description}
                    onChange={(e) => updateNewsletter({ description: e.target.value })}
                    rows={3}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Input Placeholder</Label>
                    <Input
                      value={content.newsletter.placeholder}
                      onChange={(e) => updateNewsletter({ placeholder: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                      value={content.newsletter.buttonText}
                      onChange={(e) => updateNewsletter({ buttonText: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Footer Text</Label>
                  <Input
                    value={content.newsletter.footerText}
                    onChange={(e) => updateNewsletter({ footerText: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "links" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Community Links</CardTitle>
                <Dialog open={isCreateLinkOpen} onOpenChange={setIsCreateLinkOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="rounded-xl bg-sky-500/20 text-sky-500 hover:bg-sky-500/30 border-0"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>New Community Link</DialogTitle>
                      <DialogDescription>Add a channel or resource link with icon and URL.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={linkForm.title}
                          onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                          placeholder="e.g. Discord Hub"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle / Label</Label>
                        <Input
                          value={linkForm.label}
                          onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                          placeholder="e.g. Real-time architect sync"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                          value={linkForm.url}
                          onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                          placeholder="https://..."
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select
                          value={linkForm.iconName}
                          onValueChange={(val) => setLinkForm({ ...linkForm, iconName: val })}
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
                          value={linkForm.color}
                          onChange={(e) => setLinkForm({ ...linkForm, color: e.target.value })}
                          placeholder="text-sky-500"
                          className="rounded-xl font-mono text-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateLink} className="rounded-xl">
                        Add Link
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between group",
                      editingLinkId === link.id
                        ? "bg-sky-500/10 border-sky-500/30"
                        : "bg-card/50 border-border/40"
                    )}
                    onClick={() => setEditingLinkId(link.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          link.isActive ? "bg-green-500" : "bg-muted-foreground/50"
                        )}
                      />
                      <span className="font-bold text-sm truncate">{link.title}</span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        openConfirm(
                          "Delete link",
                          `Remove "${link.title}"?`,
                          () => {
                            deleteLink(link.id);
                            if (editingLinkId === link.id) setEditingLinkId(null);
                            toast.success("Link deleted");
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
              {editingLinkId ? (
                (() => {
                  const link = links.find((l) => l.id === editingLinkId);
                  if (!link) return null;
                  return (
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-border/40">
                        <h2 className="text-xl font-bold">Edit Link</h2>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={link.isActive ? "default" : "secondary"}
                            size="sm"
                            className="rounded-xl"
                            onClick={() => updateLink(link.id, { isActive: !link.isActive })}
                          >
                            {link.isActive ? "Active" : "Hidden"}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={link.title}
                            onChange={(e) => updateLink(link.id, { title: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input
                            value={link.label}
                            onChange={(e) => updateLink(link.id, { label: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>URL</Label>
                          <Input
                            value={link.url}
                            onChange={(e) => updateLink(link.id, { url: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Color Class</Label>
                          <Input
                            value={link.color}
                            onChange={(e) => updateLink(link.id, { color: e.target.value })}
                            placeholder="text-sky-500"
                            className="rounded-xl font-mono text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select
                            value={link.iconName}
                            onValueChange={(val) => updateLink(link.id, { iconName: val })}
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
                  <LinkIcon className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">Select a link to edit details</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <Card
                key={stat.id}
                className="relative group border-border/40 rounded-[24px] overflow-hidden"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg z-10"
                  onClick={() =>
                    openConfirm(
                      "Delete statistic",
                      `Remove "${stat.label}"?`,
                      () => {
                        deleteStat(stat.id);
                        toast.success("Statistic deleted");
                      }
                    )
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => updateStat(stat.id, { value: e.target.value })}
                      className="text-2xl font-bold rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStat(stat.id, { label: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card
              className="flex flex-col items-center justify-center p-6 border-dashed border-border/40 rounded-[24px] cursor-pointer hover:bg-muted/50 transition-colors min-h-[180px]"
              onClick={() => setIsCreateStatOpen(true)}
            >
              <Plus className="w-8 h-8 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Add Statistic</span>
            </Card>
          </div>
        )}

        <Dialog open={isCreateStatOpen} onOpenChange={setIsCreateStatOpen}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add Statistic</DialogTitle>
              <DialogDescription>Add a community stat (e.g. active users, pulls).</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  value={statForm.value}
                  onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                  placeholder="e.g. 1.2m"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={statForm.label}
                  onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                  placeholder="e.g. Active Users"
                  className="rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateStat} className="rounded-xl">
                Add Stat
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              <CardTitle className="text-lg font-black italic">Community Preview</CardTitle>
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
                    {content.header.title}{" "}
                    <span className="text-sky-500">{content.header.highlight}</span>
                  </h1>
                  <p className="text-muted-foreground">{content.header.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {content.links.filter((l) => l.isActive).map((link) => {
                    const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[link.iconName] || Globe;
                    return (
                      <div
                        key={link.id}
                        className="p-4 rounded-xl border border-border/40 flex gap-3 items-center"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            link.color?.replace?.("text-", "bg-") + "/20",
                            link.color
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-sm">{link.title}</div>
                          <div className="text-xs text-muted-foreground">{link.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {content.stats.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-xl border border-border/40 text-center bg-muted/20"
                    >
                      <div className="text-2xl font-black text-sky-500">{s.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="p-6 rounded-2xl border border-border/40 bg-muted/20 space-y-4">
                  <h2 className="text-xl font-bold">{content.newsletter.title}</h2>
                  <p className="text-sm text-muted-foreground">{content.newsletter.description}</p>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={content.newsletter.placeholder}
                      className="rounded-xl bg-muted/50 flex-1"
                    />
                    <Button className="rounded-xl shrink-0">{content.newsletter.buttonText}</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{content.newsletter.footerText}</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
