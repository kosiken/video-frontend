import React, { useState } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from "dayjs"

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import ApiLoader from "../../components/ApiLoader";
import LoadingPageIndicator from "../../components/LoadingPageIndicator";
import VideoView from "../../components/VideoView";
import { useParams } from "react-router";
import Video from '../../models/Video';
import UserApiSignleton from '../../api/userApi';
import { Channel } from '../../models/User';
import CommentComponent from '../../components/CommentComponent';
dayjs.extend(relativeTime)
const ViewRestricted = () => {
  const prefix = ""
  const [video, setVideo] = useState<Video | undefined>();

  const [loading, setLoading] = useState(true);


  let { accessCode } = useParams<{ accessCode: string }>();



  const getVideo = async () => {
    const Api = UserApiSignleton();
    setLoading(true)

    let v = await Api.getRestrictedVideo(accessCode);
    console.log(v, 'lion')
    setVideo(v);
    setLoading(false)
    return v;
  }



  const getBody = () => {
    if (loading && !video) return <LoadingPageIndicator />
    if (video)
      return (
        <Box style={{ paddingTop: "4em" }}>
          <Grid container spacing={2}>
            <Grid item md={8} sm={12}>
              <VideoView url={prefix + video.url} video={video} accessToken={accessCode} />
            </Grid>
            <Grid item md={4} sm={12}>
              <Box padding={2}>

                <Typography variant="caption">{typeof video.channel === "string" ? video.channel : (video.channel as Channel).name}</Typography>
                <Typography variant="h4">{video.title} </Typography>
                <Typography variant="body2">
                  {video.description}
                </Typography>
                <Typography sx={{mt: 1, mb: 2}} variant="caption">
                  {dayjs(video.createdAt).fromNow()}
                </Typography>

              <CommentComponent videoId={video.id} />
              </Box>
            </Grid>
          </Grid>


        </Box>
      );



    return <p>lol</p>
  }
  return (
    <div>
      {getBody()}
      <ApiLoader setLoading={setLoading} request={getVideo} onLoad={(v) => {
        console.log(v);
        setVideo(v as Video);
        setLoading(false);
      }} />
    </div>
  )
};

export default ViewRestricted;
