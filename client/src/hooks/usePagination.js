import { useState } from "react";

const usePagination = () => {
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginate = (data) => {
    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const handleRows = (e) => {
    setRowsPerPage(Number(e.target.value));

    setPage(0);
  };

  return {
    page,
    rowsPerPage,
    setPage,
    handleRows,
    paginate,
  };
};

export default usePagination;
