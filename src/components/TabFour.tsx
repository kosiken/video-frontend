import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Container from "@mui/material/Container";
import Spacer from "./Spacer";
import AppLink from "./AppLink";
import { shortenText } from "../utils/functions";
import { Link } from "react-router-dom";
import { VideoPurchase } from "../models/Video";
import UserApiSignleton from "../api/userApi";
import Centered from "./Centered";


interface KosyTabProps {
  showing: boolean;
}







const TabFour: React.FC<KosyTabProps> = ({ showing }) => {
  const [shown, setShown] = useState(false);
  const [loading, setLoading] = useState(true)


  const [purchases, setPurchases] = useState<VideoPurchase[]>([]);


  useEffect(() => {
    if (!shown && showing) {
      console.log("request four");
      const userApi = UserApiSignleton();
      userApi.purchases().then((v) => {
        setLoading(false)
        setPurchases(v);

      }).catch(() => {
        setLoading(false);
      });

      setShown(true)
    }

  }, [shown, showing])
  if (loading && purchases.length === 0) {
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
      {purchases.map(({ videoPurchased: video, amountPaid: price, channel, accessCode }, index) => {

        return (<Box sx={{mb: 1}} key={'view-history-' + index} display="flex" alignItems="center">

          <div style={{ width: "40%", maxWidth: '230px' }}>
            <Link to={"/main/restricted/" + accessCode} >
              <img style={{ display: 'block', width: '100%' }} src={video.thumbnail} alt={video.title} />
            </Link>
          </div>
          <Box flex={1} padding="1em">
            <Typography sx={{ color: 'text.primary' }} fontWeight="bold" >
              {video.title}
            </Typography>
            <Typography sx={{ color: 'text.primary' }} fontSize={".85rem"} >
              {shortenText(video.description, 80)}
            </Typography>

            <AppLink to={"/main/channel/" + channel.id} sx={{ mt: 1, textTransform: 'none', padding: 0 }}>
              <Typography variant="subtitle2"  >
                {channel.name}
              </Typography>
            </AppLink>
            <Typography sx={{ color: 'success.main' }} fontWeight="bold" component="p" variant="caption"  >
              {price}(NGN)
            </Typography>
          </Box>

        </Box>)
      })}
    </Container>
  )
}

export default TabFour;