import axios from 'axios';
import { Button, Container, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { useState, useEffect } from "react";
import { getUserIdFromToken } from "../api/TokenUtils";
import { FamilyMember, getFamilyMemberName } from './family.ts';
import { AccountType, Sido } from '../common/Enums.ts';

export default function Conditions() {

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

                    세대원 : {hasCondition && family.length || 0}명<br />
                    {family.map((member) => {
                        return (
                            <>
                                <br />
                                관계 : {getFamilyMemberName(member.relationship)} <br />
                                소유한 부동산 수 : {member.houseCount} 채<br />
                                {member.houseSoldDate && <span>과거 주택 처분한 날짜 : {member.houseSoldDate}<br /></span>}
                                {member.livingTogetherDate && <span>동거 기간 : {member.livingTogetherDate}<br /></span>}
                                {member.relationship === FamilyMember.CHILD && <span>혼인 여부 : {member.isMarried ? "기혼" : "미혼"}<br /></span>}
                                {(member.relationship === FamilyMember.MOTHER || member.relationship === FamilyMember.FATHER) &&
                                    <span>생년월일 : {member.birthday}<br /></span>}

                            </>
                        );
                    })}
                    {hasCondition && <DisplayConditions accountData={accountData} form1Data={form1Data} form3Data={form3Data} />}

                    {!hasCondition && !loading &&
                        <p className='heading-text'>등록된 조건이 없습니다.</p>
                    }

                    <Button variant="dark" onClick={handleClick1}>{hasCondition ? "조건1 수정" : "조건1 등록"}</Button>
                    <Button variant="dark" onClick={handleClick2}>{hasCondition ? "조건2 수정" : "조건2 등록"}</Button>
                    <Button variant="dark" onClick={handleClick3}>{hasCondition ? "조건3 수정" : "조건3 등록"}</Button>

                    <Footer />
                </Stack>
            </Container>
        </>
    );
}

function DisplayConditions({ accountData, form1Data, form3Data }) {

    const marriedState = ['미혼', '기혼', '예비신혼부부', '한부모'];
    return (
        <>
            <br /><br />
            [신청자 정보] <br />
            생년월일 : {form1Data.birthday}<br />
            거주 지역 : {`${Sido[form1Data.siDo]} ${form1Data.gunGu}`}<br />
            현재 거주지 입주일 : {form1Data.transferDate}<br />
            {Sido[form1Data.siDo]} 입주일 : {form1Data.regionMoveInDate}<br />
            수도권 입주일 : {form1Data.metropolitanAreaDate}<br />
            세대주 여부 : {form1Data.isHouseHolder ? "O" : "X"} <br />
            혼인 상태 : {marriedState[form1Data.married]} <br />
            {form1Data.married === 1 && <span>결혼기념일 : {form1Data.marriedDate} <br /></span>}

            차량 가액 : {form3Data.carPrice} 만원<br />
            세대구성원 전원의 총 자산 : {form3Data.totalAsset} 만원<br />
            본인의 총 자산 : {form3Data.myAsset} 만원<br />



            <br /><br />
            [계좌 정보] <br />
            통장 종류 : {AccountType[accountData.type]}<br />
            계좌 가입일 : {accountData.createdAt}<br />
            납입 횟수 : {accountData.paymentCount}<br />
            총 납입 금액 : {accountData.totalAmount} 만원<br />
            납입 인정 금액 : {accountData.recognizedAmount} 만원<br />
        </>
    );
}

