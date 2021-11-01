import React, { useState, useEffect } from "react";
import relativeTime from 'dayjs/plugin/relativeTime';
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs"
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Skeleton from "@mui/material/Skeleton";
import Grid, { GridSize } from "@mui/material/Grid";
import ControlledText from "./ControlledText";
import Centered from "./Centered";
import Video from "../models/Video";
import { Channel } from "../models/User";
import { UserChannel } from "../constants";
import ApiSignleton from "../api/api";
import ApiLoader from './ApiLoader'
import Typography from "@mui/material/Typography";
import AppLink from "./AppLink";

dayjs.extend(relativeTime)
type VideoGridProps = {
  videoPlaceholderCount?: number;
  loggedIn?: boolean;
  xs?: GridSize;
  sm?: GridSize;
  lg?: GridSize;
  md?: GridSize;
  prefix?: string;
  channelId?: string;
};

const VideoGrid: React.FC<VideoGridProps> = ({
  videoPlaceholderCount = 6,
  loggedIn = false,
  xs = 12,
  sm = 6,
  md = 4,
  lg = 3,
  prefix = "/main", channelId
}) => {

  const [videos, setVideos] = useState<Video[]>([]);

  const items = new Array(videoPlaceholderCount).fill(0)
  const [done, setDone] = useState(false)

  let retry = async () => {
    if (videos.length > 0) {
      setDone(true)
      return;

    }
    const Api = ApiSignleton();
    let v;
    if(channelId)v = await Api.getChannelVideos(channelId)
    else v = await Api.allVideos()
    setVideos(v);
    return v;
    // setDone(true)

    // .catch((err) => {
    //   console.log(err);
    //   setDone(true)
    // })
  }

  useEffect(() => {
    console.log(videos)
    setDone(videos.length > 0)
  }, [videos])

  const getGrid = () => {
    if (done && videos.length > 0) {
      return (
        <>
          {videos.map((item, index) => {

            let channel: Channel = UserChannel;
            if (typeof item.channel !== "string") {

              channel = item.channel;
            }
            return (
              <Grid item key={"video" + index} lg={lg} md={md} sm={sm} xs={xs} style={{ minWidth: '260px' }}>
                <Centered>
                  <Card sx={{ maxWidth: 455, m: 2 }}>
                    <CardHeader
                      style={{ textDecoration: "none", fontSize: "0.9em" }}
                      avatar={
                        <a
                          style={{ textDecoration: "none", fontSize: "0.9em" }}
                          href={(`/channel/${channel.id}`)}
                        >
                          <Avatar
                            alt="Intresting Channel"
                            src={channel.logo}
                          />
                        </a>
                      }
                      action={
                        loggedIn && (
                          <IconButton aria-label="settings">
                            <MoreVertIcon />
                          </IconButton>
                        )
                      }
                      title={channel.name}
                      subheader={dayjs(item.createdAt).fromNow()}
                    />
                    <AppLink
                      sx={{ textDecoration: "none", minHeight: '140px', display: 'block', width: '100%' }}
                      to={item.videoType === 'public' ? `${prefix}/watch/${item.id}` : `${prefix}/purchase/${item.id}`}
                      doNotUseButton
                    >
                      <CardMedia
                        component="img"

                        image={item.thumbnail}
                        alt={item.thumbnail}
                        sx={{ fontSize: "12px", width: '100%' }}


                      />
                    </AppLink>

                    <CardContent>
                      <ControlledText
                        defaultComponent="span"
                        props={{
                          color: "text.secondary",
                          variant: "body2",
                          component: "p",
                          text: item.title,
                          length: 60,
                        }}
                      />

                      <Typography fontSize="0.8em" sx={{ mb: 2 }}>{item.viewCount} View(s)</Typography>
                      <Chip size="small"  label={item.videoType} variant={(item.videoType === 'public' ? 'outlined' : 'filled')} />
                     {item.price > 0 && <Chip label={"N" + item.price }size="small" variant="outlined"  />}

                    </CardContent>
                  </Card>
                </Centered>
              </Grid>
            );
          })}
        </>
      );
    }

    if (videos.length > 0) {

    return (
      <>
        {items.map((item, index) => {
          return (
            <Grid item key={"video" + index} lg={3} md={4} sm={6} xs={12}>
              <Card sx={{ maxWidth: 345, m: 2 }}>
                <CardHeader
                  avatar={
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  }
                  title={
                    <Skeleton
                      animation="wave"
                      height={10}
                      width="80%"
                      style={{ marginBottom: 6 }}
                    />
                  }
                  subheader={
                    <Skeleton animation="wave" height={10} width="40%" />
                  }
                />

                <Skeleton
                  sx={{ height: 190 }}
                  animation="wave"
                  variant="rectangular"
                />

                <CardContent>
                  <React.Fragment>
                    <Skeleton
                      animation="wave"
                      height={10}
                      style={{ marginBottom: 6 }}
                    />
                    <Skeleton animation="wave" height={10} width="80%" />
                  </React.Fragment>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </>
    );
    
    }
    return (<Box>

      <Centered sx={{ height: '70vh', justifyContent: 'center', alignItems: 'center' }}>

        <Paper style={{ padding: '3em', minWidth: '300px' }}>
          <div style={{ textAlign: 'center' }}>
            <img
              src="/images/upload.png"
              alt="done"
              style={{ maxWidth: 200, marginBottom: 10 }}
            />
          </div>
          <Typography align="center" color="success.main" sx={{ mt: 2, mb: 2 }}>No Videos found</Typography>

        </Paper>


      </Centered>
    </Box>)
  };

  return (<React.Fragment><Grid container>{getGrid()}</Grid>

    <ApiLoader setLoading={(l) => setDone(l)} request={retry} onFail={(m) => {
      console.log("In grid");
      setDone(true);

    }} onLoad={(v) => {
      console.log(videos)
      console.log(v);
      setVideos(v)
      setDone(true)
    }} />
  </React.Fragment>);
};

export default VideoGrid;
