import axios from 'axios';
import { Button, Form, Stack, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { toDateType } from "./InputNumberItem";
import { placeholderText } from "./placeholderText";
import { FamilyMember, familyMemberNames } from "./family.ts";
import { getUserIdFromToken } from '../api/TokenUtils.js';

export default function Condition02Content() {

    const navigate = useNavigate();
    const [updateMode, setUpdateMode] = useState(false);

    const [validate, setValidate] = useState(true);

    /* 제출용 데이터 */
    const [familyDataList, setFamilyDataList] = useState([]);
    const [spouseFamilyDataList, setSpouseFamilyDataList] = useState([
        {
            seqIndex: 0, livingTogether: 2, relationship: 2, birthday: null,
            isMarried: true, houseCount: 0
        }]);

    const [married, setMarried] = useState(0);
    const [hasSpouse, setHasSpouse] = useState(false); // true: 배우자와 동거

    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);


    const fetchCondition = () => {
        axios
            .get(`http://localhost:8989/condition/${userId}`)
            .then((response) => {
                if (response.data.hasCondition === true) {
                    setUpdateMode(true);

                    sessionStorage.setItem('familyDataList', JSON.stringify(response.data.form1Data));
                    setMarried(response.data.form1Data.married);

                    const nextFamilyList = response.data.familyList;
                    setHasSpouse(nextFamilyList.some(item => item.relationship === 2));

                    setFamilyDataList(nextFamilyList);
                    setSpouseFamilyDataList(response.data.spouseFamilyList);

                    sessionStorage.removeItem('familyDataList');
                    sessionStorage.setItem('familyDataList', JSON.stringify(response.data.familyList));

                    sessionStorage.setItem('formData3', JSON.stringify(response.data.form3Data));
                    sessionStorage.setItem('spouseFamilyDataList', JSON.stringify(response.data.spouseFamilyList));
                }

            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
            });
    };

    const updateCondition = (FamilyData) => {
        axios
            .patch(`http://localhost:8989/condition/2/${userId}`, FamilyData)
            .then((response) => {
                console.log('업데이트 성공:', response.data);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
            });
    };

    useEffect(() => {
        /* 이전 폼 데이터 읽어오기 */
        fetchCondition();

        // 폼2데이터
        const sessionFamilyData = sessionStorage.getItem('familyDataList');
        const sessionSpouseFamilyData = sessionStorage.getItem('spouseFamilyDataList');
        if (sessionFamilyData && sessionFamilyData.length > 0) {
            const storedFamilyData = JSON.parse(sessionFamilyData);
            setFamilyDataList(storedFamilyData);
            const storedSpouseFamilyData = JSON.parse(sessionSpouseFamilyData) || [];
            setSpouseFamilyDataList(storedSpouseFamilyData);

            return;
        }

        // 폼1데이터
        const nextHasSeperateSpouse = sessionStorage.getItem('livingWithSpouse') === 'N';

        const sessionData = sessionStorage.getItem('formData1');
        if (!sessionData) return;

        let userData = null;
        let birthday = null;
        let married = null;
        try {
            userData = JSON.parse(sessionData);
            birthday = userData.birthday;
            married = Number(userData.married);
        } catch (error) { }

        const hasSpouse = !nextHasSeperateSpouse && (married === 1 || married === 2);
        const isMarried = married > 0;
        let nextFamilyDataList = [{
            seqIndex: 0, livingTogether: 1, relationship: 1,
            birthday: birthday, isMarried: isMarried, houseCount: 0
        }];

        if (hasSpouse) {
            nextFamilyDataList = [...nextFamilyDataList,
            {
                seqIndex: 1, livingTogether: 1, relationship: 2, birthday: null,
                isMarried: true, houseCount: 0
            }
            ];
        }

        setHasSpouse(hasSpouse)

        setMarried(married);
        setFamilyDataList(nextFamilyDataList);

    }, []);

    function handlePrevButtonClick(e) {
        navigate("/condition-1");
    }

    // 세대구성원 추가/수정
    function handleFamilyRowChange(updatedFamilyData) {
        setFamilyDataList(updatedFamilyData);
    }

    // 배우자 세대구성원 추가/수정
    function handleSpouseFamilyRowChange(updatedFamilyData) {
        setSpouseFamilyDataList(updatedFamilyData);
    }

    // 제출(세션 저장)
    function handleSubmit(event) {
        const form = event.currentTarget;

        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false) {

            alert('누락된 필수 항목이 있습니다.');

            setValidate(true);
            return;
        }

        if(updateMode) {
            updateCondition(familyDataList);
            navigate("/conditions");
            return;
        }

        const finalHasSpouse = (married === 1 || married === 2);

        sessionStorage.setItem('hasSpouse', finalHasSpouse);
        sessionStorage.setItem('familyDataList', JSON.stringify(familyDataList));
        if(finalHasSpouse && !hasSpouse) {
            sessionStorage.setItem('spouseFamilyDataList', JSON.stringify(spouseFamilyDataList));
        }
    
        navigate("/condition-3");
    }


    return (
        <>
            <p className='heading-text'>
                조건 등록 (2/3) - 세대구성원 정보 {updateMode ? " 수정" : " 입력"}
            </p>

            <Form noValidate validated={validate} onSubmit={handleSubmit}>
                <Stack direction='vertical' gap={5} >

                    {/* 본인 세대의 세대원 */}
                    <FamilyForm married={married} handleChange={handleFamilyRowChange}
                        hasSpouse={hasSpouse} savedFamilyDataList={familyDataList} />

                    {/* 배우자 세대의 세대원 */}
                    {(!hasSpouse && (married === 1 || married === 2)) &&
                        <SpouseFamilyForm married={married} handleChange={handleSpouseFamilyRowChange}
                            savedFamilyDataList={spouseFamilyDataList} />}

                    {/* 다음으로 */}
                    <Stack direction="horizontal" gap={2}>
                        {!updateMode && <Button variant="light" onClick={handlePrevButtonClick} style={{ flex: '1' }} >이전</Button>}
                        <Button variant="dark" type="submit" style={{ flex: '1' }} >{updateMode ? "수정" : "다음"}</Button>
                    </Stack>
                </Stack>

            </Form>
        </>
    );
}

