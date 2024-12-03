import Stack from 'react-bootstrap/Stack';
import { Container, Row, Col } from 'react-bootstrap';
import NotificationButton from './NotificationButton';

function InformationalPost({subscription}) {
    return (
        <>
        <Container>
        <Row>
            <Col>
              <Container>
              <Row className="mb-5">
                  <Col md="auto"><p className='card-body-text'>{subscription.type}</p></Col>
                  <Col md="auto"><p className='card-body-text'>{subscription.region}</p></Col>
                  <Col><p className='card-body-text'>{subscription.date}</p></Col>
                </Row>

                <Row className="mb-5">
                  <Col>
                  <p className='card-header-text'>
                  {subscription.title}
                  </p>
                  </Col>
                </Row>
                <Row>
                    <HousingPage housingData={subscription.detail} />
                </Row>
              </Container>
            </Col>
            <Col md="auto">
              <NotificationButton />
            </Col>
          </Row>
      </Container>
        </>
    );
}

function HousingPage({housingData}) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>청약 공고 상세 정보</h1>
  
        <section>
          <h2>공급 위치</h2>
          <p>{housingData.supply_location}</p>
        </section>
  
        <section>
          <h2>공급 규모</h2>
          <p>{housingData.supply_scale}</p>
        </section>
  
        <section>
          <h2>문의 정보</h2>
          <p>{housingData.announcement_inquiry.description}</p>
          <p>문의처: {housingData.announcement_inquiry.contact_number}</p>
          <p>
            <a href="#">{housingData.announcement_inquiry.announcement_link}</a>
          </p>
        </section>
  
        <section>
          <h2>청약 일정</h2>
          <p>모집공고일: {housingData.application_schedule.announcement_date}</p>
          <h3>접수 일정</h3>
          <ul>
            <li>
              특별공급: {housingData.application_schedule.application_details.special_supply.date} (
              {housingData.application_schedule.application_details.special_supply.location})
            </li>
            <li>
              1순위 (해당 지역): {housingData.application_schedule.application_details.first_priority.local} (
              {housingData.application_schedule.application_details.first_priority.location})
            </li>
            <li>
              1순위 (기타 지역): {housingData.application_schedule.application_details.first_priority.other_areas} (
              {housingData.application_schedule.application_details.first_priority.location})
            </li>
            <li>
              2순위: {housingData.application_schedule.application_details.second_priority.date} (
              {housingData.application_schedule.application_details.second_priority.location})
            </li>
          </ul>
          <p>당첨자 발표일: {housingData.application_schedule.winner_announcement_date}</p>
          <p>계약일: {housingData.application_schedule.contract_date}</p>
        </section>
  
        <section>
          <h2>특이사항</h2>
          <ul>
            {housingData.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </section>
  
        <section>
          <h2>공급 대상</h2>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>유형</th>
                <th>주택형</th>
                <th>공급면적</th>
                <th>일반 공급</th>
                <th>특별 공급</th>
                <th>모델번호</th>
              </tr>
            </thead>
            <tbody>
              {housingData.supply_targets.map((target, index) => (
                <tr key={index}>
                  <td>{target.type}</td>
                  <td>{target.housing_type}</td>
                  <td>{target.housing_supply_area}</td>
                  <td>{target.general_units}</td>
                  <td>{target.special_units}</td>
                  <td>{target.model_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
  
        <section>
          <h2>총 공급 수량</h2>
          <p>일반 공급: {housingData.total.general_units}세대</p>
          <p>특별 공급: {housingData.total.special_units}세대</p>
          <p>총 공급: {housingData.total.total_units}세대</p>
        </section>
      </div>
    );
}

export default function ApplyAnnouncementContent() {
    const subscription = { title: '화성 비봉지구 B1블록 금성백조 예미지2차', 
        type: '민영', 
        region: '경기도 > 화성시', 
        date: '2024-05-02',
        detail: {
            supply_location: "서울특별시 도봉구 창동 662-7번지 외 12필지",
            supply_scale: "89세대",
            announcement_inquiry: {
              description: "입주자모집공고 관련 문의는 사업주체 또는 분양사무실로 문의",
              contact_number: "☎ 1668-4888",
              announcement_link: "모집공고문 보기"
            },
            application_schedule: {
              announcement_date: "2022-05-12 (e대한경제)",
              application_details: {
                special_supply: {
                  date: "2022-05-23",
                  location: "인터넷"
                },
                first_priority: {
                  local: "2022-05-24",
                  other_areas: "2022-05-25",
                  location: "인터넷"
                },
                second_priority: {
                  date: "2022-05-26",
                  location: "인터넷"
                }
              },
              winner_announcement_date: "2022-06-02 (http://www.dawartriche.com/)",
              contract_date: "2022-06-13 ~ 2022-06-15"
            },
            notes: [
              "투기과열지구, 청약과열지역",
              "특별공급 종류에 따라 접수기간 및 장소가 다를 수 있으니 모집공고를 반드시 확인하시기 바랍니다."
            ],
            supply_targets: [
              {
                type: "민영",
                housing_type: "058.8500A",
                housing_supply_area: "80.38",
                general_units: 80,
                special_units: 3,
                model_number: "11192022000248(01)"
              },
              {
                type: "민영",
                housing_type: "058.1300B",
                housing_supply_area: "79.05",
                general_units: 65,
                special_units: 1,
                model_number: "112022000248(02)"
              },
              {
                type: "민영",
                housing_type: "058.0900C",
                housing_supply_area: "79.07",
                general_units: 17,
                special_units: 2,
                model_number: "21382022000248(03)"
              },
              {
                type: "민영",
                housing_type: "059.8000",
                housing_supply_area: "80.84",
                general_units: 81,
                special_units: 11,
                model_number: "1192022000248(04)"
              },
              {
                type: "민영",
                housing_type: "122.5100F",
                housing_supply_area: "165.345",
                general_units: 0,
                special_units: 5,
                model_number: "20220220000248(05)"
              }
            ],
            total: {
              general_units: 414,
              special_units: 88,
              total_units: 502
            }
          }};
    return (
        <>
        <Container>
        <Row className="mb-5">
            {/* 뒤로가기 버튼 등 */}
        </Row>
        <Row>
          <InformationalPost subscription={subscription} />
        </Row>
      </Container>
        </>
    );
}