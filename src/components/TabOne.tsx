import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Badge from "@mui/material/Badge";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/system";
import Spacer from "./Spacer";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import User from "../models/User";
import AppLink from "./AppLink";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import UserApiSignleton from "../api/userApi";


 

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





const CardDetails: React.FC<{ user: User }> = ({ user }) => {

  const [showDetails, setShowDetails] = useState(false);



  if (!showDetails) return <Button variant="contained" onClick={() => setShowDetails(true)}>Show Card Details </Button>
  if (user.has_billing_card) {
    return (<React.Fragment>
      <Typography variant="caption" color="GrayText">
        Card Details
      </Typography>
      <Box display="flex" sx={{ mb: 1, maxWidth: '200px' }} alignItems="center">    <Typography style={{ flex: 1 }} >{user.billing_card_brand || "none"} {"->"} {user.billing_card_last4} </Typography>
        <AppLink to="/main/update-billing">
          Update
        </AppLink>
      </Box>
      <Button onClick={() => setShowDetails(false)}>Hide Card Details </Button>

    </React.Fragment>)
  }
  return (
    <Box display="flex" sx={{ mb: 1, maxWidth: '200px' }} alignItems="center">    <Typography style={{ flex: 1 }} >No Card Details </Typography>
      <AppLink to="/main/update-billing">
        Add
      </AppLink>
    </Box>
  )
}

const TabOne: React.FC<{ user?: User }> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false)
  const handleClick = (m: string) => {
    setMessage(m);



    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }
  const theme = useTheme();
  const {
    register,
    handleSubmit,

  } = useForm({});
  const [country] = useState(Countries[0].value);
  const userApi = UserApiSignleton()
  const onSubmit = (data: any) => {
    setLoading(true);
    let keys = Object.keys(data);
    let v: any = { ...user };
    for (let key of keys) {

      if (!data[key] || (v && (data[key] === (v[key])))) delete data[key];

    }

    userApi.updateDetails(data)
      .then(() => {

        setLoading(false);
        handleClick('Details Updated successfully')
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        handleClick('An error occured while trying to update')
      })

  };
  const action = (

    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >

      <CloseIcon fontSize="small" />
    </IconButton>

  );


  return (
    <Container maxWidth="md">
      <Typography sx={{ mt: 2, mb: 2, color: 'text.primary' }} fontWeight="bold">
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
        <form style={{ maxWidth: "500px" }} onSubmit={handleSubmit(onSubmit)}>
          {loading && <LinearProgress />}
          <Typography sx={{ mt: 2, mb: 2, color: 'text.primary' }} fontWeight="bold">
            Contact Details
          </Typography>
          <FormControl fullWidth>
            <TextField
              defaultValue={user?.fullName}
              id="fullName"
              label="Full Name"
              variant="outlined"
              InputProps={{
                type: "text",
              }}

              {...register("fullName")}
            />
          </FormControl>
          <Spacer space={20} />
          <FormControl fullWidth>
            <TextField
              id="email"
              defaultValue={user?.email}
              label="Email"
              variant="outlined"
              InputProps={{
                type: "email",
              }}
              {...register("emailAddress")}
            />
          </FormControl>
          <Spacer space={20} />

          <FormControl fullWidth>
            <TextField
              variant="filled"
              type="date"
              defaultValue={user?.birthdate}
              InputProps={{ inputProps: { max: "12-12-2021" } }}

              {...register("dob")}
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

              {...register("country")}
            >
              {Countries.map(({ value, title }, index) => (
                <MenuItem key={"country" + index} value={value}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Spacer space={20} />
          <Button type="submit" variant="contained">
            Update Details
          </Button>
        </form>
        <Spacer space={20} />
        <Divider variant="middle" /> <Spacer space={20} />

        {user && (<CardDetails user={user} />)}



      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </Container>
  );
};

export default TabOne;