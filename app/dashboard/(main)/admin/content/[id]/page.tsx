"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Save, Eye, Globe, RefreshCcw, Check, Clock,
  Image as ImageIcon, Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
  Sparkles, Upload, Download, FileJson, Copy, FileDown, X, AlertCircle
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
import { usePageContent, useUpdatePageContent, usePublishPageContent, useUploadFile, useGenerateWithAI } from "@/lib/api/content-queries";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AIChatbox } from "@/components/dashboard/ai-chatbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Generate empty template for a field
function generateFieldTemplate(field: any): any {
  switch (field.type) {
    case "text":
    case "textarea":
    case "richtext":
    case "image":
    case "video":
      return "";
    case "boolean":
      return false;
    case "tags":
      return [];
    case "number":
      return 0;
    case "group":
      const groupObj: Record<string, any> = {};
      field.fields?.forEach((subField: any) => {
        groupObj[subField.name] = generateFieldTemplate(subField);
      });
      return groupObj;
    case "array":
      // Generate a sample item to show the structure
      if (field.fields && field.fields.length > 0) {
        const sampleItem: Record<string, any> = {};
        field.fields.forEach((itemField: any) => {
          sampleItem[itemField.name] = generateFieldTemplate(itemField);
        });
        return [sampleItem];
      }
      return [];
    default:
      return "";
  }
}

// Generate empty template for entire page
function generatePageTemplate(schema: any): Record<string, any> {
  const template: Record<string, any> = {};

  schema?.sections?.forEach((section: any) => {
    if (section.id === "_root" || !section.id) {
      section.fields?.forEach((field: any) => {
        template[field.name] = generateFieldTemplate(field);
      });
    } else {
      template[section.id] = {};
      section.fields?.forEach((field: any) => {
        template[section.id][field.name] = generateFieldTemplate(field);
      });
    }
  });

  return template;
}

// JSON Import Dialog (Responsive)
function JsonImportDialog({
  open,
  onClose,
  onImport,
  schema,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (data: Record<string, any>) => void;
  schema: any;
}) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (typeof parsed !== "object" || parsed === null) {
        setError("JSON must be an object");
        return;
      }
      onImport(parsed);
      onClose();
      setJsonText("");
      setError(null);
      toast.success("Content imported successfully");
    } catch {
      setError("Invalid JSON format");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonText(text);
    };
    reader.readAsText(file);
  };

  const handleLoadTemplate = () => {
    const template = generatePageTemplate(schema);
    setJsonText(JSON.stringify(template, null, 2));
    toast.success("Empty template loaded");
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonText(text);
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Failed to paste from clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileJson className="w-5 h-5 text-primary" />
            Import Content from JSON
          </DialogTitle>
          <DialogDescription className="text-sm">
            Paste, upload, or load an empty template to import content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={handlePasteFromClipboard}
            >
              <Copy className="w-4 h-4 mr-2" />
              Paste
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={handleLoadTemplate}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Load Template
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* JSON Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">JSON Content</label>
            <Textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setError(null);
              }}
              placeholder='{\n  "title": "My Title",\n  "description": "My Description"\n}'
              rows={12}
              className="font-mono text-xs sm:text-sm rounded-xl bg-muted/30"
            />
            {error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!jsonText.trim()} className="w-full sm:w-auto">
            <Check className="w-4 h-4 mr-2" />
            Import Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// JSON Export Dialog (Responsive)
