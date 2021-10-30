import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import { AppState } from "../../store";
import Container from "@mui/material/Container";
import { Helmet } from "react-helmet";
import Spacer from "../../components/Spacer";
import TabOne from "../../components/TabOne";
import TabTwo from "../../components/TabTwo";
import TabThree from "../../components/TabThree";
import TabFour from "../../components/TabFour";
 






const Profile = () => {
  const TabNames = ["Profile", "Channels", "History", "Purchases"]
  const user = useSelector((state: AppState) => state.auth.user);
  const [value, setValue] = useState(0);

  useEffect(() => {
    let pathName = window.location.hash.slice(1)
    if (pathName) {
      const dictionary: any = {};
      const TabNames2 = ["Profile", "Channels", "History", "Purchases"]
      TabNames2.forEach((name, index) => {
        dictionary[name.toLocaleLowerCase()] = index;
      })
      dictionary["channel"] = 1;
      let index = dictionary[pathName];
      if (index) {
        setValue(index)
      }

    }

  }, [])
  const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (
    <Box style={{ marginTop: "4em", position: "relative" }}>
      <Helmet>

        <title>{user?.fullName + " / " + TabNames[value]}</title>

      </Helmet>
      <Paper style={{ padding: "1em 0 0", border: 'none', boxShadow: 'none' }} elevation={0}>
        <Container maxWidth="md">
          <Typography variant="h5">{user?.fullName || "None"}</Typography>
        </Container>
      </Paper>

      <Paper style={{ position: "sticky", top: 64, left: 0, zIndex: 99, borderTop: 'none' }} square>
        <Container maxWidth="md">
          <Box
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "sticky",
              top: 64,
              left: 0,
              zIndex: 99,
            }}
          >
            <Tabs
              variant="scrollable"
              scrollButtons="auto"
              value={value}
              onChange={handleChange1}
            >
              <Tab href="#profile" label="Profile" />
              <Tab href="#channel" label="Channels" />
              <Tab href="#history" label="History" />
              <Tab href="#purchases" label="Purchases" />
            </Tabs>
          </Box>
        </Container>
      </Paper>

      <Box style={{ display: (value === 0 ? 'block' : 'none') }}>
        <TabOne user={user} />
      </Box>
      <Box style={{ display: (value === 1 ? 'block' : 'none') }}>
        <TabTwo showing={value === 1} />
      </Box>
      <Box style={{ display: (value === 2 ? 'block' : 'none') }}>
        <TabThree showing={value === 2} />
      </Box>

      <Box style={{ display: (value === 3 ? 'block' : 'none') }}>
        <TabFour showing={value === 3} />
      </Box>
      <Spacer space={30} />


    </Box>
  );
};

export default Profile;
