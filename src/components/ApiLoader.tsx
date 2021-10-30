import React, { useState, useEffect } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";

type ApiLoaderProps = {
    request: (data: any) => Promise<any>;
    // retry?: (func:()=> void) => void;
    onLoad: (data: any) => void;
    onFail?: (message: string) => void;
    setLoading: (bool: boolean) => void
    data?: any;
}

const ApiLoader: React.FC<ApiLoaderProps> = function ({ request, setLoading, onLoad, data , onFail = console.log}) {

    const [errrorMessage, setErrorMessage] = useState("");
    const [errorPresent, setErrorPresent] = useState(false);
    const loadRequest =  async () => {
        try {
            let response = await request(data);
            onLoad(response);

        } catch (e: any) {
            let message = "An Error Occured"
            if (e.response) {
                setLoading(false)
                
                console.log(e.response);
                switch (e.response.status) {
                    case 400:
                        handleOpen(e.response.data.problems ||  message);

                        break;

                    case 404:
                        handleOpen(e.response.data.problems ||  message);

                        break;

                    case 500:
                        handleOpen(e.response.data.problems ||  message);

                        break;
                    default:
                        handleOpen(e.response.data.problems ||  message);
                        break;
                }
                handleOpen( message);
                return

            }
   
            handleOpen( message);
        }
    }

    useEffect(() => {
        const loadRequest2 = async () => {
            try {
                let response = await request(data);
                onLoad(response);
    
            } catch (e: any) {
                let message = "An Error Occured"
                if (e.response) {
                    setLoading(false)
                    
                    console.log(e.response);
                    switch (e.response.status) {
                        case 400:
                            handleOpen(e.response.data.problems ||  message);
    
                            break;
    
                        case 404:
                            handleOpen(e.response.data.problems ||  message);
    
                            break;
    
                        case 500:
                            handleOpen(e.response.data.problems ||  message);
    
                            break;
                        default:
                            handleOpen(e.response.data.problems ||  message);
                            break;
                    }
                    handleOpen( message);
                    return
    
                }
       
                handleOpen( message);
            }
        }
        loadRequest2()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleRetry = () => {
        loadRequest();
        setErrorPresent(false);
    }
    const handleOpen = (message: string) => {
        setErrorMessage(message);
        setErrorPresent(true);
        setLoading(false);
        onFail(message)
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


    return (<Snackbar
        open={errorPresent}
        autoHideDuration={6000}
        
        onClose={handleClose}
        message={errrorMessage}
        action={action}
    />)

}

export default ApiLoader;