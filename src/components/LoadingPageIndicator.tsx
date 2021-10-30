import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Centered from './Centered';




const LoadingPageIndicator: React.FC<{height?: string}> = ({height = '100vh'}) => (
    <Centered sx={{ height }}>
        <Box> <CircularProgress />
            <p>Loading</p></Box>

    </Centered>
)


export default LoadingPageIndicator;