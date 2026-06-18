import { Box, Button, InputLabel, Link, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const navigate = useNavigate();
  return (
    <div className="forgot">
      <Box textAlign={"center"} mb={3}>
        <h1>Did you forget your password?</h1>
      </Box>
      <Box textAlign={"center"} mb={3}>
        <p>
          Enter your email address and we'll send you a link to restore password
        </p>
      </Box>

      <Box mb={2}>
        <InputLabel shrink htmlFor="bootstrap-input">
          Email Address
        </InputLabel>
        <TextField fullWidth id="fullWidth" />
      </Box>

      <Box mb={2}>
        <Button fullWidth variant="contained">Request reset link</Button>
      </Box>
      <Box display={'flex'} justifyContent={"center"}>
          <Link
        component="button"
        variant="body2"
        onClick={() => {
          navigate(-1);
        }}
      >
        Go to login
      </Link>
      </Box>
    
    </div>
  );
};
export default ForgotPassword;
