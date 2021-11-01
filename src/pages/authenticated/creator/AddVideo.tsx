import {  useState } from 'react';

import { useForm } from "react-hook-form";
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from "@mui/material/IconButton";
import CreatorApiSingleton from '../../../api/creatorApi';
import LinearProgress from "@mui/material/LinearProgress";
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
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toHHMMSS } from '../../../utils/functions';
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import Centered from '../../../components/Centered';
import AppLink from '../../../components/AppLink';
import Video from '../../../models/Video';

const schema = yup
    .object({
        title: yup.string().min(6).required(),
        description: yup.string().min(6).required(),
    })
    .required();


function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                >{`${(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}



const AddVideo = () => {
    const base = "http://localhost:1337"
    const VideoTypes: { value: string, title: string }[] = [{
        title: "Public Video",
        value: "public"
    }, {
        title: "Restricted Video",
        value: 'restricted'
    }]
    const [videoType, setVideoType] = useState('public');
    const [video, setVideo] = useState<Video>()

    const [loading, setLoading] = useState(true);
    const [loadedCurrent, setLoadedCurrent] = useState(0)
    const [file, setFile] = useState<any>();
    const [videoId, setVideoId] = useState('')
    const [done, setDone] = useState(true);
    const [errrorMessage, setErrorMessage] = useState("");
    const [hasError, setHasError] = useState(false);
    const [hasSubmittedDetails, setHasSubmittedDetails] = useState(false)
    const [duration, setDuration] = useState(0)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const handleOpen = (message: string) => {
        setErrorMessage(message);
        setHasError(true);
    }

    const handleChange = (event: SelectChangeEvent<string>) => {
        setVideoType(event.target.value);
    };
    const onSubmit = (data: any) => {
        console.log(data);
        setLoading(true);
        setErrorMessage("");
        setHasError(false)
        setDone(false)
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
        const Api = CreatorApiSingleton();
        data.duration = duration;
        Api.uploadVideo(videoId, data).then(v => {
            console.log(v)
            setVideoId(v.id);
            setVideo(v)
            setHasSubmittedDetails(true);
            setLoading(false)
        }).catch(e => {
            let message = "An Error Occured"
            if (e.response) {
                setLoading(false)

                console.log(e.response);
                switch (e.response.status) {
                    case 400:
                        handleOpen(e.response.data.problems || message);

                        break;

                    case 404:
                        handleOpen(e.response.data.problems || message);

                        break;

                    case 500:
                        handleOpen(e.response.data.problems || message);

                        break;
                    default:
                        handleOpen(e.response.data.problems || message);
                        break;
                }
                handleOpen(message);
                return

            }

            handleOpen(message);
        })

    }

    const onFileChange = (e: any) => {
        let f = e.target.files[0];
        setFile(f);
        console.log(f);
        var videoNode = document.getElementById("video-temp") as HTMLVideoElement;
        if (!(f && videoNode)) return;
        let type = f.type;
        let cp = videoNode.canPlayType(type);
        if (cp) {
            var fileURL = URL.createObjectURL(f);
            videoNode.src = fileURL;

        }
        else {
            alert("cannot play video")
        }


    }

    const handleUpload = function (url: string, name: string, image = false) {
        if (!file) return;
        if (!image) {
            console.log("Uploding")
            var videoNode = document.getElementById("video-temp") as HTMLVideoElement;
            let nb = Math.floor(videoNode.duration);
            if((nb * 1000) < 12000)  {alert("Minimum duration is 2:00 mins");
            return;}
            setDuration(nb * 1000)
       
        }

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
                if (e.target.readyState === 4 && !image) {
                    let { up } = JSON.parse(xhr.response);
                    console.log(up)
                    setVideoId(up.id)
                
                    setFile(undefined)
                    setLoadedCurrent(0)
                    setLoading(false);



                }
                setDone(true);
            }

        })


    }

    if (done && hasSubmittedDetails && video) {
        return (<Box style={{ marginTop: "64px", minHeight: '80vh' }}
            sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
        >

            <Centered sx={{ height: '70vh' }}>

                <Paper style={{ padding: '3em', minWidth: '300px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src="/images/upload.png"
                            alt="done"
                            style={{ maxWidth: 200, marginBottom: 10 }}
                        />
                    </div>
                    <Typography align="center" color="success.main" sx={{ mt: 2, mb: 2 }}> Done Creating Video</Typography>
                    <div style={{ textAlign: 'center' }}>
                        <AppLink to={ `/creator/watch/${videoId}`}>
                            View
                        </AppLink>
                    </div>
                </Paper>
            </Centered>

        </Box>)
    }


    if (!videoId) {
        return (<Box


            style={{ marginTop: "64px", minHeight: '80vh' }}
            sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
        >
            <Container maxWidth="sm">
                <Typography variant="h5" style={{ marginBottom: '20px' }}>Upload Video </Typography>
                <Box padding="1em">
                    <Typography variant="h6" style={{ marginBottom: '20px' }}>Step One (Select Video File)</Typography>
                    <Paper style={{ display: "flex", alignItems: 'center', padding: '2em 1em' }}>

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

                                        onClick={() => handleUpload(`${base}/api/creator/upload`, 'video')}
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
                        <div style={{ flexGrow: 1 }} />
                        <video id="video-temp" style={{ display: 'none' }} />
                        <div style={{ textAlign: 'center', }}>
                            <CircularProgressWithLabel value={loadedCurrent} />
                        </div>

                    </Paper>
                </Box>
            </Container>
        </Box>)
    }
    return (
        <Container


            style={{ marginTop: "64px", minHeight: '80vh' }}
            sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
        >
            <Typography variant="h5" style={{ marginBottom: '20px' }}>Add Video </Typography>

            <Grid container spacing={2}>

                <Grid item md={6} sm={12} style={{ flex: 1 }}>
                    <Paper >
                        {loading && <LinearProgress />}
                        <Box style={{ padding: '1em 1.2em' }} >
                            <Typography variant="h6" style={{ marginBottom: '20px' }} >Step Two</Typography>
                            <form style={{ maxWidth: "500px" }} onSubmit={handleSubmit(onSubmit)}>
                                <Typography style={{ marginBottom: '20px' }}>Video Details</Typography>
                                {hasError && (<Typography color="error.main" style={{ marginBottom: '20px' }}>{errrorMessage}</Typography>)}
                                <FormControl fullWidth>
                                    <TextField

                                        helperText={errors.title?.message}
                                        id="title"
                                        error={!!errors.title}

                                        label="Video Title"
                                        variant="outlined"
                                        {...register('title')}

                                    />
                                </FormControl>
                                <Spacer space={20} />
                                <FormControl fullWidth>
                                    <TextField
                                        helperText={errors.description?.message}
                                        id="description"
                                        error={!!errors.description}

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

                                        id="duration"
                                        label="Video Duration(msecs)"
                                        disabled
                                        value={duration}


                                        variant="outlined"
                                        InputProps={{
                                            type: "text",
                                        }}
                                        {...register("duration")}
                                        helperText={toHHMMSS(duration / 1000)}
                                    />
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


                                <Spacer space={20} />
                                <Button disabled={hasSubmittedDetails} type="submit" variant="contained">
                                    Submit
                                </Button>
                            </form>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item md={6} sm={12} style={{ flex: 1 }}>

                    <Paper style={{ padding: '1em 1.2em', minWidth: "300px" }} >
                        <Typography variant="h6" style={{ marginBottom: '20px' }}>Step Three</Typography>
                        {!hasSubmittedDetails && (<Typography component="small" fontSize={14} color="GrayText"> You must submit video details first</Typography>)}

                        <Spacer space={20} />

                        <InputLabel id="video-thumbnail">Video Thumbnail</InputLabel>
                        <Box display="flex">
                            <OutlinedInput
                                id="file-input"
                                type={"file"}
                                disabled={!hasSubmittedDetails}

                                inputProps={{
                                    accept: "image/png, image/jpeg",
                                }}
                                onChange={onFileChange}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconButton
                                            disabled={!hasSubmittedDetails}
                                            onClick={() => {
                                                handleUpload(`${base}/api/creator/thumbnail/` + videoId, 'thumb', true)
                                            }}
                                        >
                                            <CloudUploadIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            disabled={!hasSubmittedDetails}
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
                        <div style={{ textAlign: 'center', marginTop: '2em' }}>
                            <CircularProgressWithLabel value={loadedCurrent} />
                        </div>
                    </Paper>
                </Grid>


            </Grid>
            <Spacer space={20} />
        </Container>
    );

};

export default AddVideo;
