import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import clsx from "clsx";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

// ----------------------
// Define Notification type
// ----------------------
type NotificationType = "success" | "error" | "info";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
}

// ----------------------
// Utility: Color classes per type
// ----------------------
const typeStyles: Record<NotificationType, string> = {
  success: "border-green-500 text-green-700",
  error: "border-red-500 text-red-700",
  info: "border-blue-500 text-blue-700",
};

// ----------------------
// NotificationItem Component
// ----------------------
interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={clsx(
          "mb-6 p-6 w-full max-w-5xl border-l-4 shadow-lg transition-all duration-300",
          typeStyles[notification.type]
        )}
      >
        <CardContent className="flex items-start gap-6">
          {/* Always show Bell icon on the left */}
          <Bell className="w-8 h-8 mt-1 text-blue-500" />

          <div className="flex-1">
            <h4 className="font-semibold text-xl mb-2 text-red-700">
              {notification.message}
            </h4>
            <p className="text-base text-gray-700 mb-3">{notification.title}</p>
            <p className="text-sm text-gray-500">
              {new Date(notification.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Show checkmark if read, else show button */}
          {notification.read ? (
            <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMarkRead(notification.id)}
            >
              Mark as read
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ----------------------
// NotificationPage Component
// ----------------------
const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper: infer notification type based on message or sensor value
  const inferType = (message: string, value: number): NotificationType => {
    const msg = message.toLowerCase();
    if (msg.includes("error") || value > 50) return "error";
    if (msg.includes("alert")) return "info";
    return "success";
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/noti"); // Your Flask API URL
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const data = await res.json();

        // Map Supabase API data to Notification type expected by UI
        const mappedNotifications: Notification[] = data.map((item: any) => ({
          id: item.id,
          title: `Sensor: ${item.Sensor}`,
          message: item.Message,
          type: inferType(item.Message, item.Value),
          timestamp: item.Date,
          read: false, // Default read status (no backend persistence here)
        }));

        setNotifications(mappedNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setNotifications([]); // Optional: clear on failure
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkRead = (id: number): void => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="p-6 max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold mb-6">Notifications</h2>
          {loading ? (
            <p className="text-center text-gray-600">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="text-center text-gray-600">No notifications to display.</p>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
              />
            ))
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default NotificationPage;
