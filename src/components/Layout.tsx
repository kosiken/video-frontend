import  Typography  from '@mui/material/Typography'

import React from 'react'

import Header from './Header'

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
        <div className="layout" >
          <Header/>
            {children}

            <footer>
          <Typography align="center">&copy; KRC media 2021 </Typography>
        </footer>
        </div>
    )
}

export default Layout
