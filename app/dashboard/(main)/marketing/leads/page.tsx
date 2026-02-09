"use client";

import { useState } from "react";
import { 
    Users, 
    Mail, 
    Plus, 
    Trash2, 
    CheckCircle2, 
    Clock, 
    Filter, 
    Search,
    Download,
    MoreHorizontal,
    Megaphone,
    MousePointer2,
    Calendar,
    BadgeCheck,
    ArrowUpRight,
    Sparkles,
    LucideIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLeads } from "@/hooks/useLeads";
import { LeadStatus, LeadType } from "@/lib/api";
import { format } from "date-fns";

export default function LeadsDashboardPage() {
    const { leads = [], stats, isLoading, updateStatus, deleteLead } = useLeads();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredLeads = leads.filter(lead => 
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: LeadStatus) => {
        switch (status) {
            case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'in_progress': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'converted': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'archived': return 'bg-muted text-muted-foreground border-border';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getTypeIcon = (type: LeadType) => {
        switch (type) {
            case 'cta': return MousePointer2;
            case 'newsletter': return Mail;
            case 'contact': return Megaphone;
            default: return Users;
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Marketing Leads</h1>
                    <p className="text-muted-foreground font-medium mt-1">Manage and track your customer acquisitions and subscriptions.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 rounded-xl h-11 border-border/50 bg-card/50 backdrop-blur-sm font-bold">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Leads" 
                    value={stats?.total || 0} 
                    icon={Users} 
                    trend="+12%" 
                    trendColor="text-green-500"
                />
                <StatCard 
                    title="New Submissions" 
                    value={stats?.newLeads || 0} 
                    icon={Sparkles} 
                    trend="Active" 
                    trendColor="text-blue-500"
                />

                <StatCard 
                    title="CTA Conversions" 
                    value={stats?.ctaCount || 0} 
                    icon={MousePointer2} 
                    trend="+5.4%" 
                    trendColor="text-green-500"
                />
                <StatCard 
                    title="Newsletter" 
                    value={stats?.newsletterCount || 0} 
                    icon={Mail} 
                    trend="+28" 
                    trendColor="text-green-500"
                />
            </div>

            {/* Table Card */}
            <Card className="border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm rounded-[32px] shadow-sm">
                <CardHeader className="p-6 border-b border-border/50 bg-muted/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search leads by name or email..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 h-12 rounded-2xl bg-background border-border/50 focus:ring-primary/20" 
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-10 px-4 gap-2 rounded-xl font-bold border-border/50">
                                <Filter className="w-4 h-4" /> Filters
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/5 hover:bg-muted/5 border-border/50">
                                <TableHead className="h-12 font-black text-xs uppercase tracking-widest pl-8">Inquirer</TableHead>
                                <TableHead className="h-12 font-black text-xs uppercase tracking-widest">Type</TableHead>
                                <TableHead className="h-12 font-black text-xs uppercase tracking-widest">Message</TableHead>
                                <TableHead className="h-12 font-black text-xs uppercase tracking-widest">Date</TableHead>
                                <TableHead className="h-12 font-black text-xs uppercase tracking-widest">Status</TableHead>
                                <TableHead className="h-12 font-black text-xs uppercase tracking-widest text-right pr-8">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeads.map((lead) => {
                                const TypeIcon = getTypeIcon(lead.type);
                                return (
                                    <TableRow key={lead.id} className="group hover:bg-primary/[0.02] transition-colors border-border/50">
                                        <TableCell className="pl-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground">{lead.name || 'Anonymous Inquirer'}</span>
                                                <span className="text-xs text-muted-foreground">{lead.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <TypeIcon size={14} />
                                                </div>
                                                <span className="text-xs font-black uppercase tracking-wider">{lead.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <p className="text-sm text-muted-foreground max-w-[300px] truncate">
                                                {lead.message || <span className="italic opacity-50">No message provided</span>}
                                            </p>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold">{format(new Date(lead.createdAt), 'MMM dd, yyyy')}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase">{format(new Date(lead.createdAt), 'hh:mm aa')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", getStatusColor(lead.status))}>
                                                {lead.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-8 py-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 border-border/50 bg-card/95 backdrop-blur-xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5">Lead Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => updateStatus({ id: lead.id, status: 'in_progress' as any })} className="rounded-xl gap-2 font-bold text-xs"><Clock size={14} /> Mark In Progress</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatus({ id: lead.id, status: 'converted' as any })} className="rounded-xl gap-2 font-bold text-xs text-green-500"><CheckCircle2 size={14} /> Mark Converted</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateStatus({ id: lead.id, status: 'archived' as any })} className="rounded-xl gap-2 font-bold text-xs"><BadgeCheck size={14} /> Archive Lead</DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-border/50" />
                                                    <DropdownMenuItem onClick={() => deleteLead(lead.id)} className="rounded-xl gap-2 font-bold text-xs text-destructive"><Trash2 size={14} /> Delete Record</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredLeads.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                                                <Megaphone className="w-8 h-8 opacity-20" />
                                            </div>
                                            <p className="font-medium">No leads found matching your search.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, trend, trendColor }: { title: string, value: number | string, icon: LucideIcon, trend: string, trendColor: string }) {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-[32px] overflow-hidden group hover:border-primary/30 transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <Badge className={cn("bg-transparent border-none font-black text-xs", trendColor)}>{trend}</Badge>
                </div>
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 mb-1">{title}</p>
                    <h3 className="text-3xl font-black italic tracking-tighter">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

