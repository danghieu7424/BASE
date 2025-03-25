import React from "react";
import { Link } from "react-router-dom";

import "../access/css/header.css";

export default function Header() {
    return (
        <header className="header_container">
            <div className="header-left">
                <Link to="/">logo</Link>
            </div>
            <div className="header-right">menu</div>
        </header>
    )
}