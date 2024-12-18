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
import UserTest from "./components/user/UserTest";
import PrivateRoute from "./components/routes/PrivateRoute";
import LoginRoute from "./components/routes/LoginRoute";
import KakaoRedirection from "./components/login/KakaoRedirection";
import NaverRedirection from "./components/login/NaverRedirection";
import CommunityPostList from "./community/CommunityPostList";
import CommunityPosting from "./community/CommunityPosting";
import MyPage from "./mypage/MyPage";
import PostDetail from "./community/PostDetail";
import UpdatePost from "./community/UpdatePost";
import FindEmail from "./pages/FindEmail";
import EmailRecoveryResult from "./pages/EmailRecoveryResult";
import FindPassword from "./pages/find-password/FindPassword";
import SendVerification from "./pages/find-password/SendVerification";
import ResetPassword from "./pages/find-password/ResetPassword";
import SearchAnnouncementByName from "./apply_announcement/SearchAnnouncementByName";
import UserInfo from "./pages/account/UserInfo";
import UserInfoEdit from "./pages/account/UserInfoEdit";
import InterestList from "./mypage/InterestList";

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

        {/* 청약 */}
        <Route path="/subscriptions" element={<ApplyAnnouncementList />} />
        <Route path="/subscriptions/info" element={<ApplyAnnouncement />} />
        <Route
          path="/subscriptions/search/:keyword"
          element={<SearchAnnouncementByName />}
        />

        {/* 조건등록 */}
        <Route path="/conditions" element={<Conditions />} />
        <Route path="/condition-1" element={<Condition01 />} />
        <Route path="/condition-2" element={<Condition02 />} />
        <Route path="/condition-3" element={<Condition03 />} />

        {/* 마이페이지 */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/interest" element={<InterestList />} />

        {/* 커뮤니티 */}
        <Route exact path="/community" element={<CommunityPostList />} />
        <Route exact path="/community/posting" element={<CommunityPosting />} />
        <Route exact path="/community/:postId" element={<PostDetail />} />
        <Route
          exact
          path="/community/posting/:postId"
          element={<UpdatePost />}
        />

        {/* 소셜 로그인 리다이렉트 경로 */}
        <Route exact path="/kakao/callback" element={<KakaoRedirection />} />
        <Route exact path="/naver/callback" element={<NaverRedirection />} />

        {/* 로그인한 사용자는 접근할 수 없음 - LoginRoute 컴포넌트로 감싸면 보호 설정 됨 */}
        {/* 로그인한 사용자가 페이지 접근 시 메인 페이지("/")로 리다이렉트 */}
        {/* 회원가입 */}
        <Route
          path="/signup"
          element={
            <LoginRoute>
              <Signup />
            </LoginRoute>
          }
        />

        {/* 로그인 */}
        <Route
          path="/login"
          element={
            <LoginRoute>
              <Login />
            </LoginRoute>
          }
        />

        {/* 이메일 찾기 */}
        <Route
          path="/find-email"
          element={
            <LoginRoute>
              <FindEmail />
            </LoginRoute>
          }
        />
        <Route
          exact
          path="/find-email/verify"
          element={
            <LoginRoute>
              <EmailRecoveryResult />
            </LoginRoute>
          }
        />

        {/* 비밀번호 찾기 */}
        <Route
          exact
          path="/find-password"
          element={
            <LoginRoute>
              <FindPassword />
            </LoginRoute>
          }
        />
        <Route
          exact
          path="/find-password/verify"
          element={
            <LoginRoute>
              <SendVerification />
            </LoginRoute>
          }
        />
        <Route
          exact
          path="/find-password/reset"
          element={
            <LoginRoute>
              <ResetPassword />
            </LoginRoute>
          }
        />

        {/* 로그인한 사용자만 접근할 수 있는 페이지 - PrivateRoute 컴포넌트로 감싸면 보호 설정 됨 */}
        {/* 로그인하지 않으면 로그인 페이지(/login)로 리다이렉트 */}
        {/* 정보 조회 및 수정 */}
        <Route
          path="/mypage/account"
          element={
            <PrivateRoute>
              <UserInfo />
            </PrivateRoute>
          }
        />
        <Route
          path="/mypage/account/edit"
          element={
            <PrivateRoute>
              <UserInfoEdit />
            </PrivateRoute>
          }
        />
        {/* 테스트 페이지입니다. -hw */}
        <Route
          path="/test"
          element={
            <PrivateRoute>
              <UserTest />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  </AppProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
