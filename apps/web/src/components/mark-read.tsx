"use client";

import { useEffect } from "react";
import { markNotificationsRead } from "@/app/notifications-actions";

// Marks the viewer's unread notifications read once the feed is on screen.
export function MarkReadOnView({ path }: { path: string }) {
  useEffect(() => {
    const t = setTimeout(() => void markNotificationsRead([path]), 800);
    return () => clearTimeout(t);
  }, [path]);
  return null;
}
