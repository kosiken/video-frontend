import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Centered from "../../components/Centered";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store";
import { Redirect } from "react-router";
import ApiSignleton from "../../api/api";

const BecomeACreator = () => {
  const user = useSelector((state: AppState) => state.auth.user);
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const dispatch = useDispatch();
  const Api = ApiSignleton();



  const activateCreatorMode = () => {
    setLoading(true)
    Api.becomeCreator().then(({ isCreator }) => {
      if (isCreator) {
        dispatch({ type: 'become_creator' })
      }
      else {
        setReason('Failed to make you a creator')
        setOpen(true)
      }
    }).catch(err => {
      setReason("Request Could not be completed at this time"); setOpen(true)
    })
  }


  const handleClose = () => {
    setOpen(false);
  };

  const dialog = (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Failed
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {reason}
        </DialogContentText>
      </DialogContent>
      <DialogActions>

        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )



  return (
    <Box style={{ paddingTop: "4em", minHeight: 'calc(100vh - 64px)' }}>

      {user?.isCreator && (<Redirect to="/creator/dashboard" />)}

      <Container maxWidth="sm" style={{ height: '100%' }} >
        <Centered sx={{ height: '100%' }}>
          <Paper style={{ padding: '2em', textAlign: 'center' }} elevation={3}>
            <img style={{ width: '100%', maxWidth: 350 }} alt="Become a creator" src="/images/share.png" />

            <Typography align="center" sx={{ mt: 2, mb: 2 }} variant="h4">
              Become a Creator
            </Typography>

            <Typography align="center" sx={{ mt: 2, mb: 2 }} >
              Join over <Typography component="span" color="#e770de"> 1000</Typography> creators who create everyday on Ereder
            </Typography>

            <Typography fontSize={".9em"} color="GrayText" align="center" sx={{ mt: 2, mb: 2 }} >
              By becoming a creator you are required to comply with our <a href="/content-policy">content policy</a> and follow all the <a href="/community-guidelines">Community Guidelines</a>
            </Typography>

            <Button onClick={activateCreatorMode} variant="contained" style={{ minWidth: 103 }}>{loading ? <CircularProgress size={30} color="inherit" /> : 'Continue'}</Button>
          </Paper>
        </Centered>
{dialog}
      </Container>

    </Box>
  );
};

export default BecomeACreator;
