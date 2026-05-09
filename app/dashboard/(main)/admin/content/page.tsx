"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Layout,
  FileText,
  Image as ImageIcon,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Globe,
  RefreshCcw,
  CheckCircle2,
  Clock,
  Save,
  Upload,
  Download,
  History,
  Menu,
  Check,
  Sparkles,
  Code,
  FileJson,
  Copy,
  X,
  AlertCircle,
  Settings,
  Layers,
  Home,
  Briefcase,
  Mail,
  ShieldCheck,
  ScrollText,
  MessageSquare,
  Link as LinkIcon,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileDown,
  Undo,
  Redo,
  EyeOff,
  Palette,
  Monitor,
  Tablet,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  usePageContent,
  useUpdatePageContent,
  useAllPages,
  usePublishPageContent,
  useGenerateWithAI,
} from "@/lib/api/content-queries";
import { CMS_SCHEMA, PageKey } from "@/lib/cms/schema";
import { ImageUploader, MultiImageUploader } from "@/components/cms/image-uploader";
import { RichTextEditor, MarkdownPreview } from "@/components/cms/rich-text-editor";
import { Logo } from "@/components/ui/logo";

// Type definitions
type FieldType = "text" | "textarea" | "richtext" | "image" | "boolean" | "tags" | "group" | "array" | "number";

interface SchemaField {
  name: string;
  label: string;
  type: FieldType;
  fields?: SchemaField[];
  itemLabel?: string;
}

interface SchemaSection {
  id: string;
  label: string;
  fields: SchemaField[];
}

interface PageSchema {
  label: string;
  icon: string;
  sections: SchemaSection[];
}

