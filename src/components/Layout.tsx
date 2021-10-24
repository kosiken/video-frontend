import { Typography } from '@mui/material'
import React from 'react'
import ButtonAppBar from './ButtonAppBar'
import Header from './Header'
import { useSelector } from 'react-redux'
import { AppState } from '../store'
import {
 
  Redirect,
  useLocation
} from "react-router-dom";

type LayoutProps = {
    children: any;
  
    showHeader?: boolean
}
const Layout: React.FC<LayoutProps> = ({children}) => {
  let location = useLocation();



  const user = useSelector((state: AppState) => state.auth.user);
    const getHeader = () => location.pathname === "/login" ? <div/> : user === undefined ? <ButtonAppBar/> : <Header/>;

    if(user && (location.pathname === "/login" || location.pathname === "/" || location.pathname === "/signup")) {
        return <Redirect to="/dashboard" />
    }
    return (
        <div className="layout">
          {getHeader()}
            {children}

            <footer>
          <Typography align="center">&copy; KRC media 2021 </Typography>
        </footer>
        </div>
    )
}

export default Layout
