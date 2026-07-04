import { Box } from "@mui/material";

const PageContainer = ({ children }) => {
  return (
    <Box
      sx={{
        background: "#fff",

        p: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },

        m: {
          xs: 1,
          md: 2,
        },

        minHeight: "calc(100vh - 90px)",

        borderRadius: 2,

        boxShadow: "0px 1px 5px rgba(0,0,0,.15)",

        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;
