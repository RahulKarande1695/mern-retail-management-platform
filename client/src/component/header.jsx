import { Box } from "@mui/material";
import headerlogo from "../headerlogo.svg";
import headerlogout from "../headerlogout.svg";
import NotificationBell from "./Notifications/NotificationBell";
const Header = () => {
  const role = sessionStorage.getItem("currentRole");

  let user = {};

  switch (role) {
    case "shop":
      user = JSON.parse(localStorage.getItem("shop"));
      break;

    case "customer":
      user = JSON.parse(localStorage.getItem("customer"));
      break;

    case "deliveryPartner":
      user = JSON.parse(localStorage.getItem("deliveryPartner"));
      break;
  }
  return (
    <Box
      bgcolor={"#662671"}
      display={"flex"}
      justifyContent={"space-between"}
      px={4}
      py={1}
      alignItems={"center"}
    >
      <Box>
        <img
          width={"200px"}
          src={headerlogo}
          className="header_logo"
          alt="logo"
        />
      </Box>
      <Box display={"flex"} alignItems={"center"} gap={"20px"}>
        <Box display={"flex"} alignItems={"center"} gap={"20px"}>
          <NotificationBell />

          <b style={{ color: "white" }}>{user?.email}</b>

          <img
            width={"40px"}
            src={headerlogout}
            className="header_logout"
            alt="logout"
          />
        </Box>
        <img
          width={"40px"}
          src={headerlogout}
          className="header_logout"
          alt="logoout"
        />
      </Box>
    </Box>
  );
};
export default Header;
