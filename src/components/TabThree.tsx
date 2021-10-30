import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Container from "@mui/material/Container";
import Spacer from "./Spacer";
import AppLink from "./AppLink";
import ViewHistory from "../models/ViewHistory";
import { shortenText } from "../utils/functions";
import { Link } from "react-router-dom";
import UserApiSignleton from "../api/userApi";
import Centered from "./Centered";


interface KosyTabProps {
  showing: boolean;
}





const TabThree: React.FC<KosyTabProps> = ({ showing }) => {
  const [shown, setShown] = useState(false);
  const [loading, setLoading] = useState(true)

  const [viewHistory, setViewHistory] = useState<ViewHistory[]>([]);
  useEffect(() => {
    if (!shown && showing) {
      console.log("request three");
      const userApi = UserApiSignleton();
      userApi.viewHistory().then((v) => {
        setLoading(false)
        setViewHistory(v);

      }).catch(() => {
        setLoading(false);
      });


      setShown(true)
    }

  }, [shown, showing])

  if (loading && viewHistory.length === 0) {
    return (<Container maxWidth="sm" style={{ paddingTop: "2em", height: '60vh' }} >
      <Centered sx={{ height: '100%' }}>
        <Box>
          <CircularProgress />
          <Typography>Loading</Typography>
        </Box>
      </Centered>
    </Container>)
  }
  return (
    <Container maxWidth="md" >
      <Spacer space={30} />
      {viewHistory.map(({ video, channel }, index) => {
        let variant: "outlined" | "filled" = video.videoType === 'restricted' ? 'filled': 'outlined';
        return (<Box key={'view-history-' + index} sx={{mb: 1}} display="flex" alignItems="center">

          <div style={{ width: "40%", maxWidth: '230px' }}>
            <Link to={"/main/watch/" + video.id} >
              <img style={{ display: 'block', width: '100%' }} src={video.thumbnail} alt={video.title} />
            </Link>
          </div>
          <Box flex={1} padding="1em">
            <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>
              {video.title}
            </Typography>
            <Typography sx={{ color: 'text.primary' }} fontSize={".85rem"} >
              {shortenText(video.description || "No description", 100)}
            </Typography>
            <AppLink to={"/main/channel/" + channel.id} sx={{ mt: 1, textTransform: 'none', padding: 0 }}>
              <Typography sx={{ color: 'text.primary' }} variant="subtitle2"  >
                {channel.name}
              </Typography>
            </AppLink>
            <div style={{marginTop: '0.5em'}}>
            <Chip variant={variant} label={video.videoType} size="small" />
            </div>
          


          </Box>

        </Box>)
      })}
    </Container>
  )
}

export default TabThree;