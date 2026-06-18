import { Box } from "@mui/material";
import rightArrow from "../rightArrow.svg";
import { Link } from "react-router-dom";
const MenuBar = (props) => {
    const {icon,menu,link} = props
    return(
        <Link to={link} className="nav-item">
            <Box display={"flex"} alignItems={"center"}> 
            <div>
            <img width={'20px'} src={icon} className="icon_menu" alt="icon_menu" />
            </div>
            <Box sx={{textDecoration:"none"}}>{menu}</Box>
            </Box>
            <div>
            <img src={rightArrow} className="rightArrow_menu" alt="rightArrow_menu" />
            </div>
        </Link>
    )
}
export default MenuBar;