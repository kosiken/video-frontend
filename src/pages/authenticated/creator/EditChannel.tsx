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
import Spacer from "../../../components/Spacer";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Channel } from '../../../models/User';
import LoadingPageIndicator from "../../../components/LoadingPageIndicator";
import Centered from '../../../components/Centered';
import CreatorApiSingleton from '../../../api/creatorApi';



const EditChannel = () => {
    const base = "";
    const [channel, setChannel] = useState<Channel>();
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState<any>();
    const [loadedCurrent, setLoadedCurrent] = useState(0)
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
    const onFileChange = (e: any) => {
        let f = e.target.files[0];
        setFile(f);


    }

    const handleUpload = function (url: string, name: string) {
        if (!file) return;


        let xhr = new window.XMLHttpRequest();
        // TODO hanle error

        xhr.open("POST", url);
        xhr.setRequestHeader('authorization', `Bearer ${window.localStorage.getItem('jwt') || 'None'}`)
        xhr.upload.addEventListener("progress", ({ loaded, total }) => {
            let loaded2 = Math.ceil((loaded / total) * 100)
            setLoadedCurrent(loaded2);

        })
        let data = new FormData();
        data.append(name, file);
        xhr.send(data);

        xhr.addEventListener("readystatechange", (e: any) => {
            if (e && e.target) {
                if (e.target.readyState === 4) {
                    let c: Channel = JSON.parse(xhr.response);
                    // console.log(up)
                    // setVideoId(up.id)
                    setChannel(c);

                    setFile(undefined)
                    setLoadedCurrent(0);
                    alert("done")
                    // setLoading(false);



                }
                // setDone(true);
            }

        })


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
            sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
        >
            <div style={{position: 'relative'}}>
                <img  src={channel.banner || "/none.png"} alt="Channel banner" style={{width: '100%', height: '250px'}}/>
                <Avatar
                style={{position: 'absolute', left: 10, bottom: 10}}
            alt={channel.name}
            src={channel.logo}
            sx={{ width: 50, height: 50 }}
          />
            </div>
     
            <Typography variant="h5" style={{ marginBottom: '20px' }}>Edit Channel</Typography>

            <Grid container spacing={2}>
                <Grid item md={6} sm={12} style={{ flex: 1 }}>
                    <Paper>
                        <LinearProgress variant="determinate" value={loadedCurrent} />

                        <Box style={{ padding: '1em 1.2em', minWidth: "300px" }} >

                            <Typography style={{ marginBottom: '20px' }}>Edit Channel Logo</Typography>


                            <OutlinedInput
                                id="file-input"
                                type={"file"}
                                onChange={onFileChange}

                                inputProps={{
                                    accept: "image/png, image/jpeg",
                                }}

                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconButton
                                            onClick={() => handleUpload(`${base}/api/creator/channel/upload-logo`, 'logo')}

                                        >
                                            <CloudUploadIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => {
                                                // let l: any = document.getElementById('file-input');
                                                // setFile(null)
                                                // if (l) l.value = ""
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />

                            <Typography style={{ marginBottom: '20px' }}>Edit Channel Banner</Typography>


                            <OutlinedInput
                                id="file-inpu-2t"
                                type={"file"}

                                onChange={onFileChange}
                                inputProps={{
                                    accept: "image/png, image/jpeg",
                                }}

                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconButton

                                            onClick={() => handleUpload(`${base}/api/creator/channel/upload-banner`, 'banner')}
                                        >
                                            <CloudUploadIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => {
                                                // let l: any = document.getElementById('file-input');
                                                // setFile(null)
                                                // if (l) l.value = ""
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item md={6} sm={12} style={{ flex: 1 }}>
                    <Paper style={{ padding: '1em 1.2em' }} >
                        <form style={{ maxWidth: "500px" }} onSubmit={handleSubmit(onSubmit)}>
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

                                    label="Channel Description"
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
    return (<Container style={{ paddingTop: "64px", minHeight: '80vh' }}
        sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
    >
        <Centered sx={{ height: '100%' }}>
            <Typography>An error occured {errrorMessage}</Typography>
        </Centered>
    </Container>)
};

export default EditChannel;
