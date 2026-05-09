"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Filter,
  Search,
  MoreHorizontal,
  Package,
  AlertCircle,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RoleGuard } from "@/components/auth/role-guard";
import { motion } from "framer-motion";

interface PendingProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  vendorId: string;
  vendorName: string;
  rejectionReason?: string;
}

export default function ProductApprovalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedProduct, setSelectedProduct] = useState<PendingProduct | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch pending products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["pending-products", statusFilter],
    queryFn: async () => {
      const response = await api.get(`/products/pending?status=${statusFilter}`);
      return response.data as PendingProduct[];
    },
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (productId: string) => {
      return api.post(`/products/${productId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-products"] });
      toast.success("Product approved successfully");
      setIsReviewOpen(false);
    },
    onError: () => {
      toast.error("Failed to approve product");
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ productId, reason }: { productId: string; reason: string }) => {
      return api.post(`/products/${productId}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-products"] });
      toast.success("Product rejected");
      setIsRejectOpen(false);
      setRejectionReason("");
    },
    onError: () => {
      toast.error("Failed to reject product");
    },
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    pending: products.filter((p) => p.status === "pending").length,
    approved: products.filter((p) => p.status === "approved").length,
    rejected: products.filter((p) => p.status === "rejected").length,
    total: products.length,
  };

  const handleApprove = (product: PendingProduct) => {
    setSelectedProduct(product);
    setIsReviewOpen(true);
  };

  const handleReject = (product: PendingProduct) => {
    setSelectedProduct(product);
    setIsRejectOpen(true);
  };

  const confirmApprove = () => {
    if (selectedProduct) {
      approveMutation.mutate(selectedProduct.id);
    }
  };

  const confirmReject = () => {
    if (selectedProduct && rejectionReason) {
      rejectMutation.mutate({ productId: selectedProduct.id, reason: rejectionReason });
    }
  };

  return (
    <RoleGuard allowedRoles={["SuperAdmin", "Admin", "Editor"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Product Approval</h1>
            <p className="text-muted-foreground">Review and approve vendor products</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-500" },
            { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-green-500" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-500" },
            { label: "Total", value: stats.total, icon: Package, color: "text-primary" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products or vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Products</CardTitle>
            <CardDescription>Review products submitted by vendors</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground">
                  {statusFilter === "pending"
                    ? "No products waiting for approval"
                    : `No ${statusFilter} products`}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.vendorName}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "approved"
                              ? "default"
                              : product.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {product.status === "pending" && (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(product)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-500 hover:text-green-600"
                              onClick={() => handleApprove(product)}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleReject(product)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Product</DialogTitle>
              <DialogDescription>
                Review the product details before approving
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center">
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                    <p className="text-muted-foreground">{selectedProduct.description}</p>
                    <div className="flex gap-4 mt-2">
                      <Badge variant="secondary">{selectedProduct.category}</Badge>
                      <Badge variant="outline">${selectedProduct.price.toFixed(2)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Vendor: {selectedProduct.vendorName}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={confirmApprove}
                disabled={approveMutation.isPending}
                className="bg-green-500 hover:bg-green-600"
              >
                {approveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Approve Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Product</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this product
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Rejection Reason</Label>
                <Textarea
                  id="reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmReject}
                disabled={rejectMutation.isPending || !rejectionReason}
              >
                {rejectMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Reject Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}
