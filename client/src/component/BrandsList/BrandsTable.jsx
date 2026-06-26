import React, {
  useEffect,
  useState,
} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  useNavigate,
} from "react-router-dom";
import api from "../../api/axios";
import deleteOptionTable from "../../deleteOptionTable.svg";
import editOptionTable from "../../editOptionTable.svg";
import disabledDelete from "../../disabledDelete.svg";

function BrandsTable({
  search,
}) {
  const navigate =
    useNavigate();

  const [rows, setRows] =
    useState([]);

  const getBrands =
    async () => {
      try {
        const res =
          await api.get(
            `/brands?search=${search || ""}`
          );

        const formattedData =
          res.data.map(
            (
              item,
              index
            ) => ({
              id:
                index +
                1,

              _id:
                item._id,

              name:
                item.name,

              category:
                item
                  .category
                  ?.name,

              status:
                item.status
                  ? "active"
                  : "inactive",
            })
          );

        setRows(
          formattedData
        );
      } catch (err) {
        console.log(
          err
        );
      }
    };

  useEffect(() => {
    getBrands();
  }, [search]);

  const handleDelete =
    async (id) => {
      try {
        await api.delete(
          `/brands/${id}`
        );

        getBrands();
      } catch (err) {
        console.log(
          err
        );
      }
    };

  return (
    <TableContainer
      component={
        Paper
      }
    >
      <Table>
        <TableHead
          sx={{
            background:
              "#FFF8B7",
          }}
        >
          <TableRow>
            <TableCell>
              Id
            </TableCell>

            <TableCell align="right">
              Brand
            </TableCell>

            <TableCell align="right">
              Category
            </TableCell>

            <TableCell align="right">
              Status
            </TableCell>

            <TableCell align="right" />

            <TableCell align="right" />
          </TableRow>
        </TableHead>

        <TableBody>
          {rows?.length ===
            0 && (
            <TableRow>
              <TableCell
                colSpan={
                  6
                }
              >
                No Brands
                Found
              </TableCell>
            </TableRow>
          )}

          {rows?.map(
            (row) => (
              <TableRow
                key={
                  row._id
                }
                sx={{
                  background:
                    "#F2F2F2",
                }}
              >
                <TableCell>
                  {
                    row.id
                  }
                </TableCell>

                <TableCell align="right">
                  {
                    row.name
                  }
                </TableCell>

                <TableCell align="right">
                  {
                    row.category
                  }
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    color:
                      row.status ===
                      "active"
                        ? "green"
                        : "red",
                  }}
                >
                  {
                    row.status
                  }
                </TableCell>

                <TableCell align="right">
                  <img
                    src={
                      editOptionTable
                    }
                    className="edit"
                    alt="edit"
                    onClick={() =>
                      navigate(
                        `/dgflake/brands/addbrand/${row._id}`
                      )
                    }
                  />
                </TableCell>

                <TableCell align="right">
                  {row.status ===
                  "active" ? (
                    <img
                      src={
                        deleteOptionTable
                      }
                      className="delete"
                      alt="delete"
                      onClick={() =>
                        handleDelete(
                          row._id
                        )
                      }
                    />
                  ) : (
                    <img
                      src={
                        disabledDelete
                      }
                      className="delete"
                      alt="disabledDelete"
                    />
                  )}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BrandsTable;