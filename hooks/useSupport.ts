import { useState, useCallback, useEffect } from "react";
import { supportAPI, Ticket } from "@/lib/api";
import { toast } from "sonner";

export function useSupport() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTickets = useCallback(async (status?: string) => {
        setIsLoading(true);
        try {
            const data = await supportAPI.getTickets(status);
            setTickets(data);
        } catch (err) {
            console.error("Failed to fetch tickets", err);
            toast.error("Failed to load support tickets");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createTicket = async (data: { subject: string; category: string; priority: string; description: string }) => {
        setIsLoading(true);
        try {
            await supportAPI.createTicket(data);
            toast.success("Support ticket created");
            fetchTickets(); // Refresh list
            return true;
        } catch (err) {
            console.error("Failed to create ticket", err);
            toast.error("Failed to create support ticket");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        tickets,
        isLoading,
        fetchTickets,
        createTicket,
    };
}
