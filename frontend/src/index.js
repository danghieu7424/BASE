import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Dashboard from "./components/dashboard.js";
import FileUploadPage from "./components/fileManagerPage/fileUploadPage.js";
import Header from "./components/header.js";
import HomePage from "./components/homePage.js";

// ------------ CSS ---------------
import "./access/css/base.css";
// --------------------------------

function Loader() {
    return (
        <div className="showbox">
            <div className="loader">
                <svg className="circular" viewBox="25 25 50 50">
                    <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
                </svg>
            </div>
        </div>
    );
}

// Component chính
function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Giả lập thời gian tải (có thể thay bằng logic tải thực tế)
        const timer = setTimeout(() => {
            setLoading(false); // Tắt Loader sau khi tải xong
        }, 500); // 2 giây

        // Dọn dẹp
        return () => clearTimeout(timer);
    }, []);
    return (
        <Router>
            <React.Fragment>
                {loading && <Loader />}
                {!loading && (
                    <>
                        <Header />
                        {/* <Navigation /> */}
                        <Switch>
                            <Route exact path="/" component={HomePage} />
                            <Route exact path="/dashboard" component={Dashboard} />
                            <Route exact path="/upload" component={FileUploadPage} />
                        </Switch>
                    </>
                )}
            </React.Fragment>
        </Router>
    );
}

// Render ứng dụng React vào phần tử có id 'root'
ReactDOM.render(<App />, document.getElementById("root"));
