import axios from 'axios';
import { Container, Row, Col, Stack, Nav, Table, Form, Card, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InterestButton from './InterestButton';
import AnnouncementLocationMap from './AnnouncementLocationMap';
import SupplySolution from './SupplySolution';

export default function ApplyAnnouncementContent() {

  const { houseId } = useParams();

  const [loading, setLoading] = useState(false);

  const [houseData, setHouseData] = useState({});

  // Detail01 or Detail04
  const [houseDetailData, setHouseDetailData] = useState({});

  const [houseDetailListData, setHouseDetailListData] = useState([]);

  // 선택한 타입의 상세 정보
  const [selectedHouseDetailData, setSelectedHouseDetailData] = useState({});

  const [houseTypes, setHouseType] = useState([]);

  const [key, setKey] = useState(null);

  // 일반공급세대수
  const [normalSupplyCount, setNormalSupplyCount] = useState(0);
  // 특별공급세대수
  const [specialSupplyCount, setSpecialSupplyCount] = useState(0);


  const [supplyTypeList, setSupplyTypeList] = useState([]);

  const supplyTypeNameList = [
    { name: 'mnychHshldco', kor: '다자녀가구' },
    { name: 'nwwdsHshldco', kor: '신혼부부' },
    { name: 'lfeFrstHshldco', kor: '생애최초' },
    { name: 'oldParntsSuportHshldco', kor: '노부모부양' },
    { name: 'insttRecomendHshldco', kor: '기관추천' },
    { name: 'etcHshldco', kor: '기타' },
    { name: 'transrInsttEnfsnHshldco', kor: '이전기관' },
    { name: 'ygmnHshldco', kor: '청년' },
    { name: 'nwbbHshldco', kor: '신생아' },
  ];


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

        const nextNormalSupplyCount = nextHouseDetailData
          .map(house => house.normalSupply)
          .reduce((sum, current) => sum + current, 0);
        setNormalSupplyCount(nextNormalSupplyCount);

        const nextSpecialSupplyCount = nextHouseDetailData
          .map(house => house.specialSupply)
          .reduce((sum, current) => sum + current, 0);
        setSpecialSupplyCount(nextSpecialSupplyCount);

        let nextSupplyTypeList = response.data.house.houseSecd === "04" ? ["일반"] : ["1순위", "2순위"];
        nextHouseDetailData.forEach(data => {
          supplyTypeNameList.forEach((typeName) => {
            if (data[typeName.name] > 0 && !nextSupplyTypeList.find(type => type === typeName.kor)) {
              nextSupplyTypeList.push(typeName.kor);
            }
          })
        });

        setSupplyTypeList(nextSupplyTypeList);
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

            <Row className="mb-5">
              {/* 기본 헤더 */}
              <Col>
                <DetailHeader houseData={houseData} houseDetailData={houseDetailData} />
              </Col>
              <Col md="auto">
                <InterestButton houseId={houseId} />
              </Col>
            </Row>

            {/* 기본 상세 */}
            <Row className="mb-5">
              <div className='house-detail'>
                <section className='mb-5'>
                  <h2>공고 상세</h2>
                  <hr />
                </section></div>



              <Stack direction='horizontal' gap={3} style={{ alignItems: 'start' }}>

                <div style={{ flex: 1 }} >
                  <DefaultDetailData houseData={houseData} houseDetailData={houseDetailData}
                    normalSupplyCount={normalSupplyCount} specialSupplyCount={specialSupplyCount} />

                </div>

                <div style={{ flex: 1 }} >
                  <SupplyType supplyTypeList={supplyTypeList} />
                </div>

              </Stack>

            </Row>

            {/* 네이버지도 API */}
            <Row>
              <AnnouncementLocationMap address={houseData.hssplyAdres} houseName={houseData.houseNm} />
            </Row>

            <Row>
              <div className='house-detail'>
                <section className='mb-5'>
                  <h2>타입 별 상세</h2>
                  <hr />
                </section></div>
            </Row>

            {/* 타입 내비게이션 */}
            <Row className="mb-5">
              <TypeNavBar houseTypes={houseTypes} setKey={handleTypeClick} eventKey={key} />
            </Row>

            {/* 타입 상세 */}
            <Row>
              <TypeDetailData selectedHouseDetailData={selectedHouseDetailData} />
            </Row>

            {/* 문의 */}
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
        <p className='card-body-text'>{houseData.rcritPblancDe}</p>
        <p className='card-body-text'>{houseDetailData.houseDtlSecdNm || '무순위'}</p>
        <p className='card-body-text'>{houseData.hssplyAdres}</p>
      </Stack>
      <p className='housing-subtitle'>
        {houseData.houseNm}
      </p>
    </Stack>
  );
}

