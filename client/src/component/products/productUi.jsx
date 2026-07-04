import { Box } from "@mui/material";
import { useState } from "react";

import SearchBar from "../searchbar";
import PageContainer from "../common/PageContainer";
import ProductTable from "./productsTable";

const ProductUi = () => {
  const [search, setSearch] = useState("");

  return (
    <PageContainer>
      <SearchBar title="Products" onSearch={setSearch} addRoute="addproducts" />

      <Box mt={3}>
        <ProductTable search={search} />
      </Box>
    </PageContainer>
  );
};

export default ProductUi;
