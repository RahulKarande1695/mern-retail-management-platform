import { useEffect, useState } from "react";

import {
  Badge,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import toast from "react-hot-toast";
import NotificationsIcon from "@mui/icons-material/Notifications";

import socket from "../../socket/socket";
import api from "../../api/axios";

const iconMap = {
  Order: "📦",
  Delivery: "🚚",
  Return: "↩️",
  Payment: "💰",
  General: "🔔",
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const getNotifications = async () => {
    try {
      const res = await api.get("/notifications");

      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getNotifications();

    socket.on("NEW_NOTIFICATION", (notification) => {
      setNotifications((prev) => [notification, ...prev]);

      toast.custom(() => (
        <Box
          sx={{
            background: "#fff",
            borderRadius: 2,
            p: 2,
            boxShadow: 4,
            minWidth: 340,
            borderLeft: "5px solid #1976d2",
          }}
        >
          <Typography fontWeight={700}>
            {iconMap[notification.type]} {notification.title}
          </Typography>

          <Typography variant="body2">{notification.message}</Typography>
        </Box>
      ));
    });

    return () => {
      socket.off("NEW_NOTIFICATION");
    };
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                isRead: true,
              }
            : item,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        })),
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon
            sx={{
              color: "white",
            }}
          />
        </Badge>
      </IconButton>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box width={360} p={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={700}>
              Notifications
            </Typography>

            <Button size="small" onClick={markAllRead}>
              Read All
            </Button>
          </Box>

          <Divider />

          <List>
            {notifications.length === 0 && (
              <Typography mt={3} textAlign="center">
                No Notifications
              </Typography>
            )}

            {notifications.map((item) => (
              <ListItem
                key={item._id}
                divider
                button
                onClick={() => markRead(item._id)}
                sx={{
                  bgcolor: item.isRead ? "white" : "#eef5ff",

                  borderRadius: 1,

                  mb: 1,
                }}
              >
                <ListItemText
                  primary={
                    <Typography fontWeight={700}>{item.title}</Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2">{item.message}</Typography>

                      <Typography variant="caption" color="gray">
                        {new Date(item.createdAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NotificationBell;
