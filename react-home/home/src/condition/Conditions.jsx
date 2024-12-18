import axios from 'axios';
import { Button, Card, Container, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import React, { useState, useEffect } from "react";
import { getUserIdFromToken } from "../api/TokenUtils";

import { AccountType, LivingTogetherDate, Sido } from '../common/Enums.ts';
import { FamilyMember, getFamilyMemberName } from '../condition/family.ts';

export default function Conditions() {

    const [loading, setLoading] = useState(false);
    const [hasCondition, setHasCondition] = useState(false);


    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    const fetchCondition = () => {
        setLoading(true);
        axios
            .get(`http://localhost:8989/condition/${userId}`)
            .then((response) => {
                setHasCondition(response.data.hasCondition);
                setLoading(false);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
                setLoading(false);
            });
    };


    const navigate = useNavigate();

    function handleClick1(e) {
        navigate("/condition-1");
    }

    function handleClick2(e) {
        navigate("/condition-2");
    }

    function handleClick3(e) {
        navigate("/condition-3");
    }

    useEffect(() => {
        fetchCondition();
    }, []);

    return (
        <>
            <Container className="p-5" fluid="md">
                <Stack direction="vertical" gap={5}>
                    <Header />

                    <Card body>
                        <p className='filter-values'>내 조건</p>
                        <hr />
                        <ConditionInfo />
                    </Card>

                    <Button variant="dark" onClick={handleClick1}>{hasCondition ? "조건1 수정" : "조건1 등록"}</Button>
                    <Button variant="dark" onClick={handleClick2}>{hasCondition ? "조건2 수정" : "조건2 등록"}</Button>
                    <Button variant="dark" onClick={handleClick3}>{hasCondition ? "조건3 수정" : "조건3 등록"}</Button>

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
    const [accountData, setAccountData] = useState({});

    const [form1Data, setForm1Data] = useState({});
    const [form3Data, setForm3Data] = useState({});

    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    const fetchCondition = () => {
        setLoading(true);
        axios
            .get(`http://localhost:8989/condition/${userId}`)
            .then((response) => {
                setHasCondition(response.data.hasCondition);

                setFamily(response.data.familyList);
                setAccountData(response.data.accountData);

                setForm1Data(response.data.form1Data);
                setForm3Data(response.data.form3Data);

                setLoading(false);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCondition();
    }, []);

    return (
        <>
            <FamilyData hasCondition={hasCondition} family={family} />

            {hasCondition &&
                <DisplayConditions accountData={accountData} family={family}
                    form1Data={form1Data} form3Data={form3Data} />}

            {!hasCondition && !loading &&
                <p className='heading-text'>등록된 조건이 없습니다.</p>
            }

        </>
    );
}

function FamilyData({ hasCondition, family }) {

    const hasBirthDay = (member) => (member.relationship === FamilyMember.MOTHER || member.relationship === FamilyMember.FATHER
        || member.relationship === FamilyMember.SELF || member.relationship === FamilyMember.CHILD);

    return (
        <>
            [세대원 정보] <br />
            세대구성원 : {hasCondition && family.length || 0}명<br />
            {family.map((member, index) => {
                return (
                    <>
                        <React.Fragment key={`${member.seqIndex}-${index}`} >
                            {getFamilyMemberName(member.relationship)}

                            {hasBirthDay(member) &&
                                <>({member.birthday})</>}

                            {index < family.length - 1 && <>,&nbsp;</>}
                        </React.Fragment>
                    </>
                );

            })}
            <br />
        </>
    );
}


function DisplayConditions({ accountData, form1Data, form3Data, family }) {

    const totalHouseCount = family.reduce((sum, member) => sum + (member.houseCount || 0), 0);
    const marriedState = ['미혼', '기혼', '예비신혼부부', '한부모'];

    return (
        <>
            <br />
            [신청자 정보] <br />
            생년월일 : {form1Data.birthday}<br />
            거주 지역 : {`${Sido[form1Data.siDo]} ${form1Data.gunGu}`}<br />
            현재 거주지 입주일 : {form1Data.transferDate}<br />
            {Sido[form1Data.siDo]} 입주일 : {form1Data.regionMoveInDate}<br />
            수도권 입주일 : {form1Data.metropolitanAreaDate}<br />
            세대주 {form1Data.isHouseHolder ? "O" : "X"} <br />
            {marriedState[form1Data.married]}
            {form1Data.married === 1 && <span>, 결혼기념일 : {form1Data.marriedDate}</span>}
            <br />

            차량 가액 : {form3Data.carPrice} 만원<br />
            세대구성원 전원의 총 자산 : {form3Data.totalAsset} 만원<br />
            세대구성원의 총 부동산 수 : {totalHouseCount}채<br />
            본인의 총 자산 : {form3Data.myAsset} 만원<br />

            <br />
            [{AccountType[accountData.type]}] <br />
            가입 : {accountData.createdAt}  <br />
            총 {accountData.totalAmount} 만원 {accountData.paymentCount}회 납입<br />
            납입 인정 금액 : {accountData.recognizedAmount} 만원<br />
        </>
    );
}
