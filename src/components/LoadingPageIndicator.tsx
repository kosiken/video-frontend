import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Centered from './Centered';




const LoadingPageIndicator: React.FC = () => (
    <Centered sx={{ height: '100vh' }}>
        <Box> <CircularProgress />
            <p>Loading</p></Box>

    </Centered>
)


export default LoadingPageIndicator;