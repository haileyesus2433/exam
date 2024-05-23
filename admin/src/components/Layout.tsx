import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import React, { PropsWithChildren } from "react";

const drawerWidth: number = 240;
const defaultTheme = createTheme();

const Layout = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex", margin: 0, padding: 0 }}>
        <CssBaseline />
        <Header
          open={open}
          toggleDrawer={toggleDrawer}
          drawerWidth={drawerWidth}
        />
        <Sidebar
          open={open}
          toggleDrawer={toggleDrawer}
          drawerWidth={drawerWidth}
        />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
