import { Box } from '@mui/material'
import React from 'react'
import Container from '../components/Container'
import VideoGrid from '../components/VideoGrid'

const Explore = () => {
    return (
        <Box sx={{marginTop: '8em'}}>
        <Container>
            <VideoGrid/>
        </Container>
        </Box>
    )
}

export default Explore
