import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Centered from './Centered';




const ErrorPageIndicator: React.FC<{height?: string, errorMessage: string, retry: () => void}> = ({height = '100vh', ...props}) => (
    <Centered sx={{ height }}>
        <Box> 
            
            <Typography variant="h6">
            Error
        </Typography>

           
        <Typography color="error">
            {props.errorMessage}
        </Typography>

        <Button variant="contained" onClick={props.retry}>
            Retry
        </Button>
        </Box>

    </Centered>
)


export default ErrorPageIndicator;