import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Box
      height="60vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress />
    </Box>
  );
};

export default Loader;
