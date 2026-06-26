import { Box } from "@mui/material";
import SearchBar from "../searchbar";
import ProductsTable from "./productsTable";
import { useState } from "react";

const ProductUi = () => {
  const [search, setSearch] = useState("");

  return (
    <Box
      sx={{
        background: "#FFFFFF",
        boxShadow: "0px 1px 4px 0px #000000",
        padding: "10px",
        margin: "10px",
        height: "85vh",
      }}
    >
      <SearchBar title={"Products"} onSearch={setSearch} addRoute="addproducts"/>
      <Box sx={{ marginTop: "30px" }}>
        <ProductsTable search={search}/>
      </Box>
    </Box>
  );
};
export default ProductUi;
