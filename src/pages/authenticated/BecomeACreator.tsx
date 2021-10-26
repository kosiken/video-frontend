import React, {useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import  CircularProgress from "@mui/material/CircularProgress";
 
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Centered from "../../components/Centered";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store";
import { Redirect } from "react-router";

const BecomeACreator= () => {
    const user = useSelector((state: AppState) => state.auth.user);
const [loading, setLoading] = useState(false)

    const dispatch = useDispatch();

    const activateCreatorMode = () => {
        setLoading(true)
        setTimeout(() => {
            dispatch({type: 'become_creator'});
            setLoading(false)
           // window.location.pathname = '/creator/dashboard'
        }, 1000)
    }
 

  return (
    <Box style={{ marginTop: "4em" , height: 'calc(100vh - 64px)'}}>

        {user?.isCreator && (<Redirect to="/creator/dashboard" />)}
        
      <Container  maxWidth="sm" style={{height: '100%'}} >
          <Centered sx={{height: '100%'}}>
          <Paper style={{padding: '2em',textAlign: 'center'}} elevation={3}>
              <img style={{width: '100%', maxWidth: 350}} alt="Become a creator" src="/images/share.png" />

              <Typography align="center" sx={{mt: 2, mb: 2}} variant="h4">
                Become a Creator
              </Typography>

              <Typography  align="center" sx={{mt: 2, mb: 2}} >
                    Join over <Typography component="span" color="#e770de"> 1000</Typography> creators who create everyday on Ereder
              </Typography>

              <Typography  fontSize={".9em"} color="GrayText" align="center" sx={{mt: 2, mb: 2}} >
                    By becoming a creator you are required to comply with our <a href="/content-policy">content policy</a> and follow all the <a href="/community-guidelines">Community Guidelines</a>
              </Typography>

              <Button onClick={activateCreatorMode}  variant="contained" style={{minWidth: 103}}>{loading? <CircularProgress size={30} color="inherit" /> :'Continue'}</Button> 
          </Paper>
          </Centered>

      </Container>
     
    </Box>
  );
};

export default BecomeACreator;
