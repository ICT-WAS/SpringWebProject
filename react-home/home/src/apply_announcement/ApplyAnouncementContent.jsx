import axios from 'axios';
import { Container, Row, Col, Stack, Nav, Table } from 'react-bootstrap';
import NotificationButton from './InterestButton';
import React, { useState } from 'react';

export default function ApplyAnnouncementContent() {

  // const [houseData, setHouseData] = useState({});
  // cosnt [loading, setLoading] = useState(false);

  // const getDetailData = () => {
  //   axios
  //     .get(`http://localhost:8989/house/${houseId}`)
  //     .then((response) => {
  //       setHouseData(response.data.houseDetail);
  //       setLoading(true);
  //     })
  //     .catch((error) => {
  //       console.error("데이터 요청 실패:", error);
  //       setLoading(false);
  //     });
  // };


  useState(() => {
    // getDetailData();
  }, [])

  /* 임시 데이터 */

  return (
    <>
      <Container>
        <Row>
          <InformationalPost />
        </Row>
      </Container>
    </>
  );
}

function InformationalPost() {

  const [houseData, setHouseData1] = useState({
    "houseId": 1,
    "houseManageNo": 2024000714,
    "pblancNo": 2024000714,
    "houseNm": "아산탕정자이 퍼스트시티",
    "houseSecd": "01",
    "houseSecdNm": "APT",
    "hssplyZip": "31458",
    "hssplyAdres": "충청남도 아산시 탕정면 동산리 142-12번지 일원",
    "totSuplyHsldco": 797,
    "rcritPblancDe": "2024-12-12",
    "przwnerPresnatnDe": "2024-12-30",
    "cntrctCnclsBgnde": "2025-01-10",
    "cntrctCnclsEndde": "2025-01-12",
    "hmpgAdres": "https://xi.co.kr/xi1st",
    "bsnsMbyNm": "교보자산신탁(주)",
    "mdhsTelno": "18332543",
    "mvnPrearngeYm": "202712",
    "pblancUrl": "https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do?houseManageNo=2024000714&pblancNo=2024000714"

  });

  const [houseDetailData, setHouseDetailData] = useState({
    "detail01Id": 1,
    "house": {
      "houseId": 1,
      "houseManageNo": 2024000714,
      "pblancNo": 2024000714,
      "houseNm": "아산탕정자이 퍼스트시티",
      "houseSecd": "01",
      "houseSecdNm": "APT",
      "hssplyZip": "31458",
      "hssplyAdres": "충청남도 아산시 탕정면 동산리 142-12번지 일원",
      "totSuplyHsldco": 797,
      "rcritPblancDe": "2024-12-12",
      "przwnerPresnatnDe": "2024-12-30",
      "cntrctCnclsBgnde": "2025-01-10",
      "cntrctCnclsEndde": "2025-01-12",
      "hmpgAdres": "https://xi.co.kr/xi1st",
      "bsnsMbyNm": "교보자산신탁(주)",
      "mdhsTelno": "18332543",
      "mvnPrearngeYm": "202712",
      "pblancUrl": "https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do?houseManageNo=2024000714&pblancNo=2024000714"
    },
    "houseDtlSecd": "01",
    "houseDtlSecdNm": "민영",
    "rentSecd": 0,
    "rentSecdNm": "분양주택",
    "subscrptAreaCode": "312",
    "subscrptAreaCodeNm": "충남",
    "rceptBgnde": "2024-12-19",
    "rceptEndde": "2024-12-23",
    "spsplyRceptBgnde": "2024-12-19",
    "spsplyRceptEndde": "2024-12-19",
    "gnrlRnk1CrspareaRcptde": "2024-12-20",
    "gnrlRnk1CrspareaEndde": "2024-12-20",
    "gnrlRnk1EtcGgRcptde": null,
    "gnrlRnk1EtcGgEndde": null,
    "gnrlRnk1EtcAreaRcptde": "2024-12-20",
    "gnrlRnk1EtcAreaEndde": "2024-12-20",
    "gnrlRnk2CrspareaRcptde": "2024-12-23",
    "gnrlRnk2CrspareaEndde": "2024-12-23",
    "gnrlRnk2EtcGgRcptde": null,
    "gnrlRnk2EtcGgEndde": null,
    "gnrlRnk2EtcAreaRcptde": "2024-12-23",
    "gnrlRnk2EtcAreaEndde": "2024-12-23",
    "cnstrctEntrpsNm": "지에스건설(주)",
    "specltRdnEarthAt": false,
    "mdatTrgetAreaSecd": false,
    "parcprcUlsAt": false,
    "imprnmBsnsAt": false,
    "publicHouseEarthAt": false,
    "lrsclBldlndAt": false,
    "nplnPrvoprPublicHouseAt": false,
    "publicHouseSpclwApplcAt": false
  });

  const [houseDetailListData, setHouseDetailListData] = useState([
    {
      "houseType": "59",
      "houseTypeDTOList": [
        {
          "typeName": "059.9941A",
          "normalSupply": 52,
          "specialSupply": 50,
          "mnychHshldco": 10,
          "nwwdsHshldco": 18,
          "lfeFrstHshldco": 9,
          "oldParntsSuportHshldco": 3,
          "insttRecomendHshldco": 10,
          "etcHshldco": 0,
          "transrInsttEnfsnHshldco": 0,
          "ygmnHshldco": 0,
          "nwbbHshldco": 0,
          "price": 39750
        },
        {
          "typeName": "059.9843B",
          "normalSupply": 18,
          "specialSupply": 16,
          "mnychHshldco": 3,
          "nwwdsHshldco": 6,
          "lfeFrstHshldco": 3,
          "oldParntsSuportHshldco": 1,
          "insttRecomendHshldco": 3,
          "etcHshldco": 0,
          "transrInsttEnfsnHshldco": 0,
          "ygmnHshldco": 0,
          "nwbbHshldco": 0,
          "price": 39520
        }
      ],
      "normalSupply": 70,
      "maxPrice": 39750,
      "minPrice": 39520,
      "specialSupply": 66,
      "mnychHshldco": 13,
      "nwwdsHshldco": 24,
      "lfeFrstHshldco": 12,
      "oldParntsSuportHshldco": 4,
      "insttRecomendHshldco": 13,
      "etcHshldco": 0,
      "transrInsttEnfsnHshldco": 0,
      "ygmnHshldco": 0,
      "nwbbHshldco": 0
    },
    {
      "houseType": "84",
      "houseTypeDTOList": [
        {
          "typeName": "084.9905A",
          "normalSupply": 237,
          "specialSupply": 229,
          "mnychHshldco": 46,
          "nwwdsHshldco": 83,
          "lfeFrstHshldco": 41,
          "oldParntsSuportHshldco": 13,
          "insttRecomendHshldco": 46,
          "etcHshldco": 0,
          "transrInsttEnfsnHshldco": 0,
          "ygmnHshldco": 0,
          "nwbbHshldco": 0,
          "price": 52410
        },
        {
          "typeName": "084.9923B",
          "normalSupply": 50,
          "specialSupply": 45,
          "mnychHshldco": 9,
          "nwwdsHshldco": 17,
          "lfeFrstHshldco": 8,
          "oldParntsSuportHshldco": 2,
          "insttRecomendHshldco": 9,
          "etcHshldco": 0,
          "transrInsttEnfsnHshldco": 0,
          "ygmnHshldco": 0,
          "nwbbHshldco": 0,
          "price": 52390
        },
        {
          "typeName": "084.9921C",
          "normalSupply": 36,
          "specialSupply": 29,
          "mnychHshldco": 6,
          "nwwdsHshldco": 11,
          "lfeFrstHshldco": 5,
          "oldParntsSuportHshldco": 1,
          "insttRecomendHshldco": 6,
          "etcHshldco": 0,
          "transrInsttEnfsnHshldco": 0,
          "ygmnHshldco": 0,
          "nwbbHshldco": 0,
          "price": 52560
        },
        {
          "typeName": "084.9921D",
          "normalSupply": 16,
          "specialSupply": 14,
          "mnychHshldco": 3,
          "nwwdsHshldco": 5,
          "lfeFrstHshldco": 2,
          "oldParntsSuportHshldco": 1,
          "insttRecomendHshldco": 3,
          "etcHshldco": 0,
          "transrInsttEnfsnHshldco": 0,
          "ygmnHshldco": 0,
          "nwbbHshldco": 0,
          "price": 52560
        }
      ],
      "normalSupply": 339,
      "maxPrice": 52560,
      "minPrice": 52390,
      "specialSupply": 317,
      "mnychHshldco": 64,
      "nwwdsHshldco": 116,
      "lfeFrstHshldco": 56,
      "oldParntsSuportHshldco": 17,
      "insttRecomendHshldco": 64,
      "etcHshldco": 0,
      "transrInsttEnfsnHshldco": 0,
      "ygmnHshldco": 0,
      "nwbbHshldco": 0
    },
    {
      "houseType": "125",
      "houseTypeDTOList": [
        {
          "typeName": "125.6353A",
          "normalSupply": 3,
          "specialSupply": 0,
          "mnychHshldco": 0,
          "nwwdsHshldco": 0,
          "lfeFrstHshldco": 0,
          "oldParntsSuportHshldco": 0,
          "insttRecomendHshldco": 0,
          "etcHshldco": 0,
          "transrInsttEnfsnHshldco": 0,
          "ygmnHshldco": 0,
          "nwbbHshldco": 0,
          "price": 100040
        },
        {
          "typeName": "125.9654B",
          "normalSupply": 2,
          "specialSupply": 0,
          "mnychHshldco": 0,
          "nwwdsHshldco": 0,
          "lfeFrstHshldco": 0,
          "oldParntsSuportHshldco": 0,
          "insttRecomendHshldco": 0,
          "etcHshldco": 0,
          "transrInsttEnfsnHshldco": 0,
          "ygmnHshldco": 0,
          "nwbbHshldco": 0,
          "price": 100270
        }
      ],
      "normalSupply": 5,
      "maxPrice": 100270,
      "minPrice": 100040,
      "specialSupply": 0,
      "mnychHshldco": 0,
      "nwwdsHshldco": 0,
      "lfeFrstHshldco": 0,
      "oldParntsSuportHshldco": 0,
      "insttRecomendHshldco": 0,
      "etcHshldco": 0,
      "transrInsttEnfsnHshldco": 0,
      "ygmnHshldco": 0,
      "nwbbHshldco": 0
    }
  ]);

  const [houseTypes, setHouseType] = useState(houseDetailListData.map(house => house.houseType));

  function handleTypeClick(houseType) {

  }

  return (
    <>

      <Container>
        <Row>
          {/* 기본 헤더 */}
          <Col>
            <DetailHeader houseData={houseData} houseDetailData={houseDetailData} />
          </Col>
          <Col md="auto">
            <NotificationButton />
          </Col>
        </Row>
        {/* 타입 내비게이션 */}
        <Row className="mb-5">
          <TypeNavBar houseTypes={houseTypes} onClick={handleTypeClick} />
        </Row>

        {/* 기본 상세 */}
        <Row className="mb-5">
          <DefaultDetailData houseData={houseData} houseDetailData={houseDetailData} />
        </Row>

        {/* 타입 상세 */}
        <Row>
          <TypeDetailData houseDetailListData={houseDetailListData} />
        </Row>

        {/* 특이사항, 문의 */}
        <Row>
          <AdditionalInfo houseData={houseData} />
        </Row>
      </Container>
    </>
  );
}

