import React, { useState } from "react";
import { styled, alpha } from '@mui/material/styles';
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputBase from '@mui/material/InputBase';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";


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


const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  display: 'inline-block',
  '& .MuiInputBase-input': {
    
    transition: theme.transitions.create('width'),  display: 'inline-block',width:'33%'
    
  
  },
}));
const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(5).required(),
    fullName: yup.string().min(3).required(),
  })
  .required();

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [errrorMessage] = useState("");
  const [country, setCountry] = useState(Countries[0].value)
  const [dob, setDob] = useState<Date>();

  const handleChange = (event: SelectChangeEvent<string>) => {
    setCountry(event.target.value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data: any) => {
    console.log(data)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

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
            <FormControl fullWidth>
              <TextField
       variant="filled"
          {...register('dob')}
          type="date"
         InputProps= {
          {inputProps: {max:"12-12-2021"}}
         }

         onChange={(e) => {
           var date = e.target.value.split('-').reverse().map(v => parseInt(v));
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
    </Centered>
  );
};

export default SignUp;
