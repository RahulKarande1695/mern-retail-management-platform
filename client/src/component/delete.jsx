import { Box, Button } from "@mui/material";
import logout from "../logout.svg";
const DeleteUi = () => {
return(
    <div>
          <img src={logout} className="App-logo" alt="logoout" />
          <h1 style={{display:"inline-block"}}>Delete</h1>
          <p>Are you sure you want to delete ?</p>
          <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
        >
          <Button variant="contained">Cancel</Button>
          <Button variant="outlined">Confirm</Button>
        </Box>
    </div>
)
}
export default DeleteUi;