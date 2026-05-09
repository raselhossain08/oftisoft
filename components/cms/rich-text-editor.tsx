"use client";

import { useState, useCallback, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Type,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
  onImageUpload?: () => Promise<string>;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter content...",
  className,
  minHeight = 200,
  onImageUpload,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const insertText = useCallback(
    (before: string, after: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

      onChange(newText);

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      }, 0);
    },
    [value, onChange]
  );

  const insertLineStart = useCallback(
    (prefix: string, suffix: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;

      let newText: string;
      if (suffix && selectedText) {
        // Wrap selected text with prefix and suffix
        newText = value.substring(0, lineStart) + prefix + selectedText + suffix + value.substring(end);
      } else if (suffix) {
        // Insert prefix and suffix at line start with placeholder
        newText = value.substring(0, lineStart) + prefix + value.substring(lineStart) + suffix;
      } else {
        // Just insert prefix at line start
        newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
      }

      onChange(newText);

      setTimeout(() => {
        textarea.focus();
        if (suffix && selectedText) {
          textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length + selectedText.length);
        } else {
          textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
        }
      }, 0);
    },
    [value, onChange]
  );

  const execCommand = (command: string, showUI: boolean = false, value: string = "") => {
    document.execCommand(command, showUI, value);
  };

  const handleAddLink = () => {
    if (linkUrl) {
      insertText("[", `](${linkUrl})`);
      setLinkUrl("");
      setIsLinkDialogOpen(false);
    }
  };

  const handleAddImage = async () => {
    if (onImageUpload) {
      setIsUploading(true);
      try {
        const url = await onImageUpload();
        insertText(`![Image](${url})`);
        setIsImageDialogOpen(false);
        setImageUrl("");
      } catch {
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    } else if (imageUrl) {
      insertText(`![Image](${imageUrl})`);
      setImageUrl("");
      setIsImageDialogOpen(false);
    }
  };

  const toolbarGroups = [
    {
      label: "Format",
      buttons: [
        { icon: Bold, title: "Bold (Ctrl+B)", onClick: () => insertText("**", "**") },
        { icon: Italic, title: "Italic (Ctrl+I)", onClick: () => insertText("*", "*") },
        { icon: Underline, title: "Underline", onClick: () => insertText("<u>", "</u>") },
        { icon: Strikethrough, title: "Strikethrough", onClick: () => insertText("~~", "~~") },
        { icon: Code, title: "Inline Code", onClick: () => insertText("`", "`") },
      ],
    },
    {
      label: "Headings",
      buttons: [
        {
          icon: Heading1,
          title: "Heading 1",
          onClick: () => insertLineStart("# "),
        },
        { icon: Heading2, title: "Heading 2", onClick: () => insertLineStart("## ") },
        { icon: Heading3, title: "Heading 3", onClick: () => insertLineStart("### ") },
      ],
    },
    {
      label: "Lists",
      buttons: [
        { icon: List, title: "Bullet List", onClick: () => insertLineStart("- ") },
        { icon: ListOrdered, title: "Numbered List", onClick: () => insertLineStart("1. ") },
      ],
    },
    {
      label: "Insert",
      buttons: [
        { icon: Quote, title: "Quote", onClick: () => insertLineStart("> ") },
        {
          icon: LinkIcon,
          title: "Insert Link",
          onClick: () => setIsLinkDialogOpen(true),
        },
        {
          icon: ImageIcon,
          title: "Insert Image",
          onClick: () => setIsImageDialogOpen(true),
        },
      ],
    },
    {
      label: "Alignment",
      buttons: [
        { icon: AlignLeft, title: "Align Left", onClick: () => insertLineStart("") },
        { icon: AlignCenter, title: "Align Center", onClick: () => insertLineStart("<center>", "</center>") },
        { icon: AlignRight, title: "Align Right", onClick: () => insertLineStart("<div align='right'>", "</div>") },
      ],
    },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 rounded-t-xl border border-border border-b-0 bg-muted/30">
        {toolbarGroups.map((group, groupIndex) => (
          <div key={group.label} className="flex items-center gap-0.5">
            {group.buttons.map((button) => (
              <Button
                key={button.title}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title={button.title}
                onClick={button.onClick}
              >
                <button.icon className="w-4 h-4" />
              </Button>
            ))}
            {groupIndex < toolbarGroups.length - 1 && (
              <div className="w-px h-6 bg-border mx-1" />
            )}
          </div>
        ))}
      </div>

      {/* Editor */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "rounded-none rounded-b-xl font-mono text-sm",
          "focus-visible:ring-1 focus-visible:ring-primary",
          "resize-none"
        )}
        style={{ minHeight: `${minHeight}px` }}
      />

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLink} disabled={!linkUrl}>
              Add Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {onImageUpload ? (
              <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-xl">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="rich-text-image-upload"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIsUploading(true);
                      try {
                        const url = await onImageUpload();
                        insertText(`![Image](${url})`);
                        setIsImageDialogOpen(false);
                      } catch {
                        toast.error("Failed to upload image");
                      } finally {
                        setIsUploading(false);
                      }
                    }
                  }}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isUploading}
                  onClick={() => document.getElementById("rich-text-image-upload")?.click()}
                >
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">or enter URL below</p>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            ) : (
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="rounded-xl"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddImage} disabled={!imageUrl && !onImageUpload}>
              Add Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simple Markdown preview component
export function MarkdownPreview({ content }: { content: string }) {
  const parseMarkdown = (text: string): string => {
    let html = text
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Strikethrough
      .replace(/~~(.+?)~~/g, "<del>$1</del>")
      // Code
      .replace(/`(.+?)`/g, "<code class='bg-muted px-1 py-0.5 rounded text-sm'>$1</code>")
      // Headers
      .replace(/^### (.+)$/gm, "<h3 class='text-lg font-semibold mt-4 mb-2'>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2 class='text-xl font-semibold mt-4 mb-2'>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold mt-4 mb-2'>$1</h1>")
      // Lists
      .replace(/^- (.+)$/gm, "<li class='ml-4'>$1</li>")
      .replace(/^(\d+)\. (.+)$/gm, "<li class='ml-4 list-decimal'>$2</li>")
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>')
      // Images
      .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />')
      // Blockquotes
      .replace(/^> (.+)$/gm, "<blockquote class='border-l-4 border-primary pl-4 italic'>$1</blockquote>")
      // Paragraphs
      .replace(/\n\n/g, "</p><p class='mb-2'>")
      // Line breaks
      .replace(/\n/g, "<br />");

    return `<div class='prose prose-sm max-w-none'><p class='mb-2'>${html}</p></div>`;
  };

  return (
    <div
      className="prose prose-sm max-w-none p-4 rounded-xl bg-muted/30 border"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}