import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from "@mui/icons-material/Add";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from '@mui/material/AppBar';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Helmet } from "react-helmet";
import Avatar from "@mui/material/Avatar";
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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

import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";

import Container from "@mui/material/Container";

import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import dayjs from "dayjs"
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import AppLink from "../../components/AppLink";
import LoadingPageIndicator from "../../components/LoadingPageIndicator";
import Centered from '../../components/Centered';
import AdminApiSingleton from '../../api/adminApi';
import { AppState } from "../../store";
import User, { WithdrawalRequest } from "../../models/User";
import { shortenText } from "../../utils/functions";


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


const RequestsTab: React.FC<KosyTabProps> = ({ showing }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [user, setUser] = useState<User | undefined>()
    const [currentRequest, setCurrentRequest] = useState<WithdrawalRequest | undefined>()
    const [rindex, setRindex] = useState(0)
    const [shown, setShown] = useState(false);
    const [loading, setLoading] = useState(true)
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const [errrorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
    const [retries, setRetries] = useState(0);
    const [loading2, setLoading2] = useState(false);
    const [open, setOpen] = React.useState(false);
   
    const open2 = Boolean(anchorEl);



    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleAcceptOrReject = async (state: boolean) => {
        if (currentRequest && currentRequest.status === 'pending') {
            let s: "fulfilled" | "denied" = state ? 'fulfilled' : 'denied'
            const Api = AdminApiSingleton();

            setLoading2(true);
            try {
                let ans = await Api.handleWithdrawal(currentRequest.id, s);
                if (ans.status === s) {
                    let arr2 = [...requests];
                    arr2[rindex].status = s;
                    setRequests(arr2);
                }
                else {
                    handleOpen("An error occured while trying to handle request")
                }
            } catch (error: any) {
                handleOpen(error.message)
            }
            setLoading2(false);


        }
        else {
            alert("Cannot perform this action");
        }
        handleCloseMenu()
    }

    const handleClickOpen = (user: User) => {
        setUser(user);
        setOpen(true)
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };
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
                const Api = AdminApiSingleton();

                try {
                    let _views: any[];
                    _views = await Api.model('request', "userAssociated");


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

        <DialogTitle>{user?.fullName || "None"}</DialogTitle>
        <DialogContent>
            <Box display="flex" style={{ minWidth: '200px' }} alignItems="center">
                <div style={{ marginRight: '1em' }}>
                    <Avatar
                        sx={{ width: 50, height: 50, }}
                        alt={user?.fullName}
                        src={user?.profilePic}
                    />
                </div>
                <Typography>{user?.emailAddress || "None"}</Typography>
            </Box>


        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>

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
                        <Button color="secondary" size="small" onClick={handleRetry}>
                            Reload
                        </Button>

                    </Box>
                </Centered>
            </Container>)
        }
        else return (
            <Container maxWidth="md" style={{ padding: '1em' }}>
                <Paper style={{ marginBottom: '2em' }}>
                    {loading2 && <LinearProgress />}

                    <TableContainer style={{ minHeight: '40vh' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>User Name</TableCell>
                                    <TableCell >Currency</TableCell>
                                    <TableCell >Amount</TableCell>
                                    <TableCell >W/Fee</TableCell>
                                    <TableCell >Status</TableCell>
                                    <TableCell >Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : requests).map((request, i) => {
                                        const { status, amount, createdAt, userAssociated: user } = request;
                                        return (
                                            <TableRow
                                                key={'request-' + i}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell ><Typography>{dayjs(createdAt).format('DD/MM/YYYY')}</Typography></TableCell>
                                                <TableCell ><Button onClick={() => {
                                                    handleClickOpen(user);
                                                }} style={{ textTransform: 'none' }}>{shortenText(user.fullName, 18)}</Button> </TableCell>
                                                <TableCell ><Typography>NGN</Typography> </TableCell>
                                                <TableCell ><Typography>NGN{amount}</Typography> </TableCell>
                                                <TableCell ><Typography>NGN{(0.015 * amount).toFixed(2)}</Typography> </TableCell>

                                                <TableCell component="th" scope="row">

                                                    <Typography fontWeight="bold"> {status}</Typography>
                                                </TableCell>
                                                <TableCell >

                                                    <Button disabled={status !== 'pending'} onClick={(e) => {
                                                        setCurrentRequest(request);
                                                        setRindex(i);
                                                        handleClickMenu(e);

                                                    }} style={{ textTransform: 'none' }}>Action</Button>
                                                </TableCell>

                                                {/*
                    <TableCell align="right">{row.protein}</TableCell> */}
                                            </TableRow>
                                        )
                                    })}
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

        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open2}
            onClose={handleCloseMenu}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={() => handleAcceptOrReject(true)}>Accept</MenuItem>
            <MenuItem onClick={() => handleAcceptOrReject(false)}>Deny</MenuItem>

        </Menu>
    </Box>);

}




const AdminDashboard = () => {
    const TabNames = ["Requests", "Tickets"]
    const user = useSelector((state: AppState) => state.auth.user); const [loading, setLoading] = useState(true)
    const [open, setOpen] = React.useState(false);
    const [showing, setShowing] = useState(false)
    const [dialogHeader, setDialogHeader] = useState("")
    const [dialogContent, setDialogContent] = useState("")
    const [value, setValue] = useState(0);

    const [errrorMessage, setErrorMessage] = useState("");
    const toggleBankDetails = () => {
        setShowing(!showing);
    }

    const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    useEffect(() => {
        let pathName = window.location.hash.slice(1)
        if (pathName) {
            const dictionary: any = {};
            const TabNames2 = ["Requests", "Tickets"]
            TabNames2.forEach((name, index) => {
                dictionary[name.toLocaleLowerCase()] = index;
            })
            dictionary["channel"] = 1;
            let index = dictionary[pathName];
            if (index) {
                setValue(index)
            }

        }

    }, [])
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


    return (<>

        <Helmet>

            <title>Admin {user?.fullName + " / " + TabNames[value]}</title>

        </Helmet>
        <Box style={{ marginTop: "64px", minHeight: '80vh' }}
            sx={{ marginLeft: { sm: 0, md: "200px" }, maxWidth: { md: 'calc(100vw - 200px)', sm: 'auto' }, }}
        >


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
                <RequestsTab showing={value === 0} />

            </Box>
        </Box></>)
};

export default AdminDashboard;