/* 본인과의 관계 */
function FamilyRelationshipDropdown({ married, handleChange, value }) {

    // 미혼 3~8
    const notMarriedFamilyList = Object.keys(FamilyMember).filter(key =>
        (typeof FamilyMember[key] !== 'number') && (key > 2 && key < 8)
    );

    // 기혼
    const marriedFamilyList = Object.keys(FamilyMember).filter(key =>
        (typeof FamilyMember[key] !== 'number') && key > 2
    );

    // 예비신혼 9, 10, 11, 12 제외
    const engagedFamilyList = Object.keys(FamilyMember).filter(key =>
        (typeof FamilyMember[key] !== 'number') && (key > 2 && key < 9) || key > 12
    );

    // 한부모 13~ 제외
    const singleParentFamilyList = Object.keys(FamilyMember).filter(key =>
        (typeof FamilyMember[key] !== 'number') && (key > 2 && key < 13)
    );

    const familyOptinList = [notMarriedFamilyList, marriedFamilyList, engagedFamilyList, singleParentFamilyList];
    let familyList = familyOptinList[married];

    const relationshipList = () => {
        return familyList.map((relationship, seqIndex) => (
            <option value={relationship} key={seqIndex} >
                {familyMemberNames[relationship]}
            </option>
        ));
    }

    function handleChanged(e) {
        const updatedValue = Number(e.target.value);
        handleChange(updatedValue);
    }

    return (
        <Form.Select required value={value || ''} onChange={handleChanged}>
            <option value="">선택</option>
            {relationshipList()}
        </Form.Select>
    );

}

