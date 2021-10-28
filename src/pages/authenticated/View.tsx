import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
 
 
 
import VideoView from "../../components/VideoView";

const View = () => {
    const url = "/videos/video.mp4"//https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4

 
 

  return (
    <Box style={{ marginTop: "4em" }}>
      <Grid container spacing={2}>
        <Grid  item md={8} sm={12}>
       <VideoView url={url} />
        </Grid>
        <Grid item md={4} sm={12}>
          <Box padding={2}>
    
            <Typography variant="caption">Video Creator</Typography>
            <Typography variant="h4">Video Title </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae
              unde provident quae praesentium, non sint. Rerum, ex error
              distinctio ut blanditiis magni voluptates numquam cumque. Dolor
              itaque cupiditate repellendus a.
            </Typography>
            <Typography variant="caption">
             5 hours ago
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default View;
