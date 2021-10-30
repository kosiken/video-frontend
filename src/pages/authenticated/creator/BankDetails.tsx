import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Centered from "../../../components/Centered";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CreatorApiSingleton, { IBankAccountDetails } from '../../../api/creatorApi';
import LinearProgress from "@mui/material/LinearProgress";
import AppLink from "../../../components/AppLink";
import Spacer from "../../../components/Spacer";
import LoadingPageIndicator from "../../../components/LoadingPageIndicator";


const schema = yup
    .object({
        bankAccountName: yup.string().required(),
        bankName: yup.string().required(),
        bankAccountNumber: yup.string().length(10).required(),
        password: yup.string().min(4).required(),
    })
    .required();


const BankDetails: React.FC = () => {


    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')

    const { register, handleSubmit,
        formState: { errors }, } = useForm({ resolver: yupResolver(schema) });
    const [bankDetails, setBankDetails] = useState<IBankAccountDetails | undefined>();


    useEffect(() => {
        const Api = CreatorApiSingleton();
        setLoading(true)
        Api.getBankDetails()
            .then(v => {
                setBankDetails(v);
                setLoading(false);

            })
            .catch(err => {
                console.log(err)

                setLoading(false)
            })

    }, [])


    const onSubmit = (data: IBankAccountDetails) => {
        console.log(data)
        setLoading(true)
        setHasError(false);

        const Api = CreatorApiSingleton();

        Api.updateBankDetails(data)
            .then(v => {
                setBankDetails(v);
                setErrorMessage("Updated")
                setHasError(true);
                setLoading(false);
             
            })
            .catch(err => {
                console.log(err)
                if (err.response) {
                    console.log(err.response)
                    switch (err.response.status as number) {
                        case 400:
                            
                            setHasError(true);
                            setErrorMessage(err.response.data.problems);
                            break;
                    }
                    setLoading(false);
                    return
                }
                setHasError(true);
                setErrorMessage(err.message);
                // setBankDetails(undefined);
                setLoading(false)
            })
    }
    const handleClose = () => {
        setErrorMessage("");
        setHasError(false);
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
    if (loading && !bankDetails) return <LoadingPageIndicator />

    if (bankDetails)
        return (
            <Box style={{ marginTop: "4em", position: "relative" }} sx={{ pt: 1 }}>
                <Container maxWidth="md"     sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}>
                {loading && <LinearProgress />}
                    <form style={{ maxWidth: "500px" }} onSubmit={handleSubmit(onSubmit)}>
                        <Typography
                            sx={{ mt: 2, mb: 2, color: "text.primary" }}
                            fontWeight="bold"
                        >
                            Billing Details
                        </Typography>
                        <FormControl fullWidth>
                            <TextField
                                defaultValue={bankDetails.bankAccountName}
                                id="bankAccountNamer"
                                label="Bank Account Name"
                                helperText={errors.bankAccountName?.message}

                                error={!!errors.bankAccountName}
                                variant="outlined"
                                InputProps={{
                                    type: "text",
                                }}
                                {...register("bankAccountName")}
                            />
                        </FormControl>

                        <Spacer space={20} />

                        <FormControl fullWidth>
                            <TextField
                                placeholder={bankDetails.bankAccountNumber}
                                id="bankAccountNamer"
                                label="Bank Account Number"
                                helperText={errors.bankAccountNumber?.message}

                                error={!!errors.bankAccountNumber}
                                variant="outlined"
                                InputProps={{
                                    type: "number",
                                }}
                                {...register("bankAccountNumber")}
                            />
                        </FormControl>

                        <Spacer space={20} />

                        <FormControl fullWidth>
                            <TextField
                                defaultValue={bankDetails.bankName}
                                id="bankNamer"
                                label="Bank Name"
                                helperText={errors.bankName?.message}

                                error={!!errors.bankName}
                                variant="outlined"
                                InputProps={{
                                    type: "text",
                                }}
                                {...register("bankName")}
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
                        <Button disabled={loading} type="submit" variant="contained">
                            Update Details
                        </Button>
                    </form>
                </Container>
                <Snackbar
                    open={hasError}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message={errorMessage}
                    action={action}
                />
            </Box>
        );
    else
        return (
            <Box style={{ marginTop: "4em", position: "relative" }} sx={{ pt: 1 }}>
                <Centered sx={{ height: "60vh" }}>
                    <Typography sx={{ mb: 1 }}>An internal error has occured</Typography>
                    <AppLink to="/" doNotUseButton>
                        Go Back
                    </AppLink>
                </Centered>
            </Box>
        );
};

export default BankDetails;
