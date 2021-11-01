import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";

import Box from "@mui/material/Box";


import { Helmet } from "react-helmet";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import AppLink from "../../../components/AppLink";
import Container from "@mui/material/Container";
import { AppState } from "../../../store";
import ViewHistory from "../../../models/ViewHistory";
import Table from '@mui/material/Table';
import dayjs from "dayjs"
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import LoadingPageIndicator from "../../../components/LoadingPageIndicator";


import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import CreatorApiSingleton from '../../../api/creatorApi';
import Centered from "../../../components/Centered";
import { toHHMMSS } from "../../../utils/functions";
import ApiLoader from "../../../components/ApiLoader";
import { Channel } from "../../../models/User";
import VideosTab from "../../../components/VideosTab";

type KosyTabProps = {
    showing: boolean;
}







const ViewsTab: React.FC<KosyTabProps> = ({ showing }) => {

    const [shown, setShown] = useState(false);
    const [loading, setLoading] = useState(true)
    const [views, setViews] = useState<ViewHistory[]>([]);
    const [errrorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
    const [retries, setRetries] = useState(0);

    const handleRetry = () => {
        setRetries(retries + 1);
        setShown(false)
    }

    useEffect(() => {
        const loadFunc = async () => {
            if (!shown && showing) {
                const Api = CreatorApiSingleton();

                try {
                    let _views: any[];
                    _views = await Api.analytics("view", "video");


                    setViews(_views as ViewHistory[]);
                }
                catch (err: any) {
                    handleOpen(err.message || "An error occured");
                }
                setLoading(false);
                setShown(true)
            }

        }
        if (views.length > 0) return;
        loadFunc()

    }, [retries, showing, shown, views])
    const handleOpen = (message: string) => {
        setErrorMessage(message);
        setErrorPresent(true);
        setLoading(false);

    }


    const handleClose = () => {
        setErrorMessage("");
        setErrorPresent(false);
    }

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleRetry}>
                Retry
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


    const body = () => {
        if (loading && views.length === 0) {
            return (<Container maxWidth="sm" style={{ paddingTop: "2em", height: '60vh' }} >
                <Centered sx={{ height: '100%' }}>
                    <Box>
                        <CircularProgress />
                        <Typography>Loading</Typography>
                    </Box>
                </Centered>
            </Container>)
        }

        if (views.length === 0) {
            return (<Container maxWidth="sm" style={{ paddingTop: "2em", height: '60vh' }} >
                <Centered sx={{ height: '100%', textAlign: 'center' }}>
                    <Box>

                        <Typography sx={{ mb: 2 }}>No Views Found</Typography>
                        <Button color="secondary" size="small" onClick={handleRetry}>
                            ReLoad
                        </Button>
                    </Box>
                </Centered>
            </Container>)
        }
        else return (
            <Box>
                <Typography variant="h5"> Total: {views.length}</Typography>
                <TableContainer component={Paper} style={{ minHeight: '60vh' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Video</TableCell>
                                <TableCell align="right">Duration</TableCell>
                                <TableCell align="right">isPayedView</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {views.map(({ video, duration, isPayedView, createdAt }, i) => (
                                <TableRow
                                    key={'view-history' + i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <AppLink doNotUseButton to={"/creator/watch/" + video.id}><Typography color="primary.main" fontWeight="bold"> {video.title}</Typography> </AppLink>
                                    </TableCell>
                                    <TableCell align="right"><Typography>{toHHMMSS(duration / 1000)}</Typography> </TableCell>
                                    <TableCell align="right"><Typography>{isPayedView.toString()}</Typography></TableCell>
                                    <TableCell align="right"><Typography>{dayjs(createdAt).format('DD/MM/YYYY')}</Typography></TableCell>
                                    {/*
                    <TableCell align="right">{row.protein}</TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }


    return (<Box>

        {body()}

        <Snackbar
            open={errorPresent}
            autoHideDuration={6000}

            onClose={handleClose}
            message={errrorMessage}
            action={action}
        />
    </Box>);

}


const OverviewTab: React.FC<{ channel: Channel }> = ({ channel }) => {
    return (<Grid container spacing={2}>


        <Grid item sm={12} md={6} style={{ flex: 1 }}>
            <Paper sx={{ minWidth: '300px', }}>
                <Box padding="1em">

                    <Typography variant="caption" color="GrayText">
                        Total Followers
                    </Typography>

                    <Typography variant="h5" component="p" sx={{ mb: 1 }} >{channel.follower_count}</Typography>
                    <Typography variant="caption" color="GrayText" style={{ display: 'block' }} sx={{ mt: 1 }}>
                        Total Videos
                    </Typography>

                    <Typography paragraph sx={{ mb: 1 }}>
                        {channel.video_count || "0"}
                    </Typography>

                    <Typography variant="caption" color="GrayText" style={{ display: 'block' }} sx={{ mt: 1 }}>
                        Total Views
                    </Typography>

                    <Typography paragraph sx={{ mb: 1 }}>
                        {channel.total_views || "0"}
                    </Typography>


                </Box>
            </Paper>
        </Grid>

    </Grid>)
}


const Analytics: React.FC = () => {
    const [channel, setChannel] = useState<Channel | undefined>();
    const [loading, setLoading] = useState(true)



    const user = useSelector((state: AppState) => state.auth.user);
    const TabNames = ["Overview", "Views", "Videos"]

    const [value, setValue] = useState(0);

    const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        let pathName = window.location.hash.slice(1)
        if (pathName) {
            const dictionary: any = {};
            const TabNames2 = ["Overview", "Views", "Videos"]
            TabNames2.forEach((name, index) => {
                dictionary[name.toLocaleLowerCase()] = index;
            })

            let index = dictionary[pathName];
            if (index) {
                setValue(index)
            }

        }

    }, []);

    const retry = async function () {
        const Api = CreatorApiSingleton();
        let c = await Api.getChannel();
        // setChannel(c);
        // setLoading(false)

        return c;
    }

    const getBody = () => {
        if (loading) {
            return (
                <Container style={{ marginTop: "64px", minHeight: '80vh' }}
                    sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
                >
                    <LoadingPageIndicator />
                </Container>
            );
        }
        if (channel) {
            return (<>   <Helmet>

                <title>{channel.name || "None"} </title>

            </Helmet>
                <Paper style={{ padding: "1em 0 0", border: 'none', boxShadow: 'none' }} elevation={0}>
                    <Container maxWidth="md">
                        <Typography variant="h5">{user?.fullName || "None"} / {channel.name}</Typography>
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
                                {TabNames.map((v, k) => (<Tab key={'ereder-tab' + k} href={'#' + v.toLocaleLowerCase()} label={v} />))}
                            </Tabs>
                        </Box>
                    </Container>
                </Paper>
                <Box padding="1em" style={{ display: (value === 0 ? 'block' : 'none') }}>
                    <OverviewTab channel={channel} />

                </Box>
                <Box padding="1em" style={{ display: (value === 1 ? 'block' : 'none') }}>
                    <ViewsTab showing={value === 1} />
                </Box>


                <Box padding="1em" style={{ display: (value === 2 ? 'block' : 'none') }}>
                    <VideosTab showing={value === 2} />
                </Box>
           
            </>);
        }

        return (<Container style={{ marginTop: "64px", minHeight: '80vh' }}
            sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
        >
            <Centered sx={{ height: '100%' }}>
                <Typography>An error occured </Typography>
            </Centered>
        </Container>)
    }

    return (
        <Box style={{ paddingTop: "4em", position: "relative", height: '100vh' }} sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}>

            {getBody()}
            <ApiLoader setLoading={setLoading} request={retry} onLoad={(v) => {
                console.log(v);
                setChannel(v as Channel)
                setLoading(false)
            }} />
        </Box>



    )
}

export default Analytics
