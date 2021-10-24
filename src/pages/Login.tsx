import React, { useState } from "react";

import Centered from "../components/Centered";
import Spacer from "../components/Spacer";
import {
  Button,
  Card,
  CardContent,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";



const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(5).required(),
  })
  .required();

const Login = ( ) => {
  
  const [loading, setLoading] = useState(false);
  const [errrorMessage] = useState("Email does not exist");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

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
                {...register("email")}
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
            <Typography component="small" variant="subtitle2" align="center" color="red">{errrorMessage}</Typography>
          </form>
        </CardContent>
      </Card>
    </Centered>
  );
};

export default Login;
