import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  TablePagination,
} from "@mui/material";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import TableWrapper from "../common/TableWrapper";

import Loader from "../common/Loader";

import usePagination from "../../hooks/usePagination";

const CategoryTable = ({ search }) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const { page, rowsPerPage, setPage, handleRows, paginate } = usePagination();

  useEffect(() => {
    getCategories();
  }, [search]);

  const getCategories = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/categories?search=${search}`);

      setCategories(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete category?")) return;

    await api.delete(`/categories/${id}`);

    getCategories();
  };

  if (loading) return <Loader />;

  return (
    <>
      <TableWrapper>
        <Table>
          <TableHead
            sx={{
              background: "#FFF8B7",
            }}
          >
            <TableRow>
              <TableCell>Sr</TableCell>

              <TableCell>Name</TableCell>

              <TableCell>Description</TableCell>

              <TableCell>Status</TableCell>

              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginate(categories).map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                <TableCell>{item.name}</TableCell>

                <TableCell>{item.description}</TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={item.status ? "Active" : "Inactive"}
                    color={item.status ? "success" : "default"}
                  />
                </TableCell>

                <TableCell align="center">
                  <Button
                    onClick={() =>
                      navigate(`/dgflake/categories/edit/${item._id}`)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    color="error"
                    onClick={() => deleteCategory(item._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>

      <TablePagination
        component="div"
        count={categories.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={handleRows}
      />
    </>
  );
};

export default CategoryTable;
