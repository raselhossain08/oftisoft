"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Trophy,
  Zap,
  Star,
  Shield,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const data = [
  { name: "Mon", visits: 4000, pv: 2400 },
  { name: "Tue", visits: 3000, pv: 1398 },
  { name: "Wed", visits: 2000, pv: 9800 },
  { name: "Thu", visits: 2780, pv: 3908 },
  { name: "Fri", visits: 1890, pv: 4800 },
  { name: "Sat", visits: 2390, pv: 3800 },
  { name: "Sun", visits: 3490, pv: 4300 },
];

const ACHIEVEMENTS = [
  { title: "Project Master", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "Speed Demon", icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Team Favorite", icon: Star, color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "Privacy Pro", icon: Shield, color: "text-green-500", bg: "bg-green-500/10" },
];

const RECENT_ACTIVITY = [
  { name: "Sarah J.", initials: "SJ", task: "Final UI Designs", time: "10m ago" },
  { name: "Mike T.", initials: "MT", task: "API Deployment", time: "1h ago" },
];

const TEAM_MEMBERS = [
  { name: "Rasel Hossain", role: "Manager", status: "online" },
  { name: "Sarah Jenkins", role: "UI Designer", status: "typing" },
  { name: "Mike Thompson", role: "Dev", status: "busy" },
];

const StatCard = ({
  title,
  value,
  change,
  trend,
  href,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  href: string;
}) => (
  <Button variant="ghost" asChild className="h-auto p-0 block text-left">
    <Link href={href}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm transition-all hover:shadow-xl group h-full w-full"
      >
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground font-bold uppercase tracking-wider mb-1">
              {title}
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold">{value}</h3>
          </div>
          <div
            className={cn(
              "p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-transform group-hover:rotate-12 shrink-0",
              trend === "up" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            )}
          >
            {trend === "up" ? (
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] sm:text-xs font-bold border-0",
              trend === "up" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
            )}
          >
            {change}
          </Badge>
          <span className="text-muted-foreground font-medium">vs last month</span>
        </div>
      </motion.div>
    </Link>
  </Button>
);

import { useAuth } from "@/hooks/useAuth";

