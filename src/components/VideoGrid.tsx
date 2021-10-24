import React, { useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import useDelayed from "../hooks/useDelayed";
import Button from "@mui/material/Button";
import ControlledText from "./ControlledText";
import Video from '../models/Video';

type VideoGridProps = {
  videoPlaceholderCount?: number;
  loggedIn?: boolean;
};

const VideoGrid: React.FC<VideoGridProps> = ({
  videoPlaceholderCount = 6,
  loggedIn = false,
}) => {
 
  const [videos, setVideos] = useState<Video[]>([]);
  const items = new Array(videoPlaceholderCount).fill(0);
  let done = useDelayed<boolean>(false, true, 1 * 1000);

  const getGrid = () => {
    if (done) {
      return (
        <>
          {items.map((item, index) => {
            return (
              <Grid key={"video" + index} item lg={3} md={4} sm={6} xs={12}>
                <Card sx={{ maxWidth: 345, m: 2 }}>
                  <CardHeader
                    avatar={
                      <a
                        style={{ textDecoration: "none" }}
                        href="/channels/intresting-channel-78767367376"
                      >
                        <Avatar
                          alt="Intresting Channel"
                          src="https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg"
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
                    title={"Intresting Channel"}
                    subheader={"5 hours ago"}
                  />
                  <a
                    style={{ textDecoration: "none" }}
                    href="/channels/intresting-channel-78767367376"
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image="/images/hq720.webp"
                      alt="Nicola Sturgeon on a TED talk stage"
                      sx={{ fontSize: "12px" }}
                    />
                  </a>

                  <CardContent>
                    <ControlledText
                      defaultComponent="span"
                      props={{
                        color: "text.secondary",
                        variant: "body2",
                        component: "p",
                        text: " For Norwegian football & the club it's a fantastic result - Bodo/Glimt CEO on beating Roma 6-1",
                        length: 60,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </>
      );
    }
    return (
      <>
        {items.map((item, index) => {
          return (
            <Grid key={"video" + index} item lg={3} md={4} sm={6} xs={12}>
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
  };

  return <Grid container>{getGrid()}</Grid>;
};

export default VideoGrid;