import React, { useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { AppState } from "../../store";
import Container from "@mui/material/Container";
import Badge from "@mui/material/Badge";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/system";
import Spacer from "../../components/Spacer";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import User from "../../models/User";
import { Link } from "react-router-dom";
type CountryItem = {
  value: string;
  title: string;
};

const Countries: CountryItem[] = [
  {
    value: "nigeria",
    title: "Nigeria",
  },
  {
    value: "civ",
    title: "Cote'ivore",
  },
  {
    value: "ghana",
    title: "Ghana",
  },
  {
    value: "the_gambia",
    title: "The Gambia",
  },
];


const TabOne: React.FC<{ user?: User }> = ({ user }) => {
    const theme = useTheme();
  const [country, setCountry] = useState(Countries[0].value);
  const [dob] = useState<Date>();
  const handleChange = (event: SelectChangeEvent<string>) => {
    setCountry(event.target.value);
    console.log(dob);
  };

  return (
    <Container maxWidth="md">
      <Typography sx={{ mt: 2, mb: 2 }} fontWeight="bold">
        Profile Picture
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <IconButton style={{ backgroundColor: theme.palette.primary.main }}>
              <CloudUploadIcon htmlColor="white" />
            </IconButton>
          }
        >
          <Avatar
            alt={user?.fullName || "None"}
            src={user?.profilePic || "/images/me.jpeg"}
            sx={{ width: 100, height: 100 }}
          />
        </Badge>
        <Spacer space={20} />
        <Divider variant="middle" /> <Spacer space={20} />
        <form style={{ maxWidth: "500px" }}>
          <Typography sx={{ mt: 2, mb: 2 }} fontWeight="bold">
            Contact Details
          </Typography>
          <FormControl fullWidth>
            <TextField
              defaultValue={user?.fullName}
              id="fullName"
              label="Full Name"
              variant="outlined"
              InputProps={{
                type: "fullName",
              }}
            />
          </FormControl>
          <Spacer space={20} />
          <FormControl fullWidth>
            <TextField
              id="email"
              defaultValue={user?.email}
              label="Email"
              variant="outlined"
            />
          </FormControl>
          <Spacer space={20} />

          <FormControl fullWidth>
            <TextField
              variant="filled"
              type="date"
              InputProps={{ inputProps: { max: "12-12-2021" } }}
              onChange={(e) => {}}
            />
          </FormControl>
          <Spacer space={20} />

          <InputLabel id="demo-simple-select-label">Country</InputLabel>
          <FormControl fullWidth>
            {" "}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={country}
              label="Country"
              onChange={handleChange}
            >
              {Countries.map(({ value, title }, index) => (
                <MenuItem key={"country" + index} value={value}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Spacer space={20} />
          <Button disabled type="submit" variant="contained">
            Update Details
          </Button>
        </form>
      </Box>
    </Container>
  );
};


const TabTwo: React.FC = () => {
    const creators: Array<{name: string; url: string}> = new Array(12).fill( {name: "Sam Smith", url: "/images/me.jpeg"})
return (<Container maxWidth="sm" style={{paddingTop: '2em'}}> 
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
 </Container>)
}

const Profile = () => {
  const theme = useTheme();
  console.log(theme);
  const user = useSelector((state: AppState) => state.auth.user);
  const [value, setValue] = useState(0);

  const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getTab = () => {
      if(value === 0)  return <TabOne user={user} />
      else return <TabTwo /> 
  }
  return (
    <Box style={{ marginTop: "4em",  position: 'relative' }}>
        <Paper style={{ padding: "1em 0 0",}} elevation={0}>
        <Container maxWidth="md" >
         <Typography variant="h5">{user?.fullName || "None"}</Typography>
</Container>
        </Paper>

      <Paper style={{  position: 'sticky', top: 64,left: 0, zIndex: 99 }}>
        <Container maxWidth="md" >
      
 


          <Box
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: 'sticky',
              top: 64,
              left: 0,
              zIndex: 99

            
            }}
          >
            <Tabs
              variant="scrollable"
              scrollButtons="auto"
              value={value}
              onChange={handleChange1}
            >
              <Tab label="Profile" />
              <Tab label="Channels" />
              <Tab label="History" />
              <Tab label="Purchases" />
            </Tabs>
          </Box>
        </Container>
      </Paper>

      {getTab()}

      <Spacer space={30} />
    </Box>
  );
};

export default Profile;
