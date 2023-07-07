import React from "react";
import {AppBar, Toolbar, IconButton, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"

const Header: React.FC = () => {
    return (
        <header className={"app-header"}>
            <AppBar position={"static"} color={"default"}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Crawling
                    </Typography>
                </Toolbar>
            </AppBar>
        </header>
    );
};

export default Header;