/* 동거기간 */
function LivingTogetherDateDropdown({ handleChange, required, disabled, value }) {

    const livingTogetherData = [
        { data: '1년 미만', value: 1 },
        { data: '1년 이상 3년 미만', value: 2 },
        { data: '3년 이상', value: 3 }];

    const livingTogetherDataList = () => {
        return livingTogetherData.map((livingTogether, seqIndex) => (
            <option key={seqIndex} value={livingTogether.value}>{livingTogether.data}</option>
        ));
    }

    function handleChanged(e) {
        const value = Number(e.target.value);
        handleChange(value);
    }

    return (
        <Form.Select required={required} disabled={disabled} onChange={handleChanged} value={value || ''} >
            <option value="" >선택</option>
            {livingTogetherDataList()}
        </Form.Select>
    );

}

/* 본인 세대의 세대원 */
function FamilyForm({ married, handleChange, hasSpouse, savedFamilyDataList }) {

    // 세대구성원 수정
    function handleFamilyRowChange(seqIndex, familyRow) {

        const updatedFamilyData = savedFamilyDataList.map((row) =>
            row.seqIndex === seqIndex ? { ...row, ...familyRow } : row
        );

        handleChange(updatedFamilyData);
    }

    // 세대구성원 추가
    function handleAdd() {
        const nextIndex = savedFamilyDataList.length > 0
            ? Math.max(...savedFamilyDataList.map(row => row.seqIndex)) + 1
            : 2;

        const nextFamilyDataList = [
            ...savedFamilyDataList,
            { seqIndex: nextIndex, relationship: null, livingTogether: 1, houseCount: 0, birthday: null, houseSoldDate: null, isMarried: null }
        ];

        handleChange(nextFamilyDataList);
    }

    // 세대구성원 삭제
    function handleRemove(seqIndex) {
        const updatedFamilyData = savedFamilyDataList.filter(prev => prev.seqIndex !== seqIndex)
        handleChange(updatedFamilyData);
    }

    // 관계 드롭다운 변경(초기화)
    function handleResetData(seqIndex, relationship) {
        const updatedFamilyData = savedFamilyDataList.map((row) =>
            row.seqIndex === seqIndex
                ? { seqIndex: row.seqIndex, relationship: relationship, livingTogether: 1, houseCount: 0, birthday: null, houseSoldDate: null, isMarried: null }
                : row
        );

        handleChange(updatedFamilyData);
    }

    return (
        <>
        
            본인 세대의 세대구성원
            <Table>
                <thead>
                    <FamilyFormHead />
                </thead>
                <tbody>
                    <SelfFormRow handleChange={handleFamilyRowChange}
                        rowData={savedFamilyDataList.find(item => item.relationship === 1)} />
                    {hasSpouse && <SpouseFormRow handleChange={handleFamilyRowChange}
                        rowData={savedFamilyDataList.find(item => item.relationship === 2)} />}

                    {savedFamilyDataList
                        .filter((row) => row.relationship !== 1 && row.relationship !== 2)
                        .map((familyData, index) =>
                            <React.Fragment key={`${familyData.seqIndex}-${index}`} >
                                <FamilyFormRow married={married || 0}
                                    handleChange={handleFamilyRowChange} handleRemove={handleRemove}
                                    rowData={familyData} resetData={handleResetData} />
                            </React.Fragment>
                        )}
                </tbody>
            </Table>
            <Button variant="light" onClick={handleAdd}>동거인 추가</Button>
        </>
    );
}

