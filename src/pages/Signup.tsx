import  React, { useState } from "react";
import querystring from 'querystring'

import Centered from "../components/Centered";
import Spacer from "../components/Spacer";
import CloseIcon from "@mui/icons-material/Close";

import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useLocation } from "react-router-dom";
import ApiSignleton from "../api/api";


type CountryItem = {
  value: string;
  title: string;
}

const Countries: CountryItem[] = [
{
  value: 'nigeria',
  title: 'Nigeria'
},
{
  value: 'civ',
  title: 'Cote\'ivore'
},
{
  value: 'ghana',
  title: 'Ghana'
},
{
  value: 'the_gambia',
  title: 'The Gambia'
},
]


const schema = yup
  .object({
    emailAddress: yup.string().email().required(),
    password: yup.string().min(4).required(),
    fullName: yup.string().min(3).required(),
    dob: yup.string().length(10).required()
  })
  .required();

const SignUp = () => {
  let location = useLocation();

  const [loading, setLoading] = useState(false);
  const [errrorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
  const [country, setCountry] = useState(Countries[0].value)
  const [dob, setDob] = useState<Date>();
  const Api = ApiSignleton()

  let redirect: string;

  if(!!location.search) {
    redirect = location.search.slice(1);
    redirect = querystring.parse(redirect).rediirectTo as string
    console.log(redirect)
  }
  

  const handleOpen = (message: string) => {
    setErrorMessage(message);
    setErrorPresent(true)
      }
      const handleClose = () => {
        setErrorMessage("");
        setErrorPresent(false);
      }
  const handleChange = (event: SelectChangeEvent<string>) => {
    setCountry(event.target.value);
    console.log(dob)
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data: any) => {
    console.log(data)
    setLoading(true);

    Api.signIn(data).then(() => {
      window.location.pathname = redirect ||  "/"
    }).catch((e)=> {
   if(e.response)   {
     setLoading(false)
     console.log(e.response);
     switch(e.response.status) {
       case 400: 
          handleOpen("Email or Password Incorrect");
          
          break;
      case 500:
        handleOpen("Server Error");
  
        break;
        default:
          handleOpen("Unknown Error")
          break;
     }
     return
    
    }
  
    handleOpen(e.message || "Unknown Error");
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
    <Centered
      sx={{
        minHeight: "100vh",
        // backgroundColor: "primary.main",
        flexDirection: "column",
        padding: "1em 0",
        marginTop:20
      }}
    >
      <Card
        sx={{
          maxWidth: "500px",
          width: "60%",
          minWidth: "300px",
          padding: 0,
        }}
      >
        {loading && <LinearProgress />}
        <CardContent sx={{ padding: "3em 2em" }}>
          <Typography variant="h6" align="center">
            Sign Up
          </Typography>
          <Spacer space={10} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>
              <TextField
                helperText={errors.fullName?.message}
                id="fullName"
                error={!!errors.fullName}
                label="Full Name"
                variant="outlined"
                 InputProps={{
                  type: "fullName",
                }}
                {...register("fullName")}
              />
            </FormControl>
            <Spacer space={20} />
            <FormControl fullWidth>
              <TextField
                helperText={errors.email?.message}
                id="email"
                error={!!errors.email}
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
                id="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
                label="Password"
                variant="outlined"
                InputProps={{
                  type: "password",
                }}
              />
            </FormControl>

            <Spacer space={20} />
            <FormControl fullWidth>
              <TextField
       variant="filled"
          {...register('dob')}
          type="date"
         InputProps= {
          {inputProps: {max:"12-12-2021"}}
         }

         onChange={(e) => {
           setDob(new Date(e.target.value))
         }}
                  
                  

              />
            </FormControl>
            <Spacer space={20} />
            
              <InputLabel   id="demo-simple-select-label">Country</InputLabel>
              <FormControl fullWidth >  <Select
                {...register('country')}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={country}
                label="Country"
                onChange={handleChange}
              >
              {Countries.map(({value, title}, index) => (  <MenuItem key={'country' + index} value={value}>{title}</MenuItem>))}
              </Select>
            </FormControl>
            <Spacer space={20} />
            <Button type="submit" variant="contained">
              Submit
            </Button>
            <Link
              to="/login"
              style={{ marginLeft: 30, textDecoration: "none" }}
            >
              <Button>Log In</Button>
            </Link>{" "}
            <Spacer space={20} />
            <Typography
              component="small"
              variant="subtitle2"
              align="center"
              color="red"
            >
              {errrorMessage}
            </Typography>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        open={errorPresent}
        autoHideDuration={6000}
        onClose={handleClose}
        message={errrorMessage}
        action={action}
      />
    </Centered>
  );
};

export default SignUp;
