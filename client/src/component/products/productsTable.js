import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import TableWrapper from "../common/TableWrapper";

import Loader from "../common/Loader";

import usePagination from "../../hooks/usePagination";

const ProductTable = ({ search }) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const { page, rowsPerPage, setPage, handleRows, paginate } = usePagination();

  useEffect(() => {
    getProducts();
  }, [search]);

  const getProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/products?search=${search}`);

      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete Product?")) return;

    await api.delete(`/products/${id}`);

    getProducts();
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

              <TableCell>Category</TableCell>

              <TableCell>Brand</TableCell>

              <TableCell>Stock</TableCell>

              <TableCell>MRP</TableCell>

              <TableCell>Status</TableCell>

              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginate(products).map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                <TableCell>{item.name}</TableCell>

                <TableCell>{item.category?.name}</TableCell>

                <TableCell>{item.brand?.name}</TableCell>

                <TableCell>{item.stock}</TableCell>

                <TableCell>₹{item.mrp}</TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    color={item.status ? "success" : "default"}
                    label={item.status ? "Active" : "Inactive"}
                  />
                </TableCell>

                <TableCell align="center">
                  <Button
                    size="small"
                    onClick={() =>
                      navigate(`/dgflake/products/edit/${item._id}`)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    color="error"
                    size="small"
                    onClick={() => deleteProduct(item._id)}
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
        count={products.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={handleRows}
      />
    </>
  );
};

export default ProductTable;
