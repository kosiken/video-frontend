import { Typography } from '@mui/material'
import React from 'react'
import ButtonAppBar from './ButtonAppBar'


// import {
 
//   Redirect,
//   useLocation
// } from "react-router-dom";

type LayoutProps = {
    children: any;
  

}
const LayoutOpen: React.FC<LayoutProps> = ({children}) => {
  // let location = useLocation();



  // const user = useSelector((state: AppState) => state.auth.user);
  
    return (
        <div className="layout">
          <ButtonAppBar />
            {children}

            <footer>
          <Typography align="center">&copy; KRC media 2021 </Typography>
        </footer>
        </div>
    )
}

export default LayoutOpen;
