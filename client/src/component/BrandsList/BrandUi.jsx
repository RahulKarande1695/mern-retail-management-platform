import { Box } from "@mui/material";
import { useState } from "react";

import SearchBar from "../searchbar";
import BrandsTable from "./BrandsTable";

const BrandUi = () => {
  const [search, setSearch] =
    useState("");

  return (
    <Box
      sx={{
        background: "#FFFFFF",
        boxShadow:
          "0px 1px 4px 0px #000000",
        padding: "10px",
        margin: "10px",
        height: "85vh",
      }}
    >
      <SearchBar
        title={"Brands"}
        onSearch={setSearch}
        addRoute="addbrand"
      />

      <Box
        sx={{
          marginTop: "30px",
        }}
      >
        <BrandsTable
          search={search}
        />
      </Box>
    </Box>
  );
};

export default BrandUi;