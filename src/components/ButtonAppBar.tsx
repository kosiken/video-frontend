import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useScrollTrigger } from '@mui/material';


interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

function ElevationScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function ButtonAppBar(v: any) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ElevationScroll {...v.props}>
      < AppBar>
        <Toolbar>
        <Link to="/" style={{display: 'block', textDecoration: 'none', color: 'white', flex: 1 }} >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Ereder
          </Typography>
          </Link>
          <Link to="/login" style={{display: 'block', textDecoration: 'none', color: 'white'}} >
          <Button color="inherit">Login</Button>
          </Link>
        </Toolbar>
      </AppBar>
      </ElevationScroll>
    </Box>
  );
}