import React, { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';

import Box from "@mui/material/Box";

import { alpha } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AppLink from "./AppLink";
import Container from "@mui/material/Container";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress from "@mui/material/LinearProgress";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import CreatorApiSingleton from '../api/creatorApi';
import Centered from "./Centered";
import { shortenText } from "../utils/functions";
import Video from "../models/Video";

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

interface EnhancedTableToolbarProps {
    numSelected: number; onDeleteClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    loading: boolean;
}
interface EnhancedTableProps {
    numSelected: number;
    headCells: string[];
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;

}
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected ,loading} = props;

    return (
        <div>
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Videos
                </Typography>
            )}
            {numSelected > 0 && (
                <Tooltip title="Delete">
                    <IconButton onClick={props.onDeleteClick}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>

            )}
     
        </Toolbar>
        {loading && (
               <LinearProgress/>

            )}
        </div>
    );
};
function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, numSelected, rowCount, headCells } =
        props;


    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell, index) => (
                    <TableCell
                        key={'cell-' + index}
                        align={'left'}
                        padding={'normal'}

                    >
                        {headCell}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
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



const VideosTab: React.FC<KosyTabProps> = ({ showing }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const theme = useTheme();
    const [selected, setSelected] = React.useState<readonly string[]>([]);

    const [shown, setShown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false)
    const [videos, setVideos] = useState<Video[]>([]);
    const [errrorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
    const [retries, setRetries] = useState(0);
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - videos.length) : 0;


    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = videos.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const onDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        setDeleting(true)
        console.log(selected)
        let data =  selected.slice();
        const Api = CreatorApiSingleton();
        try {
         await  Api.deleteItems('video', data)
        // .then(() => {
            setVideos(videos.filter( v => !isSelected(v.id)));
            setSelected([])
        // })
        // .catch(console.log)
    }catch(err: any) {
console.log(err)
    }
       setDeleting(false)
    }

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };


    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };
    const isSelected = (name: string) => selected.indexOf(name) !== -1;
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleRetry = () => {
        setRetries(retries + 1);
        setShown(false)
    }

    useEffect(() => {
        const loadFunc = async () => {
            console.log(showing)
            if (!shown && showing) {
                console.log("here")
                const Api = CreatorApiSingleton();

                try {
                    let _views: any[];
                    _views = await Api.analytics("video");


                    setVideos(_views as Video[]);
                }
                catch (err: any) {
                    handleOpen(err.message || "An error occured");
                }
                setLoading(false);
                setShown(true)
            }

        }
        if (videos.length > 0) return;
        loadFunc()

    }, [retries, showing, shown, videos])
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
        let rows = videos;

        if (loading && videos.length === 0) {
            return (<Container maxWidth="sm" style={{ paddingTop: "2em", height: '60vh' }} >
                <Centered sx={{ height: '100%' }}>
                    <Box>
                        <CircularProgress />
                        <Typography>Loading</Typography>
                    </Box>
                </Centered>
            </Container>)
        }

        if (videos.length === 0) {
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
            <Container maxWidth="md" style={{ padding: '1em' }} >
                <Paper  >
                    <EnhancedTableToolbar numSelected={selected.length} onDeleteClick={onDelete} loading={deleting} />

                    <TableContainer >
                        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                            <EnhancedTableHead
                                numSelected={selected.length}

                                onSelectAllClick={handleSelectAllClick}
                                headCells={['Title', 'Type', 'Views','Likes', 'Watch']}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : rows
                                ).map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow selected={isItemSelected} key={row.id}>

                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    onClick={(event) => {
                                                        handleClick(event, row.id)
                                                    }}
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {shortenText(row.title, 20)}
                                            </TableCell>

                                            <TableCell style={{ width: 160 }} align="left">
                                                {row.videoType}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="left">
                                                {row.viewCount} 

                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="left">
                                                {row.likeCount} 

                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="left">
                                                <AppLink to={("/main/watch/" ) + row.id} doNotUseButton>
                                                    <IconButton >
                                                        <PreviewIcon htmlColor={theme.palette.primary.main} />
                                                    </IconButton>
                                                </AppLink>

                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                    </TableContainer>
                    <TablePagination
                        sx={{ width: '100%', display: 'block' }}
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={3}
                        count={rows.length}
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


export default VideosTab;