import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";
import { Box } from "@mui/material";

const LayoutDGFlake = () => {
  return (
    <main className="App">
      <Header />
      <div className="main-Layout">
        <Box width={'20vw'} bgcolor={"#F4F4F4"} >
      <Sidebar />
        </Box>
        <Box width={'80vw'}>
      <Outlet />
        </Box>
      </div>
    </main>
  );
};

export default LayoutDGFlake;
