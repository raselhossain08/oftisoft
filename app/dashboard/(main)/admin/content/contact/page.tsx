"use client";

import { useState, useEffect, useRef } from "react";
import { useContactContentStore, type ContactInfoItem } from "@/lib/store/contact-content";
import { useContactContent, useUpdateContactContent } from "@/lib/api/contact-content-queries";
import { toast } from "sonner";
import {
  Plus,
  Save,
  Trash2,
  MapPin,
  Mail,
  Headset,
  LayoutTemplate,
  Terminal,
  Phone,
  Globe,
  MessageSquare,
  Radio,
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
  { value: "MapPin", label: "Location", icon: MapPin },
  { value: "Mail", label: "Email", icon: Mail },
  { value: "Headset", label: "Support", icon: Headset },
  { value: "Phone", label: "Phone", icon: Phone },
  { value: "MessageSquare", label: "Message", icon: MessageSquare },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Radio", label: "Broadcast", icon: Radio },
];

export default function ContactContentEditor() {
  const {
    content,
    setContent,
    updateHeader,
    updateStatusNode,
    updateForm,
    updateFooter,
    addContactInfo,
    updateContactInfo,
    deleteContactInfo,
    resetToDefaults,
  } = useContactContentStore();

  const { data: apiContent } = useContactContent();
  const updateMutation = useUpdateContactContent();

  const [activeTab, setActiveTab] = useState<"info" | "header" | "form">("info");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });
  const hasHydrated = useRef(false);

  const [itemForm, setItemForm] = useState<Partial<ContactInfoItem>>({
    title: "",
    value: "",
    iconName: "MapPin",
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
        Initializing Contact Sync...
      </div>
    );
  }

  const contactInfo = content.contactInfo || [];

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

  const handleCreateItem = () => {
    const newId = `info-${Date.now()}`;
    addContactInfo({
      id: newId,
      title: itemForm.title || "New Contact Point",
      value: itemForm.value || "Details...",
      iconName: itemForm.iconName || "MapPin",
      color: itemForm.color || "text-primary",
      order: contactInfo.length + 1,
    });
    toast.success("Contact info added");
    setIsCreateItemOpen(false);
    setEditingItemId(newId);
    setItemForm({
      title: "",
      value: "",
      iconName: "MapPin",
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
                  Contact Page CMS
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-sky-500/10 text-sky-500 border-none"
                >
                  SYNC_ACTIVE
                </Badge>
              </div>
              <CardDescription className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                Contact points, page text & form config
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
                  "Reset all contact content to defaults? This cannot be undone.",
                  () => {
                    resetToDefaults();
                    toast.success("Contact defaults restored");
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
            variant={activeTab === "info" ? "default" : "outline"}
            onClick={() => setActiveTab("info")}
            className="rounded-xl"
          >
            <MapPin className="w-4 h-4 mr-2" /> Contact Info
          </Button>
          <Button
            variant={activeTab === "header" ? "default" : "outline"}
            onClick={() => setActiveTab("header")}
            className="rounded-xl"
          >
            <LayoutTemplate className="w-4 h-4 mr-2" /> Page Text
          </Button>
          <Button
            variant={activeTab === "form" ? "default" : "outline"}
            onClick={() => setActiveTab("form")}
            className="rounded-xl"
          >
            <Terminal className="w-4 h-4 mr-2" /> Form Config
          </Button>
        </div>

        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Contact Points</CardTitle>
                <Dialog open={isCreateItemOpen} onOpenChange={setIsCreateItemOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="rounded-xl bg-sky-500/20 text-sky-500 hover:bg-sky-500/30 border-0"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Point
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>New Contact Point</DialogTitle>
                      <DialogDescription>Add a contact info item (location, email, etc.).</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={itemForm.title}
                          onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                          placeholder="e.g. Sales Inquiries"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Value / Detail</Label>
                        <Input
                          value={itemForm.value}
                          onChange={(e) => setItemForm({ ...itemForm, value: e.target.value })}
                          placeholder="e.g. sales@oftisoft.com"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select
                          value={itemForm.iconName}
                          onValueChange={(val) => setItemForm({ ...itemForm, iconName: val })}
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
                          value={itemForm.color}
                          onChange={(e) => setItemForm({ ...itemForm, color: e.target.value })}
                          placeholder="text-sky-500"
                          className="rounded-xl font-mono text-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateItem} className="rounded-xl">
                        Add Point
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {contactInfo.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between group",
                      editingItemId === item.id
                        ? "bg-sky-500/10 border-sky-500/30"
                        : "bg-card/50 border-border/40"
                    )}
                    onClick={() => setEditingItemId(item.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          item.color?.replace?.("text-", "bg-") || "bg-primary"
                        )}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {item.value}
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
                          "Delete contact point",
                          `Remove "${item.title}"?`,
                          () => {
                            deleteContactInfo(item.id);
                            if (editingItemId === item.id) setEditingItemId(null);
                            toast.success("Point deleted");
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
              {editingItemId ? (
                (() => {
                  const item = contactInfo.find((i) => i.id === editingItemId);
                  if (!item) return null;
                  return (
                    <div className="p-6 space-y-6">
                      <div className="pb-4 border-b border-border/40">
                        <h2 className="text-xl font-bold">Edit Contact Point</h2>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={item.title}
                            onChange={(e) => updateContactInfo(item.id, { title: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Value / Detail</Label>
                          <Input
                            value={item.value}
                            onChange={(e) => updateContactInfo(item.id, { value: e.target.value })}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Color Class</Label>
                          <Input
                            value={item.color}
                            onChange={(e) => updateContactInfo(item.id, { color: e.target.value })}
                            placeholder="text-sky-500"
                            className="rounded-xl font-mono text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select
                            value={item.iconName}
                            onValueChange={(val) => updateContactInfo(item.id, { iconName: val })}
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
                  <MapPin className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium">Select a contact point to edit details</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "header" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Page Header & Status</CardTitle>
                <CardDescription>Main titles and operational status text.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Page Badge</Label>
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
                    <Label>Highlighted Word</Label>
                    <Input
                      value={content.header.titleHighlight}
                      onChange={(e) => updateHeader({ titleHighlight: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
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
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={content.header.description}
                    onChange={(e) => updateHeader({ description: e.target.value })}
                    rows={3}
                    className="rounded-xl"
                  />
                </div>
                <div className="border-t border-border/40 pt-4 mt-4 space-y-4">
                  <Label className="text-muted-foreground uppercase text-xs font-bold">
                    Status Node
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={content.statusNode.title}
                        onChange={(e) => updateStatusNode({ title: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status Label</Label>
                      <Input
                        value={content.statusNode.status}
                        onChange={(e) => updateStatusNode({ status: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Latency Text</Label>
                    <Input
                      value={content.statusNode.latencyText}
                      onChange={(e) => updateStatusNode({ latencyText: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 rounded-[24px] overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/5">
                <CardTitle className="font-black italic">Footer Links</CardTitle>
                <CardDescription>Bottom security guarantee text.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Encrypted Text</Label>
                  <Input
                    value={content.footer.encryptedText}
                    onChange={(e) => updateFooter({ encryptedText: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Agent Dispatch Text</Label>
                  <Input
                    value={content.footer.agentText}
                    onChange={(e) => updateFooter({ agentText: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "form" && (
          <Card className="border-border/40 rounded-[24px] overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/5">
              <CardTitle className="font-black italic">Contact Form Configuration</CardTitle>
              <CardDescription>Customize the contact form labels and text.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Form Title</Label>
                  <Input
                    value={content.form.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input
                    value={content.form.buttonText}
                    onChange={(e) => updateForm({ buttonText: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Form Description</Label>
                <Input
                  value={content.form.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Name Label</Label>
                  <Input
                    value={content.form.nameLabel}
                    onChange={(e) => updateForm({ nameLabel: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Label</Label>
                  <Input
                    value={content.form.emailLabel}
                    onChange={(e) => updateForm({ emailLabel: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject Label</Label>
                  <Input
                    value={content.form.subjectLabel}
                    onChange={(e) => updateForm({ subjectLabel: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message Label</Label>
                  <Input
                    value={content.form.messageLabel}
                    onChange={(e) => updateForm({ messageLabel: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
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
              <CardTitle className="text-lg font-black italic">Contact Preview</CardTitle>
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
                    {content.header.titlePrefix}{" "}
                    <span className="text-sky-500">{content.header.titleHighlight}</span>
                    {content.header.titleSuffix}
                  </h1>
                  <p className="text-muted-foreground">{content.header.description}</p>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-muted/30">
                  <Badge className="bg-green-500/20 text-green-500 border-none">
                    {content.statusNode.status}
                  </Badge>
                  <span className="font-medium">{content.statusNode.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {content.statusNode.latencyText}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {content.contactInfo.map((item) => {
                    const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[item.iconName] || MapPin;
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-border/40 flex gap-3 items-center"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            item.color?.replace?.("text-", "bg-") + "/20",
                            item.color
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-6 rounded-2xl border border-border/40 bg-muted/20 space-y-4">
                  <h2 className="text-xl font-bold">{content.form.title}</h2>
                  <p className="text-sm text-muted-foreground">{content.form.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-muted-foreground">{content.form.nameLabel}</Label>
                      <Input readOnly className="rounded-lg mt-1 bg-muted/50" placeholder="—" />
                    </div>
                    <div>
                      <Label className="text-muted-foreground">{content.form.emailLabel}</Label>
                      <Input readOnly className="rounded-lg mt-1 bg-muted/50" placeholder="—" />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">{content.form.subjectLabel}</Label>
                      <Input readOnly className="rounded-lg mt-1 bg-muted/50" placeholder="—" />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">{content.form.messageLabel}</Label>
                      <Textarea readOnly className="rounded-lg mt-1 bg-muted/50" rows={2} placeholder="—" />
                    </div>
                  </div>
                  <Button className="rounded-xl w-full">{content.form.buttonText}</Button>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>{content.footer.encryptedText}</span>
                  <span>{content.footer.agentText}</span>
                </div>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
