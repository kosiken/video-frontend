import React, { useState } from "react";
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

import FormControl from "@mui/material/FormControl";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useLocation } from "react-router-dom";
import ApiSignleton from "../api/api";
 


const schema = yup
  .object({
    emailAddress: yup.string().email().required(),
    password: yup.string().min(4).required(),
  })
  .required();

const Login = ( ) => {

  const Api = ApiSignleton();
  let location = useLocation();

  const [loading, setLoading] = useState(false);
  const [errrorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
  let redirect: string;

  if(!!location.search) {
    redirect = location.search.slice(1);
    redirect = querystring.parse(redirect).rediirectTo as string
    console.log(redirect)
  }
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleOpen = (message: string) => {
setErrorMessage(message);
setErrorPresent(true)
  }

  const onSubmit = (data: any) => {
    // data.emailAddress = "";
    setLoading(true);
  Api.logIn(data).then(() => {
    window.location.pathname = redirect ||  "/"
  }).catch((e)=> {
 if(e.response)   {
   setLoading(false)
   console.log(e.response);
   switch(e.response.status) {
     case 400: 
        handleOpen("Email or Password Incorrect");
        
        break;

        case 404: 
        handleOpen("Email cannot be found");
        
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


  const handleClose = () => {
    setErrorMessage("");
    setErrorPresent(false);
  }
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
        height: "100vh",
        // backgroundColor: "primary.main",
        flexDirection: "column",
        padding: "1em 0",
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
            <Typography variant="h6" align="center" >Log In</Typography>
            <Spacer space={10} />

          <form onSubmit={handleSubmit(onSubmit)}>
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
            <Button type="submit" variant="contained">
              Submit
            </Button>
            <Link
              to="/signup"
              style={{ marginLeft: 30, textDecoration: "none" }}
            >
              <Button >Sign up</Button>
            </Link>{" "}
            <Spacer space={20} />
           </form>
        </CardContent>   <Snackbar
        open={errorPresent}
        autoHideDuration={6000}
        onClose={handleClose}
        message={errrorMessage}
        action={action}
      />

      </Card>
    </Centered>
  );
};

export default Login;
