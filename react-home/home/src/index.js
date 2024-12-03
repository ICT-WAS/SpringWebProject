import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Main from "./main/main";
import "./common/Common.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; //라우터 설정
import AppProvider from "./Context"; //전역변수 설정
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import ApplyAnnouncement from "./apply_announcement/ApplyAnouncement";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppProvider>
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <React.StrictMode>
              <Main />
            </React.StrictMode>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/list" element={<ApplyAnnouncement />} />
      </Routes>
    </Router>
  </AppProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
