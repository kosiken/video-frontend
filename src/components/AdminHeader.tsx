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
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from "@mui/icons-material/Add";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SettingsIcon from "@mui/icons-material/Settings";
import Tooltip from "@mui/material/Tooltip";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Switch from "@mui/material/Switch";
import { useDispatch  } from "react-redux";

import AppLink from "./AppLink";
import Home  from "@mui/icons-material/Home";

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
  { title: "Create Video", url: "/add-video", Icon: AddCircleIcon },
  { title: "Edit Channel", url: "/edit-channel", Icon: EditIcon },
  { title: "Bank Account", url: "/edit-bank-account", Icon: EditIcon },
  { title: "Analytics", url: "/analytics", Icon: AnalyticsIcon },
  { title: "Income", url: "/income", Icon: AccountBalanceWalletIcon },

];
export default function  AdminHeader(props: Props) {
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
          const to = ('/admin' + Item.url) 
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
             <AppLink to={'/'} doNotUseButton >
          <ListItem  button >
            <ListItemIcon >
              <Home />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
          </AppLink>
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
        color="primary"
        elevation={0}
        position="fixed"
        style={{ top: 0 }}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Ereder Admin
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
            display: { sm: "block", md: "none" },
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
            display: { sm: "none", xs: "none", md: "block" },
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
