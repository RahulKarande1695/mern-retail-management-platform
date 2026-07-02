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