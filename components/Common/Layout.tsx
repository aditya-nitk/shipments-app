import * as React from 'react';
import { signOut, useSession } from 'next-auth/react'
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';

type Props = { children: React.ReactNode };

const Layout : React.FC<Props> = (props) => {
    const { status } = useSession();
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {status === "authenticated" && (
                        <>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                            >
                                <HomeIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Home
                            </Typography>
                            <IconButton size="small" color="inherit" aria-label="person" onClick={() => signOut()}>
                                <PersonIcon /> &nbsp; Logout
                            </IconButton>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            {props.children}
        </>
    )
}

export default Layout;