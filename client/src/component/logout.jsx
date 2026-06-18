import { Box, Button } from "@mui/material";
import logout from "../logout.svg";
import { useNavigate } from "react-router-dom";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const LogoutUser = (props) => {
  const { setOpen } = props;
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        ...style,
        width: 350,
        border: "0px",
        boxShadow: "0px 4px 15px 0px #000000",
      }}
    >
      <Box display={"flex"} justifyContent={"center"} gap={"5px"}>
        <div>
          <img src={logout} width={"30px"} className="App-logo" alt="logoout" />
        </div>
        <div>
          <h4>Log Out</h4>
        </div>
      </Box>
      <Box textAlign={"center"} mb={3}>
        {" "}
        <p>Are you sure you want to log out ?</p>
      </Box>

      <Box display={"flex"} justifyContent={"center"} gap={"60px"}>
        <Button sx={{fontSize:"10px"}} className="logout_btn" variant="contained" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button sx={{fontSize:"10px"}} className="logout_btn" variant="outlined" onClick={() => navigate("/")}>
          Confirm
        </Button>
      </Box>
    </Box>
  );
};
export default LogoutUser;
