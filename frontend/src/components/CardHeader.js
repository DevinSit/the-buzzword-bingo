import React from "react";
import "./CardHeader.css";

const CardHeader = ({text, color = "#008C8C"}) => (
    <h2
        className="card-header"
        style={{background: color}}
    >
        {text}
    </h2>
);

export default CardHeader;
