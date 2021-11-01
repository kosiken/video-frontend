import React, { useState} from  'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from "dayjs"

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
 
import ApiLoader from "../../components/ApiLoader";
import LoadingPageIndicator from "../../components/LoadingPageIndicator";
import VideoView from "../../components/VideoView";
import {  useParams } from "react-router";
import Video from '../../models/Video';
import ApiSignleton from '../../api/api';
import { Channel } from '../../models/User';
dayjs.extend(relativeTime)

const View = () => {
    const url = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
    const prefix = "http://localhost:1337"
const [video, setVideo] = useState<Video|undefined>();

const [loading, setLoading] = useState(true);


let { id } = useParams<{id: string}>();



   const getVideo = async () => {
      const Api = ApiSignleton();
      setLoading(true)
    
     let v =  await Api.getVideo(id);
     console.log(v, 'lion')
setVideo(v);
setLoading(false)
    return v;
   }
   


  const getBody = () => {
    if(loading && !video) return <LoadingPageIndicator />
    if(video)
      return (
        <Box style={{ paddingTop: "4em" }}>
          <Grid container spacing={2}>
            <Grid  item md={8} sm={12}>
           <VideoView url={prefix + video.url} video={video} />
            </Grid>
            <Grid item md={4} sm={12}>
              <Box padding={2}>
        
                <Typography variant="caption">{typeof video.channel === "string" ? video.channel : (video.channel as Channel).name}</Typography>
                <Typography variant="h4">{video.title} </Typography>
                <Typography variant="body2">
                {video.description}
                </Typography>
                <Typography variant="caption">
                {dayjs(video.createdAt).fromNow()}
                </Typography>
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

export default View;
