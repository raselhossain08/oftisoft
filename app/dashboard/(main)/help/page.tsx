import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, Book, MessageCircle, Mail, FileQuestion, 
    ChevronRight, ExternalLink, Plus, AlertCircle, CheckCircle2 
} from "lucide-react";
import { useSupport } from "@/hooks/useSupport";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";

const FAQ_ITEMS = [
    { q: "How do I upgrade my plan?", a: "You can upgrade your plan anytime from the Billing > Subscription section. Changes take effect immediately." },
    { q: "Can I manage multiple teams?", a: "Yes, the Pro and Business plans support multiple team management with role-based access control." },
    { q: "Where can I find my API keys?", a: "API keys are located in Settings > Developer. Make sure to keep them secure." },
    { q: "Do you offer refunds?", a: "We offer a 14-day money-back guarantee for all new subscriptions. Contact support for assistance." },
];

const GUIDES = [
    { title: "Getting Started", time: "5 min read", category: "Basics" },
    { title: "Setting up Custom Domains", time: "10 min read", category: "Advanced" },
    { title: "API Documentation", time: "15 min read", category: "Developer" },
];

export default function HelpPage() {
    const { tickets, isLoading, fetchTickets, createTicket } = useSupport();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Ticket Form
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("general");
    const [priority, setPriority] = useState("medium");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleSubmitTicket = async () => {
        if (!subject || !description) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        const success = await createTicket({
            subject,
            category,
            priority,
            description
        });
        
        if (success) {
            setIsCreateOpen(false);
            setSubject("");
            setDescription("");
            setCategory("general");
            setPriority("medium");
        }
        setIsSubmitting(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'pending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'resolved': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'closed': return 'bg-muted text-muted-foreground border-border';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="mx-auto space-y-12 pb-20">
            
            <div className="text-center space-y-4 py-8">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black italic tracking-tight"
                >
                    How can we help?
                </motion.h1>
                <div className="relative max-w-lg mx-auto group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <input 
                        placeholder="Search for answers..." 
                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-card border border-border shadow-sm focus:ring-2 focus:ring-primary/20 outline-none text-lg transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/docs" className="bg-card border border-border/50 rounded-[32px] p-8 hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                        <Book className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-xl mb-2 italic">Documentation</h3>
                    <p className="text-muted-foreground text-sm font-medium mb-4">Detailed guides and API references for developers.</p>
                    <span className="text-sm font-black text-primary flex items-center gap-1 group-hover:underline">Browse Docs <ChevronRight size={14} /></span>
                </Link>

                <div 
                    onClick={() => toast.info("Live chat agents are currently busy. Please open a ticket.")}
                    className="bg-card border border-border/50 rounded-[32px] p-8 hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer"
                >
                    <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                        <MessageCircle className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-xl mb-2 italic">Live Chat</h3>
                    <p className="text-muted-foreground text-sm font-medium mb-4">Chat with our support team in real-time.</p>
                    <span className="text-sm font-black text-primary flex items-center gap-1 group-hover:underline">Start Chat <ChevronRight size={14} /></span>
                </div>

                <div 
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-card border border-border/50 rounded-[32px] p-8 hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer"
                >
                    <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform shadow-inner">
                        <Mail className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-xl mb-2 italic">Priority Support</h3>
                    <p className="text-muted-foreground text-sm font-medium mb-4">Open a ticket for complex issues. 24h response time.</p>
                    <span className="text-sm font-black text-primary flex items-center gap-1 group-hover:underline">Open Ticket <ChevronRight size={14} /></span>
                </div>
            </div>

            {/* Recent Tickets Section */}
            {tickets.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                         <h3 className="text-2xl font-black italic tracking-tight">Your Recent Tickets</h3>
                         <Button variant="outline" size="sm" onClick={() => fetchTickets()} className="gap-2">
                            Refresh
                         </Button>
                    </div>
                    
                    <div className="grid gap-4">
                        {tickets.slice(0, 3).map((ticket) => (
                            <div key={ticket.id} className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 transition-all">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={`capitalize font-black border-2 ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </Badge>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                            #{ticket.id.slice(0, 8)}
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-lg">{ticket.subject}</h4>
                                </div>
                                <div className="flex items-center gap-4">
                                     <Badge variant="secondary" className="uppercase text-[10px] font-black tracking-widest h-6">
                                        {ticket.category}
                                     </Badge>
                                     <Button variant="ghost" size="sm" className="font-bold gap-1">
                                        View Details <ChevronRight className="w-4 h-4" />
                                     </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                     <h3 className="text-2xl font-black italic tracking-tight mb-6">Frequently Asked Questions</h3>
                     <div className="space-y-4">
                        {FAQ_ITEMS.filter(i => i.q.toLowerCase().includes(searchQuery.toLowerCase()) || i.a.toLowerCase().includes(searchQuery.toLowerCase())).map((item, i) => (
                            <div key={i} className="bg-muted/10 border border-border/50 rounded-2xl p-6 hover:bg-muted/20 transition-colors">
                                <h4 className="font-bold text-base mb-2 flex items-start gap-3">
                                    <div className="p-1 rounded bg-primary/10 text-primary mt-0.5">
                                        <FileQuestion className="w-4 h-4" />
                                    </div>
                                    {item.q}
                                </h4>
                                <p className="text-sm font-medium text-muted-foreground pl-9 leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                     </div>
                </div>

                <div>
                    <h3 className="text-2xl font-black italic tracking-tight mb-6">Popular Guides</h3>
                    <div className="space-y-4">
                        {GUIDES.map((guide, i) => (
                            <Link href="#" key={i} className="flex items-center justify-between p-5 bg-card border border-border/50 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
                                <div className="space-y-1">
                                    <h4 className="font-bold group-hover:text-primary transition-colors text-lg">{guide.title}</h4>
                                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                                        <Badge variant="secondary" className="text-[10px] uppercase font-black tracking-wider h-5">{guide.category}</Badge>
                                        {guide.time}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <ExternalLink className="w-5 h-5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Ticket Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-[32px] p-8 border-border/50 bg-card/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black italic tracking-tight text-center">Open Support Ticket</DialogTitle>
                        <DialogDescription className="text-center text-base font-medium">
                            Describe your issue and we'll get back to you as soon as possible.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Subject</label>
                            <Input 
                                placeholder="Brief summary of the issue" 
                                className="h-12 rounded-xl font-medium"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Category</label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="h-12 rounded-xl font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="billing">Billing</SelectItem>
                                        <SelectItem value="technical">Technical</SelectItem>
                                        <SelectItem value="feature">Feature Request</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Priority</label>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger className="h-12 rounded-xl font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Description</label>
                            <Textarea 
                                placeholder="Provide detailed information about the issue..." 
                                className="min-h-[150px] rounded-xl font-medium resize-none p-4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-8">
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl h-12 font-bold px-8">Cancel</Button>
                        <Button 
                            onClick={handleSubmitTicket} 
                            disabled={isSubmitting}
                            className="rounded-xl h-12 font-bold px-8 bg-primary text-white shadow-lg shadow-primary/20"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Ticket"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
