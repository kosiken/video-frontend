import React, { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "./Container";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ReactPlayer from "react-player";
import { useDebounce } from "@react-hook/debounce";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Centered from "./Centered";
import PauseIcon from "@mui/icons-material/Pause";
import Slider from "@mui/material/Slider";
import Snackbar from '@mui/material/Snackbar';
import useHover from "../hooks/useHover";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import useWindowSize, { Size } from "../hooks/useWindowSize";
import { toHHMMSS } from "../utils/functions";
import Video from "../models/Video";
import UserApiSignleton from "../api/userApi";

type VideoViewProps = {
  url: string;
  video: Video
};

const VideoView: React.FC<VideoViewProps> = ({ url, video }) => {
  // const url = "/video.mp4"//https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4

  const videoRef: any = React.useRef();
  const ref: any = React.useRef();
  const timeoutRef = React.useRef(0);
  const val = useHover(ref);
  const [playing, setPlaying] = useState(false);
  const [playedSecondString, setPlayedSecondString] = useState("00:00");
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [durationString, setDurationString] = useState("00:00");
  const [liked, setLiked] = useState(false);
  const [value, setValue] = useDebounce(false, 1000);
  const [show, setShow] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [open, setOpen] = React.useState(true);


  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const updateView = async () => {
      try {
        const Api = UserApiSignleton()
        let b = await Api.viewVideo(video.id, playedSeconds * 1000);
        console.log(b);
      } catch (error: any) {
        console.log(error)
      }
    }
    if (playedSeconds > 0) {
      if(Math.round(playedSeconds) === 1) {
        updateView();
        return
      }
      let m = Math.round(playedSeconds);
      if ((m % 60) === 0 && m > 0) {
        updateView()
      }
    }
  }, [playedSeconds, video])

  const getMd = () => {
    if (fullScreen) {
      return show ? "block" : "none";
    } else return val ? "block" : "none";
  };

  useEffect(() => {
    const func = (event: Event) => {
      // document.fullscreenElement will point to the element that
      // is in fullscreen mode if there is one. If there isn't one,
      // the value of the property is null.
      if (document.fullscreenElement) {
        console.log(
          `Element: ${document.fullscreenElement.id} entered full-screen mode.`
        );
      } else {
        if (fullScreen) setFullScreen(false);
      }
    };
    document.addEventListener("fullscreenchange", func);
    return () => {
      document.removeEventListener("fullscreenchange", func);
    };
  });

  const size: Size = useWindowSize();

  useEffect(() => {
    if (!!ref.current && fullScreen) {
      ref.current.requestFullscreen();
    } else if (!fullScreen) {
      if (document.fullscreenElement) document.exitFullscreen().catch(console.log);
    }
  }, [fullScreen]);



  const toggleVideoLike = () => {
    const Api = UserApiSignleton();

    Api.reactToVideo(!liked, video)
    .then(console.log)
    .catch(console.log);

    
    setLiked(!liked);
  };

  useEffect(() => {
    setValue(liked);

    return () => { };
  }, [liked, setValue]);

  useEffect(() => {
    const sendApiRequest = () => {
      console.log("sending request");
    };
    sendApiRequest();
    return () => { };
  }, [value]);

  useEffect(() => {
    if (timeoutRef.current !== 0) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setShow(false);
      timeoutRef.current = 0;
    }, 2000);

    return () => {
      if (timeoutRef.current !== 0) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [show]);

  useEffect(() => {
    setDurationString(toHHMMSS(duration));
    return () => { };
  }, [duration]);

  useEffect(() => {
    setPlayedSecondString(toHHMMSS(playedSeconds));
    return () => { };
  }, [playedSeconds]);
  const getWidth = () => {
    return fullScreen
      ? window.innerWidth + "px"
      : size.width
        ? size.width < 640
          ? size.width + "px"
          : "640px"
        : "640px";
  };
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
    <Container sx={{ paddingTop: "1em", maxWidth: "640px" }}>
      {" "}
      <div
        onClick={() => {
          setShow(true);
          setPlaying(!playing)
        }
        }
        style={{ position: "relative" }}
        ref={ref}
      >
        <ReactPlayer
          ref={videoRef}
          onProgress={(state) => {
            setProgress(state.played);
            setPlayedSeconds(state.playedSeconds);
          }}
          height={fullScreen ? "100%" : 'auto'}

          width={getWidth()}
          onDuration={setDuration}
          playing={playing}
          url={url}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: 0,
            width: "100%",
            display: {
              xs: show ? "block" : "none",
              sm: show ? "block" : "none",
              md: getMd(),
            },
          }}
        >
          <Centered sx={{ marginTop: "1em" }}>
            <Box sx={{ width: "85%", backgroundColor: "#000000ad", p: 1 }}>
              <Box
                alignItems="center"
                justifyContent="space-between"
                display="flex"
                sx={{ alignItems: "center" }}
              >
                <IconButton
                  onClick={() => setFullScreen(!fullScreen)}
                  style={{ color: "white" }}
                  aria-label="next"
                >
                  {fullScreen ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
                </IconButton>
                <Box
                  alignItems="center"
                  display="flex"
                  sx={{ alignItems: "center" }}
                >
                  <IconButton style={{ color: "white" }} aria-label="previous">
                    <SkipPreviousIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setPlaying(!playing)}
                    sx={{
                      margin: "0 0.5em",
                      color: "white",
                    }}
                    aria-label="play/pause"
                  >
                    {!playing ? (
                      <PlayArrowIcon sx={{ height: 30, width: 30 }} />
                    ) : (
                      <PauseIcon sx={{ height: 30, width: 30 }} />
                    )}
                  </IconButton>
                  <IconButton style={{ color: "white" }} aria-label="next">
                    <SkipNextIcon />
                  </IconButton>
                </Box>
                <Typography id="seek" sx={{ color: "white" }}>
                  {playedSecondString}/{durationString}
                </Typography>
              </Box>
              <Box sx={{ width: "100%" }}>
                <Slider
                  size="small"
                  value={progress * 100}
                  aria-label="Small"
                  valueLabelDisplay="off"
                  color="secondary"
                  onChange={(v, n) => {
                    if (videoRef.current) {
                      let num: number = Array.isArray(n) ? n[0] : n;
                      setProgress(num / 100);
                      videoRef.current.seekTo(num / 100, "fraction");
                    }
                  }}
                />
              </Box>
            </Box>
          </Centered>
        </Box>
      </div>
      <Box display="flex" marginTop={1}>
        <Box
          display="flex"
          padding={"0 2em 0 0"}
          color="primary"
          alignItems={"center"}
        >

          <VisibilityIcon color="primary" />{" "}
          <Typography color="primary" variant="subtitle1" component="span">
            {video.viewCount} Views

          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box display="flex" padding={"0 0 0 2em"} alignItems={"center"}>

          <IconButton
            onClick={toggleVideoLike}
            color={liked ? "error" : "default"}
          >

            <FavoriteIcon color="inherit" />{" "}
          </IconButton>{" "}
          <Typography color="secondary" variant="subtitle1" component="span">
            {liked ? video.likeCount + 1 : video.likeCount } likes


          </Typography>
        </Box>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Tap Video to play or pause"
        action={action}
      />

    </Container>
  );
};

export default VideoView;
