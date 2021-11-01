import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import VideoGrid from "../../components/VideoGrid";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from '@mui/material/Button'
import { Link } from "react-router-dom";
import { Channel } from "../../models/User";
import LoadingPageIndicator from "../../components/LoadingPageIndicator";
import UserApiSignleton from "../../api/userApi";
import ErrorPageIndicator from "../../components/ErrorPageIndicator";
import AppLink from "../../components/AppLink";


const Sidebar = () => {
  const [creators, setCreators] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const sliceCreators = () => creators.length > 20 ? creators.slice(0, 19) : creators;

  function retry() {
    if (creators.length > 0) return;
    const userApi = UserApiSignleton();
    userApi.getFollowing().then(c => {
      setCreators(c.map(s => s.channel));
      setLoading(false)
    }).catch((error) => {
      console.log(error);
      if (error.response) {
        setErrorMessage(error.response.data.problems || error.response.data.message);
        setHasError(true)
        setLoading(false)
      }
      else {
        setErrorMessage("An error occured " +  error.message);
        setHasError(true)
        setLoading(false)
      }
    })
  }
  useEffect(() => {
    const userApi = UserApiSignleton();
    userApi.getFollowing().then(c => {
      setCreators(c.map(s => s.channel));
      setLoading(false)
    }).catch((error) => {
      console.log(error);
      if (error.response) {
        setErrorMessage(error.response.data.problems || error.response.data.message);
        setHasError(true)
        setLoading(false)
      }
      else {
        setErrorMessage("An error occured " +  error.message);
        setHasError(true)
        setLoading(false)
      }
    })


  },[])

  
  if (loading) {
    return (<Box padding="0" sx={{
      display: { md: "block", sm: "none" },
      width: { md: "250px", sm: "90vw" },

    }}>
      <LoadingPageIndicator height={"80vh"} />
    </Box>);
  }
  if(hasError) {
    return (<Box padding="0" sx={{
      display: { md: "block", sm: "none" },
      width: { md: "250px", sm: "90vw" },

    }}>
      <ErrorPageIndicator errorMessage={errorMessage} retry={retry} height={"80vh"} />
    </Box>);
  }

  return (
    <Box
      sx={{
        display: { md: "block", sm: "none" },
        width: { md: "250px", sm: "90vw" },

      }}
      style={{ padding: '1em 0 0' }}
    >
      <Typography fontWeight="bold" component="span" style={{ marginLeft: 15 }}>Following ({creators.length})</Typography> <AppLink sx={{ml: 0.2}} to="/main/my-dashboard#channel">View All</AppLink>
      <Paper elevation={0} style={{ height: "95%", overflowY: 'scroll' }}>
        {sliceCreators().map((creator, index) => {
          return (
            <Link to={"#/creator/" + index} key={"creator" + index} style={{ display: 'block', textDecoration: 'none', color: 'inherit', marginBottom: 10 }}>
              <Button style={{ textTransform: 'none', display: 'flex', width: '100%', justifyContent: 'flex-start', color: 'inherit' }}>
                <Avatar
                  alt={creator.name}
                  src={creator.logo}
                />

                <Typography style={{ marginLeft: 15 }}>{creator.name}</Typography>
              </Button>
            </Link>
          )
        })}
      </Paper>
    </Box>
  );

  
}

const Dashboard = () => {
  // 
  return (
    <Box>
      <Box style={{ maxHeight: 'calc(100vh )', overflow: 'hidden', paddingTop: '64px' }} sx={{ position: "relative", display: { sm: "block", md: "flex" } }}>
        <Box style={{ overflowY: 'scroll', height: '100vh' }} flex={1}>

          <Container maxWidth="md">

            <VideoGrid videoPlaceholderCount={24} lg={4} md={4} prefix="/main" />
          </Container>
        </Box>
        <Sidebar />

      </Box>
    </Box>
  );
};

export default Dashboard;
