import  Typography  from '@mui/material/Typography'
import Box from "@mui/material/Box";
import React from 'react'

import Header from './Header'
import OpenTicket from './OpenTicket';

// import {
 
//   Redirect,
//   useLocation
// } from "react-router-dom";

type LayoutProps = {
    children: any;
  
    showHeader?: boolean
}
const Layout: React.FC<LayoutProps> = ({children}) => {
  // let location = useLocation();



  // const user = useSelector((state: AppState) => state.auth.user);
  
    return (
        <Box >
          <Header/>
            {children}
<OpenTicket/>
            <footer>
          <Typography align="center">&copy; KRC media 2021 </Typography>
        </footer>
        </Box>
    )
}

export default Layout
