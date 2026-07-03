import homeMenu from "../homeMenu.svg";
import category from "../category.svg";
import productsMenu from "../productsMenu.svg";
import brandMenu from "../tag.png";
import orderMenu from "../list.png";

export const sidebarMenus = {
  shop: [
    {
      icon: homeMenu,
      menu: "Home",
      link: "",
    },
        {
      icon: homeMenu,
      menu: "Dashboard",
      link: "dashboard",
    },
    {
      icon: category,
      menu: "Categories",
      link: "categories",
    },
    {
      icon: brandMenu,
      menu: "Brands",
      link: "brands",
    },
    {
      icon: productsMenu,
      menu: "Products",
      link: "products",
    },
    {
      icon: orderMenu,
      menu: "Orders",
      link: "orders",
    },
    {
      icon: orderMenu,
      menu: "Delivery Partner",
      link: "deliveryBoy",
    },
    {
      icon: orderMenu,
      menu: "Return Orders",
      link: "returns",
    },
    {
      icon: orderMenu,
      menu: "Approved Returns",
      link: "returns/approved",
    },
  ],

  customer: [
    {
      icon: homeMenu,
      menu: "Shop",
      link: "/customer",
    },
    {
      icon: orderMenu,
      menu: "Cart",
      link: "/customer/cart",
    },
  ],
};
