import { useState } from 'react';
import { useTheme } from "@mui/system";
import { useForm } from "react-hook-form";
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from "@mui/material/Box";

import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from "@mui/material/IconButton";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Spacer from "../../../components/Spacer";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";



const AddVideo = () => {
    const VideoTypes: { value: string, title: string }[] = [{
        title: "Public Video",
        value: "public"
    }, {
        title: "Restricted Video",
        value: 'restricted'
    }]
    const [videoType, setVideoType] = useState('public');

    const [loading, setLoading] = useState(true);
    const [loadedCurrent, setLoadedCurrent] = useState(0)
    const [file, setFile] = useState(null);
    const [videoId, setVideoId] = useState('')
    const theme = useTheme();
    const [errrorMessage, setErrorMessage] = useState("");
    const {
        register,
        handleSubmit,

    } = useForm();

    const handleChange = (event: SelectChangeEvent<string>) => {
        setVideoType(event.target.value);
    };
    const onSubmit = (data: any) => {
        console.log(data);

    }
    const onFileChange = (e: any) => {
        let f = e.target.files[0];
        setFile(f);
        console.log(f);
    }

    const handleUpload = function () {
        if (!file) return;
        console.log("Uploding")
        let xhr = new window.XMLHttpRequest();


        xhr.open("POST", "http://localhost:1337/api/creator/upload");
        xhr.setRequestHeader('authorization', `Bearer ${window.localStorage.getItem('jwt') || 'None'}`)
        xhr.upload.addEventListener("progress", ({ loaded, total }) => {
            let loaded2 = Math.ceil((loaded/total )* 100)
            setLoadedCurrent(loaded2);
            
        })
        let data = new FormData();
        data.append('video', file);
        xhr.send(data);

        xhr.addEventListener("readystatechange",( e: any) => {
            if (e && e.target) {
                if (e.target.readyState === 4) {
                    let {up } = JSON.parse(xhr.response);
                    console.log(up)
                    setVideoId(up.id)
                }
            }
        })


    }
    if (!videoId) {
        return (<Container


            style={{ marginTop: "64px", minHeight: '80vh' }}
            sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
        >
            <Typography variant="h5" style={{ marginBottom: '20px' }}>Upload Video </Typography>
            <Box padding="1em">
                <Paper style={{display: "flex", alignItems: 'center'}}>
                    <OutlinedInput
                        id="file-input"
                        type={"file"}


                        inputProps={{
                            accept: "video/mp4, video/ogg"
                        }}
                        onChange={onFileChange}
                        startAdornment={
                            <InputAdornment position="start">
                                <IconButton

                                    onClick={handleUpload}
                                >
                                    <CloudUploadIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => {
                                        let l: any = document.getElementById('file-input');
                                        setFile(null)
                                        if (l) l.value = ""
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />

                    <Typography id="loaded" variant="h5" color="success.main" style={{flex: 1, textAlign: 'center'}}>Uploading {loadedCurrent}%</Typography>
                </Paper>
            </Box>
        </Container>)
    }
    return (
        <Container


            style={{ marginTop: "64px", minHeight: '80vh' }}
            sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
        >
            <Typography variant="h5" style={{ marginBottom: '20px' }}>Add Video </Typography>

            <Grid container spacing={2}>

                <Grid item md={6} sm={12} style={{ flex: 1 }}>
                    <Paper style={{ padding: '1em 1.2em' }} >
                        <form style={{ maxWidth: "500px" }} onSubmit={handleSubmit(onSubmit)}>
                            <Typography style={{ marginBottom: '20px' }}>Video Details</Typography>

                            <FormControl fullWidth>
                                <TextField

                                    id="title"

                                    label="Video Title"
                                    variant="outlined"
                                    {...register('title')}

                                />
                            </FormControl>
                            <Spacer space={20} />
                            <FormControl fullWidth>
                                <TextField

                                    id="description"
                                    {...register('description')}

                                    label="Video Description"
                                    variant="outlined"
                                    multiline
                                    rows={4}

                                />
                            </FormControl>


                            <Spacer space={20} />
                            <InputLabel id="demo-simple-select-label">Video Type</InputLabel>

                            <FormControl fullWidth >  <Select
                                {...register('videoType')}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={videoType}
                                label="Video Type"
                                onChange={handleChange}
                            >
                                {VideoTypes.map(({ value, title }, index) => (<MenuItem key={'video-type' + index} value={value}>{title}</MenuItem>))}
                            </Select>
                            </FormControl>
                            <Spacer space={20} />


                            <FormControl fullWidth>
                                <TextField

                                    id="price"
                                    label="Video Price"
                                    disabled={videoType === 'public'}

                                    variant="outlined"
                                    InputProps={{
                                        type: "number",
                                    }}
                                    {...register("price")}
                                />
                            </FormControl>
                            <Spacer space={20} />        <Button type="submit" variant="contained">
                                Submit
                            </Button>
                        </form>
                    </Paper>
                </Grid>
                <Grid item md={6} sm={12} style={{ flex: 1 }}>

                    <Paper style={{ padding: '1em 1.2em', minWidth: "300px" }} >
                        <Typography style={{ marginBottom: '20px' }}>Video Files</Typography>
                        {!videoId && (<Typography component="small" fontSize={14} color="GrayText"> You must submit video details first</Typography>)}

                        <Spacer space={20} />

                        <InputLabel id="video-thumbnail">Video Thumbnail</InputLabel>
                        <Box display="flex">
                            <OutlinedInput
                                id="file-input"
                                type={"file"}
                                disabled={!videoId}

                                inputProps={{
                                    accept: "image/png, image/jpeg"
                                }}
                                onChange={onFileChange}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconButton
                                            disabled={!videoId}
                                            onClick={() => {

                                            }}
                                        >
                                            <CloudUploadIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => {
                                                let l: any = document.getElementById('file-input');
                                                setFile(null)
                                                if (l) l.value = ""
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


            </Grid>
            <Spacer space={20} />
        </Container>
    );

};

export default AddVideo;
