import { Typography } from '@mui/material'
import React from 'react'
import User from '../models/User'
import ButtonAppBar from './ButtonAppBar'
import Header from './Header'


type LayoutProps = {
    children: any;
    user?: User;
    showHeader?: boolean
}
const Layout: React.FC<LayoutProps> = ({children,user}) => {
    const getHeader = () => user === undefined ? <ButtonAppBar/> : <Header/>;
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
