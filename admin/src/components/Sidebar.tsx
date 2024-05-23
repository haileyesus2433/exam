import {
  Divider,
  Icon,
  IconButton,
  List,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import MuiDrawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import { NavListItems } from "./ListItem";
import Logo from "../assets/icons/Logo";

interface DrawerProps extends MuiDrawerProps {
  drawerWidth: number;
}
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<DrawerProps>(({ theme, open, drawerWidth }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

type SideBarPropType = {
  open: boolean;
  toggleDrawer: () => void;
  drawerWidth: number;
};

const Sidebar = ({ open, toggleDrawer, drawerWidth }: SideBarPropType) => {
  return (
    <Drawer variant="permanent" open={open} drawerWidth={drawerWidth}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <Logo height={32} width={32} />

        <Typography variant="h6" sx={{ marginLeft: "15px" }}>
          T-Movie
        </Typography>

        <IconButton onClick={toggleDrawer} sx={{ marginLeft: "20px" }}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">{NavListItems}</List>
    </Drawer>
  );
};

export default Sidebar;
