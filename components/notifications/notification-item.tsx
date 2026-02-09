import { motion } from "framer-motion";
import { Check, Trash2, Archive, Clock, AlertTriangle, FileText, UserPlus, CreditCard, Settings, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "@/hooks/useNotifications";

interface NotificationItemProps {
    notification: Notification;
    filter: string;
    onMarkAsRead: (id: string) => void;
    onArchive: (id: string) => void;
    onDelete: (id: string) => void;
    index: number;
}

const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
        case 'project': return <FileText className="w-5 h-5 text-blue-500" />;
        case 'team': return <UserPlus className="w-5 h-5 text-green-500" />;
        case 'billing': return <CreditCard className="w-5 h-5 text-purple-500" />;
        case 'system': return <Settings className="w-5 h-5 text-orange-500" />;
        default: return <Bell className="w-5 h-5 text-primary" />;
    }
};

const NotificationBg = ({ type }: { type: string }) => {
    switch (type) {
        case 'alert': return "bg-red-500/10 text-red-500";
        case 'project': return "bg-blue-500/10 text-blue-500";
        case 'team': return "bg-green-500/10 text-green-500";
        case 'billing': return "bg-purple-500/10 text-purple-500";
        case 'system': return "bg-orange-500/10 text-orange-500";
        default: return "bg-primary/10 text-primary";
    }
};

export function NotificationItem({ notification: notif, filter, onMarkAsRead, onArchive, onDelete, index }: NotificationItemProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "flex items-start gap-5 p-6 rounded-[24px] border transition-all hover:shadow-lg relative group bg-card",
                !notif.read && filter !== 'archived' ? "border-l-4 border-l-primary border-t border-r border-b border-border shadow-md bg-primary/[0.02]" : "border-border/50 hover:border-primary/20",
            )}
        >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", NotificationBg({ type: notif.type }))}>
                <NotificationIcon type={notif.type} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                    <h3 className={cn("font-bold text-base", !notif.read && "text-foreground")}>{notif.title}</h3>
                    <span className="text-xs font-bold text-muted-foreground/60 whitespace-nowrap flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-none mb-3">{notif.description}</p>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    {!notif.read && filter !== 'archived' && (
                        <button 
                            onClick={() => onMarkAsRead(notif.id)}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
                        >
                            <Check className="w-3.5 h-3.5" /> Mark as read
                        </button>
                    )}
                    {filter !== 'archived' && (
                        <button 
                            onClick={() => onArchive(notif.id)}
                            className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                        >
                            <Archive className="w-3.5 h-3.5" /> Archive
                        </button>
                    )}
                    {filter === 'archived' && (
                         <button 
                            onClick={() => onDelete(notif.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Forever
                        </button>
                    )}
                </div>
            </div>
            
            {!notif.read && filter !== 'archived' && (
                <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-primary rounded-full animate-pulse md:block hidden shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            )}
        </motion.div>
    );
}
