export default function MarketingLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030014]">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 opacity-[0.02] bg-grain" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated logo mark */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary animate-pulse-slow opacity-30 blur-xl" />
          <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-pulse-slow" style={{ animationDelay: "1s" }} />
          <div className="absolute inset-3 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-2xl font-bold text-white">O</span>
          </div>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold tracking-[0.3em] text-white/90">
            OFTISOFT
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-primary to-secondary rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
