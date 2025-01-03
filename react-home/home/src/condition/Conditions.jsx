import axios from 'axios';
import { Accordion, Button, Container, Modal, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import React, { useState, useEffect } from "react";
import { getUserIdFromToken } from "../api/TokenUtils";

import { AccountType, LivingTogetherDate, Sido } from '../common/Enums.ts';
import { FamilyMember, getFamilyMemberName } from '../condition/family.ts';

export default function Conditions() {

    return (
        <>
            <Container className="p-5" fluid="md">
                <Stack direction="vertical" gap={5}>
                    <Header />

                    <ConditionInfo />

                    <Footer />
                </Stack>
            </Container>
        </>
    );
}

function ConditionInfo() {

    const [loading, setLoading] = useState(false);
    const [hasCondition, setHasCondition] = useState(false);

    const [family, setFamily] = useState([]);
    const [spouseFamily, setSpouseFamily] = useState([]);
    const [accountData, setAccountData] = useState({});
    const [spouseAccountData, setSpouseAccountData] = useState({});

    const [form1Data, setForm1Data] = useState({});
    const [form3Data, setForm3Data] = useState({});

    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    const [showLoginModal, setLoginShowModal] = useState(false);

    // 로그인 모달 닫기 함수
    const handleCloseLoginModal = () => setLoginShowModal(false);

    // 로그인 모달 열기 함수
    const handleShowLoginModal = () => setLoginShowModal(true);

    const fetchCondition = () => {

        if (userId === null) {
            return;
        }

        setLoading(true);
        axios
            .get(`http://localhost:8989/condition/${userId}`)
            .then((response) => {
                setHasCondition(response.data.hasCondition);

                setFamily(response.data.familyList);
                setSpouseFamily(response.data.spouseFamilyList);
                setAccountData(response.data.accountData);
                setSpouseAccountData(response.data.spouseAccountData);

                setForm1Data(response.data.form1Data);
                setForm3Data(response.data.form3Data);

                setLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 500) {
                    console.error("서버 에러(500):", error.response.data);
                    alert("서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.");
                    navigate("/conditions");
                } else {
                    console.error("응답 에러:", error.response.status, error.response.data);
                    console.error("데이터 요청 실패:", error);
                }
                setLoading(false);
            });
    };

    const clearCondition = () => {

        setLoading(true);
        axios
            .delete(`http://localhost:8989/condition/${userId}`)
            .then((response) => {
                console.error("데이터 삭제 성공");
                setLoading(false);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        sessionStorage.removeItem('familyDataList');
        sessionStorage.removeItem('spouseFamilyDataList');
        sessionStorage.removeItem('livingWithSpouse');
        sessionStorage.removeItem('formData1');
        sessionStorage.removeItem('formData3');

        fetchCondition();
    }, []);

    const navigate = useNavigate();

    function handleClick1(e) {

        if (userId === null) {
            handleShowLoginModal();
            return;
        }

        navigate("/condition-1");
    }

    function handleClick2(e) {
        navigate("/condition-2");
    }

    function handleClick3(e) {
        navigate("/condition-3");
    }

    const [showModal, setShowModal] = useState(false);

    const handleConfirm = () => {
        clearCondition();

        setShowModal(false);
        alert('삭제되었습니다.');

        // 정보 새로고침
        fetchCondition();
    };

    function handleClearCondition(e) {

        setShowModal(true);
    }

    useEffect(() => {
        fetchCondition();
    }, []);


    return (
        <>
            <p className='heading-text'>조건 확인</p>

            {!hasCondition && !loading &&
                <>
                    <p className='heading-text'>등록된 조건이 없습니다.</p>
                    <Button variant="dark" onClick={handleClick1}>조건 등록</Button>
                </>
            }
            {/* 로그인 모달 */}
            <Modal show={showLoginModal} onHide={handleCloseLoginModal}>
                <Modal.Header closeButton>
                    <Modal.Title>로그인 필요</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    해당 기능은 로그인 후 이용할 수 있습니다. 로그인 하시겠습니까?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => {
                            // 로그인 페이지로 리다이렉트
                            window.location.href = '/login';
                        }}
                    >
                        로그인 하러 가기
                    </Button>
                    <Button variant="secondary" onClick={handleCloseLoginModal}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>

            {hasCondition &&
                <>
                    <Accordion defaultActiveKey={['0']} alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>신청자 정보</Accordion.Header>
                            <Accordion.Body>
                                <span className='filter-values'>{hasCondition &&
                                    <DisplayCondition01 accountData={accountData} spouseAccountData={spouseAccountData}
                                        form1Data={form1Data} />
                                }</span>
                                <br />
                                <Button variant="dark" onClick={handleClick1}>신청자 정보{hasCondition ? " 수정" : " 등록"}</Button>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>세대구성원 정보</Accordion.Header>
                            <Accordion.Body>
                                <span className='filter-values'>
                                    {hasCondition && <FamilyData family={family} />}
                                </span>
                                <span className='filter-values'>
                                    {(hasCondition && spouseFamily?.length > 0) &&
                                        <><hr /><FamilyData family={spouseFamily} /></>}
                                </span>
                                <br />
                                <Button variant="dark" onClick={handleClick2}>세대구성원 정보{hasCondition ? " 수정" : " 등록"}</Button>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>재산 정보</Accordion.Header>
                            <Accordion.Body>
                                <span className='filter-values'>
                                    {hasCondition && <DisplayCondition03 form3Data={form3Data} family={family} />}
                                </span>
                                <br />
                                <Button variant="dark" onClick={handleClick3}>재산 정보 {hasCondition ? " 수정" : " 등록"}</Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Button variant='dark' onClick={handleClearCondition}>조건 삭제</Button>
                    <ConfirmDialog open={showModal} onClose={() => setShowModal(false)} onConfirm={handleConfirm} />
                </>
            }
        </>
    );
}

function ConfirmDialog({ open, onClose, onConfirm }) {
    return (
        <Modal show={open} >
            <Modal.Header closeButton>
                <Modal.Title>조건 삭제</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                등록된 조건을 삭제하시겠습니까?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={onConfirm} >
                    확인
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    취소
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function FamilyData({ family }) {

    const hasBirthDay = (member) => (member.relationship === FamilyMember.MOTHER || member.relationship === FamilyMember.FATHER
        || member.relationship === FamilyMember.SELF || member.relationship === FamilyMember.CHILD);

    const familyList = () => {
        return family.map((member, index) => (
            <React.Fragment key={member.seqIndex}>
                {getFamilyMemberName(member.relationship)}
                {index < family.length - 1 && <>,&nbsp;</>}
            </React.Fragment>
        ));
    }

    const familyDataList = () => {
        return family.map((member, index) => (
            <React.Fragment key={member.seqIndex}>
                <b>[{getFamilyMemberName(member.relationship)}]</b> <br />
                소유한 부동산 : {member.houseCount} 채<br />
                {member.houseSoldDate && (
                    <span>과거 주택 처분한 날짜 : {member.houseSoldDate}<br /></span>
                )}
                {member.livingTogetherDate && (
                    <span>동거 기간 : {LivingTogetherDate[member.livingTogetherDate]}<br /></span>
                )}
                {member.relationship === FamilyMember.CHILD && (
                    <span>{member.isMarried ? "기혼" : "미혼"}<br /></span>
                )}
                {hasBirthDay(member) && (
                    <span>생년월일 : {member.birthday}<br /></span>
                )}

                {index < family.length - 1 && <hr />}
            </React.Fragment>
        ));
    }

    return (
        <>
            <b>세대구성원 :</b> {family.length || 0}<br />
            {familyList()}<br /><hr />
            {familyDataList()}
            <br />
        </>
    );
}


function DisplayCondition01({ accountData, form1Data, spouseAccountData }) {

    const marriedState = ['미혼', '기혼', '예비신혼부부', '한부모'];

    return (
        <>
            <b>[신청자 기본 정보]</b><br />
            생년월일 : {form1Data.birthday}<br />
            거주 지역 : {`${Sido[form1Data.siDo]} ${form1Data.gunGu}`}<br />
            현재 거주지 입주일 : {form1Data.transferDate}<br />
            {form1Data.regionMoveInDate &&
                <>{Sido[form1Data.siDo]} 입주일 : {form1Data.regionMoveInDate}<br /></>

            }
            {form1Data.metropolitanAreaDate &&
                <>수도권 입주일 : {form1Data.metropolitanAreaDate}<br /></>
            }
            세대주 {form1Data.isHouseHolder ? "O" : "X"} <br />

            {marriedState[form1Data.married]}
            {form1Data.married === 1 && <span>, 결혼기념일 : {form1Data.marriedDate}</span>}

            <hr />
            <b>[신청자 청약통장]</b><br />
            통장 종류 : {AccountType[accountData.type]} <br />
            가입 : {accountData.createdAt}  <br />
            총 {accountData.totalAmount} 만원 {accountData.paymentCount}회 납입<br />
            납입 인정 금액 : {accountData.recognizedAmount} 만원<br />

            {spouseAccountData?.type && <>
                <hr />
                <b>[배우자 청약통장]</b><br />
                통장 종류 : {AccountType[spouseAccountData.type]} <br />
                가입 : {spouseAccountData.createdAt}  <br />
            </>}
        </>
    );
}

function DisplayCondition03({ form3Data, family }) {

    const totalHouseCount = family.reduce((sum, member) => sum + (member.houseCount || 0), 0);

    return (
        <>
            차량 가액 : {form3Data.carPrice} 만원<br />
            세대구성원 전원의 총 자산 : {form3Data.totalAsset} 만원<br />
            세대구성원의 총 부동산 수 : {totalHouseCount}채<br />
            본인의 총 자산 : {form3Data.myAsset} 만원<br />
        </>
    );
}