import MenuBar from "./menuBar";
import homeMenu from "../homeMenu.svg";
import category from "../category.svg";
import productsMenu from "../productsMenu.svg";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const Sidebar = () => {
  const navigate = useNavigate();
  const sidebarMenu = [
    {
      icon: homeMenu,
      menu: "Home",
      link:"",
    },
    {
      icon: category,
      menu: "Categories",
      link:"categories/*",
    },
    {
      icon: productsMenu,
      menu: "products",
      link:"products/*",
    },
  ];
  return (
    <Box bgcolor={"#F4F4F4"} height={"89vh"} pt={2}>
      {sidebarMenu.map((i) => {
        return <div>
        <MenuBar icon={i.icon} menu={i.menu} link={i.link}/>
        </div>
      })}
    </Box>
  );
};
export default Sidebar;