/* 공고 상세(기본) */
function DefaultDetailData({ houseData, houseDetailData, normalSupplyCount, specialSupplyCount }) {

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

  const specialNotes = [
    { name: 'specltRdnEarthAt', display: '투기과열지구' },
    { name: 'mdatTrgetAreaSecd', display: '조정대상지역' },
    { name: 'parcprcUlsAt', display: '분양가상한제' },
    { name: 'imprnmBsnsAt', display: '정비사업' },
    { name: 'publicHouseEarthAt', display: '공공주택지구' },
    { name: 'lrsclBldlndAt', display: '대규모 택지개발지구' },
    { name: 'nplnPrvoprPublicHouseAt', display: '수도권 내 민영 공공주택지구' },
    { name: 'publicHouseSpclwApplcAt', display: '공공주택 특별법 적용' },
  ];

  const scheduleData = houseData.houseSecd === "01" ? detail01ScheduleData : detail04ScheduleData;

  const today = new Date();

  const scheduleList = [
    { id: 1, name: scheduleData[0].display, date: houseData[scheduleData[0].name], completed: new Date(houseData[scheduleData[0].name]) <= today },
    { id: 2, name: scheduleData[1].display, date: houseDetailData[scheduleData[1].name], completed: new Date(houseDetailData[scheduleData[1].name]) <= today },
    { id: 3, name: scheduleData[2].display, date: houseDetailData[scheduleData[2].name], completed: new Date(houseDetailData[scheduleData[2].name]) <= today },
    { id: 4, name: scheduleData[3].display, date: houseData[scheduleData[3].name], completed: new Date(houseData[scheduleData[3].name]) <= today },
    { id: 5, name: scheduleData[4].display, date: houseData[scheduleData[4].name], completed: new Date(houseData[scheduleData[4].name]) <= today },
  ];

  return (
    <>
      <div className='house-detail'>

        <section>
          <h3>공급 위치</h3>

          <p className='filter-values'>
            ({houseData.hssplyZip})&nbsp;{houseData.hssplyAdres}
          </p>

        </section>

        <section>
          <h3>공급 세대 수</h3>
          <p className='filter-values'>일반 공급 {normalSupplyCount || 0}세대,
            특별 공급 {specialSupplyCount || 0}세대,
            총 공급 {houseData.totSuplyHsldco}세대
          </p>
        </section>

        {houseData.houseSecd === "01" &&
          <section className='mb-5'>
            <h3>특이사항</h3>

            {
              specialNotes.map((data, index) => (
                houseDetailData[data.name] === true
                  ? <li key={index} className='mb-1'>{data.display}</li>
                  : null
              ))
            }
          </section>
        }

        <section className='mb-5'>
          <h3>접수 일정</h3>

          <ScheduleProgress scheduleList={scheduleList} />

        </section>

      </div>
    </>
  );
}

/* 공급방식 */
function SupplyType({ supplyTypeList }) {

  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    setSelectedValue(supplyTypeList[0]);

  }, [supplyTypeList]);

  function handleChanged(e) {
    setSelectedValue(e.target.value);
  }

  return (
    <Card body>
      <div className='house-detail mb-3'>
        <h3>신청 자격 조회</h3>

      </div>
      <Form.Select value={selectedValue} onChange={handleChanged} >

        {supplyTypeList.map((type) =>
          <option key={type} value={type} >
            {type}
          </option>
        )}
      </Form.Select>
      <div style={{ minHeight: '30vh' }} >
        <SupplySolution type={selectedValue} />
      </div>
    </Card>
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

      <h3>공급 대상</h3>

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
function AdditionalInfo({ houseData }) {

  return (
    <div className='house-detail'>

      <section>
        <h3>문의 정보</h3>
        {houseData.hmpgAdres && <p><a href={houseData.hmpgAdres}>{houseData.bsnsMbyNm}</a></p>}
        <p>문의처: {houseData.mdhsTelno || ''}</p>
      </section>

      <section>
        <p>
          <Button variant='secondary' onClick={() => window.location.href = `${houseData.pblancUrl}`}>공고 모집 확인</Button>
        </p>
      </section>
    </div>
  );
}
