import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Chip,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import PageContainer from "../common/PageContainer";

import TableWrapper from "../common/TableWrapper";

import Loader from "../common/Loader";

import usePagination from "../../hooks/usePagination";

import TablePaginationActions from "../common/TablePaginationActions";

const DeliveryBoyList = () => {
  const navigate = useNavigate();

  const [deliveryBoys, setDeliveryBoys] = useState([]);

  const [availability, setAvailability] = useState("");

  const [loading, setLoading] = useState(true);

  const { page, rowsPerPage, setPage, handleRows, paginate } = usePagination();

  useEffect(() => {
    getDeliveryBoys();
  }, [availability]);

  const getDeliveryBoys = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/deliveryBoy?available=${availability}`);

      setDeliveryBoys(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete Delivery Boy?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/deliveryBoy/${id}`);

      getDeliveryBoys();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <PageContainer>
      {/* Header */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <h2>Delivery Boys</h2>

        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            select
            size="small"
            label="Availability"
            value={availability}
            sx={{
              width: 170,
            }}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>

            <MenuItem value="true">Available</MenuItem>

            <MenuItem value="false">Busy</MenuItem>
          </TextField>

          <Button
            variant="contained"
            onClick={() => navigate("/dgflake/deliveryBoy/add")}
          >
            Add Delivery Boy
          </Button>
        </Box>
      </Box>

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

              <TableCell>Mobile</TableCell>

              <TableCell>Vehicle</TableCell>

              <TableCell>Available</TableCell>

              <TableCell>Verified</TableCell>

              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {deliveryBoys.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Delivery Boys Found
                </TableCell>
              </TableRow>
            )}

            {paginate(deliveryBoys).map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                <TableCell>{item.name}</TableCell>

                <TableCell>{item.mobile}</TableCell>

                <TableCell>{item.vehicleType}</TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    color={item.isAvailable ? "success" : "warning"}
                    label={item.isAvailable ? "Available" : "Busy"}
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    color={item.isVerified ? "success" : "default"}
                    label={item.isVerified ? "Verified" : "Pending"}
                  />
                </TableCell>

                <TableCell align="center">
                  <Button
                    size="small"
                    onClick={() => navigate(`/dgflake/deliveryBoy/${item._id}`)}
                  >
                    View
                  </Button>

                  <Button
                    size="small"
                    onClick={() =>
                      navigate(`/dgflake/deliveryBoy/edit/${item._id}`)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    color="error"
                    size="small"
                    onClick={() => handleDelete(item._id)}
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
        count={deliveryBoys.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={handleRows}
        ActionsComponent={TablePaginationActions}
      />
    </PageContainer>
  );
};

export default DeliveryBoyList;