function JsonExportDialog({
  open,
  onClose,
  data,
  pageName,
}: {
  open: boolean;
  onClose: () => void;
  data: Record<string, any>;
  pageName: string;
}) {
  const jsonText = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pageName.toLowerCase().replace(/\s+/g, "-")}-content.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Download className="w-5 h-5 text-primary" />
            Export Content as JSON
          </DialogTitle>
          <DialogDescription className="text-sm">
            Copy or download the content data in JSON format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <pre className="p-4 rounded-xl bg-muted/30 border border-border overflow-auto max-h-[300px] sm:max-h-[400px] text-xs sm:text-sm font-mono">
            {jsonText}
          </pre>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCopy} className="w-full sm:w-auto">
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
          <Button onClick={handleDownload} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Download File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  const generateMutation = useGenerateWithAI();

  // Local State
  const [formData, setFormData] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [generatingField, setGeneratingField] = useState<string | null>(null);
  const [isJsonImportOpen, setIsJsonImportOpen] = useState(false);
  const [isJsonExportOpen, setIsJsonExportOpen] = useState(false);

  // Sync server data to local state
  useEffect(() => {
    if (serverContent && serverContent.content) {
      setFormData(serverContent.content);
    } else if (serverContent && !formData) {
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 text-center px-4">The content key "{pageKey}" is not in the CMS schema.</p>
        <Link href="/dashboard/admin/content">
          <Button>Return to Content Management</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <RefreshCcw className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-red-500">Error Loading Content</h1>
        <p className="text-muted-foreground text-sm text-center">Could not load this page from the server.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/content">Back to Content</Link>
          </Button>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
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

  const handleJsonImport = (data: Record<string, any>) => {
    setFormData(data);
    setIsDirty(true);
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
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <Button variant="ghost" size="icon" asChild className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl border shrink-0">
                <Link href="/dashboard/admin/content">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {schema.label} Editor
                  </h1>
                  <Badge className={cn(
                    "text-xs font-semibold px-2 py-0.5",
                    serverContent?.status === "published" ? "bg-primary/20 text-primary" : "bg-amber-500/20 text-amber-500"
                  )}>
                    {serverContent?.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:flex items-center gap-2">
                  <span className="font-mono">{pageKey}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  {updateMutation.isPending ? (
                    <span className="text-primary animate-pulse flex items-center gap-1">
                      <RefreshCcw className="w-3 h-3 animate-spin" /> Saving...
                    </span>
                  ) : (
                    <span>Last saved: {new Date(serverContent?.updatedAt || Date.now()).toLocaleTimeString()}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsJsonImportOpen(true)}
                className="hidden sm:inline-flex"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsJsonExportOpen(true)}
                className="hidden sm:inline-flex"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={!isDirty || updateMutation.isPending}
                className="gap-2"
              >
                {updateMutation.isPending ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span className="hidden sm:inline">Save Draft</span>
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={publishMutation.isPending}
                className="gap-2"
              >
                {publishMutation.isPending ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Globe className="w-4 h-4" />}
                <span className="hidden sm:inline">Publish</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <div className="mx-auto space-y-6 sm:space-y-8 max-w-4xl">
          {/* Render Sections based on Schema */}
          {schema.sections.map((section: any) => {
            const sectionData = section.id === "_root" ? formData : formData?.[section.id];
            const buildContext = () => {
              try {
                const ctx: Record<string, unknown> = { page: pageKey, section: section.id };
                if (formData) ctx.existing = truncateForContext(formData, 1800);
                return JSON.stringify(ctx);
              } catch { return ""; }
            };
            const fillableFields = collectTextFields(section.fields || [], sectionData, section.id);
            return (
              <Card key={section.id} className="border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden group/card hover:border-border transition-all duration-300">
                <CardHeader className="p-4 sm:p-6 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-base sm:text-lg font-semibold">{section.label}</CardTitle>
                    <div className="flex items-center gap-2">
                      {fillableFields.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2 text-primary border-primary/30 hover:bg-primary/10 text-xs"
                          disabled={generatingField !== null}
                          onClick={async () => {
                            setGeneratingField(`section-${section.id}`);
                            let filled = 0;
                            for (const { path, field, getValue } of fillableFields) {
                              const v = getValue();
                              if (isEmptyValue(v, field.type)) {
                                try {
                                  const res = await generateMutation.mutateAsync({
                                    prompt: `Generate ${field.label} for the ${pageKey} page, ${section.label} section.`,
                                    fieldType: getAIFieldType(field.name, field.label),
                                    pageKey,
                                    sectionId: section.id,
                                    fieldName: field.name,
                                    context: buildContext(),
                                  });
                                  const val = field.type === "tags" ? res.text.split(",").map((s: string) => s.trim()).filter(Boolean) : res.text;
                                  updateField(path, val);
                                  filled++;
                                } catch { /* continue */ }
                              }
                            }
                            setGeneratingField(null);
                            if (filled > 0) toast.success(`Generated content for ${filled} field(s)`);
                          }}
                        >
                          <Sparkles className={cn("w-3.5 h-3.5", generatingField === `section-${section.id}` && "animate-pulse")} />
                          {generatingField === `section-${section.id}` ? "Generating..." : "AI Fill"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-6">
                  {section.fields?.map((field: any) => {
                    const fieldId = `${section.id}-${field.name}`;
                    return (
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
                        pageKey={pageKey}
                        sectionId={section.id}
                        sectionLabel={section.label}
                        onGenerateAI={async (opts: { prompt?: string; fieldType?: AIFieldType }) => {
                          const res = await generateMutation.mutateAsync({
                            prompt: opts.prompt || `Generate ${field.label} for the ${pageKey} page, ${section.label} section.`,
                            fieldType: opts.fieldType,
                            pageKey,
                            sectionId: section.id,
                            fieldName: field.name,
                            context: buildContext(),
                          });
                          return res.text;
                        }}
                        generatingField={generatingField}
                        fieldId={fieldId}
                        setGeneratingField={setGeneratingField}
                      />
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dialogs */}
      <JsonImportDialog
        open={isJsonImportOpen}
        onClose={() => setIsJsonImportOpen(false)}
        onImport={handleJsonImport}
        schema={schema}
      />

      <JsonExportDialog
        open={isJsonExportOpen}
        onClose={() => setIsJsonExportOpen(false)}
        data={formData || {}}
        pageName={schema.label || pageKey}
      />

      <AIChatbox pageKey={pageKey} />
    </div>
  );
}

type AIFieldType = 'meta_title' | 'meta_description' | 'keywords' | 'title' | 'description' | 'tags';

function truncateForContext(obj: any, maxChars: number): any {
  try {
    const s = typeof obj === "string" ? obj : JSON.stringify(obj);
    return s.length <= maxChars ? obj : s.slice(0, maxChars) + "...";
  } catch { return {}; }
}

function isEmptyValue(v: unknown, type: string): boolean {
  if (v == null) return true;
  if (type === "tags" && Array.isArray(v)) return v.length === 0;
  if (typeof v === "string") return v.trim() === "";
  return false;
}

function collectTextFields(fields: any[], sectionData: any, sectionId: string, basePath: string[] = []): { path: string[]; field: any; getValue: () => unknown }[] {
  const out: { path: string[]; field: any; getValue: () => unknown }[] = [];
  for (const f of fields) {
    if (f.type === "text" || f.type === "textarea" || f.type === "tags") {
      const path = [sectionId, ...basePath, f.name];
      const getVal = () => sectionData?.[f.name];
      out.push({ path, field: f, getValue: getVal });
    } else if (f.type === "group" && f.fields) {
      out.push(...collectTextFields(f.fields, sectionData?.[f.name] || {}, sectionId, [...basePath, f.name]));
    } else if (f.type === "array" && f.fields) {
      const arr = sectionData?.[f.name];
      if (Array.isArray(arr)) {
        arr.forEach((_: any, i: number) => {
          out.push(...collectTextFields(f.fields, arr[i] || {}, sectionId, [...basePath, f.name, String(i)]));
        });
      }
    }
  }
  return out;
}

function getAIFieldType(fieldName: string, fieldLabel: string): AIFieldType {
  const n = (fieldName || '').toLowerCase();
  const l = (fieldLabel || '').toLowerCase();
  if (n.includes('title') || l.includes('title')) return 'meta_title';
  if (n.includes('description') || l.includes('description')) return 'meta_description';
  if (n.includes('keyword') || n.includes('tag') || l.includes('keyword')) return 'keywords';
  return 'description';
}

// --- Field Renderers ---

function FieldRenderer({
  field,
  value,
  onChange,
  path,
  pageKey,
  sectionId,
  sectionLabel,
  onGenerateAI,
  generatingField,
  fieldId,
  setGeneratingField,
}: {
  field: any;
  value: any;
  onChange: (val: any) => void;
  path: string[];
  pageKey?: string;
  sectionId?: string;
  sectionLabel?: string;
  onGenerateAI?: (opts: { prompt?: string; fieldType?: AIFieldType }) => Promise<string>;
  generatingField?: string | null;
  fieldId?: string;
  setGeneratingField?: (id: string | null) => void;
}) {
  const isLoading = !!(fieldId && generatingField === fieldId);
  const showAI = onGenerateAI && (field.type === 'text' || field.type === 'textarea' || field.type === 'rich-text' || field.type === 'tags');
  const handleAI = async () => {
    if (!onGenerateAI) return;
    if (fieldId && setGeneratingField) setGeneratingField(fieldId);
    try {
      const text = await onGenerateAI({
        prompt: `Generate ${field.label}${pageKey ? ` for the ${pageKey} page` : ''}${sectionLabel ? `, ${sectionLabel} section` : ''}.`,
        fieldType: getAIFieldType(field.name, field.label),
      });
      if (field.type === 'tags') {
        onChange(text.split(',').map((s: string) => s.trim()).filter(Boolean));
      } else {
        onChange(text);
      }
      toast.success('Content generated');
    } catch {
      // Error already shown by mutation
    } finally {
      if (fieldId && setGeneratingField) setGeneratingField(null);
    }
  };

  if (field.type === 'text') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          {showAI && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 gap-1 text-primary hover:bg-primary/10 rounded-lg text-xs"
              onClick={handleAI}
              disabled={isLoading}
            >
              <Sparkles className={cn("w-3 h-3", isLoading && "animate-pulse")} />
              {isLoading ? "Generating..." : "AI Generate"}
            </Button>
          )}
        </div>
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 rounded-xl bg-background/50"
          placeholder={`Enter ${field.label.toLowerCase()}...`}
        />
      </div>
    );
  }

  if (field.type === 'number') {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{field.label}</Label>
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-11 rounded-xl"
        />
      </div>
    );
  }

  if (field.type === 'textarea' || field.type === 'rich-text') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          {showAI && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 gap-1 text-primary hover:bg-primary/10 rounded-lg text-xs"
              onClick={handleAI}
              disabled={isLoading}
            >
              <Sparkles className={cn("w-3 h-3", isLoading && "animate-pulse")} />
              {isLoading ? "Generating..." : "AI Generate"}
            </Button>
          )}
        </div>
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px] rounded-xl text-sm"
          placeholder={`Enter ${field.label.toLowerCase()} content...`}
        />
        {field.type === 'rich-text' && <p className="text-xs text-muted-foreground">HTML tags supported</p>}
      </div>
    );
  }

  if (field.type === 'boolean') {
    return (
      <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50">
        <Label className="text-sm font-medium">{field.label}</Label>
        <Switch checked={!!value} onCheckedChange={onChange} />
      </div>
    );
  }

  if (field.type === 'image' || field.type === 'video') {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{field.label}</Label>
        <MediaUploader
          value={value}
          onChange={onChange}
          type={field.type}
        />
      </div>
    );
  }

  if (field.type === 'tags') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          {showAI && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 gap-1 text-primary hover:bg-primary/10 rounded-lg text-xs"
              onClick={handleAI}
              disabled={isLoading}
            >
              <Sparkles className={cn("w-3 h-3", isLoading && "animate-pulse")} />
              {isLoading ? "Generating..." : "AI Generate"}
            </Button>
          )}
        </div>
        <Input
          value={Array.isArray(value) ? value.join(', ') : (value || '')}
          onChange={(e) => onChange(e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
          className="h-11 rounded-xl"
          placeholder="tag1, tag2, tag3"
        />
        <p className="text-xs text-muted-foreground">Separate tags with commas</p>
      </div>
    );
  }

  if (field.type === 'group') {
    return (
      <div className="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-4">
        <Label className="text-sm font-semibold text-primary">{field.label}</Label>
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
          <Label className="text-sm font-medium">{field.label}</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const newItem = {};
              onChange([...(value || []), newItem]);
            }}
            className="h-8 rounded-lg gap-2 text-xs"
          >
            <Plus size={14} /> Add {field.itemLabel || "Item"}
          </Button>
        </div>

        <div className="space-y-3 pl-4 border-l-2 border-border/50">
          {(value || []).map((item: any, index: number) => (
            <Accordion type="single" collapsible key={index} className="bg-card/50 border border-border/50 rounded-xl overflow-hidden">
              <AccordionItem value={`item-${index}`} className="border-none">
                <div className="flex items-center p-2">
                  <div className="cursor-move p-2 text-muted-foreground"><GripVertical size={16} /></div>
                  <AccordionTrigger className="hover:no-underline py-2 pr-4 flex-1">
                    <span className="font-medium text-sm">
                      {item.title || item.name || item.id || `${field.itemLabel || "Item"} ${index + 1}`}
                    </span>
                  </AccordionTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={(e) => {
                      e.stopPropagation();
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
              No items yet. Click Add to create one.
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div className="text-sm text-muted-foreground">Unknown field type: {field.type}</div>;
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
      className="relative group border-2 border-dashed border-border/50 rounded-xl p-2 hover:border-primary/40 transition-all duration-300 bg-muted/20 w-full flex flex-col items-center justify-center min-h-[140px]"
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
        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-black/5">
          {type === 'image' ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <video src={value} className="w-full h-full object-cover" controls />
          )}

          <div className={cn(
            "absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-200",
            isHovering ? "opacity-100" : "opacity-0"
          )}>
            <p className="text-white font-medium text-xs">Click to Replace</p>
          </div>
        </div>
      ) : (
        <div className="text-center p-4">
          {uploadMutation.isPending ? (
            <RefreshCcw className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
          ) : (
            <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          )}
          <p className="text-xs font-medium text-muted-foreground">
            {uploadMutation.isPending ? "Uploading..." : `Upload ${type}`}
          </p>
        </div>
      )}
    </div>
  );
}