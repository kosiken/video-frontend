import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AppLink from "../../../components/AppLink";
import { Channel } from "../../../models/User";
import LoadingPageIndicator from "../../../components/LoadingPageIndicator";
import Centered from '../../../components/Centered';
import ApiSingleton from '../../../api/api';


const ChannelInfoText = `These Details would be displayed when someone navigates to your Channel page.
Please Note that the details here must comply with our Community Guidelines`

const ChannelAnalyticsText = `Analtytics on your Channel based on user interaction. 
You can view a full summary of analytics by going to the Analytics section in the sidebar`




const CreatorDashboard = () => {
  const [channel, setChannel] = useState<Channel>();
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = React.useState(false);
  const [dialogHeader, setDialogHeader] = useState("")
  const [dialogContent, setDialogContent] = useState("")
  const [errrorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const Api = ApiSingleton();
    if(channel){
      setLoading(false)
      return;}
      Api.getChannel().then(ch => {
        setChannel(ch);
        setLoading(false);
      }).catch((e)=> {
        if(e.response)   {
          setLoading(false)
          console.log(e.response);
          switch(e.response.status) {
      
       
               case 404: 
               setErrorMessage(e.response.data.message);
               
               break;
           
           case 500:
             setErrorMessage("Server Error");
       
             break;
             default:
               setErrorMessage("Unknown Error")
               break;
          }
          setLoading(false)
          return
         
         }
         setErrorMessage(e.message);
         setLoading(false)
       
         })

  }, [channel])
  const handleClickOpen = () => {
    setOpen(true);
  };

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
        {dialogHeader}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogContent}
        </DialogContentText>
      </DialogContent>
      <DialogActions>

        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Container style={{ marginTop: "64px", minHeight: '80vh' }}
        sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
      >
        <LoadingPageIndicator />
      </Container>
    );
  }

  if (channel) return (
    <Container


      style={{ marginTop: "64px", minHeight: '80vh' }}
      sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
    >
      <Typography variant="h5" style={{ marginBottom: '20px' }}>Channel Dashboard</Typography>


      <Grid container spacing={2}>
        <Grid item sm={12} md={6} style={{ flex: 1 }}>
          <Paper sx={{ minWidth: '300px' }}>
            <Box padding="1em">
              <div style={{ display: 'flex' }}>
                <Typography variant="h6" style={{ flex: 1 }}>Channel Information</Typography>
                <IconButton color="info" onClick={() => {
                  setDialogHeader("Channel Info Help")
                  setDialogContent(ChannelInfoText);
                  handleClickOpen();
                }}>
                  <HelpOutlineIcon />
                </IconButton>
              </div>
              <Typography variant="caption" color="GrayText">
                Channel Name
              </Typography>
              <Typography sx={{ mb: 1 }}>{channel.name}</Typography>



              <Typography variant="caption" color="GrayText" >
                Channel Description
              </Typography>



              <Typography fontSize={'.9em'} sx={{ mb: 1 }}>
                {channel.short_description || "No description provided"}
              </Typography>



              <Typography variant="caption" color="GrayText" >
                Channel About Section
              </Typography>
              <Typography paragraph fontSize={'.9em'} sx={{ mb: 1 }}>
                {channel.about || "No about provided"}
              </Typography>

              <AppLink to="/creator/edit-channel">
                Edit Channel Info
              </AppLink>

            </Box>
          </Paper>
        </Grid>

        <Grid item sm={12} md={6} style={{ flex: 1 }}>
          <Paper sx={{ minWidth: '300px', }}>
            <Box padding="1em">
              <div style={{ display: 'flex' }}>
                <Typography variant="h6" style={{ flex: 1 }}>Channel Analytics</Typography>
                <IconButton color="info" onClick={() => {
                  setDialogHeader("Channel Analytics Help")
                  setDialogContent(ChannelAnalyticsText);
                  handleClickOpen();
                }}>
                  <HelpOutlineIcon />
                </IconButton>
              </div>
              <Typography variant="caption" color="GrayText">
                Total Followers
              </Typography>

              <Typography variant="h5" component="p" sx={{ mb: 1 }} >{channel.follower_count}</Typography>
              <Typography variant="caption" color="GrayText" style={{ display: 'block' }} sx={{ mt: 1 }}>
                Total Videos
              </Typography>

              <Typography paragraph fontSize={'.9em'} sx={{ mb: 1 }}>
                {channel.video_count || "Unavailable"}
              </Typography>

              <Typography variant="caption" color="GrayText" style={{ display: 'block' }} sx={{ mt: 1 }}>
                Like Count
              </Typography>

              <Typography paragraph fontSize={'.9em'} sx={{ mb: 1 }}>
                {channel.like_count || "Unavailable"}
              </Typography>


            </Box>
          </Paper>
        </Grid>
        {/* <Grid item sm={12} md={6}>

          <Paper sx={{minWidth: '300px'}}>

            <Box padding="1em">
         
          
            </Box>

          </Paper>
        </Grid> */}
      </Grid>
      {dialog}
    </Container>
  );
  return (<Container style={{ marginTop: "64px", minHeight: '80vh' }}
    sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
  >
    <Centered sx={{ height: '100%' }}>
      <Typography>An error occured {errrorMessage}</Typography>
    </Centered>
  </Container>)
};

export default CreatorDashboard;
