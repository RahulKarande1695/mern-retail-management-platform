import MenuBar from "./menuBar";
import homeMenu from "../homeMenu.svg";
import category from "../category.svg";
import productsMenu from "../productsMenu.svg";
import brandMenu from "../tag.png";
import orderMenu from "../list.png";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const Sidebar = () => {
  const navigate = useNavigate();
  const sidebarMenu = [
    {
      icon: homeMenu,
      menu: "Home",
      link: "",
    },
    {
      icon: category,
      menu: "Categories",
      link: "categories",
    },
    {
      icon: brandMenu,
      menu: "brand",
      link: "brands",
    },
    {
      icon: productsMenu,
      menu: "products",
      link: "products",
    },
    {
      icon: orderMenu,
      menu: "order",
      link: "orders",
    },
    {
      icon: orderMenu,
      menu: "shop",
      link: "shop",
    },
    {
      icon: orderMenu,
      menu: "cart",
      link: "cart",
    },
    {
      icon: orderMenu,
      menu: "delivery Boy Verification",
      link: "deliveryBoy",
    },
  ];
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
