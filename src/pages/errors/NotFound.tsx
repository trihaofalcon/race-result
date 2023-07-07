import React from "react";
import {Typography} from "@mui/material";

const NotFound: React.FC = () => {
    return (
        <div className={"flex items-center justify-center"} style={{minHeight: "calc(100vh - 84px)"}}>
            <div>
                <Typography variant="h3">404</Typography>
                <Typography variant="h4">Page not found</Typography>
            </div>
        </div>
    );
};

export default NotFound;
