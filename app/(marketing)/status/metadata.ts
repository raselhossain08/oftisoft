import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "System Status | Real-time Status Updates",
  description: "Check the real-time status of Oftisoft services and infrastructure. View uptime, incidents, and maintenance schedules.",
  keywords: [
    "system status",
    "service status",
    "uptime",
    "infrastructure status",
    "maintenance",
  ],
});
