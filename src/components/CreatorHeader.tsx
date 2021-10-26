import * as React from "react";
import { useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SettingsIcon from "@mui/icons-material/Settings";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import { useDispatch  } from "react-redux";

import AppLink from "./AppLink";

const drawerWidth = 200;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

interface IDrawerMenuItem {
  title: string;
  url: string;
  Icon: any;
}

const DrawerItems: IDrawerMenuItem[] = [
  { title: "Dashboard", url: "/dashboard", Icon: DashboardIcon },
  { title: "Create Video", url: "/createVideo", Icon: AddCircleIcon },
];
export default function CreatorHeader(props: Props) {
  let location = useLocation();
  const dispatch = useDispatch();
  // const state = useSelector((state: AppState) => state.settings.darkMode);
  const [dark, setDark] = React.useState(false);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [settingsAnchorEl, setSettingsAnchorEl] = React.useState(null);
  const isSettingsMenuOpen = Boolean(settingsAnchorEl);

  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleSettingsMenuOpen = (event: any) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const menuId2 = "settings-menu";
  const settingsMenu = (
    <Menu
      anchorEl={settingsAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId2}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isSettingsMenuOpen}
      onClose={handleSettingsMenuClose}
    >
      <MenuItem
        onClick={() => {
          dispatch({ type: "change-theme", value: !dark });
          setDark(!dark);
          //  handleSettingsMenuClose();
        }}
      >
        <Switch checked={dark} size="small" /> <span> Dark Mode </span>
      </MenuItem>
    </Menu>
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Box padding="0 1em"></Box>
      <Divider />
      <List>
        {DrawerItems.map((Item, index) => {
          const to = ('/creator' + Item.url) 
            const selected = to === location.pathname
          return (
            <AppLink to={to} doNotUseButton key={'ereder-drawer-item' + index}>
          <ListItem selected={selected} button >
            <ListItemIcon >
              <Item.Icon/>
            </ListItemIcon>
            <ListItemText primary={Item.title} />
          </ListItem>
          </AppLink>
        )
        }
        )}
      </List>
      {/* <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))} 
      </List>
      */}
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        color="default"
        elevation={0}
        position="fixed"
        style={{ top: 0 }}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Ereder Creator
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Settings">
            <IconButton
              onClick={handleSettingsMenuOpen}
              size="large"
              edge="end"
              color="inherit"
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        {settingsMenu}
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      ></Box>
    </Box>
  );
}
