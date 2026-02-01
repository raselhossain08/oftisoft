
"use client";

import { motion } from "framer-motion";
import {
    DollarSign, TrendingUp, TrendingDown, CreditCard,
    Download, Calendar, Wallet
} from "lucide-react";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";

const REVENUE_DATA = [
    { month: 'Jan', revenue: 12000, expenses: 8000 },
    { month: 'Feb', revenue: 15000, expenses: 9500 },
    { month: 'Mar', revenue: 18000, expenses: 11000 },
    { month: 'Apr', revenue: 14000, expenses: 9000 },
    { month: 'May', revenue: 22000, expenses: 14000 },
    { month: 'Jun', revenue: 28000, expenses: 16000 },
];

const EXPENSE_BREAKDOWN = [
    { name: 'Servers', value: 35, color: '#f472b6' },
    { name: 'Salaries', value: 45, color: '#60a5fa' },
    { name: 'Marketing', value: 20, color: '#4ade80' },
];

export default function FinancialAnalyticsPage() {
    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Financial Reports</h1>
                    <p className="text-muted-foreground">Monitor revenue, expenses, and profitability.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-border rounded-xl font-medium hover:bg-muted transition-colors flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> This Year
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <p className="text-muted-foreground font-bold text-sm mb-2">Total Revenue</p>
                    <h3 className="text-3xl font-bold mb-1">$109,000</h3>
                    <div className="flex items-center text-green-500 text-sm font-bold">
                        <TrendingUp className="w-4 h-4 mr-1" /> +12.5% <span className="text-muted-foreground font-normal ml-1">vs last year</span>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <p className="text-muted-foreground font-bold text-sm mb-2">Total Expenses</p>
                    <h3 className="text-3xl font-bold mb-1">$67,500</h3>
                    <div className="flex items-center text-red-500 text-sm font-bold">
                        <TrendingDown className="w-4 h-4 mr-1" /> +5.2% <span className="text-muted-foreground font-normal ml-1">vs last year</span>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-green-500/20">
                    <p className="text-green-100 font-bold text-sm mb-2">Net Profit</p>
                    <h3 className="text-3xl font-bold mb-1">$41,500</h3>
                    <div className="flex items-center text-white text-sm font-bold">
                        <TrendingUp className="w-4 h-4 mr-1" /> +24.8% <span className="text-green-100 font-normal ml-1">margin</span>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold mb-6">Revenue vs Expenses</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={REVENUE_DATA}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="revenue" name="Revenue" fill="#4ade80" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expenses" name="Expenses" fill="#f472b6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold mb-6">Expense Breakdown</h3>
                    <div className="h-[200px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={EXPENSE_BREAKDOWN}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {EXPENSE_BREAKDOWN.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-3xl font-bold">$67k</div>
                                <div className="text-xs text-muted-foreground">Total</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center flex-wrap gap-4 mt-6">
                        {EXPENSE_BREAKDOWN.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
