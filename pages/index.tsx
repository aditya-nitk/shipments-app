import type { NextPage } from 'next'
import { CircularProgress, Box } from '@mui/material';

const Home: NextPage = () => {
  return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
  );
}

export default Home