export default function DashboardHome() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const navLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/analytics", label: "Analytics" },
    { href: "/dashboard/settings", label: "Settings" },
  ];

  const prevMonth = () => setCalendarMonth((m) => (m === 0 ? 11 : m - 1));
  const nextMonth = () => setCalendarMonth((m) => (m === 11 ? 0 : m + 1));

  return (
    <div className="space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      {/* Header / Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tight h-10 sm:h-12 overflow-hidden">
            <TypeAnimation
              sequence={[
                `Welcome back, ${user?.name?.split(' ')[0] || 'Architect'}! 👋`,
                2000,
                "Scale your business today.",
                2000,
                "Manage projects like a pro.",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </h1>
          <div className="h-8 overflow-hidden relative mt-1">
            <motion.div
              animate={{ y: ["0%", "-33.33%", "-66.66%"] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                times: [0, 0.33, 0.66],
                ease: "easeInOut",
              }}
              className="flex flex-col text-xs sm:text-sm font-medium text-muted-foreground"
            >
              <span className="h-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                You have{" "}
                <span className="text-foreground font-bold underline">
                  3 critical deadlines
                </span>{" "}
                this week.
              </span>
              <span className="h-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                New feature &quot;AI Chat&quot; is{" "}
                <span className="text-foreground font-bold">ready for review</span>.
              </span>
              <span className="h-8 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                Server uptime was{" "}
                <span className="text-foreground font-bold">99.99%</span> last month.
              </span>
            </motion.div>
          </div>
        </div>

        <div className="flex bg-muted p-1 rounded-xl sm:rounded-2xl border border-border shrink-0">
          {navLinks.map((link: any) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-lg",
                pathname === link.href
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Active Projects"
          value="12"
          change="+2"
          trend="up"
          href="/dashboard/projects"
        />
        <StatCard
          title="Total Revenue"
          value="$48,200"
          change="+12.5%"
          trend="up"
          href="/dashboard/analytics"
        />
        <StatCard
          title="Team Velocity"
          value="87%"
          change="-2.4%"
          trend="down"
          href="/dashboard/analytics"
        />
        <StatCard
          title="Task Efficiency"
          value="94%"
          change="+5.1%"
          trend="up"
          href="/dashboard/analytics"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {/* Performance Graph */}
          <Card className="relative overflow-hidden border rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-6 sm:mb-8 relative z-10">
              <div>
                <CardTitle className="text-lg sm:text-xl">Activity Trends</CardTitle>
                <CardDescription>Real-time performance metrics</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild className="h-9 w-9 shrink-0">
                  <Link
                    href="/dashboard/analytics"
                    title="View Detailed Analytics"
                  >
                    <Activity className="w-4 h-4" />
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/analytics" className="cursor-pointer">
                        <Download className="w-4 h-4" /> Export Data
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/analytics" className="cursor-pointer">
                        <Share2 className="w-4 h-4" /> Share Report
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/analytics" className="cursor-pointer">
                        <RefreshCw className="w-4 h-4" /> Refresh
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      cursor={{ stroke: "#6366f1", strokeWidth: 2, strokeDasharray: "4 4" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderRadius: "12px",
                        border: "1px solid hsl(var(--border))",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visits"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorWave)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Achievements */}
            <Card className="rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8">
              <CardHeader className="p-0 mb-4 sm:mb-6">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Trophy className="text-amber-500 w-5 h-5" /> Milestone Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {ACHIEVEMENTS.map((ach, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      asChild
                      className="h-auto p-0 block"
                    >
                      <Link
                        href="/dashboard/settings/profile"
                        className="flex flex-col items-center p-4 bg-muted/20 border border-border rounded-2xl sm:rounded-3xl hover:border-primary/50 transition-all group"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform",
                            ach.bg,
                            ach.color
                          )}
                        >
                          <ach.icon size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <p className="text-[10px] sm:text-xs font-bold text-center">
                          {ach.title}
                        </p>
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8">
              <CardHeader className="p-0 mb-4 sm:mb-6">
                <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4 sm:space-y-6">
                  {RECENT_ACTIVITY.map((act, i) => (
                    <div key={i} className="flex items-center gap-3 sm:gap-4">
                      <Avatar className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shrink-0">
                        <AvatarFallback className="rounded-xl bg-muted text-[10px] font-bold">
                          {act.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold truncate">
                          {act.name}{" "}
                          <span className="font-normal text-muted-foreground">
                            uploaded
                          </span>{" "}
                          {act.task}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                          {act.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          {/* Calendar */}
          <Card className="rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-0 mb-4 sm:mb-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary shrink-0" /> Schedule
                <span className="text-sm font-normal text-muted-foreground">
                  {monthNames[calendarMonth]}
                </span>
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevMonth}
                  className="h-8 w-8 shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMonth}
                  className="h-8 w-8 shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 gap-y-2 sm:gap-y-4 text-center">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <span
                    key={`${d}-${i}`}
                    className="text-[10px] font-black text-muted-foreground uppercase"
                  >
                    {d}
                  </span>
                ))}
                {Array.from({ length: 31 }).map((_, i) => (
                  <div key={i} className="relative py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className={cn(
                        "text-xs font-bold w-7 h-7 sm:w-8 sm:h-8 p-0 rounded-lg sm:rounded-xl mx-auto",
                        i + 1 === 24
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Link href={`/dashboard/calendar?date=${i + 1}`}>{i + 1}</Link>
                    </Button>
                    {[12, 18, 28].includes(i + 1) && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team */}
          <Card className="rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8">
            <CardHeader className="p-0 mb-4 sm:mb-6">
              <CardTitle className="text-base sm:text-lg">Online Team</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 sm:space-y-5">
                {TEAM_MEMBERS.map((tm, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <Avatar className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl">
                          <AvatarFallback className="rounded-xl bg-muted text-xs font-bold">
                            {tm.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-card rounded-full",
                            tm.status === "online"
                              ? "bg-green-500"
                              : tm.status === "typing"
                              ? "bg-blue-500 animate-pulse"
                              : "bg-orange-500"
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold leading-tight truncate">
                          {tm.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider truncate">
                          {tm.role}
                        </p>
                      </div>
                    </div>
                    {tm.status === "typing" && (
                      <div className="flex gap-1 shrink-0">
                        {[0, 1, 2].map((d) => (
                          <motion.div
                            key={d}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              delay: d * 0.2,
                            }}
                            className="w-1 h-1 bg-primary rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                asChild
                className="w-full mt-6 sm:mt-8 rounded-xl sm:rounded-2xl"
              >
                <Link href="/dashboard/settings/security">
                  Manage Permissions
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
