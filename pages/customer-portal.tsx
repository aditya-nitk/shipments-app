import * as React from 'react';
import useSWR from 'swr';
import { Box, Typography } from '@mui/material';
import { fetcher } from '../lib/helpers/fetcher';
import Loading from '../components/Common/Loading';
import ShipmentsGrid from '../components/DataGrids/ShipmentsGrid';

const CustomerPortal = () => {
    const { data } = useSWR('/api/shipments', fetcher);

    return (
        <Box sx={{ width: '100%', p: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Shipments</Typography>
            {!data ? <Loading /> : <ShipmentsGrid isAdmin={false} shipments={data?.shipments} />}
        </Box>
    )
}

export default CustomerPortal;