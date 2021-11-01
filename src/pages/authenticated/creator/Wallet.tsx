import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from "@mui/icons-material/Add";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from '@mui/material/AppBar';
import TextField from '@mui/material/TextField';

import Box from "@mui/material/Box";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Wallet } from '../../../models/User'
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
import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import dayjs from "dayjs"
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import LoadingPageIndicator from "../../../components/LoadingPageIndicator";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { alpha } from '@mui/material/styles';

import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import CreatorApiSingleton from '../../../api/creatorApi';
import Centered from "../../../components/Centered";
import { toHHMMSS } from "../../../utils/functions";
import ApiLoader from "../../../components/ApiLoader";
import { VideoPurchase } from "../../../models/Video";
import { Channel, WithdrawalRequest } from "../../../models/User";
import VideosTab from "../../../components/VideosTab";
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const BalanceInfoText = "We take 10% of all payments as is contained in our terms of use"

const BalanceInfoText2 = `Check that the amount entered is not more than the balance of your wallet`


type KosyTabProps = {
    showing: boolean;
}
interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;


}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}





const OverviewTab: React.FC<{ wallet: Wallet }> = ({ wallet }) => {

    const [open, setOpen] = React.useState(false);

    const [dialogHeader, setDialogHeader] = useState("")
    const [dialogContent, setDialogContent] = useState("")
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const dialog = (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {dialogHeader}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {dialogContent}
                </DialogContentText>
            </DialogContent>
            <DialogActions>

                <Button onClick={handleClose} autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
    return (
        <Box>
            <Box padding="3em 1em" sx={{ backgroundColor: 'primary.main', minHeight: 'calc(100vh - 164px)' }}>
                <Centered sx={{ height: '100%' }}>
                    <Paper style={{ padding: '2em', textAlign: 'center' }} elevation={3}>
                        <img style={{ width: '100%', maxWidth: 350 }} alt="Become a creator" src="/images/earn.png" />

                        <div style={{ display: 'flex' }}>
                            <Typography variant="h6" style={{ flex: 1 }}>Total Balance (NGN){wallet.income}</Typography>
                            <IconButton color="info" onClick={() => {
                                setDialogHeader("Balance Info Help")
                                setDialogContent(BalanceInfoText);
                                handleClickOpen();
                            }}>
                                <HelpOutlineIcon />
                            </IconButton>
                        </div>

                    </Paper>
                </Centered>
            </Box>

            {dialog}
        </Box>
    )
}

const PurchasesTab: React.FC<KosyTabProps> = ({ showing }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [shown, setShown] = useState(false);
    const [loading, setLoading] = useState(true)
    const [purchases, setPurchases] = useState<VideoPurchase[]>([]);
    const [errrorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
    const [retries, setRetries] = useState(0);

    const handleRetry = () => {
        setRetries(retries + 1);
        setShown(false)
    }

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const loadFunc = async () => {
            if (!shown && showing) {
                const Api = CreatorApiSingleton();

                try {
                    let _views: any[];
                    _views = await Api.analytics("purchase", "videoPurchased");


                    setPurchases(_views as VideoPurchase[]);
                }
                catch (err: any) {
                    handleOpen(err.message || "An error occured");
                }
                setLoading(false);
                setShown(true)
            }

        }
        if (purchases.length > 0) return;
        loadFunc()

    }, [retries, showing, shown, purchases])
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

        if (purchases.length === 0) {
            return (<Container maxWidth="sm" style={{ paddingTop: "2em", height: '60vh' }} >
                <Centered sx={{ height: '100%', textAlign: 'center' }}>
                    <Box>

                        <Typography sx={{ mb: 2 }}>Nothing Found Here</Typography>
                        <Button color="secondary" size="small" onClick={handleRetry}>
                            ReLoad
                        </Button>
                    </Box>
                </Centered>
            </Container>)
        }
        else return (
            <Container maxWidth="md" style={{ padding: '1em' }}>
                <Paper>
                    <TableContainer style={{ minHeight: '40vh' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Video</TableCell>
                                    <TableCell align="right">Amount Paid</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? purchases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : purchases).map(({ videoPurchased: video, amountPaid, createdAt }, i) => (
                                        <TableRow
                                            key={'purchase-' + i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <AppLink doNotUseButton to={"/creator/watch/" + video.id}><Typography color="primary.main" fontWeight="bold"> {video.title}</Typography> </AppLink>
                                            </TableCell>
                                            <TableCell align="right"><Typography>NGN{amountPaid}</Typography> </TableCell>
                                            <TableCell align="right"><Typography>{dayjs(createdAt).format('DD/MM/YYYY')}</Typography></TableCell>
                                            {/*
                    <TableCell align="right">{row.protein}</TableCell> */}
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        sx={{ width: '100%', display: 'block' }}
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={3}
                        count={purchases.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: {
                                'aria-label': 'rows per page',
                            },
                            native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                </Paper>
            </Container>
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





const RequestsTab: React.FC<KosyTabProps & {
    onRequestChange: (amount: number) => void;
}> = ({ showing, onRequestChange }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [shown, setShown] = useState(false);
    const [loading, setLoading] = useState(true)
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const [errrorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
    const [retries, setRetries] = useState(0);
    const [loading2, setLoading2] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = useState(0);



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };
    const handleRetry = () => {
        if (amount > 0) return;
        setRetries(retries + 1);
        setShown(false)
    }

    const sendRequest = async () => {
        const Api = CreatorApiSingleton();
        if (amount === 0) return;
        setLoading2(true)
        try {
            let request = await Api.createRequest(amount);

            setRequests(requests.concat([request]));

            onRequestChange(request.amount);
            alert("Request successful");
            handleCloseDialog();

        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 400) {
                    console.log(error.response.data);
                    if (amount < 100) handleOpen(`${amount} is less than minimum which is (NGN)100`);
                    else handleOpen(error.response.data.problems)
                }
            }
        }
        setLoading2(false);
    }

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const loadFunc = async () => {
            if (!shown && showing) {
                const Api = CreatorApiSingleton();

                try {
                    let _views: any[];
                    _views = await Api.getRequests();


                    setRequests(_views as WithdrawalRequest[]);
                }
                catch (err: any) {
                    handleOpen(err.message || "An error occured");
                }
                setLoading(false);
                setShown(true)
            }

        }
        if (requests.length > 0) return;
        loadFunc()

    }, [retries, showing, shown, requests])
    const handleOpen = (message: string) => {
        setErrorMessage(message);
        setErrorPresent(true);
        setLoading(false);

    }


    const handleClose = () => {
        setErrorMessage("");
        setErrorPresent(false);
    }

    const toolbar = (<div>
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }}
        >

            <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
            >
                {requests.length}  Requests
            </Typography>


            <Tooltip title="Add">
                <IconButton onClick={handleClickOpen}>
                    <AddIcon />
                </IconButton>
            </Tooltip>



        </Toolbar>

    </div>
    );

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


    const dialog = (<Dialog open={open} onClose={handleCloseDialog}>
        {loading2 && <LinearProgress />}
        <DialogTitle>Request Withdrwawal</DialogTitle>
        <DialogContent>

            <DialogContentText>
                {BalanceInfoText2}
            </DialogContentText>
            <TextField
                defaultValue={0}
                autoFocus
                margin="dense"
                id="name"
                label="Amount"
                type="number"
                fullWidth
                variant="standard"
                onChange={(e) => {
                    setAmount(parseInt(e.target.value))
                }}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={sendRequest}>Send</Button>
        </DialogActions>
    </Dialog>)

    const body = () => {
        if (loading && requests.length === 0) {
            return (<Container maxWidth="sm" style={{ paddingTop: "2em", height: '60vh' }} >
                <Centered sx={{ height: '100%' }}>
                    <Box>
                        <CircularProgress />
                        <Typography>Loading</Typography>
                    </Box>
                </Centered>
            </Container>)
        }

        if (requests.length === 0) {
            return (<Container maxWidth="sm" style={{ paddingTop: "2em", height: '60vh' }} >
                <Centered sx={{ height: '100%', textAlign: 'center' }}>
                    <Box>

                        <Typography sx={{ mb: 2 }}>Nothing Found Here</Typography>
                        <Button variant="contained" onClick={handleClickOpen} sx={{ mr: 2 }}> Create </Button>
                        <Button color="secondary" size="small" onClick={handleRetry}>
                            Reload
                        </Button>

                    </Box>
                </Centered>
            </Container>)
        }
        else return (
            <Container maxWidth="md" style={{ padding: '1em' }}>
                <Paper>
                    {toolbar}
                    <TableContainer style={{ minHeight: '40vh' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="right">Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : requests).map(({ status, amount, createdAt }, i) => (
                                        <TableRow
                                            key={'request-' + i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">

                                                <Typography color="primary.main" fontWeight="bold"> {status}</Typography>
                                            </TableCell>
                                            <TableCell align="right"><Typography>NGN{amount}</Typography> </TableCell>
                                            <TableCell align="right"><Typography>{dayjs(createdAt).format('DD/MM/YYYY')}</Typography></TableCell>
                                            {/*
                    <TableCell align="right">{row.protein}</TableCell> */}
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        sx={{ width: '100%', display: 'block' }}
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={3}
                        count={requests.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: {
                                'aria-label': 'rows per page',
                            },
                            native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                </Paper>
            </Container>
        )
    }


    return (<Box>

        {body()}

        {dialog}

        <Snackbar
            open={errorPresent}
            autoHideDuration={6000}

            onClose={handleClose}
            message={errrorMessage}
            action={action}
        />
    </Box>);

}





const WalletPage: React.FC = () => {

    const TabNames = ["Overview", "Requests", "Transactions", "Purchases"];
    const [value, setValue] = useState(0);
    const [wallet, setWallet] = useState<Wallet | undefined>()
    const [loading, setLoading] = useState(false)
    const user = useSelector((state: AppState) => state.auth.user);
    useEffect(() => {
        let pathName = window.location.hash.slice(1)
        if (pathName) {
            const dictionary: any = {};
            const TabNames2 = ["Overview", "Requests", "Transactions", "Purchases"];
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
        let w = await Api.getWallet();
        // setChannel(c);
        // setLoading(false)

        return w;
    }
    // const action = (
    //     <IconButton
    //         size="small"
    //         aria-label="close"
    //         color="inherit"
    //         onClick={handleClose}
    //     >

    //         <CloseIcon fontSize="small" />
    //     </IconButton>
    // ); 
    const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

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
        if (wallet) {
            return (
                <>
                    <Paper style={{ padding: "1em 0 0", border: 'none', boxShadow: 'none' }} elevation={0}>
                        <Container maxWidth="md">
                            <Typography variant="h5">{user?.fullName || "None"} / Wallet</Typography>
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

                    <Box style={{ display: (value === 0 ? 'block' : 'none') }}>
                        <OverviewTab wallet={wallet} />

                    </Box>
                    <Box style={{ display: (value === 1 ? 'block' : 'none') }}>
                        <RequestsTab showing={value === 1} onRequestChange={(amount) => {
                            let w = { ...wallet };
                            w.income = wallet.income - amount;
                            setWallet(w);
                        }} />

                    </Box>

                    <Box style={{ display: (value === 3 ? 'block' : 'none') }}>
                        <PurchasesTab showing={value === 3} />

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
                setWallet(v as Wallet)
                setLoading(false)
            }} />
        </Box>
    );
};

export default WalletPage;
