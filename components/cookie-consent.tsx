"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[999] p-4 md:p-6"
        >
          <div className="mx-auto max-w-6xl bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="hidden md:flex w-12 h-12 rounded-xl bg-primary/10 items-center justify-center shrink-0">
              <Cookie className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1 space-y-1">
              <p className="text-sm font-bold text-foreground">We value your privacy</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.{" "}
                <Link href="/privacy" className="text-primary underline hover:text-primary/80 transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <Button variant="outline" size="sm" onClick={decline} className="rounded-xl text-xs h-10 px-5 w-full md:w-auto">
                Decline
              </Button>
              <Button size="sm" onClick={accept} className="rounded-xl text-xs h-10 px-6 w-full md:w-auto shadow-lg shadow-primary/20">
                Accept All
              </Button>
            </div>

            <button onClick={decline} className="hidden md:block absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
