import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
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
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}

      <Box
        sx={{
          width: drawerWidth,
          minHeight: "100vh",
          borderRight: "1px solid #ddd",
          background: "#fff",
        }}
      >
        <Toolbar />

        <Box
          sx={{
            textAlign: "center",
            py: 2,
          }}
        >
          <LocalShippingIcon
            color="primary"
            sx={{
              fontSize: 45,
            }}
          />

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Delivery Partner
          </Typography>
        </Box>

        <Divider />

        <List>
          {menu.map((item) => (
            <ListItemButton
              key={item.title}
              selected={
                location.pathname === item.path
              }
              onClick={() =>
                navigate(item.path)
              }
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.title}
              />
            </ListItemButton>
          ))}

          <Divider sx={{ my: 1 }} />

          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
            />
          </ListItemButton>
        </List>
      </Box>

      {/* Page */}

      <Box
        sx={{
          flex: 1,
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DeliveryLayout;