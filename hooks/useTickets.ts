"use client";

import { useState, useEffect, useCallback } from "react";
import { supportAPI, Ticket } from "@/lib/api";
import { toast } from "sonner";

interface TicketMessage {
  id: string;
  content: string;
  sender: string;
  createdAt: string;
}

interface TicketStats {
  total: number;
  open: number;
  pending: number;
  resolved: number;
  avgResponseTime: number;
  satisfaction: number;
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    pending: 0,
    resolved: 0,
    avgResponseTime: 0,
    satisfaction: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await supportAPI.getTickets();
      setTickets(data);
    } catch (err: any) {
      console.error("Failed to fetch tickets", err);
      toast.error("Failed to load tickets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await supportAPI.getStats();
      setStats(data);
    } catch (err: any) {
      console.error("Failed to fetch ticket stats", err);
    }
  }, []);

  // Fetch tickets and stats on mount
  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [fetchTickets, fetchStats]);

  const createTicket = useCallback(async (ticketData: {
    subject: string;
    category: string;
    priority: string;
    description: string;
  }) => {
    try {
      const newTicket = await supportAPI.createTicket(ticketData);
      setTickets((prev) => [newTicket, ...prev]);
      toast.success("Ticket created successfully");
      return newTicket;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to create ticket";
      toast.error(message);
      throw err;
    }
  }, []);

  const updateTicketStatus = useCallback(async (id: string, status: string) => {
    try {
      const updatedTicket = await supportAPI.updateTicketStatus(id, status);
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === id ? updatedTicket : ticket
        )
      );
      toast.success(`Ticket status updated to ${status}`);
      return updatedTicket;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to update ticket";
      toast.error(message);
      throw err;
    }
  }, []);

  const addMessage = useCallback(async (id: string, content: string) => {
    try {
      const message = await supportAPI.addMessage(id, content);
      // Refresh the ticket to get updated messages
      await fetchTickets();
      return message;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to add message";
      toast.error(message);
      throw err;
    }
  }, [fetchTickets]);

  return {
    tickets,
    stats,
    isLoading,
    fetchTickets,
    fetchStats,
    createTicket,
    updateTicketStatus,
    addMessage,
  };
}
