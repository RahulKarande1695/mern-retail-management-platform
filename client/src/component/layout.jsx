import { Outlet } from "react-router-dom";
import background from "../background.svg";
const Layout = () => {
  return (
    <div >
      <img src={background} className="background" alt="background" />
      <Outlet />
    </div>
  );
};

export default Layout;
