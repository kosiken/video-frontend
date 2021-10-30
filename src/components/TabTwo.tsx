import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CircularProgress from '@mui/material/CircularProgress';
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Channel } from "../models/User";
import AppLink from "./AppLink";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import UserApiSignleton from "../api/userApi";
import Centered from "./Centered";


interface KosyTabProps {
  showing: boolean;
}



const TabTwo: React.FC<KosyTabProps> = ({ showing }) => {
  const [shown, setShown] = useState(false);
  const [loading, setLoading] = useState(true)
  const [loadingResponse, setLoadingResponse] = useState(false)
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelUnfollowed, setChannelUnfollowed] = useState<Channel | null>(
    null
  );



  useEffect(() => {
    if (!shown && showing) {
      console.log("request two");
      setShown(true)

      const userApi = UserApiSignleton();

      userApi.getFollowing()
        .then((subs) => {
          setChannels(subs.map(s => s.channel))
          setLoading(false)
        })
        .catch(err => {

          setOpen(true);
          setMessage(err.message)
          setLoading(false)

        })
    }

  }, [shown, showing])
  const handleClick = (channelToUnfollow: Channel) => {
    if (loadingResponse) return;
    const userApi = UserApiSignleton();
    setLoadingResponse(true);

    userApi.unSubscribe(channelToUnfollow.id)
      .then(ans => {
        console.log(ans);
        setMessage("unfollowed " + channelToUnfollow.name);
        setChannelUnfollowed(channelToUnfollow);
        setChannels(channels.filter((c) => c.id !== channelToUnfollow.id));
        setLoadingResponse(false)
        setOpen(true);
      })
      .catch(err => {
        // TODO handle error properly
        setLoadingResponse(false);
        setMessage("An error occured")
        setOpen(true);

      })


  };

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    if (reason !== "undo") {
      console.log("unfollowed " + channelUnfollowed?.name);
    }

    setOpen(false);
    setChannelUnfollowed(null);
  };

  const handleUndo = (event: React.SyntheticEvent | React.MouseEvent) => {
    if (channelUnfollowed !== null) {
      if (loadingResponse) return;
      const userApi = UserApiSignleton();
      setLoadingResponse(true);

      userApi.subscribe(channelUnfollowed.id)
        .then(sub => {
          setChannels([sub.channel, ...channels]);
          setChannelUnfollowed(null);
          setMessage("Subscribed to " + sub.channel.name)
          setLoadingResponse(false)
          setOpen(true);
        }).catch(err => {
          // TODO handle error properly
          setLoadingResponse(false);
          setMessage("An error occured")
          setOpen(true);

        })

    }
    // handleClose(event, "undo");
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleUndo}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >

        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  if (loading && channels.length === 0) {
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
    <Container maxWidth="sm" style={{ paddingTop: "2em" }}>
      {channels.map((creator, index) => {
        return (
          <Box display="flex" sx={{mb: 1}} key={"channel-" + index}>
            <AppLink
              to={"/main/channel/" + creator.id}

              style={{ marginBottom: 10, flex: 1, display: "flex", }}
              sx={{
                textTransform: "none",
                display: "flex",
                width: "100%",
                justifyContent: "flex-start",
                color: "inherit",
              }}
            >
              <Avatar alt={creator.name} src={creator.logo} />
              <Box padding="0 0 0 1em">
                <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>
                  {creator.name}
                </Typography>
                <Typography component="p" variant="subtitle2" color="GrayText" align="left">
                  {creator.follower_count +
                    (creator.follower_count === 1
                      ? " follower"
                      : " followers")}
                </Typography>
              </Box>
            </AppLink>

            <Button

              style={{ display: "inline" }}
              onClick={() => handleClick(creator)}
            >
              Unfollow
            </Button>
          </Box>
        );
      })}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </Container>
  );
};


export default TabTwo;
