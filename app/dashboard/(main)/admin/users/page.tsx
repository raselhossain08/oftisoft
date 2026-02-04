"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, Filter, MoreVertical, Shield, User, 
    CheckCircle2, XCircle, Mail, Download, Trash2, Edit, Plus, X, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const INITIAL_USERS = [
    { id: 1, name: "Alex Morgan", email: "alex@example.com", role: "Admin", status: "Active", lastActive: "2 min ago", avatar: "AM", color: "bg-blue-500" },
    { id: 2, name: "Sarah Jenkins", email: "sarah@design.co", role: "Editor", status: "Active", lastActive: "1 hour ago", avatar: "SJ", color: "bg-pink-500" },
    { id: 3, name: "Mike Thompson", email: "mike@devops.io", role: "Viewer", status: "Inactive", lastActive: "3 days ago", avatar: "MT", color: "bg-purple-500" },
    { id: 4, name: "Emily Chen", email: "emily@inc.com", role: "User", status: "Active", lastActive: "5 min ago", avatar: "EC", color: "bg-green-500" },
    { id: 5, name: "David Wilson", email: "david@corp.net", role: "User", status: "Suspended", lastActive: "1 week ago", avatar: "DW", color: "bg-yellow-500" },
];

// --- Components ---

const CustomDialog = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-card border border-border w-full max-w-md rounded-xl shadow-2xl pointer-events-auto overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-border">
                                <h3 className="font-bold text-lg">{title}</h3>
                                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-6">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default function UserManagementPage() {
    const [users, setUsers] = useState(INITIAL_USERS);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    
    // Modal States
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null); // For Edit
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "User" });

    const toggleUser = (id: number) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(u => u !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const id = Math.max(...users.map(u => u.id)) + 1;
        const initials = newUser.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
        
        setUsers([...users, {
            id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: "Active",
            lastActive: "Just now",
            avatar: initials,
            color: "bg-gray-500"
        }]);
        setNewUser({ name: "", email: "", role: "User" });
        setIsAddOpen(false);
    };

    const handleEditUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        
        setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...currentUser } : u));
        setIsEditOpen(false);
        setCurrentUser(null);
    };

    const handleDeleteUser = (id: number) => {
        if (confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter(u => u.id !== id));
            setSelectedUsers(selectedUsers.filter(uid => uid !== id));
        }
    };
    
    const handleBulkDelete = () => {
         if (confirm(`Delete ${selectedUsers.length} users?`)) {
            setUsers(users.filter(u => !selectedUsers.includes(u.id)));
            setSelectedUsers([]);
         }
    };

    const openEdit = (user: any) => {
        setCurrentUser(user);
        setIsEditOpen(true);
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                        User Management
                    </h1>
                    <p className="text-muted-foreground">Manage system access and permissions.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-border rounded-xl font-bold hover:bg-muted transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button 
                        onClick={() => setIsAddOpen(true)}
                        className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <User className="w-4 h-4" /> Add User
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                        placeholder="Search users by name or email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="px-4 py-2 bg-muted/50 hover:bg-muted border border-border rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                    {selectedUsers.length > 0 && (
                         <button 
                            onClick={handleBulkDelete}
                            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors animate-in fade-in slide-in-from-right-4"
                        >
                            <Trash2 className="w-4 h-4" /> Delete ({selectedUsers.length})
                        </button>
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/30 border-b border-border text-xs uppercase font-bold text-muted-foreground">
                            <tr>
                                <th className="p-4 w-12 text-center">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-border"
                                        onChange={(e) => {
                                            if(e.target.checked) setSelectedUsers(users.map(u => u.id));
                                            else setSelectedUsers([]);
                                        }}
                                        checked={selectedUsers.length === users.length && users.length > 0}
                                    />
                                </th>
                                <th className="p-4 text-left">User</th>
                                <th className="p-4 text-left">Role</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Last Active</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <AnimatePresence>
                                {filteredUsers.map((user, i) => (
                                    <motion.tr 
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                                        transition={{ delay: i * 0.05 }}
                                        className={cn(
                                            "group hover:bg-muted/30 transition-colors",
                                            selectedUsers.includes(user.id) && "bg-primary/5"
                                        )}
                                    >
                                        <td className="p-4 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => toggleUser(user.id)}
                                                className="rounded border-border accent-primary"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md", user.color)}>
                                                    {user.avatar}
                                                </div>
                                                <div>
                                                    <div className="font-bold flex items-center gap-2">
                                                        {user.name}
                                                        {user.role === 'Admin' && <Shield className="w-3 h-3 text-primary fill-primary/20" />}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                                                user.role === 'Admin' ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                                                user.role === 'Editor' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                                "bg-muted text-muted-foreground border-border"
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                                                user.status === 'Active' ? "bg-green-500/10 text-green-600 border-green-500/20" :
                                                user.status === 'Inactive' ? "bg-muted text-muted-foreground border-border" :
                                                "bg-red-500/10 text-red-600 border-red-500/20"
                                            )}>
                                                {user.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                                                {user.status === 'Suspended' && <XCircle className="w-3 h-3" />}
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground font-medium">
                                            {user.lastActive}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => openEdit(user)}
                                                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No users found.
                        </div>
                    )}
                </div>
                
                {/* Pagination */}
                <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                    <div>Showing {filteredUsers.length} of {users.length} users</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-border rounded-lg hover:bg-muted disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-border rounded-lg hover:bg-muted">Next</button>
                    </div>
                </div>
            </div>

            {/* Add User Dialog */}
            <CustomDialog 
                isOpen={isAddOpen} 
                onClose={() => setIsAddOpen(false)} 
                title="Add New User"
            >
                <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Full Name</label>
                        <input 
                            required
                            value={newUser.name}
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            placeholder="e.g. John Doe"
                            className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Email Address</label>
                        <input 
                            required
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            placeholder="john@example.com"
                            className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Role</label>
                        <select 
                            value={newUser.role}
                            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                            className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                        >
                            <option value="User">User</option>
                            <option value="Editor">Editor</option>
                            <option value="Admin">Admin</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors mt-2">
                        <Plus className="w-4 h-4" /> Create User
                    </button>
                </form>
            </CustomDialog>

            {/* Edit User Dialog */}
            <CustomDialog 
                isOpen={isEditOpen} 
                onClose={() => setIsEditOpen(false)} 
                title="Edit User"
            >
                {currentUser && (
                    <form onSubmit={handleEditUser} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Full Name</label>
                            <input 
                                required
                                value={currentUser.name}
                                onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                                className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Email</label>
                            <input 
                                required
                                type="email"
                                value={currentUser.email}
                                onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                                className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Role</label>
                                <select 
                                    value={currentUser.role}
                                    onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                                    className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="User">User</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Viewer">Viewer</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Status</label>
                                <select 
                                    value={currentUser.status}
                                    onChange={(e) => setCurrentUser({...currentUser, status: e.target.value})}
                                    className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                        <div className="pt-2 flex gap-2">
                            <button 
                                type="button" 
                                onClick={() => setIsEditOpen(false)}
                                className="flex-1 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </CustomDialog>

        </div>
    );
}
