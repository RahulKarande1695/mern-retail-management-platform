import catogeryPageIcon from "../catogeryPageIcon.svg";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import api from "../api/axios";

const SearchBar = (props) => {
  const {
    title,
    onSearch,
    addRoute,
  } = props;

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      my={1}
      mx={2}
    >
      <Box display={"flex"} alignItems={"center"}>
        <img
          src={catogeryPageIcon}
          className="catogeryPageIcon"
          alt="catogeryPageIcon"
        />
        <label>{title}</label>
      </Box>

      <Paper
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          height: "34px",
          width: 400,
        }}
      >
        <IconButton
          type="button"
          sx={{ p: "10px" }}
        >
          <SearchIcon />
        </IconButton>

        <InputBase
          sx={{
            ml: 1,
            flex: 1,
          }}
          onChange={(e) =>
            onSearch(
              e.target.value
            )
          }
        />
      </Paper>

      <Link to={addRoute}>
        Add New
      </Link>
    </Box>
  );
};

export default SearchBar;