function DetailHeader({ houseData, houseDetailData }) {
  return (
    <Stack direction='vertical' gap={3}>
      <Stack direction='horizontal' gap={3} >
        <p className='card-body-text'>{houseDetailData.houseDtlSecdNm || '무순위'}</p>
        <p className='card-body-text'>{houseDetailData.hssplyAdres}</p>
        <p className='card-body-text'>{houseData.rcritPblancDe}</p>
      </Stack>
      <p className='housing-subtitle'>
        {houseData.houseNm}
      </p>
    </Stack>
  );
}

/* 공고 상세(기본) */
function DefaultDetailData({ houseData, houseDetailData }) {

  const scheduleData = [
    { name: 'rcritPblancDe', display: '모집공고일' },
    { name: 'rceptBgnde', display: '청약접수시작일' },
    { name: 'rceptEndde', display: '청약접수시작일' },
    { name: 'przwnerPresnatnDe', display: '당첨자발표일' },
    { name: 'cntrctCnclsBgnde', display: '계약시작일' },
    { name: 'cntrctCnclsEndde', display: '계약종료일' },
    { name: 'mvnPrearngeYm', display: '입주예정월' },
  ]

  return (
    <div className='house-detail'>
      <h1>청약 공고 상세 정보</h1>

      <section>
        <p>공급 위치 : ({houseData.hssplyZip})&nbsp;{houseData.hssplyAdres}</p>
      </section>

      <section className='mb-5'>
        <h3>접수 일정</h3>
        <ScheduleProgress houseData={houseData} scheduleData={scheduleData} />

      </section>

      <section>
        <h2>총 공급 수량</h2>
        <p>일반 공급: {houseData.general_units || 0}세대</p>
        <p>특별 공급: {houseData.special_units || 0}세대</p>
        <p>총 공급: {houseData.totSuplyHsldco}세대</p>
      </section>

    </div>
  );
}

/* 일정 바 */
function ScheduleProgress({ houseData, scheduleData }) {


  const steps = [
    { id: 1, label: 'Step 1', completed: true },
    { id: 2, label: 'Step 2', completed: true },
    { id: 3, label: 'Step 3', completed: false },
    { id: 4, label: 'Step 4', completed: false },
    { id: 5, label: 'Step 5', completed: false },
  ];


  return (
    <Container>
      {steps.map((step, index) => (
        <Row key={step.id} className="d-flex align-items-center">
          {/* 왼쪽 열: 진행도 표시 */}
          <Col xs="auto" className="d-flex flex-column align-items-center" style={{ height: '100%' }}>
            {/* 동그라미 표시 */}
            <div
              className={`circle ${step.completed ? 'filled' : ''}`}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #000000',
                backgroundColor: step.completed ? '#000000' : 'transparent',
              }}
            ></div>

            {/* 세로 선 표시 */}
            {index < steps.length - 1 && (
              <div
                className="line"
                style={{
                  height: '40px', // 세로 선의 높이
                  width: '4px',   // 세로 선의 너비
                  backgroundColor: step.completed ? '#000000' : '#ddd', // 진행 여부에 따라 색상 변경
                }}
              ></div>
            )}
          </Col>

          {/* 오른쪽 열: 특별공급 정보 */}
          <Col style={{ alignSelf: 'stretch' }}>
            <div >
              <strong>{scheduleData[index].display}:&nbsp;</strong>
              {houseData[scheduleData[index].name]}
            </div>
          </Col>
        </Row>
      ))}
    </Container>
  );
}

