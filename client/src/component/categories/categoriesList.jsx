import { Box } from "@mui/material";
import SearchBar from "../searchbar";
import CategoryTable from "./categoryTable";
import { useState } from "react";

const CategoriesList = () => {
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
      <SearchBar title="Category" onSearch={setSearch}  addRoute="addcategories"/>
      <Box sx={{ marginTop: "30px" }}>
        <CategoryTable search={search} />
      </Box>
    </Box>
  );
};
export default CategoriesList;
