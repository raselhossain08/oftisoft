import { Loader2 } from "lucide-react";

export default function MarketingLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020202]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">Loading page...</p>
      </div>
    </div>
  );
}