/* 배우자 세대의 세대원 */
function SpouseFamilyForm({ married, handleChange, savedFamilyDataList }) {

    const [sequence, setSequence] = useState(1);

    // 세대구성원 수정
    function handleFamilyRowChange(seqIndex, familyRow) {

        const updatedFamilyData = savedFamilyDataList.map((row) =>
            row.seqIndex === seqIndex ? familyRow : row
        );

        handleChange(updatedFamilyData);
    }


    // 세대구성원 추가
    function handleAdd() {
        const nextFamilyDataList = [
            ...savedFamilyDataList,
            { seqIndex: sequence, relationship: null, livingTogether: 2, houseCount: 0, birthday: null, houseSoldDate: null, isMarried: null }
        ];

        handleChange(nextFamilyDataList);
        setSequence(seq => seq + 1);
    }

    // 세대구성원 삭제
    function handleRemove(seqIndex) {
        const updatedFamilyData = savedFamilyDataList.filter(prev => prev.seqIndex !== seqIndex)
        handleChange(updatedFamilyData);
    }

    // 관계 드롭다운 변경(초기화)
    function handleResetData(seqIndex, relationship) {
        const updatedFamilyData = savedFamilyDataList.map((row) =>
            row.seqIndex === seqIndex
                ? { seqIndex: row.seqIndex, relationship: relationship, livingTogether: 2, houseCount: 0, birthday: null, houseSoldDate: null, isMarried: null }
                : row
        );

        handleChange(updatedFamilyData);
    }

    return (
        <>
            배우자 세대의 세대구성원
            <Table>
                <thead>
                    <FamilyFormHead />
                </thead>
                <tbody>
                    < SpouseFormRow seqIndex={0} livingTogether={2} handleChange={handleFamilyRowChange} />
                    {savedFamilyDataList
                        .filter((row) => row.relationship !== 2)
                        .map((row) =>
                            <React.Fragment key={row.seqIndex} >
                                <FamilyFormRow seqIndex={row.seqIndex} married={married}
                                    handleChange={handleFamilyRowChange} handleRemove={handleRemove}
                                    rowData={row} resetData={handleResetData} />
                            </React.Fragment>
                        )}

                </tbody>
            </Table>
            <Button variant="light" onClick={handleAdd}>동거인 추가</Button>
        </>
    );
}

function FamilyFormHead() {
    return (
        <tr>
            <th>관계</th>
            <th>동거기간</th>
            <th>생년월일</th>
            <th>혼인여부</th>
            <th>주택/분양권 소유 수</th>
            <th>주택 처분 날짜</th>
        </tr>
    );
}

