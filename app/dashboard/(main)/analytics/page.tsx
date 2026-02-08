"use client";

import { useState } from "react";
import {
  Activity,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  FileText,
  Target,
  Zap,
  Bug,
  Gauge,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { mockAnalyticsData } from "@/lib/shop-data";

const PERFORMANCE_DATA = [
  { name: "Mon", completed: 4, active: 10, velocity: 42 },
  { name: "Tue", completed: 3, active: 12, velocity: 38 },
  { name: "Wed", completed: 7, active: 8, velocity: 45 },
  { name: "Thu", completed: 2, active: 15, velocity: 35 },
  { name: "Fri", completed: 6, active: 11, velocity: 50 },
  { name: "Sat", completed: 3, active: 7, velocity: 44 },
  { name: "Sun", completed: 1, active: 5, velocity: 40 },
];

// Chart colors - vibrant & visible on dark background
const CHART_PRIMARY = "#6366f1";
const CHART_SECONDARY = "#818cf8";
const CHART_GRID = "#334155";
const CHART_TEXT = "#94a3b8";
const CHART_CARD_BG = "#0f172a";
const CHART_BORDER = "#1e293b";

const TASK_DISTRIBUTION = [
  { name: "Design", value: 35, color: "#ec4899" },
  { name: "Development", value: 45, color: "#6366f1" },
  { name: "QA & Testing", value: 20, color: "#10b981" },
];

const GEO_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899"];

export default function UnifiedAnalyticsHub() {
  const [userRole] = useState<"admin" | "user">("admin");
  const [timeRange, setTimeRange] = useState("week");

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 sm:pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black italic tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Intelligence Hub
          </h1>
          <p className="text-muted-foreground font-medium mt-1 text-sm sm:text-base">
            {userRole === "admin"
              ? "Unified overview of project velocity, business health, and financial trajectory."
              : "Performance metrics and productivity insights for your current projects."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl h-9 sm:h-11 border-border/50 bg-card/50 gap-2 font-bold text-xs sm:text-sm"
          >
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            Last 30 Days
          </Button>
          <Button
            size="sm"
            className="rounded-xl h-9 sm:h-11 bg-primary text-primary-foreground gap-2 font-bold text-xs sm:text-sm"
          >
            <Download className="w-4 h-4 shrink-0" />
            Export Intelligence
          </Button>
        </div>
      </div>

      <Tabs defaultValue="performance" className="space-y-6 sm:space-y-8">
        {/* Tab Bar + Time Range */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <TabsList className="bg-muted/50  rounded-xl sm:rounded-2xl h-auto sm:h-14 w-full sm:w-fit border border-border/50 flex flex-wrap gap-1">
            <TabsTrigger
              value="performance"
              className="rounded-lg sm:rounded-xl h-auto gap-2 font-bold px-4 sm:px-6 text-xs sm:text-sm flex-1 sm:flex-initial data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:ring-2 data-[state=active]:ring-primary/20 data-[state=active]:border data-[state=active]:border-primary/30 transition-all duration-200"
            >
              <Gauge className="w-4 h-4 shrink-0" /> Productivity
            </TabsTrigger>
            {userRole === "admin" && (
              <>
                <TabsTrigger
                  value="business"
                  className="rounded-lg sm:rounded-xl h-auto gap-2 font-bold px-4 sm:px-6 text-xs sm:text-sm flex-1 sm:flex-initial data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:ring-2 data-[state=active]:ring-primary/20 data-[state=active]:border data-[state=active]:border-primary/30 transition-all duration-200"
                >
                  <TrendingUp className="w-4 h-4 shrink-0" /> Business Intel
                </TabsTrigger>
                <TabsTrigger
                  value="financial"
                  className="rounded-lg sm:rounded-xl h-auto gap-2 font-bold px-4 sm:px-6 text-xs sm:text-sm flex-1 sm:flex-initial data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:ring-2 data-[state=active]:ring-primary/20 data-[state=active]:border data-[state=active]:border-primary/30 transition-all duration-200"
                >
                  <DollarSign className="w-4 h-4 shrink-0" /> Financials
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <div className="flex items-center gap-1 p-1.5 bg-card/40 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-border/50">
            {["day", "week", "month"].map((t) => (
              <Button
                key={t}
                variant="ghost"
                size="sm"
                onClick={() => setTimeRange(t)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all h-8 sm:h-9",
                  timeRange === t
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {t === "day" ? "Day" : t === "week" ? "Week" : "Month"}
              </Button>
            ))}
          </div>
        </div>

        {/* Performance Tab */}
        <TabsContent
          value="performance"
          className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Completion Rate",
                value: "87%",
                trend: "+2.5%",
                icon: CheckCircle2,
                color: "text-green-500",
                bg: "bg-green-500",
              },
              {
                label: "Avg. Turnaround",
                value: "1.2 Days",
                trend: "-0.4 Days",
                icon: Clock,
                color: "text-blue-500",
                bg: "bg-blue-500",
              },
              {
                label: "Critical Bugs",
                value: "3",
                trend: "+1",
                icon: Bug,
                color: "text-red-500",
                bg: "bg-red-500",
              },
              {
                label: "Team Velocity",
                value: "42 pts",
                trend: "+5 pts",
                icon: Zap,
                color: "text-orange-500",
                bg: "bg-orange-500",
              },
            ].map((stat, i) => (
              <Card
                key={i}
                className="border-border/50 bg-card/40 backdrop-blur-md overflow-hidden relative group"
              >
                <div
                  className={cn(
                    "absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-8 -mt-8 opacity-20",
                    stat.bg
                  )}
                />
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 sm:p-6">
                  <CardTitle className="text-[10px] font-black uppercase italic text-muted-foreground tracking-widest">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={cn("h-4 w-4 shrink-0", stat.color)} />
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="text-2xl sm:text-3xl font-black italic tracking-tighter">
                    {stat.value}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-[10px] font-black uppercase italic mt-1",
                      stat.trend.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {stat.trend}{" "}
                    <span className="text-muted-foreground font-medium ml-1 tracking-normal">
                      vs last cycle
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            <Card className="lg:col-span-8 border-border/50 bg-card/40 backdrop-blur-md rounded-2xl sm:rounded-[32px] overflow-hidden">
              <CardHeader className="p-4 sm:p-6 md:p-8 border-b border-border/50 flex flex-row items-center justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle className="text-lg sm:text-xl font-black italic">
                    Productivity Flow
                  </CardTitle>
                  <CardDescription className="italic text-xs sm:text-sm">
                    Task completion trends across active architectural nodes.
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground hover:rotate-180 transition-transform duration-500"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="h-[280px] sm:h-[350px] md:h-[400px] p-4 sm:p-6 md:p-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_PRIMARY} stopOpacity={0.6} />
                        <stop offset="50%" stopColor={CHART_PRIMARY} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={CHART_PRIMARY} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_GRID} opacity={0.6} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: CHART_TEXT, fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: CHART_TEXT, fontSize: 12, fontWeight: 600 }}
                      width={35}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: CHART_CARD_BG,
                        borderRadius: "12px",
                        border: `1px solid ${CHART_BORDER}`,
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                        color: "#f8fafc",
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: "8px", color: "#f8fafc" }}
                      itemStyle={{ color: CHART_PRIMARY, fontWeight: 600 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke={CHART_PRIMARY}
                      strokeWidth={3}
                      fill="url(#areaGradient)"
                      fillOpacity={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-4 border-border/50 bg-card/40 backdrop-blur-md rounded-2xl sm:rounded-[32px] overflow-hidden">
              <CardHeader className="p-4 sm:p-6 md:p-8 border-b border-border/50">
                <CardTitle className="text-lg sm:text-xl font-black italic">
                  Operative Split
                </CardTitle>
                <CardDescription className="italic text-xs sm:text-sm">
                  Distribution of tasks by department.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[240px] sm:h-[300px] relative p-4 sm:p-6 md:p-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TASK_DISTRIBUTION}
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke={CHART_BORDER}
                      strokeWidth={2}
                    >
                      {TASK_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: CHART_CARD_BG,
                        borderRadius: "12px",
                        border: `1px solid ${CHART_BORDER}`,
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                        color: "#f8fafc",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                  <span className="text-3xl sm:text-4xl font-black italic tracking-tighter">
                    142
                  </span>
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">
                    Total Tasks
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 sm:p-6 md:p-8 border-t border-border/50 bg-muted/20 flex flex-col gap-3">
                {TASK_DISTRIBUTION.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-bold italic">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-black italic">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Business Intel Tab */}
        {userRole === "admin" && (
          <TabsContent
            value="business"
            className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Revenue",
                  value: "$168,430",
                  growth: "+12.5%",
                  icon: DollarSign,
                  trend: "up" as const,
                },
                {
                  label: "Total Orders",
                  value: "1,248",
                  growth: "+8.2%",
                  icon: ShoppingCart,
                  trend: "up" as const,
                },
                {
                  label: "Active Customers",
                  value: "8,942",
                  growth: "+14.1%",
                  icon: Users,
                  trend: "up" as const,
                },
                {
                  label: "Conversion Rate",
                  value: "3.2%",
                  growth: "-0.4%",
                  icon: Activity,
                  trend: "down" as const,
                },
              ].map((kpi) => (
                <Card
                  key={kpi.label}
                  className="border-border/50 bg-card/40 backdrop-blur-md overflow-hidden relative"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 sm:p-6">
                    <CardTitle className="text-[10px] font-black uppercase italic text-muted-foreground tracking-widest">
                      {kpi.label}
                    </CardTitle>
                    <kpi.icon className="h-4 w-4 text-primary shrink-0" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                    <div className="text-2xl sm:text-3xl font-black italic tracking-tighter">
                      {kpi.value}
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-[10px] font-black uppercase italic mt-1",
                        kpi.trend === "up"
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    >
                      {kpi.trend === "up" ? (
                        <ArrowUpRight className="w-3 h-3 shrink-0" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 shrink-0" />
                      )}
                      {kpi.growth}{" "}
                      <span className="text-muted-foreground font-medium ml-1 tracking-normal">
                        trailing month
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl sm:rounded-[32px] overflow-hidden">
                <CardHeader className="p-4 sm:p-6 md:p-8 border-b border-border/50">
                  <CardTitle className="text-lg sm:text-xl font-black italic">
                    Revenue Matrix
                  </CardTitle>
                  <CardDescription className="italic text-xs sm:text-sm">
                    Global revenue distribution across product nodes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[400px] p-4 sm:p-6 md:p-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockAnalyticsData.productPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={CHART_SECONDARY} />
                          <stop offset="100%" stopColor={CHART_PRIMARY} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_GRID} opacity={0.6} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: CHART_TEXT, fontSize: 12, fontWeight: 600 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: CHART_TEXT, fontSize: 12, fontWeight: 600 }}
                        width={45}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: CHART_CARD_BG,
                          borderRadius: "12px",
                          border: `1px solid ${CHART_BORDER}`,
                          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                          color: "#f8fafc",
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="url(#barGradient)"
                        radius={[8, 8, 0, 0]}
                        barSize={36}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl sm:rounded-[32px] overflow-hidden">
                <CardHeader className="p-4 sm:p-6 md:p-8 border-b border-border/50">
                  <CardTitle className="text-lg sm:text-xl font-black italic">
                    Market Geographics
                  </CardTitle>
                  <CardDescription className="italic text-xs sm:text-sm">
                    Customer base distribution by global region.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[400px] p-4 sm:p-6 md:p-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockAnalyticsData.customerDemographics}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={110}
                        paddingAngle={4}
                        dataKey="value"
                        stroke={CHART_BORDER}
                        strokeWidth={2}
                      >
                        {mockAnalyticsData.customerDemographics.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={GEO_COLORS[index % GEO_COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: CHART_CARD_BG,
                          borderRadius: "12px",
                          border: `1px solid ${CHART_BORDER}`,
                          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                          color: "#f8fafc",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="p-4 sm:p-6 md:p-8 border-t border-border/50 bg-muted/20 grid grid-cols-2 gap-4">
                  {mockAnalyticsData.customerDemographics.map((entry, index) => (
                    <div key={entry.name} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase italic">
                        <span className="text-muted-foreground truncate pr-2">
                          {entry.name}
                        </span>
                        <span className="shrink-0 font-bold" style={{ color: GEO_COLORS[index % GEO_COLORS.length] }}>
                          {entry.value}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${entry.value}%`,
                            backgroundColor: GEO_COLORS[index % GEO_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Financials Tab */}
        {userRole === "admin" && (
          <TabsContent
            value="financial"
            className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 mt-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <Card className="border-border/50 bg-primary/[0.03] rounded-2xl sm:rounded-[32px] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 sm:p-8">
                  <TrendingUp className="w-6 h-6 text-primary opacity-20" />
                </div>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-[10px] font-black uppercase italic text-muted-foreground tracking-widest">
                    Operating Profit
                  </CardTitle>
                  <div className="text-3xl sm:text-4xl font-black italic tracking-tighter mt-2 text-primary">
                    $124,500
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">
                    Adjusted for global technical overhead and operational
                    expenditures.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-green-500/[0.03] rounded-2xl sm:rounded-[32px] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 sm:p-8">
                  <DollarSign className="w-6 h-6 text-green-500 opacity-20" />
                </div>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-[10px] font-black uppercase italic text-muted-foreground tracking-widest">
                    Fiscal Reserves
                  </CardTitle>
                  <div className="text-3xl sm:text-4xl font-black italic tracking-tighter mt-2 text-green-500">
                    $32,000
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">
                    Liquidity nodes maintained for R&D and rapid infrastructure
                    deployment.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-orange-500/[0.03] rounded-2xl sm:rounded-[32px] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 sm:p-8">
                  <Target className="w-6 h-6 text-orange-500 opacity-20" />
                </div>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-[10px] font-black uppercase italic text-muted-foreground tracking-widest">
                    Marketing Spend
                  </CardTitle>
                  <div className="text-3xl sm:text-4xl font-black italic tracking-tighter mt-2 text-orange-500">
                    $18,450
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">
                    Budget allocation for tactical acquisition campaigns and
                    brand awareness.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl sm:rounded-[40px] overflow-hidden">
              <CardHeader className="p-4 sm:p-6 md:p-10 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle className="text-xl sm:text-2xl font-black italic">
                    Profit & Loss Summary
                  </CardTitle>
                  <CardDescription className="italic text-xs sm:text-sm">
                    Detailed breakdown of organizational income and expenditures.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  className="rounded-xl sm:rounded-2xl h-10 sm:h-14 px-6 sm:px-8 bg-primary text-primary-foreground font-bold gap-2 sm:gap-3 shrink-0"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />{" "}
                  Generate PDF Ledger
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {[
                    {
                      category: "Marketplace Artifact Sales",
                      income: "$450,230",
                      expense: "$0",
                      net: "+$450,230",
                      color: "text-green-500",
                    },
                    {
                      category: "Global Edge Infrastructure",
                      income: "$0",
                      expense: "$42,500",
                      net: "-$42,500",
                      color: "text-red-500",
                    },
                    {
                      category: "Managed Service Delivery",
                      income: "$124,000",
                      expense: "$85,000",
                      net: "+$39,000",
                      color: "text-green-500",
                    },
                    {
                      category: "Intelligence Operative Salaries",
                      income: "$0",
                      expense: "$120,000",
                      net: "-$120,000",
                      color: "text-red-500",
                    },
                    {
                      category: "Acquisition & Marketing",
                      income: "$0",
                      expense: "$18,450",
                      net: "-$18,450",
                      color: "text-red-500",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-primary/[0.02] transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <h5 className="font-black italic text-base sm:text-lg">
                          {row.category}
                        </h5>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">
                          Fiscal Node ID: FX-{(i + 1) * 12}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4 sm:gap-16 text-right">
                        <div className="hidden md:block space-y-1">
                          <p className="text-[9px] font-black uppercase text-muted-foreground italic tracking-widest">
                            Gross Inflow
                          </p>
                          <p className="font-bold tabular-nums">{row.income}</p>
                        </div>
                        <div className="hidden md:block space-y-1">
                          <p className="text-[9px] font-black uppercase text-muted-foreground italic tracking-widest">
                            Gross Outflow
                          </p>
                          <p className="font-bold tabular-nums">{row.expense}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase text-muted-foreground italic tracking-widest">
                            Net Trajectory
                          </p>
                          <p
                            className={cn(
                              "font-black italic tabular-nums text-base sm:text-lg",
                              row.color
                            )}
                          >
                            {row.net}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
