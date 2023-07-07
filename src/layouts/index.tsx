import React from "react";
import Header from "./header";

type IndexProps = {
    children: React.ReactNode
};

const Index: React.FC<IndexProps> = ({children}) => {
    return <div className={"app-container"}>
        <Header />
        <div className={"app-content"}>
            {children}
        </div>
    </div>;
};

export default Index;
