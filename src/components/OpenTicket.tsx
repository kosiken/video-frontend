import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { alpha } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import BugReportIcon from '@mui/icons-material/BugReport';
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ApiSignleton from '../api/api';

export default function OpenTicket() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
const [body, setBody] = useState('')

const [title, setTitle] = useState('')

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReport = async () => {
   
setLoading(true)
try {
  const Api = ApiSignleton();
   await Api.addTicket(title,body);
  
  handleClose()
  alert("ticket submited")
} catch (error) {
  alert("an error occurred")
}
   setLoading(false);
  }
  const dialog = (<Dialog open={open} >
   {loading && <LinearProgress/>}
    <DialogTitle>Report An Issue</DialogTitle>
    <DialogContent>
      <Paper sx={{
        bgcolor: (theme) =>
          alpha(theme.palette.success.main, theme.palette.action.activatedOpacity),
      p: 2, mb:1}}>
      <DialogContentText >
        
        This Web App and Service is still in testing and so we would love to hear if you have any issue to report
      </DialogContentText>
      </Paper>

      <TextField
        autoFocus
  
        margin="dense"
        id="issueTitle"
        label="Subject"
        type="text"
        fullWidth
        onChange={(e)=> {
          setTitle(e.target.value)
        }}
        variant="standard"
      
      />
      
      <TextField
        
        rows={3}
multiline
        margin="dense"
        id="issueBody"
        label="Issue"
        type="text"
        fullWidth
        onChange={(e)=> {
          setBody(e.target.value)
        }}
        variant="standard"
        helperText={
       (   <Typography fontSize="12px">
You can also check our <a href="/faqs">faqs</a> for help
          </Typography>)
        }
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button disabled={body.length < 10 || title.length < 3} onClick={handleReport}>Report</Button>
    </DialogActions>
  </Dialog>)
  return (
    <Box sx={{ position: 'fixed', bottom: '20px', right: '20px' }}>
      <Fab size="medium" onClick={handleClickOpen} color="primary" aria-label="add">
        <BugReportIcon />
      </Fab>
      {dialog}
    </Box>
  );
}