function FamilyFormRow({ married, handleChange, resetData, handleRemove, rowData }) {

    const isRequireBirthday = rowData.relationship === FamilyMember.CHILD || rowData.relationship === FamilyMember.MOTHER || rowData.relationship === FamilyMember.FATHER;
    const isRequireLivingTogetherDate = !(rowData.relationship === FamilyMember.UNBORN_CHILD || rowData.relationship === FamilyMember.SON_IN_LAW_OR_DAUGHTER_IN_LAW);

    function handleChangeRelation(value) {

        resetData(rowData.seqIndex, value);
    }

    // 속성 값 수정
    function handleChangeFormValue({ key, value }) {

        const updatedFamilyRowData = {
            ...rowData,
            [key]: value
        };

        handleChange(rowData.seqIndex, updatedFamilyRowData);
    }

    // 속성 값 수정
    function handleChangeLivingTogetherDate(value) {
        handleChangeFormValue({ key: 'livingTogetherDate', value: value });
    }

    // 폼 Input 타입 관리
    function handleInputChanged(e) {
        const name = e.target.getAttribute('data-name');
        handleChangeFormValue({ key: name, value: e.target.value });
    }

    function handleBlur(e) {
        const name = e.target.getAttribute('data-name');
        let value = Math.max(0, e.target.value);

        handleChangeFormValue({ key: name, value: value });
    }

    // 폼 checkbox 타입 관리
    function handleCheckChanged(e) {
        const name = e.target.getAttribute('data-name');
        let value = e.target.checked === true;

        handleChangeFormValue({ key: name, value: value });
    }

    function handleDelete() {
        handleRemove(rowData.seqIndex);
    }

    return (
        <tr>

            {/* 관계 */}
            <td>
                <FamilyRelationshipDropdown married={married} handleChange={handleChangeRelation}
                    value={rowData.relationship} />
            </td>

            {/* 동거기간 */}
            <td>
                <LivingTogetherDateDropdown handleChange={handleChangeLivingTogetherDate}
                    required={isRequireLivingTogetherDate}
                    disabled={!isRequireLivingTogetherDate}
                    value={rowData.livingTogetherDate} />
            </td>

            {/* 생년월일 */}
            <td>
                <InputDateType name={`birth-${rowData.seqIndex}-${rowData.livingTogether}`}
                    dataName={'birthday'} onChange={handleChangeFormValue}
                    value={rowData.birthday || ''} required={isRequireBirthday}
                    disabled={!isRequireBirthday} />
            </td>

            {/* 혼인 여부 */}
            <td>
                <Form.Check
                    type={'checkbox'}
                    name={`married-${rowData.seqIndex}-${rowData.livingTogether}`}
                    label={'기혼'}
                    data-name={'isMarried'}
                    onChange={handleCheckChanged}
                    id={`married-${rowData.seqIndex}-${rowData.livingTogether}`}
                    style={{ flex: 1 }}
                    checked={rowData.isMarried === true}
                    disabled={rowData.relationship !== FamilyMember.CHILD}
                />
            </td>

            {/* 주택/분양권 소유 수 */}
            <td>
                <Form.Control
                    type="text"
                    placeholder={placeholderText.houseCountType}
                    name={`house-${rowData.seqIndex}-${rowData.livingTogether}`}
                    data-name={'houseCount'}
                    onChange={handleInputChanged}
                    onBlur={handleBlur}
                    value={rowData.houseCount}
                    required={rowData.relationship !== FamilyMember.UNBORN_CHILD}
                    disabled={rowData.relationship === FamilyMember.UNBORN_CHILD}
                />
            </td>

            {/* 주택 처분 날짜 */}
            <td>
                <InputDateType name={`houseSold-${rowData.seqIndex}-${rowData.livingTogether}`}
                    dataName={'houseSoldDate'} onChange={handleChangeFormValue}
                    value={rowData.houseSoldDate} required={false}
                    disabled={rowData.relationship === FamilyMember.UNBORN_CHILD} />
            </td>

            <td>
                <Button className='btn btn-no-bg-family' type="button" onClick={handleDelete} >x</Button>
            </td>
        </tr>
    );
}

function SelfFormRow({ handleChange, rowData }) {

    const [hasError, setHasError] = useState(false);

    function handleRowChange({ key, value }) {

        const newRowData = { ...rowData, [key]: value };
        handleChange(rowData.seqIndex, newRowData);
    }

    function handleInputChanged(e) {
        const name = e.target.getAttribute('data-name');
        handleRowChange({ key: name, value: e.target.value });
    }

    function handleBlur(e) {
        const name = e.target.getAttribute('data-name');

        const value = Math.max(0, e.target.value);

        handleRowChange({ key: name, value: value });
    }

    function handleChanged(e) {
        const name = e.target.getAttribute('data-name');
        handleRowChange({ key: name, value: e.target.value });
    }

    // 폼 Input date 타입 관리
    function handleBlurDate(e) {
        const name = e.target.getAttribute('data-name');

        const value = toDateType(e.target.value);
        if (e.target.value.length > 0 && value === null) {
            setHasError(true);
        } else {
            handleRowChange({ key: name, value: value });
            setHasError(false);
        }
    }

    return (
        <>
            <tr>
                {/* 관계 */}
                <td>본인</td>

                {/* 동거기간 */}
                <td>

                </td>

                {/* 생년월일 */}
                <td>
                    <Form.Control
                        type="text"
                        value={rowData?.birthday || ''}
                        readOnly
                    />
                </td>

                {/* 혼인 여부 */}
                <td>
                    {rowData?.isMarried ? "기혼" : "미혼"}
                </td>

                {/* 주택/분양권 소유 수 */}
                <td>
                    <Form.Control
                        type="text"
                        placeholder={placeholderText.houseCountType}
                        name={`house`}
                        data-name={'houseCount'}
                        required
                        onChange={handleInputChanged}
                        onBlur={handleBlur}
                        value={rowData?.houseCount || 0}
                    />
                </td>

                {/* 주택 처분 날짜 */}
                <td>
                    <Form.Control
                        type="text"
                        placeholder={placeholderText.dateType}
                        name={`houseSold`}
                        data-name={'houseSoldDate'}
                        onChange={handleChanged}
                        onBlur={handleBlurDate}
                        value={rowData?.houseSoldDate || ''}
                    />
                    {hasError && <p className="inputTypeError">올바르지 않은 형식입니다.</p>}
                </td>

            </tr>
        </>
    );
}