// Generate empty template for a field
function generateFieldTemplate(field: SchemaField): any {
  switch (field.type) {
    case "text":
    case "textarea":
    case "richtext":
    case "image":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "tags":
      return [];
    case "group":
      const groupObj: Record<string, any> = {};
      field.fields?.forEach((subField) => {
        groupObj[subField.name] = generateFieldTemplate(subField);
      });
      return groupObj;
    case "array":
      if (field.fields && field.fields.length > 0) {
        const sampleItem: Record<string, any> = {};
        field.fields.forEach((itemField) => {
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
function generatePageTemplate(pageKey: PageKey): Record<string, any> {
  const schema = CMS_SCHEMA[pageKey] as PageSchema;
  const template: Record<string, any> = {};

  schema?.sections?.forEach((section) => {
    if (section.id === "_root" || !section.id) {
      section.fields?.forEach((field) => {
        template[field.name] = generateFieldTemplate(field);
      });
    } else {
      template[section.id] = {};
      section.fields?.forEach((field) => {
        template[section.id][field.name] = generateFieldTemplate(field);
      });
    }
  });

  return template;
}

// Icon mapping
const getSchemaIcon = (iconName: string): React.ElementType => {
  const icons: Record<string, React.ElementType> = {
    Home: Home,
    Users: Globe,
    Briefcase: Briefcase,
    History: Clock,
    Mail: Mail,
    Zap: Sparkles,
    Link: LinkIcon,
    FileText: FileText,
    Settings: Settings,
    Globe: Globe,
    MessageSquare: MessageSquare,
    ShieldCheck: ShieldCheck,
    ScrollText: ScrollText,
  };
  return icons[iconName] || FileText;
};

// Content page public paths
const CONTENT_PAGE_PUBLIC_PATH: Partial<Record<PageKey, string | null>> = {
  home: "/",
  about: "/about",
  services: "/services",
  terms: "/terms",
  privacy: "/privacy",
  support: "/support",
  settings: null,
  global: null,
};

// Page card component
function PageCard({
  pageKey,
  schema,
  isSelected,
  onClick,
}: {
  pageKey: PageKey;
  schema: PageSchema;
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = getSchemaIcon(schema.icon);
  const publicPath = CONTENT_PAGE_PUBLIC_PATH[pageKey];

  const totalFields = schema.sections?.reduce((acc: number, s: SchemaSection) => acc + (s?.fields?.length || 0), 0) || 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300",
        isSelected
          ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/10"
          : "border-border bg-card hover:border-primary/40 hover:shadow-md"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
          isSelected
            ? "bg-primary text-white shadow-lg shadow-primary/30"
            : "bg-primary/10 text-primary group-hover:bg-primary/20"
        )}>
          <Icon className="w-7 h-7" />
        </div>
        {publicPath && (
          <Link
            href={publicPath}
            target="_blank"
            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="w-4 h-4" />
          </Link>
        )}
      </div>
      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{schema.label}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {schema.sections?.length || 0} sections • {totalFields} fields
      </p>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs font-medium">
          {schema.sections?.length || 0} sections
        </Badge>
        {isSelected && (
          <Badge className="text-xs bg-primary text-white">
            <Check className="w-3 h-3 mr-1" />
            Editing
          </Badge>
        )}
      </div>
    </motion.div>
  );
}

// Field editor component
function FieldEditor({
  field,
  value,
  onChange,
  onGenerate,
  isGenerating,
  depth = 0,
}: {
  field: SchemaField;
  value: any;
  onChange: (value: any) => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
  depth?: number;
}) {
  const renderInput = () => {
    switch (field.type) {
      case "text":
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="h-11 rounded-xl bg-background/50 border-border/50 focus:border-primary/50"
          />
        );
      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            rows={4}
            className="rounded-xl bg-background/50 border-border/50 focus:border-primary/50 resize-none"
          />
        );
      case "richtext":
        return (
          <div className="space-y-2">
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-9">
                <TabsTrigger value="edit" className="text-xs rounded-lg">Edit</TabsTrigger>
                <TabsTrigger value="preview" className="text-xs rounded-lg">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-2">
                <RichTextEditor
                  value={value || ""}
                  onChange={onChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  minHeight={150}
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-2">
                <div className="min-h-[150px] rounded-xl border bg-background/50 p-4">
                  {value ? (
                    <MarkdownPreview content={value} />
                  ) : (
                    <p className="text-muted-foreground text-sm">Preview will appear here...</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
      case "image":
        return (
          <ImageUploader
            value={value || ""}
            onChange={onChange}
            label={field.label}
            maxSize={10}
            previewClassName="aspect-video"
          />
        );
      case "boolean":
        return (
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
            <Label className="font-normal">{field.label}</Label>
            <Switch
              checked={value || false}
              onCheckedChange={onChange}
            />
          </div>
        );
      case "tags":
        const tags = Array.isArray(value) ? value : [];
        const [tagInput, setTagInput] = useState("");
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="px-3 py-1.5 rounded-lg gap-1.5">
                  {tag}
                  <button
                    onClick={() => onChange(tags.filter((_: any, i: number) => i !== idx))}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag..."
                className="h-10 rounded-xl bg-background/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    e.preventDefault();
                    onChange([...tags, tagInput.trim()]);
                    setTagInput("");
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 rounded-xl"
                onClick={() => {
                  if (tagInput.trim()) {
                    onChange([...tags, tagInput.trim()]);
                    setTagInput("");
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
        );
      case "number":
        return (
          <Input
            type="number"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : 0)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="h-11 rounded-xl bg-background/50 border-border/50"
          />
        );
      case "group":
        const groupValue = value || {};
        return (
          <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border">
            {field.fields?.map((subField) => (
              <FieldEditor
                key={subField.name}
                field={subField}
                value={groupValue[subField.name]}
                onChange={(v) => onChange({ ...groupValue, [subField.name]: v })}
                depth={depth + 1}
              />
            ))}
          </div>
        );
      case "array":
        const arrayValue = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{arrayValue.length} items</span>
            </div>
            {arrayValue.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-3 items-start p-4 rounded-xl bg-muted/30 border group">
                {field.fields ? (
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {field.itemLabel || "Item"} {idx + 1}
                      </span>
                    </div>
                    {field.fields.map((subField) => (
                      <FieldEditor
                        key={subField.name}
                        field={subField}
                        value={item[subField.name]}
                        onChange={(v) => {
                          const newArray = [...arrayValue];
                          newArray[idx] = { ...item, [subField.name]: v };
                          onChange(newArray);
                        }}
                        depth={depth + 1}
                      />
                    ))}
                  </div>
                ) : (
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newArray = [...arrayValue];
                      newArray[idx] = e.target.value;
                      onChange(newArray);
                    }}
                    className="h-10 rounded-xl bg-background/50 flex-1"
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-destructive hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onChange(arrayValue.filter((_: any, i: number) => i !== idx))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl h-10 border-dashed"
              onClick={() => {
                const newItem = field.fields
                  ? field.fields.reduce((acc, f) => ({ ...acc, [f.name]: generateFieldTemplate(f) }), {})
                  : "";
                onChange([...arrayValue, newItem]);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {field.itemLabel || "Item"}
            </Button>
          </div>
        );
      default:
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="h-11 rounded-xl bg-background/50 border-border/50"
          />
        );
    }
  };

  return (
    <div className={cn("space-y-2", depth > 0 && "")}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          {field.label}
        </label>
        {onGenerate && field.type !== "boolean" && field.type !== "array" && field.type !== "group" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-3 text-primary hover:bg-primary/10 rounded-lg"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            <Sparkles className={cn("w-3.5 h-3.5 mr-1.5", isGenerating && "animate-pulse")} />
            AI Generate
          </Button>
        )}
      </div>
      {renderInput()}
    </div>
  );
}

// Section editor with collapsible
function SectionEditor({
  section,
  content,
  onChange,
  onGenerateField,
  generatingField,
}: {
  section: SchemaSection;
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
  onGenerateField: (fieldName: string, field: SchemaField) => void;
  generatingField: string | null;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const sectionContent = section.id === "_root" || !section.id
    ? content
    : content[section.id] || {};

  const handleFieldChange = (fieldName: string, value: any) => {
    if (section.id === "_root" || !section.id) {
      onChange({ ...content, [fieldName]: value });
    } else {
      onChange({
        ...content,
        [section.id]: { ...sectionContent, [fieldName]: value }
      });
    }
  };

  return (
    <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden shadow-sm">
      <CardHeader
        className="cursor-pointer px-6 py-4 border-b border-border/50 bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/60 hover:to-muted/40 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
            <CardTitle className="text-base font-semibold">{section.label}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            {section.fields?.length || 0} fields
          </Badge>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="p-6 space-y-6">
              {section.fields?.map((field) => (
                <FieldEditor
                  key={field.name}
                  field={field}
                  value={sectionContent[field.name]}
                  onChange={(v) => handleFieldChange(field.name, v)}
                  onGenerate={() => onGenerateField(field.name, field)}
                  isGenerating={generatingField === field.name}
                />
              ))}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// JSON Import Dialog
function JsonImportDialog({
  open,
  onClose,
  onImport,
  pageKey,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (data: Record<string, any>) => void;
  pageKey: PageKey | null;
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

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonText(text);
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Failed to paste from clipboard");
    }
  };

  const handleLoadTemplate = () => {
    if (pageKey) {
      const template = generatePageTemplate(pageKey);
      setJsonText(JSON.stringify(template, null, 2));
      toast.success("Template loaded");
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
            Paste, upload, or load a template to import content data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
              Paste from Clipboard
            </Button>
            {pageKey && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={handleLoadTemplate}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Load Template
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileUpload}
          />

          <div className="space-y-2">
            <label className="text-sm font-semibold">JSON Content</label>
            <Textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setError(null);
              }}
              placeholder='{\n  "title": "My Title",\n  "description": "My Description",\n  ...'
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
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto rounded-xl">
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!jsonText.trim()} className="w-full sm:w-auto rounded-xl">
            <Check className="w-4 h-4 mr-2" />
            Import Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// JSON Export Dialog
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
          <div className="relative">
            <pre className="p-4 rounded-xl bg-muted/30 border overflow-auto max-h-[300px] sm:max-h-[400px] text-xs sm:text-sm font-mono">
              {jsonText}
            </pre>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCopy} className="w-full sm:w-auto rounded-xl">
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
          <Button onClick={handleDownload} className="w-full sm:w-auto rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Download File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Template Dialog
function TemplateDialog({
  open,
  onClose,
  pageKeys,
}: {
  open: boolean;
  onClose: () => void;
  pageKeys: PageKey[];
}) {
  const handleDownloadTemplate = (pageKey: PageKey) => {
    const template = generatePageTemplate(pageKey);
    const schema = CMS_SCHEMA[pageKey] as PageSchema;
    const jsonText = JSON.stringify(template, null, 2);

    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pageKey}-template.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Template for ${schema?.label || pageKey} downloaded`);
  };

  const handleDownloadAll = () => {
    pageKeys.forEach((pageKey, idx) => {
      setTimeout(() => handleDownloadTemplate(pageKey), idx * 100);
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileDown className="w-5 h-5 text-primary" />
            Download Empty Templates
          </DialogTitle>
          <DialogDescription className="text-sm">
            Download JSON templates with the correct structure for each page.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4 max-h-[400px] overflow-y-auto">
          {pageKeys.map((pageKey) => {
            const schema = CMS_SCHEMA[pageKey] as PageSchema;
            const Icon = getSchemaIcon(schema?.icon || "FileText");
            return (
              <div
                key={pageKey}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{schema?.label || pageKey}</p>
                    <p className="text-xs text-muted-foreground">{pageKey}.json</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadTemplate(pageKey)}
                  className="rounded-lg"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto rounded-xl">
            Close
          </Button>
          <Button onClick={handleDownloadAll} className="w-full sm:w-auto rounded-xl">
            <FileDown className="w-4 h-4 mr-2" />
            Download All Templates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Content Editor
export default function ContentEditorPage() {
  const [selectedPage, setSelectedPage] = useState<PageKey | null>(null);
  const [localContent, setLocalContent] = useState<Record<string, any>>({});
  const [isJsonImportOpen, setIsJsonImportOpen] = useState(false);
  const [isJsonExportOpen, setIsJsonExportOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [generatingField, setGeneratingField] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<Record<string, any>[]>([]);
  const [redoStack, setRedoStack] = useState<Record<string, any>[]>([]);

  const { data: pageContent, isLoading } = usePageContent(selectedPage || "home");
  const updateMutation = useUpdatePageContent();
  const generateMutation = useGenerateWithAI();

  // Sync local content from backend
  useEffect(() => {
    if (pageContent?.content) {
      setLocalContent(pageContent.content);
      setUndoStack([]);
      setRedoStack([]);
    }
  }, [pageContent]);

  const handleContentChange = (newContent: Record<string, any>) => {
    setUndoStack((prev) => [...prev.slice(-19), localContent]);
    setRedoStack([]);
    setLocalContent(newContent);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const prev = undoStack[undoStack.length - 1];
      setRedoStack((prevStack) => [...prevStack, localContent]);
      setUndoStack((prevStack) => prevStack.slice(0, -1));
      setLocalContent(prev);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];
      setUndoStack((prevStack) => [...prevStack, localContent]);
      setRedoStack((prevStack) => prevStack.slice(0, -1));
      setLocalContent(next);
    }
  };

  const handleGenerateField = async (fieldName: string, field: SchemaField) => {
    setGeneratingField(fieldName);
    try {
      const res = await generateMutation.mutateAsync({
        prompt: `Generate ${field.label} for a ${selectedPage} page.`,
        fieldType: field.type === "richtext" || field.type === "textarea" ? "description" : "title",
        pageKey: selectedPage || "home",
      });
      setUndoStack((prev) => [...prev.slice(-19), localContent]);
      setLocalContent((prev) => ({
        ...prev,
        [fieldName]: res.text,
      }));
      toast.success("Content generated successfully");
    } catch {
      toast.error("Failed to generate content");
    } finally {
      setGeneratingField(null);
    }
  };

  const handleSave = () => {
    if (!selectedPage) return;

    updateMutation.mutate(
      {
        pageKey: selectedPage,
        content: localContent,
      },
      {
        onSuccess: () => {
          toast.success("Content saved successfully");
        },
        onError: () => {
          toast.error("Failed to save content");
        },
      }
    );
  };

  const handleJsonImport = (data: Record<string, any>) => {
    setUndoStack((prev) => [...prev.slice(-19), localContent]);
    setLocalContent(data);
  };

  const pageKeys = Object.keys(CMS_SCHEMA) as PageKey[];

  if (!selectedPage) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Select a page to edit its content and settings.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsTemplateOpen(true)} variant="outline" size="sm" className="rounded-xl">
              <FileDown className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button onClick={() => setIsJsonImportOpen(true)} variant="outline" size="sm" className="rounded-xl">
              <FileJson className="w-4 h-4 mr-2" />
              Import JSON
            </Button>
          </div>
        </div>

        {/* Page Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pageKeys.map((pageKey) => {
            const schema = CMS_SCHEMA[pageKey] as PageSchema;
            return (
              <PageCard
                key={pageKey}
                pageKey={pageKey}
                schema={schema}
                isSelected={false}
                onClick={() => setSelectedPage(pageKey)}
              />
            );
          })}
        </div>

        <JsonImportDialog
          open={isJsonImportOpen}
          onClose={() => setIsJsonImportOpen(false)}
          onImport={(data) => {
            toast.info("Select a page first to import content");
            setIsJsonImportOpen(false);
          }}
          pageKey={null}
        />

        <TemplateDialog
          open={isTemplateOpen}
          onClose={() => setIsTemplateOpen(false)}
          pageKeys={pageKeys}
        />
      </div>
    );
  }

  const schema = CMS_SCHEMA[selectedPage] as PageSchema;
  const sections = schema?.sections || [];
  const totalFields = sections.reduce((acc: number, s: SchemaSection) => acc + (s.fields?.length || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedPage(null)}
            className="rounded-xl shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold">{schema?.label || "Content Editor"}</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {sections.length} sections • {totalFields} fields
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              title="Undo"
              className="rounded-lg"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              title="Redo"
              className="rounded-lg"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsJsonImportOpen(true)}
            className="rounded-xl"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsJsonExportOpen(true)}
            className="rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          {CONTENT_PAGE_PUBLIC_PATH[selectedPage] && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="rounded-xl"
            >
              <Link href={CONTENT_PAGE_PUBLIC_PATH[selectedPage]!} target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Link>
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending} className="rounded-xl">
            {updateMutation.isPending ? (
              <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Section Editors */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-30" />
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section: SchemaSection) => (
            <SectionEditor
              key={section.id}
              section={section}
              content={localContent}
              onChange={handleContentChange}
              onGenerateField={handleGenerateField}
              generatingField={generatingField}
            />
          ))}
        </div>
      )}

      {/* JSON Import/Export Dialogs */}
      <JsonImportDialog
        open={isJsonImportOpen}
        onClose={() => setIsJsonImportOpen(false)}
        onImport={handleJsonImport}
        pageKey={selectedPage}
      />

      <JsonExportDialog
        open={isJsonExportOpen}
        onClose={() => setIsJsonExportOpen(false)}
        data={localContent}
        pageName={schema?.label || "content"}
      />
    </div>
  );
}