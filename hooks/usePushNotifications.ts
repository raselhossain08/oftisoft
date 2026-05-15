"use client";

import { useEffect, useCallback } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export function usePushNotifications() {
  const { user } = useAuthStore();

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("Notifications not supported");
      return;
    }

    if (Notification.permission === "denied") {
      toast.error("Push notifications are blocked. Enable them in your browser settings.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });

      if (token && user?.id) {
        await fetch("/api/notifications/register-device", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            platform: /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
              ? "mobile"
              : "web",
          }),
        });
      }
    } catch (error) {
      console.error("FCM token error:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user || !("Notification" in window)) return;

    if (Notification.permission === "granted") {
      requestPermission();
    }
  }, [user, requestPermission]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const messaging = getMessaging(app);
      const unsubscribe = onMessage(messaging, (payload) => {
        const { title, body } = payload.notification || {};
        if (title) {
          toast(title, {
            description: body,
            duration: 5000,
          });
        }
      });
      return () => unsubscribe();
    } catch {
      // Firebase messaging not available
    }
  }, []);

  return { requestPermission };
}
