import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { AppState } from "../../store";
import Container from "@mui/material/Container";
import Badge from "@mui/material/Badge";
import { Helmet } from "react-helmet";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/system";
import Spacer from "../../components/Spacer";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import User, { Channel } from "../../models/User";
import AppLink from "../../components/AppLink";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import ViewHistory from "../../models/ViewHistory";
import { shortenText } from "../../utils/functions";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { VideoPurchase } from "../../models/Video";
import UserApiSignleton from "../../api/userApi";


interface KosyTabProps {
  showing: boolean;
}

type CountryItem = {
  value: string;
  title: string;
};

const Countries: CountryItem[] = [
  {
    value: "nigeria",
    title: "Nigeria",
  },
  {
    value: "civ",
    title: "Cote'ivore",
  },
  {
    value: "ghana",
    title: "Ghana",
  },
  {
    value: "the_gambia",
    title: "The Gambia",
  },
];

let id = 0;
const ChannelsList: Channel[] = new Array<Channel>(12)
  .fill({
    id: "0",
    logo: "/images/me.jpeg",
    name: "Intresting Channel",
    short_description: "A good Channel",
    user_id: "10",
    follower_count: 2495,
  })
  .map((c) => {
    return { ...c, name: c.name + (++id), id: `${id}` };
  });

