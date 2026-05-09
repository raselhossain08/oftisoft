"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully");
          toast.success("Email verified!");
          
          // Auto-redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push("/dashboard/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to verify email");
        }
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-secondary" />
      <div className="absolute -top-40 -right-40 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="mb-6 sm:mb-8 text-center">
          <Link
            href="/"
            className="inline-block text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          >
            Ofitsoft
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-lg sm:shadow-xl">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto">
                {status === "loading" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center"
                  >
                    <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary animate-spin" />
                  </motion.div>
                )}
                {status === "success" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-full h-full bg-green-500/10 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-full h-full bg-destructive/10 rounded-full flex items-center justify-center"
                  >
                    <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-destructive" />
                  </motion.div>
                )}
              </div>
              <CardTitle className="text-xl sm:text-2xl text-center">
                {status === "loading" && "Verifying Email..."}
                {status === "success" && "Email Verified!"}
                {status === "error" && "Verification Failed"}
              </CardTitle>
              <CardDescription className="text-center text-xs sm:text-sm">
                {message}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {status === "success" && (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Redirecting to login page...
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/login" className="gap-2">
                      Go to Login
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              )}

              {status === "error" && (
                <div className="text-center space-y-4">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/login">
                      Back to Login
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
