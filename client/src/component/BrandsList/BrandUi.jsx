import { Box } from "@mui/material";
import { useState } from "react";

import SearchBar from "../searchbar";
import BrandsTable from "./BrandsTable";

import PageContainer from "../common/PageContainer";

const BrandUi = () => {
  const [search, setSearch] = useState("");

  return (
    <PageContainer>
      <SearchBar title="Brands" onSearch={setSearch} addRoute="addbrand" />

      <Box mt={3}>
        <BrandsTable search={search} />
      </Box>
    </PageContainer>
  );
};

export default BrandUi;
