import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";
import { Box } from "@mui/material";

const LayoutDGFlake = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Header />

      <Box sx={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <Box
          sx={{
            width: { xs: "72px", sm: "220px", md: "20vw" },
            maxWidth: 280,
            flexShrink: 0,
            bgcolor: "#F4F4F4",
            height: "100%",
            overflowY: "auto",
            borderRight: "1px solid #e5e5e5",
          }}
        >
          <Sidebar />
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            bgcolor: "#fff",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutDGFlake;