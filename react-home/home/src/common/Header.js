import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/Stack';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export function Logo() {
  return (
    <>
    <div
    style={{
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexGrow: 0,
      flexShrink: 0,
      position: "relative",
      gap: 24,
    }}
  >
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexGrow: 0, flexShrink: 0, width: 32, height: 32, position: "relative" }}
      preserveAspectRatio="none"
    >
      <path
        d="M12 29.3332V15.9998H20V29.3332M4 11.9998L16 2.6665L28 11.9998V26.6665C28 27.3737 27.719 28.052 27.219 28.5521C26.7189 29.0522 26.0406 29.3332 25.3333 29.3332H6.66667C5.95942 29.3332 5.28115 29.0522 4.78105 28.5521C4.28095 28.052 4 27.3737 4 26.6665V11.9998Z"
        stroke="#1E1E1E"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
  <p style={{ flexGrow: 0, flexShrink: 0, fontSize: 24, textAlign: "left", color: "#000" }}>
    내집마련
  </p>
    </>
  );
}

export function SearchField() {
  return (
    <>
    <InputGroup>
      <Form.Control
        placeholder='공고 제목으로 검색'
        aria-label='Search'
      />
      <InputGroup.Text id="basic-addon1">
        <i className="bi bi-search"/>
      </InputGroup.Text>
    </InputGroup>
    </>
  );
}

export function NavBar() {
  return (
    <>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 0,
        flexShrink: 0,
        position: "relative",
        gap: 8,
        padding: 8,
        borderRadius: 8,
        background: "#f5f5f5",
      }}
    >
      <p style={{ flexGrow: 0, flexShrink: 0, fontSize: 16, textAlign: "left", color: "#1e1e1e" }}>
        청약 공고
      </p>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 0,
        flexShrink: 0,
        position: "relative",
        gap: 8,
        padding: 8,
        borderRadius: 8,
      }}
    >
      <p style={{ flexGrow: 0, flexShrink: 0, fontSize: 16, textAlign: "left", color: "#1e1e1e" }}>
        커뮤니티
      </p>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 0,
        flexShrink: 0,
        position: "relative",
        gap: 8,
        padding: 8,
        borderRadius: 8,
      }}
    >
      <p style={{ flexGrow: 0, flexShrink: 0, fontSize: 16, textAlign: "left", color: "#1e1e1e" }}>
        조건 등록
      </p>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 0,
        flexShrink: 0,
        position: "relative",
        gap: 8,
        padding: 8,
        borderRadius: 8,
      }}
    >
      <p style={{ flexGrow: 0, flexShrink: 0, fontSize: 16, textAlign: "left", color: "#1e1e1e" }}>
        Q&amp;A
      </p>
    </div>
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexGrow: 0, flexShrink: 0, width: 24, height: 24, position: "relative" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M4 19V17H6V10C6 8.61667 6.41667 7.39167 7.25 6.325C8.08333 5.24167 9.16667 4.53333 10.5 4.2V3.5C10.5 3.08333 10.6417 2.73333 10.925 2.45C11.225 2.15 11.5833 2 12 2C12.4167 2 12.7667 2.15 13.05 2.45C13.35 2.73333 13.5 3.08333 13.5 3.5V4.2C14.8333 4.53333 15.9167 5.24167 16.75 6.325C17.5833 7.39167 18 8.61667 18 10V17H20V19H4ZM12 22C11.45 22 10.975 21.8083 10.575 21.425C10.1917 21.025 10 20.55 10 20H14C14 20.55 13.8 21.025 13.4 21.425C13.0167 21.8083 12.55 22 12 22ZM8 17H16V10C16 8.9 15.6083 7.95833 14.825 7.175C14.0417 6.39167 13.1 6 12 6C10.9 6 9.95833 6.39167 9.175 7.175C8.39167 7.95833 8 8.9 8 10V17Z"
        fill="#1D1B20"
      />
    </svg>
  
  <div
    style={{
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexGrow: 0,
      flexShrink: 0,
      width: 178,
      gap: 12,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        position: "relative",
        overflow: "hidden",
        gap: 8,
        padding: 8,
        borderRadius: 8,
        background: "#e3e3e3",
        borderWidth: 1,
        borderColor: "#767676",
      }}
    >
      <p style={{ flexGrow: 0, flexShrink: 0, fontSize: 16, textAlign: "left", color: "#1e1e1e" }}>
        로그인
      </p>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        position: "relative",
        overflow: "hidden",
        gap: 8,
        padding: 8,
        borderRadius: 8,
        background: "#2c2c2c",
        borderWidth: 1,
        borderColor: "#2c2c2c",
      }}
    >
      <p style={{ flexGrow: 0, flexShrink: 0, fontSize: 16, textAlign: "left", color: "#f5f5f5" }}>
        회원가입
      </p>
    </div>
    </div>
    </>
  );
}

export default function Header() {
  return(
      <>
    <Stack direction="horizontal" gap={3}>
      <Logo />
      <SearchField />
      <NavBar />
    </Stack>
  </>
  );
}