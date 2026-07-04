import { Box, IconButton } from "@mui/material";

import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from "@mui/icons-material";

const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
  const handleFirstPage = (event) => {
    onPageChange(event, 0);
  };

  const handleBack = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNext = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPage = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2 }}>
      <IconButton onClick={handleFirstPage} disabled={page === 0}>
        <FirstPage />
      </IconButton>

      <IconButton onClick={handleBack} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>

      <IconButton
        onClick={handleNext}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>

      <IconButton
        onClick={handleLastPage}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <LastPage />
      </IconButton>
    </Box>
  );
};

export default TablePaginationActions;
