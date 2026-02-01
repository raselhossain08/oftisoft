
"use client";

import { motion } from "framer-motion";
import {
    Download, Search, Filter, Calendar, ChevronDown,
    MoreHorizontal, CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const INVOICE_LIST = [
    { id: "INV-2024-001", client: "Acme Corp", date: "Jun 01, 2026", due: "Jun 15, 2026", amount: "$2,800.00", status: "Paid" },
    { id: "INV-2024-002", client: "Globex", date: "May 15, 2026", due: "May 30, 2026", amount: "$1,500.00", status: "Paid" },
    { id: "INV-2024-003", client: "Soylent Corp", date: "May 01, 2026", due: "May 15, 2026", amount: "$4,200.00", status: "Overdue" },
    { id: "INV-2024-004", client: "Initech", date: "Apr 20, 2026", due: "May 04, 2026", amount: "$950.00", status: "Pending" },
    { id: "INV-2024-005", client: "Umbrella Corp", date: "Apr 01, 2026", due: "Apr 15, 2026", amount: "$12,000.00", status: "Paid" },
];

const STATUS_STYLES = {
    "Paid": "bg-green-500/10 text-green-500 border-green-500/20",
    "Pending": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    "Overdue": "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function InvoicesPage() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
        else setSelectedIds([...selectedIds, id]);
    }

    return (
        <div className="space-y-6">

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Invoices</h1>
                    <p className="text-muted-foreground">Manage your billing history and payments.</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    Create Invoice
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search invoice # or client..."
                        className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
                        <tr>
                            <th className="p-4 w-10">
                                <input type="checkbox" className="rounded border-gray-600 bg-muted text-primary focus:ring-primary" onChange={(e) => setSelectedIds(e.target.checked ? INVOICE_LIST.map(i => i.id) : [])} />
                            </th>
                            <th className="p-4">Invoice ID</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Date Issued</th>
                            <th className="p-4">Due Date</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {INVOICE_LIST.map((inv, i) => (
                            <motion.tr
                                key={inv.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={cn(
                                    "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                                    selectedIds.includes(inv.id) && "bg-muted/50"
                                )}
                            >
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-600 bg-muted text-primary focus:ring-primary"
                                        checked={selectedIds.includes(inv.id)}
                                        onChange={() => toggleSelect(inv.id)}
                                    />
                                </td>
                                <td className="p-4 font-bold text-foreground">{inv.id}</td>
                                <td className="p-4">{inv.client}</td>
                                <td className="p-4 text-muted-foreground">{inv.date}</td>
                                <td className="p-4 text-muted-foreground">{inv.due}</td>
                                <td className="p-4 font-medium">{inv.amount}</td>
                                <td className="p-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit",
                                        STATUS_STYLES[inv.status as keyof typeof STATUS_STYLES]
                                    )}>
                                        {inv.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                                        {inv.status === 'Pending' && <Clock className="w-3 h-3" />}
                                        {inv.status === 'Overdue' && <AlertCircle className="w-3 h-3" />}
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
