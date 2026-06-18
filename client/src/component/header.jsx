import { Box } from "@mui/material";
import headerlogo from "../headerlogo.svg";
import headerlogout from "../headerlogout.svg";
 const Header = () => {
  return (
    <Box bgcolor={'#662671'} display={"flex"} justifyContent={"space-between"} px={4} py={1} alignItems={"center"}>
      <Box>
      <img width={'200px'} src={headerlogo} className="header_logo" alt="logo" />
      </Box>
      <Box display={"flex"} alignItems={"center"} gap={"20px"}>
      <b style={{color:"white"}}>rahulkarande1695@gmail.com</b>
      <img width={'40px'} src={headerlogout} className="header_logout" alt="logoout" />
      </Box>
    </Box>
  );
};
 export default Header;