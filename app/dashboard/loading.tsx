export default function DashboardLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary animate-pulse-slow opacity-30 blur-lg" />
          <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-xl font-bold text-white">O</span>
          </div>
        </div>
        <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-primary to-secondary rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}