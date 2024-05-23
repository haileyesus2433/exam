import { Avatar, IconButton, Toolbar, Typography, styled } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

type PropType = {
  open: boolean;
  toggleDrawer: () => void;
  drawerWidth: number;
};

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  drawerWidth: number;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open, drawerWidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Header = ({ open, toggleDrawer, drawerWidth }: PropType) => {
  return (
    <AppBar position="absolute" open={open} drawerWidth={drawerWidth}>
      <Toolbar
        sx={{
          pr: "24px",
          flex: 1,
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1, textAlign: "left" }}
        >
          Dashboard
        </Typography>
        <IconButton color="inherit" edge="end">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit" edge="end" sx={{ marginLeft: "20px" }}>
          <Avatar />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
