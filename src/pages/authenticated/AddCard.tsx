import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../store";
import Centered from "../../components/Centered";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AppLink from "../../components/AppLink";
import Spacer from "../../components/Spacer";
import LoadingPageIndicator from "../../components/LoadingPageIndicator";
import UserApiSignleton, { IBillingDetails } from "../../api/userApi";
import User from "../../models/User";


const schema = yup
    .object({
        billingCardNumber: yup.string().max(16).min(10).required(),
        cvv: yup.string().length(3).required(),

    })
    .required();


const AddCard: React.FC = () => {
    const user = useSelector((state: AppState) => state.auth.user);
    const dispatch = useDispatch()
    const [expiry, setExpiry] = useState('');
    const [loading, setLoading] = useState(false)
    const [cardNumberIsValid, setCardNumberIsValid] = useState(true);


    const { register, handleSubmit,
        formState: { errors }, } = useForm({ resolver: yupResolver(schema) });

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
        if (!cardNumberIsValid) setCardNumberIsValid(true)

        let str = event.target.value;
        if (/[a-zA-Z]/.test(str)) return;
        let len = str.length;
        if (len < expiry.length) {
            setExpiry(str);
            return;
        }
        if (len >= 6) return;
        switch (len) {
            case 2:
                setExpiry(str + '/')
                break;

            default:
                setExpiry(str)
                break;
        }
    }

    const onSubmit = (data: any) => {
        console.log(data)
        if (expiry.length < 5) {
            setCardNumberIsValid(false)
        }
        else {

            let n: number[] = expiry.split('/').map(v => parseInt(v));
            console.log(n)
            let isInvalid = n.some(v => isNaN(v))

            if (!isInvalid) {
                isInvalid = n[0] > 12 || n[0] < 1

            }
            if (!isInvalid) {
                const d = new Date();
                let nb = parseInt(d.getFullYear().toString().slice(2));

                isInvalid = n[1] < nb;
            }
            if (isInvalid) {
                setCardNumberIsValid(false);
                return
            }
            setLoading(true);
            const userApi = UserApiSignleton();
            data = { ...data, billingCardBrand: "visa", billingCardExpMonth: n[0].toString(), billingCardExpYear: n[1].toString() };
            userApi.addCard(data as IBillingDetails)
                .then((v) => {
                    console.log(v)
                    if (user) {
                        let u: User = { ...user, billing_card_last4: v.billingCardLast4, billing_card_brand: v.billingCardBrand }
                        dispatch({ type: "login", user: u });
                    }
                    setLoading(false);
                }).catch(err => {
                    console.log(err);
                    setLoading(false);


                })
            console.log(data);

        }
    }

    if (loading) return <LoadingPageIndicator />

    if (user)
        return (
            <Box style={{ marginTop: "4em", position: "relative" }} sx={{ pt: 1 }}>
                <Container maxWidth="md">
                    <form style={{ maxWidth: "500px" }} onSubmit={handleSubmit(onSubmit)}>
                        <Typography
                            sx={{ mt: 2, mb: 2, color: "text.primary" }}
                            fontWeight="bold"
                        >
                            Billing Details
                        </Typography>
                        <FormControl fullWidth>
                            <TextField
                                placeholder={user.has_billing_card ? '************' + user.billing_card_last4 : "'************XXXX"}
                                id="cardNumber"
                                label="Card Number"
                                helperText={errors.billingCardNumber?.message}

                                error={!!errors.billingCardNumber}
                                variant="outlined"
                                InputProps={{
                                    type: "number",
                                }}
                                {...register("billingCardNumber")}
                            />
                        </FormControl>
                        <Spacer space={20} />
                        <FormControl fullWidth>
                            <TextField

                                error={!cardNumberIsValid}
                                helperText={!cardNumberIsValid ? "Invalid card number" : "The expiry MM/YY on your card"}

                                value={expiry}
                                id="cardExpiry"
                                label="Card Expiry"
                                variant="outlined"
                                InputProps={{
                                    type: "text",
                                }}
                                name="CardExpiry"
                                onChange={handleChange}

                            />
                        </FormControl>
                        <Spacer space={20} />

                        <FormControl fullWidth>
                            <TextField

                                id="cvv"
                                label="CVV"
                                helperText={errors.cvv?.message}

                                error={!!errors.billingCardNumber}
                                variant="outlined"
                                InputProps={{
                                    type: "number",
                                }}
                                {...register("cvv")}
                            />
                        </FormControl>
                        <Spacer space={20} />
                        <Button type="submit" variant="contained">
                            Update Details
                        </Button>
                    </form>
                </Container>
            </Box>
        );
    else
        return (
            <Box style={{ paddingTop: "4em", position: "relative" }} sx={{ pt: 1 }}>
                <Centered sx={{ height: "60vh" }}>
                    <Typography sx={{ mb: 1 }}>An internal error has occured</Typography>
                    <AppLink to="/" doNotUseButton>
                        Go Back
                    </AppLink>
                </Centered>
            </Box>
        );
};

export default AddCard;