const ViewHistoryList: ViewHistory[] = [
  {
    userWhoViewed: "1",
    video: {
      channel: "1",
      id: "intresting-channel-78767367376",
      channel_name: "Cool Channel",
      thumbnail: "/images/hq720.webp",
      title: "Cool Video",
      description: "A description",
      uploaded: new Date(2020, 10, 22),
      duration: 39409,
      video_type: "public", views: 10049944, url: ''
    },
  },

  {
    userWhoViewed: "1",
    video: {
      id: "intresting-channel-78767367376",
      channel: "2", channel_name: "Cool Channel2",
      thumbnail: "/images/hq720.webp",
      title: "Another Cool Video",
      description: "A cooler description",
      uploaded: new Date(2019, 10, 22),
      duration: 39409,
      video_type: "public", views: 1004, url: ''
    },
  },

  {
    userWhoViewed: "1",
    video: {
      channel: "2", id: "intresting-channel-78767367376",
      thumbnail: "/images/hq720.webp", channel_name: "Coolest Channel",
      title: "A Very good Video",
      description: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti
      voluptatem laudantium iusto, voluptates, quae, amet ipsam aperiam
      dignissimos impedit natus praesentium deleniti iste quaerat expedita
      magni odit error perspiciatis quod!`,
      uploaded: new Date(2021, 10, 22),
      duration: 39409,
      video_type: "public", views: 1004994, url: ''
    },
  },
  
];

const Purchases: VideoPurchase[] = ViewHistoryList.map(v => {
  return ({ ...v, user_id: '1', userWhoViewed: undefined,  price: 900 } as VideoPurchase)
})


const TabOne: React.FC<{ user?: User }> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false)
  const handleClick = (m: string) => {
    setMessage(m);



    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }
  const theme = useTheme();
  const {
    register,
    handleSubmit,

  } = useForm({});
  const [country] = useState(Countries[0].value);
  const userApi = UserApiSignleton()
  const onSubmit = (data: any) => {
    setLoading(true);
    let keys = Object.keys(data);
    let v: any = { ...user };
    for (let key of keys) {

      if (!data[key] || (v && (data[key] === (v[key])))) delete data[key];

    }

    userApi.updateDetails(data)
      .then(() => {

        setLoading(false);
        handleClick('Details Updated successfully')
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        handleClick('An error occured while trying to update')
      })

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
    <Container maxWidth="md">
      <Typography sx={{ mt: 2, mb: 2, color: 'text.primary' }} fontWeight="bold">
        Profile Picture
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <IconButton style={{ backgroundColor: theme.palette.primary.main }}>
              <CloudUploadIcon htmlColor="white" />
            </IconButton>
          }
        >
          <Avatar
            alt={user?.fullName || "None"}
            src={user?.profilePic || "/images/me.jpeg"}
            sx={{ width: 100, height: 100 }}
          />
        </Badge>
        <Spacer space={20} />
        <Divider variant="middle" /> <Spacer space={20} />
        <form style={{ maxWidth: "500px" }} onSubmit={handleSubmit(onSubmit)}>
          {loading && <LinearProgress />}
          <Typography sx={{ mt: 2, mb: 2, color: 'text.primary' }} fontWeight="bold">
            Contact Details
          </Typography>
          <FormControl fullWidth>
            <TextField
              defaultValue={user?.fullName}
              id="fullName"
              label="Full Name"
              variant="outlined"
              InputProps={{
                type: "text",
              }}

              {...register("fullName")}
            />
          </FormControl>
          <Spacer space={20} />
          <FormControl fullWidth>
            <TextField
              id="email"
              defaultValue={user?.email}
              label="Email"
              variant="outlined"
              InputProps={{
                type: "email",
              }}
              {...register("emailAddress")}
            />
          </FormControl>
          <Spacer space={20} />

          <FormControl fullWidth>
            <TextField
              variant="filled"
              type="date"
              defaultValue={user?.birthdate}
              InputProps={{ inputProps: { max: "12-12-2021" } }}

              {...register("dob")}
            />
          </FormControl>
          <Spacer space={20} />

          <InputLabel id="demo-simple-select-label">Country</InputLabel>
          <FormControl fullWidth>
            {" "}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={country}
              label="Country"

              {...register("country")}
            >
              {Countries.map(({ value, title }, index) => (
                <MenuItem key={"country" + index} value={value}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Spacer space={20} />
          <Button type="submit" variant="contained">
            Update Details
          </Button>
        </form>
      </Box>
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

const TabTwo: React.FC<KosyTabProps> = ({ showing }) => {
  const [shown, setShown] = useState(false);
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
        })
        .catch(err => {

          setOpen(true);
          setMessage(err.message)

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

  return (
    <Container maxWidth="sm" style={{ paddingTop: "2em" }}>
      {channels.map((creator, index) => {
        return (
          <Box display="flex" key={"channel-" + index}>
            <AppLink
              to={"main/channel/" + creator.id}

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


const TabThree: React.FC<KosyTabProps> = ({ showing }) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!shown && showing) {
      console.log("request three");
      setShown(true)
    }

  }, [shown, showing])
  const [viewHistory, /* setViewHistory */] = useState(ViewHistoryList);

  return (
    <Container maxWidth="md" >
      <Spacer space={30} />
      {viewHistory.map(({ video }, index) => {
        return (<Box key={'view-history-' + index} display="flex" alignItems="center">

          <div style={{ width: "40%", maxWidth: '230px' }}>
            <Link to={"/watch/" + video.id} >
              <img style={{ display: 'block', width: '100%' }} src={video.thumbnail} alt={video.title} />
            </Link>
          </div>
          <Box flex={1} padding="1em">
            <Typography fontWeight="bold" sx={{ color: 'text.primary' }}>
              {video.title}
            </Typography>
            <Typography sx={{ color: 'text.primary' }} fontSize={".85rem"} >
              {shortenText(video.description, 100)}
            </Typography>
            <AppLink to={"/channel/" + ((typeof video.channel === "number") ? video.channel : (video.channel as Channel).id)} sx={{ mt: 1, textTransform: 'none', padding: 0 }}>
              <Typography sx={{ color: 'text.primary' }} variant="subtitle2"  >
                {video.channel_name}
              </Typography>
            </AppLink>

          </Box>

        </Box>)
      })}
    </Container>
  )
}


const TabFour: React.FC<KosyTabProps> = ({ showing }) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!shown && showing) {
      console.log("request four");
      setShown(true)
    }

  }, [shown, showing])
  const [purchases, /* setPurchase */] = useState(Purchases);




  return (
    <Container maxWidth="md" >
      <Spacer space={30} />
      {purchases.map(({ video, price }, index) => {
        return (<Box key={'view-history-' + index} display="flex" alignItems="center">

          <div style={{ width: "40%", maxWidth: '230px' }}>
            <Link to={"/watch/" + video.id} >
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

            <AppLink to={"/channel/" + ((typeof video.channel === "string") ? video.channel : video.channel.id)} sx={{ mt: 1, textTransform: 'none', padding: 0 }}>
              <Typography variant="subtitle2"  >
                {video.channel_name}
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

const Profile = () => {
  const TabNames = ["Profile", "Channels", "History", "Purchases"]
  const user = useSelector((state: AppState) => state.auth.user);
  const [value, setValue] = useState(0);

  useEffect(() => {
    let pathName = window.location.hash.slice(1)
    if (pathName) {
      const dictionary: any = {};
      TabNames.forEach((name, index) => {
        dictionary[name.toLocaleLowerCase()] = index;
      })
      dictionary["channel"] = 1;
      let index = dictionary[pathName];
      if (index) {
        setValue(index)
      }

    }

  }, [])
  const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (
    <Box style={{ marginTop: "4em", position: "relative" }}>
      <Helmet>

        <title>{user?.fullName + " / " + TabNames[value]}</title>

      </Helmet>
      <Paper style={{ padding: "1em 0 0", border: 'none', boxShadow: 'none' }} elevation={0}>
        <Container maxWidth="md">
          <Typography variant="h5">{user?.fullName || "None"}</Typography>
        </Container>
      </Paper>

      <Paper style={{ position: "sticky", top: 64, left: 0, zIndex: 99, borderTop: 'none' }} square>
        <Container maxWidth="md">
          <Box
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "sticky",
              top: 64,
              left: 0,
              zIndex: 99,
            }}
          >
            <Tabs
              variant="scrollable"
              scrollButtons="auto"
              value={value}
              onChange={handleChange1}
            >
              <Tab href="#profile" label="Profile" />
              <Tab href="#channel" label="Channels" />
              <Tab href="#history" label="History" />
              <Tab href="#purchases" label="Purchases" />
            </Tabs>
          </Box>
        </Container>
      </Paper>

      <Box style={{ display: (value === 0 ? 'block' : 'none') }}>
        <TabOne user={user} />
      </Box>
      <Box style={{ display: (value === 1 ? 'block' : 'none') }}>
        <TabTwo showing={value === 1} />
      </Box>
      <Box style={{ display: (value === 2 ? 'block' : 'none') }}>
        <TabThree showing={value === 2} />
      </Box>

      <Box style={{ display: (value === 3 ? 'block' : 'none') }}>
        <TabFour showing={value === 3} />
      </Box>
      <Spacer space={30} />


    </Box>
  );
};

export default Profile;
