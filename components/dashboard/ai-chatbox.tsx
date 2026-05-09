"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGenerateWithAI } from "@/lib/api/content-queries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatboxProps {
  pageKey?: string;
  className?: string;
  /** Render custom trigger (e.g. toolbar button) instead of floating button */
  renderTrigger?: (onClick: () => void) => React.ReactNode;
}

export function AIChatbox({ pageKey, className, renderTrigger }: AIChatboxProps) {
  const [open, setOpen] = useState(false);

  const openChat = () => setOpen(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const generateMutation = useGenerateWithAI();

  useEffect(() => {
    if (open && messages.length > 0) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || generateMutation.isPending) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await generateMutation.mutateAsync({
        prompt: text,
        pageKey,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.text }]);
    } catch {
      // Error toast from mutation
    }
  };

  const copyResponse = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const floatingButton = (
    <Button
      onClick={openChat}
      className={cn(
        "fixed bottom-20 md:bottom-8 right-6 md:right-8 z-40 h-14 w-14 rounded-full shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 transition-all hover:scale-110",
        className
      )}
      title="AI Chat - Custom commands"
    >
      <Sparkles className="h-6 w-6" />
      <span className="sr-only">AI Chat</span>
    </Button>
  );

  return (
    <>
      {renderTrigger && renderTrigger(openChat)}
      {floatingButton}

      {/* Chat panel - slide-over from right */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-black text-sm uppercase tracking-wider">AI Assistant</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => setOpen(false)}>
                ×
              </Button>
            </div>
            <p className="text-xs text-muted-foreground px-4 pb-2">
              Type any command. AI will help with content, SEO, titles, descriptions, etc.
            </p>

            {/* Messages */}
            <div className="flex-1 px-4 h-[80vh] overflow-x-auto">
              <div className="space-y-4 py-4 min-h-[200px]">
                {messages.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">Send a custom command</p>
                    <p className="text-xs mt-1">e.g. &quot;Write a meta title for the about page&quot;</p>
                    <p className="text-xs">&quot;Generate 5 SEO keywords for services&quot;</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-2xl p-4 text-sm",
                      m.role === "user"
                        ? "ml-8 bg-primary/10 border border-primary/20"
                        : "mr-8 bg-muted/50 border border-border"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    {m.role === "assistant" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 gap-1.5 text-xs"
                        onClick={() => copyResponse(m.content)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </Button>
                    )}
                  </div>
                ))}
                {generateMutation.isPending && (
                  <div className="mr-8 rounded-2xl p-4 bg-muted/50 border border-border">
                    <span className="animate-pulse">Generating…</span>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your command..."
                  className="flex-1 rounded-xl h-11"
                  disabled={generateMutation.isPending}
                />
                <Button type="submit" size="icon" className="h-11 w-11 rounded-xl shrink-0" disabled={generateMutation.isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
