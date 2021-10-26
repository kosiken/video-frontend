import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import Switch from '@mui/material/Switch';
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddIcon from "@mui/icons-material/Add";
import MoreIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../store";
import AppLink from "./AppLink";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Header() {
  const user = useSelector((state: AppState) => state.auth.user);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dark, setDark] = React.useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isSettingsMenuOpen = Boolean(settingsAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    handleSettingsMenuClose()
  };

  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
   
  };

  const handleMobileMenuOpen = (event: any) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleSettingsMenuOpen = (event: any) => {
    setSettingsAnchorEl(event.currentTarget);
  };
  const menuId = "primary-search-account-menu";
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
 
        <MenuItem onClick={()=> {
          setDark(!dark);
        //  handleSettingsMenuClose();
        }}>
        <Switch checked={dark} size="small" /> <span> Dark Mode </span>
        </MenuItem>
      
    </Menu>
  );
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link
        style={{ textDecoration: "none", color: "inherit" }}
        to="/main/my-dashboard"
      >
        <MenuItem onClick={handleMenuClose}>My Dashboard</MenuItem>
      </Link>
      {user?.isCreator && (
        <Link
          style={{ textDecoration: "none", color: "inherit" }}
          to="/creator/dashboard"
        >
          <MenuItem onClick={handleMenuClose}>Creator Dashboard</MenuItem>
        </Link>
      )}

      <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <AppLink
        to={user?.isCreator ? "/creator/add-video" : "/main/become-creator"}
        doNotUseButton
      >
        <MenuItem onClick={handleMenuClose}>
          <IconButton size="large" color="inherit">
            <AddIcon />
          </IconButton>
          <p>Add Video</p>
        </MenuItem>
      </AppLink>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar
            sx={{ width: 24, height: 24 }}
            alt={user?.fullName}
            src={user?.profilePic}
          />
        </IconButton>
        <p>Profile</p>
      </MenuItem>

      <MenuItem onClick={handleSettingsMenuOpen}>
        <IconButton size="large" edge="end" color="inherit">
          <SettingsIcon />
          
        </IconButton>
        <p>Settings</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="default" elevation={0} position="fixed" style={{ top: 0 }}>
        <Toolbar>
          <AppLink to="/main" doNotUseButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Ereder
            </Typography>
          </AppLink>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <AppLink
              to={
                user?.isCreator ? "/creator/add-video" : "/main/become-creator"
              }
              doNotUseButton
            >
              <Tooltip title="Add a video">
                <IconButton size="large" edge="end" color="inherit">
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </AppLink>

            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              title="lion"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{ width: 30, height: 30 }}
                alt={user?.fullName}
                src={user?.profilePic}
              />
            </IconButton>
            <Tooltip title="Settings">
              <IconButton onClick={handleSettingsMenuOpen} size="large" edge="end" color="inherit">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {settingsMenu}
    </Box>
  );
}