/* 타입 상세 */
function TypeDetailData({ houseDetailListData }) {
  return (
    <div className='house-detail'>

      <h2>공급 대상</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>주택형</th>
            <th>일반 공급</th>
            <th>특별 공급</th>
            <th>최저가</th>
            <th>최고가</th>
          </tr>
        </thead>
        <tbody>
          {houseDetailListData.map((data, index) => (
            <tr key={index}>
              <td>{data.houseType}</td>
              <td>{data.normalSupply}</td>
              <td>{data.specialSupply || 0}</td>
              <td>{data.minPrice}</td>
              <td>{data.maxPrice}</td>
            </tr>
          ))}
        </tbody>
      </Table>

    </div>
  );
}

/* 타입 네비게이션 */
function TypeNavBar({ houseTypes, onClick }) {

  return (
    <Nav variant="underline" defaultActiveKey={houseTypes[0]}>
      {houseTypes.map((type, index) =>
        <Nav.Item key={type}>
          <Nav.Link eventKey={type}>
            {type}
          </Nav.Link>
        </Nav.Item>
      )}
    </Nav>
  );
}

/* 특이사항, 문의 */
function AdditionalInfo({ houseData, houseDetailData }) {

  const scheduleData = [
    { name: 'specltRdnEarthAt', display: '투기과열지구' },
    { name: 'mdatTrgetAreaSecd', display: '조정대상지역' },
    { name: 'parcprcUlsAt', display: '분양가상한제' },
    { name: 'imprnmBsnsAt', display: '정비사업' },
    { name: 'publicHouseEarthAt', display: '공공주택지구' },
    { name: 'lrsclBldlndAt', display: '대규모 택지개발지구' },
    { name: 'nplnPrvoprPublicHouseAt', display: '수도권 내 민영 공공주택지구' },
    { name: 'publicHouseSpclwApplcAt', display: '공공주택 특별법 적용' },
  ]

  return (
    <div className='house-detail'>
      <section>
        <h2>특이사항</h2>
        <ul>
          {houseDetailData &&
            scheduleData.map((data, index) => (
              <li key={index}>{houseDetailData[data] === "Y" ? scheduleData[index]['display'] : ""}</li>
            ))
          }
        </ul>
      </section>

      <section>
        <h2>문의 정보</h2>
        <a href={houseData.hmpgAdres}><p>{houseData.bsnsMbyNm}</p></a>
        <p>문의처: {houseData.mdhsTelno}</p>
        <p>
          공고 모집 url : <a href={houseData.pblancUrl}>{houseData.pblancUrl}</a>
        </p>
      </section>
    </div>
  );
}