function SpouseFormRow({ rowData, handleChange }) {

    const [hasError, setHasError] = useState(false);

    function handleRowChange({ key, value }) {

        const newRowData = { ...rowData, [key]: value };
        handleChange(rowData.seqIndex, newRowData);
    }

    function handleInputChanged(e) {
        const name = e.target.getAttribute('data-name');
        handleRowChange({ key: name, value: e.target.value });
    }

    function handleBlur(e) {
        const name = e.target.getAttribute('data-name');

        const value = Math.max(0, e.target.value);

        handleRowChange({ key: name, value: value });
    }

    function handleChanged(e) {
        const name = e.target.getAttribute('data-name');
        handleRowChange({ key: name, value: e.target.value });
    }

    // 폼 Input date 타입 관리
    function handleBlurDate(e) {

        const name = e.target.getAttribute('data-name');
        const value = toDateType(e.target.value);
        if (e.target.value.length > 0 && value === null) {
            setHasError(true);
        } else {
            handleRowChange({ key: name, value: value });
            setHasError(false);
        }
    }

    return (
        <>
            <tr>

                {/* 관계 */}
                <td>배우자</td>

                {/* 동거기간 */}
                <td>

                </td>

                {/* 생년월일 */}
                <td>
                    <Form.Control
                        type="number"
                        placeholder={placeholderText.dateType}
                        name={`birth-`}
                        disabled
                    />
                </td>

                {/* 혼인 여부 */}
                <td>
                    기혼
                </td>

                {/* 주택/분양권 소유 수 */}
                <td>
                    <Form.Control
                        type="text"
                        placeholder={placeholderText.houseCountType}
                        name={`house-`}
                        data-name={'houseCount'}
                        value={rowData?.houseCount || 0}
                        onBlur={handleBlur}
                        onChange={handleInputChanged}
                    />
                </td>

                {/* 주택 처분 날짜 */}
                <td>
                    <Form.Control
                        type="number"
                        placeholder={placeholderText.dateType}
                        data-name={'houseSoldDate'}
                        name={`houseSold-`}
                        value={rowData?.houseSoldDate || ''}
                        onChange={handleChanged}
                        onBlur={handleBlurDate}
                    />
                    {hasError && <p className="inputTypeError">올바르지 않은 형식입니다.</p>}
                </td>

            </tr>
        </>
    );
}

function InputDateType({ name, dataName, onChange, required, disabled, value }) {

    const [hasError, setHasError] = useState(false);

    function handleChanged(e) {
        onChange({ key: dataName, value: e.target.value });
    }

    // 폼 Input date 타입 관리
    function handleBlur(e) {

        const value = toDateType(e.target.value);
        if (e.target.value.length > 0 && value === null) {
            setHasError(true);
        } else {
            onChange({ key: dataName, value: value });
            setHasError(false);
        }
    }

    return (
        <>
            <Form.Control
                type="text"
                placeholder={placeholderText.dateType}
                name={name}
                onChange={handleChanged}
                onBlur={handleBlur}
                value={value || ''}
                required={required}
                disabled={disabled}
            />
            {(hasError && !disabled) && <p className="inputTypeError">올바르지 않은 형식입니다.</p>}
        </>
    );
}