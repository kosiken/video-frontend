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
import ApiSignleton from "../../api/api";
import ErrorPageIndicator from "../../components/ErrorPageIndicator";
import AppLink from "../../components/AppLink";


const Sidebar = () => {
  const [creators, setCreators] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const sliceCreators = () =>  creators;

  function retry() {
    if (creators.length > 0) return;
    const userApi = ApiSignleton();
    userApi.getChannels().then(c => {
      setCreators(c);
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
    const userApi = ApiSignleton();
    userApi.getChannels().then(c => {
      setCreators(c);
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
  
      style={{ padding: '1em 0 0' }}
    >
      <Paper elevation={0} style={{ height: "95%", overflowY: 'scroll' }}>
        {sliceCreators().map((creator, index) => {
          return (
            <Link to={"/main/creator/" + creator.id} key={"creator" + index} style={{ display: 'block', textDecoration: 'none', color: 'inherit', marginBottom: 10 }}>
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

const AllChannels = () => {
  // 
  return (
    <Box>
      <Box style={{ maxHeight: 'calc(100vh )', overflow: 'hidden', paddingTop: '64px' }} sx={{ position: "relative", display: { sm: "block", md: "flex" } }}>
        <Box style={{ overflowY: 'scroll', height: '100vh' }} flex={1}>

          <Container maxWidth="md">
          <Sidebar />
          </Container>
        </Box>
    

      </Box>
    </Box>
  );
};

export default AllChannels;
