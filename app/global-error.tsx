"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#020202] min-h-screen">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-lg border-red-500/20 bg-red-500/5 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Something Went Wrong
              </CardTitle>
              <CardDescription className="mt-2">
                We apologize for the inconvenience. An unexpected error occurred.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-4 bg-black/30 rounded-lg border border-red-500/20">
                <p className="text-sm text-red-400 font-mono break-all">
                  {error.message || "An unexpected error occurred"}
                </p>
                {error.digest && (
                  <p className="mt-2 text-xs text-gray-500">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => reset()} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}