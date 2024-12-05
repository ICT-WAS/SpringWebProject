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
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ApplyAnnouncementList from "./apply_announcement/ApplyAnouncementList";
import ApplyAnnouncement from "./apply_announcement/ApplyAnouncement";
import Condition01 from "./condition/Condition01";
import Condition02 from "./condition/Condition02";
import Condition03 from "./condition/Condition03";
import Conditions from "./condition/Conditions";

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
        <Route path="/subscriptions" element={<ApplyAnnouncementList />} />
        <Route path="/subscriptions/info" element={<ApplyAnnouncement />} />

        <Route path="/conditions" element={<Conditions />} />
        <Route path="/condition-1" element={<Condition01 />} />
        <Route path="/condition-2" element={<Condition02 />} />
        <Route path="/condition-3" element={<Condition03 />} />
      </Routes>
    </Router>
  </AppProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
