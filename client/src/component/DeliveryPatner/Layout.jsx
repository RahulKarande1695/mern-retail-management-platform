import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 250;

const scrollbarStyles = {
  "&::-webkit-scrollbar": { width: 6, height: 6 },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c7c7c7",
    borderRadius: 4,
  },
  "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
};

const menu = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    path: "/delivery/dashboard",
  },
  {
    title: "Assigned Orders",
    icon: <AssignmentIcon />,
    path: "/delivery/orders",
  },
  {
    title: "History",
    icon: <HistoryIcon />,
    path: "/delivery/history",
  },
  {
    title: "Profile",
    icon: <PersonIcon />,
    path: "/delivery/profile",
  },
  {
    title: "Change Password",
    icon: <LockIcon />,
    path: "/delivery/change-password",
  },
];

const DeliveryLayout = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("deliveryPartnerToken");
    localStorage.removeItem("deliveryPartner");

    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#f5f6f8",
      }}
    >
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { xs: "100%", md: drawerWidth },
          flexShrink: 0,
          height: { xs: "auto", md: "100vh" },
          display: "flex",
          flexDirection: "column",
          bgcolor: "#fff",
          borderRight: { xs: "none", md: "1px solid #e5e5e5" },
          borderBottom: { xs: "1px solid #e5e5e5", md: "none" },
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 1.5, md: 3 },
            px: 2,
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            alignItems: "center",
            justifyContent: { xs: "center", md: "center" },
            gap: { xs: 1, md: 0.5 },
          }}
        >
          <LocalShippingIcon
            color="primary"
            sx={{ fontSize: { xs: 28, md: 44 } }}
          />

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ fontSize: { xs: "1rem", md: "1.15rem" } }}
          >
            Delivery Partner
          </Typography>
        </Box>

        <Divider />

        <List
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            flex: { xs: "none", md: 1 },
            overflowX: { xs: "auto", md: "hidden" },
            overflowY: { xs: "hidden", md: "auto" },
            px: { xs: 1, md: 1 },
            py: { xs: 0.5, md: 1 },
            gap: { xs: 0.5, md: 0.25 },
            ...scrollbarStyles,
          }}
        >
          {menu.map((item) => (
            <ListItemButton
              key={item.title}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                flexShrink: 0,
                borderRadius: "10px",
                whiteSpace: "nowrap",
                "&.Mui-selected": {
                  bgcolor: "rgba(25, 118, 210, 0.1)",
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.15)" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 34, md: 40 } }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.title}
                sx={{
                  display: { xs: "none", sm: "block" },
                  "& .MuiListItemText-primary": { fontSize: "0.92rem" },
                }}
              />
            </ListItemButton>
          ))}

          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "block", md: "none" }, mx: 0.5 }}
          />
          <Divider sx={{ display: { xs: "none", md: "block" }, my: 0.5 }} />

          <ListItemButton
            onClick={logout}
            sx={{ flexShrink: 0, borderRadius: "10px", whiteSpace: "nowrap" }}
          >
            <ListItemIcon sx={{ minWidth: { xs: 34, md: 40 } }}>
              <LogoutIcon color="error" />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
              sx={{ display: { xs: "none", sm: "block" } }}
            />
          </ListItemButton>
        </List>
      </Box>

      {/* Page */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          height: { xs: "auto", md: "100vh" },
          overflowY: "auto",
          overflowX: "hidden",
          bgcolor: "#f5f6f8",
          ...scrollbarStyles,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DeliveryLayout;