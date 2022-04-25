import * as React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loading = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
        </Box>
    )
};

export default Loading;