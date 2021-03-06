import React from "react";
import { createTheme } from "@mui/material/styles";
import { Button, Card, Container, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ChevronRight from "@mui/icons-material/ChevronRight";

import Centered from "../components/Centered";
import Spacer from "../components/Spacer";
import { Link } from "react-router-dom";
import ApiSignleton from "../api/api";

type IntroCard = {
  image: string;
  header: string;
  description: string;
};

const IntroCards: IntroCard[] = [
  {
    image: "/images/create.png",
    header: "Create Magic",
    description:
      "Create wonderful and amazing videos that you want to show to the world",
  },

  {
    image: "/images/upload.png",
    header: "Upload to Ereder",
    description:
      "Showcase the world from your perspective by uploading your videos to Ereder",
  },

  {
    image: "/images/share.png",
    header: "Sharing is Caring",
    description:
      "You can share your Ereder videos with your close friends, paying viewers or the world",
  },
  {
    image: "/images/earn.png",
    header: "Earn Money",
    description: "Ereder is like OnlyFans but without the 18+ content",
  },
];
let theme = createTheme({
  palette: {
    primary: {
      main: "#5352ab",
    },
    secondary: {
      main: "rgb(36, 186, 248)",
    },
  },
});

function LandingPage() {

  const Api = ApiSignleton()
  const [numberOfUsers, setNumOfUsers] = React.useState(1000);
  let idRef = React.useRef<any>();
  React.useEffect(() => {
    idRef.current = setInterval(() => {
        setNumOfUsers(numberOfUsers + 1);
    }, 500)
    return () => {
     clearInterval(idRef.current)
    }
  });
  return (

        <Box>
        <Box
          sx={{
            backgroundColor: "primary.main",
            marginBottom: "1em",
            paddingTop: "1em"
          }}
        >
          <Box
            sx={{
              maxWidth: 500,
              width: "90%",
              margin: "0 auto",
              color: "white",
              display: "flex",
              alignItems: "center",
              padding: "3em 0",
            }}
          >
            <div>
              <Typography variant="h3" fontWeight="bold">
                An{" "}
                <code style={{ color: theme.palette.secondary.main }}>
                  upcoming
                </code>{" "}
                video sharing platform
              </Typography>
              <Typography sx={{ margin: "1em 0" }}>
                Join over{" "}
                <strong style={{ fontSize: 18 }}>{numberOfUsers}</strong> users
                who share videos everyday with viewers around the world
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "secondary.main",
                  color: "white",
                  marginRight: "10px",
                  ":hover": {
                    backgroundColor: "secondary.main",
                  },
                }}

                onClick={() => {
                  Api.me().then(console.log).catch(console.log)
                }}
              >
                Get Started
              </Button>

           
              <Link to="/explore"  style={{textDecoration: "none", color: 'white'}}>
            <Button  color="inherit" endIcon={<ChevronRight/>}  variant="text">
           
                    Explore
              
            </Button>
            </Link>
            </div>
          </Box>
        </Box>

        <Grid container sx={{ width: "100vw" }}>
          {IntroCards.map((card, n) => (
            <Grid item sx={{ padding: "10px" }} md={3} sm={6} key={"card" + n}>
              <Card
              elevation={0}
                sx={{
                  borderRadius: 4,
                  minHeight: { md: 300, sm: 250 },
                }}
              >
                <Centered>
                  <img
                    src={card.image}
                    alt="create"
                    style={{ maxWidth: 200, marginBottom: 10 }}
                  />
                </Centered>
                <Typography variant="h6" align="center">
                  {card.header}
                </Typography>
                <Centered sx={{ padding: "0 1em", margin: ".5em 0" }}>
                  <Typography fontSize={".85rem"} align="center">
                    {card.description}
                  </Typography>
                </Centered>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Spacer space={30} />
        <Box sx={{
          backgroundColor: "#b9b9dd",
         
          padding: "2em 0"
        }}>
        <Container>
          <Grid container>
            <Grid item md={6} sm={12} sx={{ padding: "0 20px" }}>
              <Typography>
                Ereder has allowed me to view the works of other content
                creators and also showcase my new material, What I love most
                about the platform is that has so many features{" "}
              </Typography>

              <Typography variant="h4">Kenechukwu Rhema </Typography>
              <Typography  color="white" fontStyle="italic"> 
                Lead Creative Director at KRC Entertainent 
              </Typography>
            </Grid>
            <Grid item md={6} sm={12} sx={{ padding: "0 20px" }}>
              <Typography>
                Investing in Ereder has been one of the best decisions I have made. From modest beginnings, the platform is beginning to make some big moves in the Nigerian Tech Industry
              </Typography>

              <Typography variant="h4">Christopher Okeke </Typography>
              <Typography color="white" fontStyle="italic"> 
               CEO, Akaokeke Investment Fund, Africa
              </Typography>
            </Grid>
          </Grid>
          </Container>
          </Box>
          <Spacer space={100} />
     

       
        </Box>
  
  );
}

export default LandingPage;
