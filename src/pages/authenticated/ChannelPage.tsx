import React, { useState, useEffect } from 'react';

import { useForm } from "react-hook-form";
import Avatar from "@mui/material/Avatar";
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Spacer from "../../components/Spacer";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Channel } from '../../models/User';
import LoadingPageIndicator from "../../components/LoadingPageIndicator";
import Centered from '../../components/Centered';
import ApiSingleton from '../../api/api';
import UserApiSingleton from '../../api/userApi';
import { useParams } from 'react-router';
import VideoGrid from '../../components/VideoGrid';



const ChannelPage = () => {
    let { id } = useParams<{ id: string }>();
    const base = "";
    const [channel, setChannel] = useState<Channel>();
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    useEffect(() => {
        const Api = ApiSingleton();
        if (channel) {
            setLoading(false)
            return;
        }
        Api.getChannel(id).then(ch => {
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


    const handleSub = () => {
        setLoading2(true)
        const Api = UserApiSingleton()
        if (channel) {
             Api.subscribe(channel.id).then(() => {
                 alert("success");
                 setLoading2(false)
             })
             .catch((err: any) => {
                 if(err.response) {
                     if(err.response.data) {
                         alert(err.response.data.problems);
                     }
                 }
                 setLoading2(false)
             }) 
            
            }
    }



    if (loading) {
        return (
            <Container style={{ paddingTop: "64px", minHeight: '80vh' }}
                sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
            >
                <LoadingPageIndicator />
            </Container>
        );
    }
    if (channel) return (
        <Container
            style={{ paddingTop: "64px", minHeight: '80vh' }}
        >
            <div style={{ position: 'relative', minHeight: '150px' }}>
                <img src={channel.banner || "/none.png"} alt="Channel banner" style={{ width: '100%', height: '250px' }} />
                <Avatar
                    style={{ position: 'absolute', left: 10, bottom: 10 }}
                    alt={channel.name}
                    src={channel.logo}
                    sx={{ width: 50, height: 50 }}
                />
            </div>

            <Box display={'flex'} style={{ marginBottom: '20px', }}>
                <Typography variant="h5" style={{ flex: 1 }}>{channel.name}</Typography>
                <Button onClick={handleSub} >{loading2 ? <CircularProgress /> :"Subscribe"}</Button>
            </Box>
            <Spacer space={20} />

            <Container maxWidth="md">

                <VideoGrid videoPlaceholderCount={24} channelId={channel.id} lg={4} md={4} prefix="/main" />
            </Container>
        </Container>
    );
    return (<Container style={{ paddingTop: "64px", minHeight: '80vh' }}
        sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
    >
        <Centered sx={{ height: '100%' }}>
            <Typography>An error occured {errorMessage}</Typography>
        </Centered>
    </Container>)
};

export default ChannelPage;
