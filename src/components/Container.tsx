import { Box, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import React from 'react';


type ContainerProps = {
    children: any;
    key?: string;
    sx?: SxProps<Theme>;
    
};


const Container: React.FC<ContainerProps> =  ({children, sx = {}, ...props}) => {
    var sX: SxProps<Theme> = {};
    sX= Object.assign({
        width: {sm: "100%", md: "85%"},
        margin: "0 auto"
    }, sx);
    return (

        <Box sx={sX}>
            {children}
        </Box>
    )
}

export default Container;
