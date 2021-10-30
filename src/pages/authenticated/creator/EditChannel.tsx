import React, { useState, useEffect } from 'react';
import { useTheme } from "@mui/system";
import { useForm } from "react-hook-form";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Spacer from "../../../components/Spacer";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Channel } from '../../../models/User';
import LoadingPageIndicator from "../../../components/LoadingPageIndicator";
import Centered from '../../../components/Centered';
import CreatorApiSingleton from '../../../api/creatorApi';



const EditChannel = () => {

    const [channel, setChannel] = useState<Channel>();
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const [errrorMessage, setErrorMessage] = useState("");
    const {
        register,
        handleSubmit,
       
      } = useForm();
    useEffect(() => {
        const Api = CreatorApiSingleton();
        if (channel) {
            setLoading(false)
            return;
        }
        Api.getChannel().then(ch => {
            setChannel(ch);
            setLoading(false);
        }).catch((e) => {
            if (e.response) {
                setLoading(false)
                console.log(e.response);
                switch (e.response.status) {


                    case 404:
                        setErrorMessage(e.response.data.message);

                        break;

                    case 500:
                        setErrorMessage("Server Error");

                        break;
                    default:
                        setErrorMessage("Unknown Error")
                        break;
                }
                setLoading(false);
                return

            }
            setErrorMessage(e.message);
            setLoading(false)

        })

    }, [channel])

    const onSubmit = (data: any) => { 
        console.log(data);
        setLoading(true);
        const Api = CreatorApiSingleton();
        Api.editChannel(data)
        .then((ch) => {
            setChannel(ch);
            setLoading(false);
            console.log(ch);
        })
        .catch(() => {
            alert("an error occured")
            setLoading(false);
        })
    }

    if (loading) {
        return (
            <Container style={{ marginTop: "64px", minHeight: '80vh' }}
                sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
            >
                <LoadingPageIndicator />
            </Container>
        );
    }
    if (channel) return (
        <Container


            style={{ marginTop: "64px", minHeight: '80vh' }}
            sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
        >
            <Typography variant="h5" style={{ marginBottom: '20px' }}>Edit Channel</Typography>

            <Grid container spacing={2}>
                <Grid item md={6} sm={12} style={{ flex: 1 }}>
                    <Paper style={{ padding: '1em 1.2em', minWidth: "300px" }} >
                        <Typography style={{ marginBottom: '20px' }}>Edit Channel Logo</Typography>
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
                                alt={channel.name}
                                src={channel.logo}
                                sx={{ width: 100, height: 100 }}
                            />
                        </Badge>
                    </Paper>
                </Grid>

                <Grid item md={6} sm={12} style={{ flex: 1 }}>
                    <Paper style={{ padding: '1em 1.2em' }} >
                        <form style={{ maxWidth: "500px" }}  onSubmit={handleSubmit(onSubmit)}>
                            <Typography style={{ marginBottom: '20px' }}>Edit Channel Details</Typography>

                            <FormControl fullWidth>
                                <TextField
                                    defaultValue={channel.name}
                                    id="name"
                                    
                                    label="Channel Name"
                                    variant="outlined"
                                    {...register('name')}

                                />
                            </FormControl>
                            <Spacer space={20} />
                            <FormControl fullWidth>
                                <TextField
                                    defaultValue={channel.name || ""}
                                    id="short_description"
                                    {...register('shortDescription')}
                                    
                                    label="Channel Name"
                                    variant="outlined"
                                    multiline
                                    rows={3}

                                />
                            </FormControl>
                            <Spacer space={20} />
                            <FormControl fullWidth>
                                <TextField
                                    id="about"
                                    label="Channel About"
                                    defaultValue={channel.about || "No About"}
                                    multiline
                                    {...register('about')}
                                    rows={6}

                                    variant="standard"
                                />
                            </FormControl>
                            <Spacer space={20} />
                            <Button type="submit" variant="contained">
                                Submit
                            </Button>
                        </form>
                    </Paper>
                </Grid>


            </Grid>
            <Spacer space={20} />
        </Container>
    );
    return (<Container style={{ marginTop: "64px", minHeight: '80vh' }}
        sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
    >
        <Centered sx={{ height: '100%' }}>
            <Typography>An error occured {errrorMessage}</Typography>
        </Centered>
    </Container>)
};

export default EditChannel;
