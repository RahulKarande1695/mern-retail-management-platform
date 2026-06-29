import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

const DeliveryBoyList = () => {
  const navigate = useNavigate();

  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [availability, setAvailability] = useState("");

  useEffect(() => {
    getDeliveryBoys();
  }, []);

  const getDeliveryBoys = async () => {
    try {
      const res = await api.get("/deliveryBoy");

      setDeliveryBoys(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete Delivery Boy?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/deliveryBoy/${id}`);

      getDeliveryBoys();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredData = availability
    ? deliveryBoys.filter(
        (item) =>
          String(item.isAvailable) === availability
      )
    : deliveryBoys;

  return (
    <Box
      sx={{
        background: "#FFFFFF",
        padding: "15px",
        margin: "10px",
        minHeight: "85vh",
        boxShadow: "0px 1px 4px rgba(0,0,0,.2)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <h2>Delivery Boys</h2>

        <Box display="flex" gap={2}>
          <TextField
            select
            label="Availability"
            size="small"
            value={availability}
            onChange={(e) =>
              setAvailability(e.target.value)
            }
            sx={{
              width: 170,
            }}
          >
            <MenuItem value="">
              All
            </MenuItem>

            <MenuItem value="true">
              Available
            </MenuItem>

            <MenuItem value="false">
              Busy
            </MenuItem>
          </TextField>

          <Button
            variant="contained"
            onClick={() =>
              navigate("/dgflake/deliveryBoy/add")
            }
          >
            Add Delivery Boy
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>

          <TableHead
            sx={{
              background: "#FFF8B7",
            }}
          >
            <TableRow>

              <TableCell>
                Sr No.
              </TableCell>

              <TableCell>
                Name
              </TableCell>

              <TableCell>
                Mobile
              </TableCell>

              <TableCell>
                Vehicle
              </TableCell>

              <TableCell>
                Available
              </TableCell>

              <TableCell>
                Verified
              </TableCell>

              <TableCell align="center">
                Action
              </TableCell>

            </TableRow>
          </TableHead>

          <TableBody>

            {filteredData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                >
                  No Delivery Boys Found
                </TableCell>
              </TableRow>
            )}

            {filteredData.map(
              (item, index) => (
                <TableRow
                  key={item._id}
                >
                  <TableCell>
                    {index + 1}
                  </TableCell>

                  <TableCell>
                    {item.name}
                  </TableCell>

                  <TableCell>
                    {item.mobile}
                  </TableCell>

                  <TableCell>
                    {item.vehicleType}
                  </TableCell>

                  <TableCell>

                    <Chip
                      size="small"
                      color={
                        item.isAvailable
                          ? "success"
                          : "warning"
                      }
                      label={
                        item.isAvailable
                          ? "Available"
                          : "Busy"
                      }
                    />

                  </TableCell>

                  <TableCell>

                    <Chip
                      size="small"
                      color={
                        item.isVerified
                          ? "success"
                          : "default"
                      }
                      label={
                        item.isVerified
                          ? "Verified"
                          : "Pending"
                      }
                    />

                  </TableCell>

                  <TableCell
                    align="center"
                  >
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(
                          `/dgflake/deliveryBoy/${item._id}`
                        )
                      }
                    >
                      View
                    </Button>

                    <Button
                      size="small"
                      onClick={() =>
                        navigate(
                          `/dgflake/deliveryBoy/edit/${item._id}`
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      color="error"
                      size="small"
                      onClick={() =>
                        handleDelete(
                          item._id
                        )
                      }
                    >
                      Delete
                    </Button>
                  </TableCell>

                </TableRow>
              )
            )}

          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
};

export default DeliveryBoyList;