import { Card, CardBody, CardHeader, Stack, Image } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

export function CommunityCard({title, content, author}) {
    return (
        <>
        <Card>
            <CardBody>
                <p>{title}</p>
                {content}
            </CardBody>
        </Card>
        </>
    );
}

export function CommunityCards() {
    return (
        <>
        <a href='#' >커뮤니티 질문 &gt;</a>
    <Stack direction='horizontal' gap={3}>
        <CommunityCard 
            title={'청약 당첨되신 분 있긴 한가요?'} 
            content={'통장 10년째 유지중인데 30번 넘게 신청했지만 주변에서도 그렇고 당첨된 사람을 본 적이 없…'}
            />
        <CommunityCard 
            title={'당첨됐어요!!!!!!!!!!!!!!!'} 
            content={'저도 이제 제 집이 생기네요 !! 다들  포기하지 말고 노려봐요!!!!!!'}
            />
    </Stack>
        </>
    );
}

export function NewSubscriptionCards() {
    return (
        <>
        <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        alignSelf: "stretch",
        flexGrow: 0,
        flexShrink: 0,
        position: "relative",
        gap: 8,
      }}
    >
      <p
        style={{
          flexGrow: 0,
          flexShrink: 0,
          fontSize: 24,
          fontWeight: 600,
          textAlign: "left",
          color: "#1e1e1e",
        }}
      >
        새로 올라온 공고 &gt;
      </p>
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        alignSelf: "stretch",
        flexGrow: 0,
        flexShrink: 0,
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignSelf: "stretch",
          flexGrow: 0,
          flexShrink: 0,
          gap: 24,
          padding: 24,
          borderRadius: 8,
          background: "#fff",
          borderWidth: 1,
          borderColor: "#d9d9d9",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexGrow: 1,
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              alignSelf: "stretch",
              flexGrow: 0,
              flexShrink: 0,
              position: "relative",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 0,
                flexShrink: 0,
                width: 83,
                height: 40,
                position: "absolute",
                left: 941,
                top: 0,
                overflow: "hidden",
                gap: 8,
                padding: 12,
                borderRadius: 8,
                background: "#d9d9d9",
                borderWidth: 1,
                borderColor: "#767676",
              }}
            >
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
              <p
                style={{
                  flexGrow: 1,
                  width: 27,
                  fontSize: 14,
                  textAlign: "left",
                  color: "#1e1e1e",
                }}
              >
                알림
              </p>
            </div>
            <p
              style={{
                alignSelf: "stretch",
                flexGrow: 0,
                flexShrink: 0,
                width: 1024,
                fontSize: 16,
                fontWeight: 600,
                textAlign: "left",
                color: "#1e1e1e",
              }}
            >
              화성 비봉지구 B1블록 금성백조 예미지2차
            </p>
            <p
              style={{
                alignSelf: "stretch",
                flexGrow: 0,
                flexShrink: 0,
                width: 1024,
                fontSize: 16,
                textAlign: "left",
                color: "#757575",
              }}
            >
              민영 530세대 경기도 &gt; 화성시 2024-11-15 공고
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignSelf: "stretch",
          flexGrow: 0,
          flexShrink: 0,
          gap: 24,
          padding: 24,
          borderRadius: 8,
          background: "#fff",
          borderWidth: 1,
          borderColor: "#d9d9d9",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexGrow: 1,
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              alignSelf: "stretch",
              flexGrow: 0,
              flexShrink: 0,
              position: "relative",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 0,
                flexShrink: 0,
                width: 83,
                height: 40,
                position: "absolute",
                left: 941,
                top: 0,
                overflow: "hidden",
                gap: 8,
                padding: 12,
                borderRadius: 8,
                background: "#d9d9d9",
                borderWidth: 1,
                borderColor: "#767676",
              }}
            >
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
              <p
                style={{
                  flexGrow: 1,
                  width: 27,
                  fontSize: 14,
                  textAlign: "left",
                  color: "#1e1e1e",
                }}
              >
                알림
              </p>
            </div>
            <p
              style={{
                alignSelf: "stretch",
                flexGrow: 0,
                flexShrink: 0,
                width: 1024,
                fontSize: 16,
                fontWeight: 600,
                textAlign: "left",
                color: "#1e1e1e",
              }}
            >
              화성 비봉지구 B1블록 금성백조 예미지2차
            </p>
            <p
              style={{
                alignSelf: "stretch",
                flexGrow: 0,
                flexShrink: 0,
                width: 1024,
                fontSize: 16,
                textAlign: "left",
                color: "#757575",
              }}
            >
              민영 530세대 경기도 &gt; 화성시 2024-11-15 공고
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignSelf: "stretch",
          flexGrow: 0,
          flexShrink: 0,
          gap: 24,
          padding: 24,
          borderRadius: 8,
          background: "#fff",
          borderWidth: 1,
          borderColor: "#d9d9d9",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexGrow: 1,
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              alignSelf: "stretch",
              flexGrow: 0,
              flexShrink: 0,
              position: "relative",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 0,
                flexShrink: 0,
                width: 83,
                height: 40,
                position: "absolute",
                left: 941,
                top: 0,
                overflow: "hidden",
                gap: 8,
                padding: 12,
                borderRadius: 8,
                background: "#d9d9d9",
                borderWidth: 1,
                borderColor: "#767676",
              }}
            >
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
              <p
                style={{
                  flexGrow: 1,
                  width: 27,
                  fontSize: 14,
                  textAlign: "left",
                  color: "#1e1e1e",
                }}
              >
                알림
              </p>
            </div>
            <p
              style={{
                alignSelf: "stretch",
                flexGrow: 0,
                flexShrink: 0,
                width: 1024,
                fontSize: 16,
                fontWeight: 600,
                textAlign: "left",
                color: "#1e1e1e",
              }}
            >
              화성 비봉지구 B1블록 금성백조 예미지2차
            </p>
            <p
              style={{
                alignSelf: "stretch",
                flexGrow: 0,
                flexShrink: 0,
                width: 1024,
                fontSize: 16,
                textAlign: "left",
                color: "#757575",
              }}
            >
              민영 530세대 경기도 &gt; 화성시 2024-11-15 공고
            </p>
          </div>
          </div>
          </div>
          </div>
        </>
    );
}

export default function MainContent() {
    return(
        <>
        <Stack direction='vertical' gap={3}>
              <Image 
                src="https://flexible.img.hani.co.kr/flexible/normal/900/670/imgdb/original/2024/0701/20240701502688.jpg" 
                className='main-image-container' 
              />
            <CommunityCards />
            <NewSubscriptionCards />
        </Stack>
        </>
    );
}