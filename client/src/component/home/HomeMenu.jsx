import { Box, Button, Modal } from "@mui/material";
import dflogo from "../../dflogo.svg";
import { useState } from "react";
import LogoutUser from "../logout";
const HomeMenu = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="admin">
      <Box display={"flex"} justifyContent={"end"} margin={"20px"}>
        <Button variant="outlined" onClick={handleOpen}>Logout</Button>
      </Box>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
       <LogoutUser setOpen={setOpen}/>
      </Modal>
      <div className="admin-contain">
        <img src={dflogo} className="header_logo" alt="logo" />
        <p>Welcome To Digitalflake Admin</p>
      </div>
    </div>
  );
};
export default HomeMenu;
