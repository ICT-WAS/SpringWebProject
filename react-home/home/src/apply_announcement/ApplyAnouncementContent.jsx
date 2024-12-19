import axios from 'axios';
import { Container, Row, Col, Stack, Nav, Table } from 'react-bootstrap';
import NotificationButton from './InterestButton';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ApplyAnnouncementContent() {

  const { houseId } = useParams();

  const [loading, setLoading] = useState(false);

  const [houseData, setHouseData] = useState({});

  // Detail01 or Detail04
  const [houseDetailData, setHouseDetailData] = useState({});

  const [houseDetailListData, setHouseDetailListData] = useState([]);

  const [selectedHouseDetailData, setSelectedHouseDetailData] = useState({});

  const [houseTypes, setHouseType] = useState([]);

  const [key, setKey] = useState(null);

  const getDetailData = () => {
    axios
      .get(`http://localhost:8989/house/${houseId}`)
      .then((response) => {
        setLoading(false);
        const detail01 = response.data.detail01;
        const detail04 = response.data.detail04;
        const detailData = detail01 === null ? detail04 : detail01;

        const nextHouseDetailData = response.data.houseDetailInfoDTOList;

        setHouseData(response.data.house); // House
        setHouseDetailData(detailData); // Detail01 or Detail04
        setHouseDetailListData(nextHouseDetailData); // List<HouseDetailInfoDTO>

        const nextKey = nextHouseDetailData[0].houseType;
        setKey(nextKey);
        const nextSelectedHouseData = nextHouseDetailData.find(house => house.houseType === nextKey);
        setSelectedHouseDetailData(nextSelectedHouseData);

        setHouseType(nextHouseDetailData.map(house => house.houseType));
      })
      .catch((error) => {
        console.error("데이터 요청 실패:", error);
        setLoading(false);
      });
  };

  useState(() => {
    getDetailData();
  }, [])

  function handleTypeClick(houseType) {
    setKey(houseType);
    const nextSelectedHouseData = houseDetailListData.find(house => house.houseType === houseType);
    setSelectedHouseDetailData(nextSelectedHouseData);
  }


  return (
    <>
      <Container>
        <Row>
          <Container>

            <Row>
              {/* 기본 헤더 */}
              <Col>
                <DetailHeader houseData={houseData} houseDetailData={houseDetailData} />
              </Col>
              <Col md="auto">
                <NotificationButton />
              </Col>

              {/* 기본 상세 */}
              <Row className="mb-5">
                <DefaultDetailData houseData={houseData} houseDetailData={houseDetailData} />
              </Row>
            </Row>
            
            {/* 타입 내비게이션 */}
            <Row className="mb-5">
              <TypeNavBar houseTypes={houseTypes} setKey={handleTypeClick} eventKey={key} />
            </Row>

            {/* 타입 상세 */}
            <Row>
              <TypeDetailData selectedHouseDetailData={selectedHouseDetailData} />
            </Row>

            {/* 특이사항, 문의 */}
            <Row>
              <AdditionalInfo houseData={houseData} houseDetailData={houseDetailData} />
            </Row>

          </Container>
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

  const detail01ScheduleData = [
    { name: 'rcritPblancDe', display: '모집공고일' },
    { name: 'rceptBgnde', display: '청약접수시작일' },
    { name: 'rceptEndde', display: '청약접수종료일' },
    { name: 'przwnerPresnatnDe', display: '당첨자발표일' },
    { name: 'cntrctCnclsBgnde', display: '계약시작일' },
    { name: 'cntrctCnclsEndde', display: '계약종료일' },
    { name: 'mvnPrearngeYm', display: '입주예정월' },
  ];

  const detail04ScheduleData = [
    { name: 'rcritPblancDe', display: '모집공고일' },
    { name: 'subscrptRceptBgnde', display: '청약접수시작일' },
    { name: 'subscrptRceptEndde', display: '청약접수종료일' },
    { name: 'przwnerPresnatnDe', display: '당첨자발표일' },
    { name: 'cntrctCnclsBgnde', display: '계약시작일' },
    { name: 'cntrctCnclsEndde', display: '계약종료일' },
    { name: 'mvnPrearngeYm', display: '입주예정월' },
  ];

  const scheduleData = houseData.houseSecd === "01" ? detail01ScheduleData : detail04ScheduleData;

  const today = new Date();

  const scheduleList = [
    {id: 1, name: scheduleData[0].display, date: houseData[scheduleData[0].name], completed: new Date(houseData[scheduleData[0].name]) <= today},
    {id: 2, name: scheduleData[1].display, date: houseDetailData[scheduleData[1].name], completed: new Date(houseDetailData[scheduleData[1].name]) <= today},
    {id: 3, name: scheduleData[2].display, date: houseDetailData[scheduleData[2].name], completed: new Date(houseDetailData[scheduleData[2].name]) <= today},
    {id: 4, name: scheduleData[3].display, date: houseData[scheduleData[3].name], completed: new Date(houseData[scheduleData[3].name]) <= today},
    {id: 5, name: scheduleData[4].display, date: houseData[scheduleData[4].name], completed: new Date(houseData[scheduleData[4].name]) <= today},
  ];

  return (
    <div className='house-detail'>
      <h1>청약 공고 상세 정보</h1>

      <section>
        <p>공급 위치 : ({houseData.hssplyZip})&nbsp;{houseData.hssplyAdres}</p>
      </section>

      <section className='mb-5'>
        <h3>접수 일정</h3>
        <ScheduleProgress scheduleList={scheduleList} />

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
function ScheduleProgress({ scheduleList }) {

  return (
    <Container>
      {scheduleList.map((step, index) => (
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
                border: '2px solid #6c757d',
                backgroundColor: step.completed ? '#6c757d' : 'transparent',
              }}
            ></div>

            {/* 세로 선 표시 */}
            {index < scheduleList.length - 1 && (
              <div
                className="line"
                style={{
                  height: '40px', // 세로 선의 높이
                  width: '4px',   // 세로 선의 너비
                  backgroundColor: step.completed ? '#6c757d' : '#ddd', // 진행 여부에 따라 색상 변경
                }}
              ></div>
            )}
          </Col>

          {/* 오른쪽 열: 특별공급 정보 */}
          <Col style={{ alignSelf: 'stretch' }}>
            <div >
              <strong>{scheduleList[index].name}:&nbsp;</strong>
              {scheduleList[index].date}
            </div>
          </Col>
        </Row>
      ))}
    </Container>
  );
}

/* 타입 상세 */
function TypeDetailData({ selectedHouseDetailData }) {

  return (
    <div className='house-detail'>

      <h2>공급 대상</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>주택형</th>
            <th>일반 공급</th>
            <th>특별 공급</th>
            <th>다자녀가구</th>
            <th>신혼부부</th>
            <th>생애최초</th>
            <th>노부모부양</th>
            <th>기관추천</th>
            <th>기타</th>
            <th>이전기관</th>
            <th>청년</th>
            <th>신생아</th>
            <th>공급금액(분양최고금액) (단위:만원)</th>
          </tr>
        </thead>
        <tbody>
          {selectedHouseDetailData?.houseTypeDTOList?.map((typeData, index) => (
            <tr key={index}>
              <td>{typeData.typeName}</td>
              <td>{typeData.normalSupply}</td>
              <td>{typeData.specialSupply || 0}</td>
              <td>{typeData.mnychHshldco || 0}</td>
              <td>{typeData.nwwdsHshldco || 0}</td>
              <td>{typeData.lfeFrstHshldco || 0}</td>
              <td>{typeData.oldParntsSuportHshldco || 0}</td>
              <td>{typeData.insttRecomendHshldco || 0}</td>
              <td>{typeData.etcHshldco || 0}</td>
              <td>{typeData.transrInsttEnfsnHshldco || 0}</td>
              <td>{typeData.ygmnHshldco || 0}</td>
              <td>{typeData.nwbbHshldco || 0}</td>
              <td>{typeData.price || 0}</td>
            </tr>
          ))}
        </tbody>
      </Table>

    </div>
  );
}

/* 타입 네비게이션 */
function TypeNavBar({ houseTypes, setKey, eventKey }) {

  return (
    <Nav variant="underline" activeKey={eventKey} onSelect={(k) => setKey(k)}>
      {houseTypes.map((type) =>
        <Nav.Item key={type} >
          <Nav.Link eventKey={type} >
            {type}m²
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
  ];

  return (
    <div className='house-detail'>
      {houseData.houseSecd === "01" &&
        <section>
          <ul>
            특이사항
            {
              scheduleData.map((data, index) => (
                houseDetailData[data] === "Y" ?? <li key={index}>scheduleData[index]['display']</li>
              ))
            }
          </ul>
        </section>
      }

      <section>
        <h2>문의 정보</h2>
        <p><a href={houseData.hmpgAdres}>{houseData.bsnsMbyNm}</a></p>
        <p>문의처: {houseData.mdhsTelno}</p>
        <p>
          공고 모집 url : <a href={houseData.pblancUrl}>{houseData.pblancUrl}</a>
        </p>
      </section>
    </div>
  );
}
