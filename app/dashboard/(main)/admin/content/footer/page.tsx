"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Save,
  RefreshCcw,
  Link2,
  Mail,
  Share2,
  Layout,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import { useFooterContentStore } from "@/lib/store/footer-content";
import { useFooterContent, useUpdateFooterContent } from "@/lib/api/footer-content-queries";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FooterContentEditor() {
  const {
    content,
    setContent,
    updateBranding,
    updateNewsletter,
    updateSocialLinks,
    updateColumns,
    updateBottom,
    addSocialLink,
    removeSocialLink,
    addColumn,
    removeColumn,
    addColumnLink,
    removeColumnLink,
    resetToDefaults,
  } = useFooterContentStore();

  const { data: apiContent } = useFooterContent();
  const updateMutation = useUpdateFooterContent();

  const [activeTab, setActiveTab] = useState("branding");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (apiContent && !hasHydrated.current) {
      setContent(apiContent);
      hasHydrated.current = true;
    }
  }, [apiContent, setContent]);

  if (!content) {
    return (
      <div className="p-20 text-center font-black animate-pulse text-muted-foreground uppercase tracking-widest">
        Initializing Footer Forge...
      </div>
    );
  }

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

  const handleAddSocialLink = () => {
    addSocialLink({
      id: `social-${Date.now()}`,
      icon: "Link2",
      href: "#",
      label: "New Link",
    });
    toast.success("Social link added");
  };

  const handleAddColumn = () => {
    addColumn({
      id: `col-${Date.now()}`,
      title: "New Column",
      links: [{ id: `link-${Date.now()}`, label: "Link", href: "/" }],
    });
    toast.success("Column added");
  };

  const handleAddColumnLink = (columnId: string) => {
    addColumnLink(columnId, {
      id: `link-${Date.now()}`,
      label: "New Link",
      href: "/",
    });
    toast.success("Link added");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" asChild className="h-12 w-12 rounded-2xl">
              <Link href="/dashboard/admin/content">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <CardTitle className="text-2xl font-black italic tracking-tight">
                Footer (Global)
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-widest mt-0.5">
                Appears on every marketing page
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-xl font-bold gap-2 border-border/50 hover:bg-muted/50"
              onClick={() =>
                openConfirm(
                  "Reset to defaults",
                  "Reset all footer content to defaults? This cannot be undone.",
                  () => {
                    resetToDefaults();
                    toast.success("Footer reset to defaults");
                  }
                )
              }
            >
              <RefreshCcw className="w-4 h-4" /> Reset
            </Button>
            <Button
              className="rounded-xl font-bold gap-2 bg-primary text-primary-foreground hover:opacity-90"
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <RefreshCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}{" "}
              {updateMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "branding", label: "Branding", icon: Layout },
            { id: "newsletter", label: "Newsletter", icon: Mail },
            { id: "social", label: "Social Links", icon: Share2 },
            { id: "columns", label: "Link Columns", icon: Link2 },
            { id: "bottom", label: "Copyright", icon: RefreshCcw },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              className="rounded-xl shrink-0 gap-2"
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </Button>
          ))}
        </div>

        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="space-y-6 pr-4">
            {activeTab === "branding" && (
              <Card className="border-border/50 rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="font-black italic">Branding</CardTitle>
                  <CardDescription>Footer brand name and tagline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Brand name</Label>
                    <Input
                      value={content.brandName}
                      onChange={(e) => updateBranding({ brandName: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input
                      value={content.tagline}
                      onChange={(e) => updateBranding({ tagline: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={content.description}
                      onChange={(e) => updateBranding({ description: e.target.value })}
                      className="rounded-xl min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "newsletter" && (
              <Card className="border-border/50 rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="font-black italic">Newsletter block</CardTitle>
                  <CardDescription>Subscribe section in footer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={content.newsletterTitle}
                      onChange={(e) =>
                        updateNewsletter({ newsletterTitle: e.target.value })
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={content.newsletterDescription}
                      onChange={(e) =>
                        updateNewsletter({
                          newsletterDescription: e.target.value,
                        })
                      }
                      className="rounded-xl min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Placeholder</Label>
                    <Input
                      value={content.newsletterPlaceholder}
                      onChange={(e) =>
                        updateNewsletter({
                          newsletterPlaceholder: e.target.value,
                        })
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Button text</Label>
                    <Input
                      value={content.newsletterButtonText}
                      onChange={(e) =>
                        updateNewsletter({
                          newsletterButtonText: e.target.value,
                        })
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Disclaimer (small text under form)</Label>
                    <Input
                      value={content.newsletterDisclaimer}
                      onChange={(e) =>
                        updateNewsletter({
                          newsletterDisclaimer: e.target.value,
                        })
                      }
                      className="rounded-xl"
                      placeholder="e.g. Unsubscribe at any time."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "bottom" && (
              <Card className="border-border/50 rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="font-black italic">Copyright & status</CardTitle>
                  <CardDescription>Bottom line text</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Copyright</Label>
                    <Input
                      value={content.copyright}
                      onChange={(e) => updateBottom({ copyright: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status text</Label>
                    <Input
                      value={content.statusText}
                      onChange={(e) => updateBottom({ statusText: e.target.value })}
                      className="rounded-xl"
                      placeholder="e.g. All Systems Operational"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "social" && (
              <Card className="border-border/50 rounded-2xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-black italic">Social links</CardTitle>
                    <CardDescription>Edit label and URL for each social link</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl gap-2"
                    onClick={handleAddSocialLink}
                  >
                    <Plus className="w-4 h-4" /> Add link
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {content.socialLinks.map((link, idx) => (
                    <div
                      key={link.id}
                      className="flex gap-2 items-center p-3 rounded-xl border border-border/50 bg-muted/20"
                    >
                      <Label className="w-24 shrink-0 text-sm font-medium">{link.label}</Label>
                      <Input
                        value={link.label}
                        onChange={(e) => {
                          const next = [...content.socialLinks];
                          next[idx] = { ...next[idx], label: e.target.value };
                          updateSocialLinks(next);
                        }}
                        placeholder="Label"
                        className="rounded-lg w-32"
                      />
                      <Input
                        value={link.href}
                        onChange={(e) => {
                          const next = [...content.socialLinks];
                          next[idx] = { ...next[idx], href: e.target.value };
                          updateSocialLinks(next);
                        }}
                        placeholder="https://..."
                        className="rounded-lg flex-1"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                        onClick={() => {
                          removeSocialLink(link.id);
                          toast.success("Link removed");
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === "columns" && (
              <Card className="border-border/50 rounded-2xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-black italic">Link columns</CardTitle>
                    <CardDescription>
                      Column titles and links. Add/remove columns and links.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl gap-2"
                    onClick={handleAddColumn}
                  >
                    <Plus className="w-4 h-4" /> Add column
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {content.columns.map((col, colIdx) => (
                    <div
                      key={col.id}
                      className="space-y-3 p-4 rounded-2xl border border-border/50 bg-muted/10"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <Label>Column title</Label>
                          <Input
                            value={col.title}
                            onChange={(e) => {
                              const next = content.columns.map((c, i) =>
                                i === colIdx ? { ...c, title: e.target.value } : c
                              );
                              updateColumns(next);
                            }}
                            className="rounded-xl"
                          />
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                          onClick={() => {
                            removeColumn(col.id);
                            toast.success("Column removed");
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 pl-2">
                        {col.links.map((lnk, linkIdx) => (
                          <div
                            key={lnk.id}
                            className="flex gap-2 items-center"
                          >
                            <Input
                              value={lnk.label}
                              onChange={(e) => {
                                const nextCol = { ...col };
                                nextCol.links = col.links.map((l, i) =>
                                  i === linkIdx ? { ...l, label: e.target.value } : l
                                );
                                const next = content.columns.map((c, i) =>
                                  i === colIdx ? nextCol : c
                                );
                                updateColumns(next);
                              }}
                              className="rounded-lg flex-1 max-w-[180px]"
                              placeholder="Label"
                            />
                            <Input
                              value={lnk.href}
                              onChange={(e) => {
                                const nextCol = { ...col };
                                nextCol.links = col.links.map((l, i) =>
                                  i === linkIdx ? { ...l, href: e.target.value } : l
                                );
                                const next = content.columns.map((c, i) =>
                                  i === colIdx ? nextCol : c
                                );
                                updateColumns(next);
                              }}
                              className="rounded-lg flex-1"
                              placeholder="/path"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                              onClick={() => {
                                removeColumnLink(col.id, lnk.id);
                                toast.success("Link removed");
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg gap-1.5 mt-2"
                          onClick={() => handleAddColumnLink(col.id)}
                        >
                          <Plus className="w-3.5 h-3.5" /> Add link
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
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
    </div>
  );
}
