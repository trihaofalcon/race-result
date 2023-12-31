import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PageNotFound from "./pages/errors/NotFound";

const Routers: React.FC = () => {
    return (
        <BrowserRouter basename={process.env.REACT_APP_ROOT}>
            <Routes>
                <Route path="/" index element={<Dashboard />} />

                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Routers;
