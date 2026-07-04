import { Box } from "@mui/material";
import { useState } from "react";

import SearchBar from "../searchbar";
import PageContainer from "../common/PageContainer";
import CategoryTable from "./categoryTable";

const CategoriesList = () => {
  const [search, setSearch] = useState("");

  return (
    <PageContainer>
      <SearchBar
        title="Category"
        onSearch={setSearch}
        addRoute="addcategories"
      />

      <Box mt={3}>
        <CategoryTable search={search} />
      </Box>
    </PageContainer>
  );
};

export default CategoriesList;
