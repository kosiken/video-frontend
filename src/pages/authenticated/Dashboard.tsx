import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import VideoGrid from "../../components/VideoGrid";
import Container from "../../components/Container";
import Avatar from "@mui/material/Avatar";
import Button from '@mui/material/Button'
import { Link } from "react-router-dom";

const Dashboard = () => {
    const creators: Array<{name: string; url: string}> = new Array(20).fill( {name: "Sam Smith", url: "/images/me.jpeg"})
  return (
    <Box>
      <Box style={{maxHeight: 'calc(100vh )', overflow: 'hidden', marginTop: '64px'}} sx={{ position: "relative", display: { sm: "block", md: "flex" } }}>
        <Box style={{overflowY: 'scroll'}} flex={1}>
          <Container>
            <VideoGrid videoPlaceholderCount={24} />
          </Container>
        </Box>

        <Box
          sx={{
            display: { md: "block", sm: "none" },
            width: { md: "350px", sm: "90vw" },
            
          }}
          style={{padding: '1em 0 0'}}
        >
             <Typography fontWeight="bold" style={{marginLeft: 15}}>Following ({creators.length})</Typography>
          <Paper elevation={0} style={{ height: "95%" , overflowY: 'scroll'}}>
            {creators.map((creator, index) => {
                return (
                    <Link to={"#/creator/" + index} key={"creator" + index} style={{display: 'block', textDecoration: 'none', color: 'inherit', marginBottom: 10}}>
                        <Button style={{textTransform: 'none', display: 'flex', width: '100%', justifyContent: 'flex-start', color: 'inherit'}}>
                        <Avatar
                          alt={creator.name}
                          src={creator.url}
                        />

                        <Typography style={{marginLeft: 15}}>{creator.name}</Typography>
                        </Button>
                    </Link>
                )
            })}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
