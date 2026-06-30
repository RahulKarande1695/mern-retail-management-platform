import MenuBar from "./menuBar";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { sidebarMenus } from "./sidebarConfig";

const Sidebar = () => {
  const navigate = useNavigate();
  const currentRole = sessionStorage.getItem("currentRole");
  const sidebarMenu = sidebarMenus[currentRole] || [];
  return (
    <Box bgcolor={"#F4F4F4"} height={"89vh"} pt={2}>
      {sidebarMenu.map((i) => {
        return (
          <div>
            <MenuBar icon={i.icon} menu={i.menu} link={i.link} />
          </div>
        );
      })}
    </Box>
  );
};
export default Sidebar;
