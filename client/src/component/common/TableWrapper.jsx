import { Paper, TableContainer } from "@mui/material";

const TableWrapper = ({ children }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        overflowX: "auto",

        "& table": {
          minWidth: 900,
        },
      }}
    >
      {children}
    </TableContainer>
  );
};

export default TableWrapper;
