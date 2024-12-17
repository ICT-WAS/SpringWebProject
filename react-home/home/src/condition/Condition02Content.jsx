import { Button, Dropdown, Form, Stack, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { formatDateToCustomFormat } from "./InputNumberItem";
import { placeholderText } from "./placeholderText";
import { FamilyMember, familyMemberNames } from "./family.ts";

export default function Condition02Content() {

    const navigate = useNavigate();

    /* 제출용 데이터 */
    const [formData1, setFormData1] = useState({});
    const [accountDTOList, setAccountDTOList] = useState({});
    const [familyDataList, setFamilyDataList] = useState([]);
    const [spouseFamilyDataList, setSpouseFamilyDataList] = useState([]);

    const [spouseData, setSpouseData] = useState([]);

    const [married, setMarried] = useState(0);

    const [hasSeperateHouseSpouse, setHasSeperateHouseSpouse] = useState(false);

    useEffect(() => {
        /* 이전 폼 데이터 읽어오기 */

        const nextHasSeperateSpouse = sessionStorage.getItem('livingWithSpouse') === 'N';
        setHasSeperateHouseSpouse(nextHasSeperateSpouse);

        const sessionData = sessionStorage.getItem('formData1');
        const accountData = sessionStorage.getItem('accountDTOList');
        if (!sessionData) return;

        let userData = null;
        try {
            userData = JSON.parse(sessionData);
            setFormData1(userData);

            const account = JSON.parse(accountData);
            setAccountDTOList(account);
        } catch (error) { }

        const prevMarried = Number(userData.married);
        setMarried(prevMarried);

        if (prevMarried === 0) {
            return;
        }

        if (nextHasSeperateSpouse) {
            setSpouseData([{ relationship: 2, livingTogether: 2 }])
        } else {
            // 배우자 추가
            setSpouseData({ relationship: 2, livingTogether: 1 });
        }

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

    function handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {

            alert('관계, 동거 기간은 필수 항목입니다.');
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        let finalFamilyData = [...familyDataList];
        if (spouseData.length > 0) {
            finalFamilyData = [...finalFamilyData, ...spouseData];
        }

        const finalHasSpouse = (married === 1 || married === 2);

        sessionStorage.setItem('hasSpouse', finalHasSpouse);
        sessionStorage.setItem('familyDataList', JSON.stringify(finalFamilyData));
        sessionStorage.setItem('formData1', JSON.stringify(formData1));
        sessionStorage.setItem('accountDTOList', JSON.stringify(accountDTOList));

        navigate("/condition-3");
    }

    return (
        <>
            <p className='heading-text'>
                조건 등록 (2/3) - 세대구성원 정보 입력
            </p>

            <Form noValidate onSubmit={handleSubmit}>
                <Stack direction='vertical' gap={5} >

                    {/* 본인 세대의 세대원 */}
                    <FamilyForm married={married} handleChange={handleFamilyRowChange} userBirth={formData1.birthday} hasSeperateHouseSpouse={hasSeperateHouseSpouse} />

                    {/* 배우자 세대의 세대원 */}
                    {hasSeperateHouseSpouse && <SpouseFamilyForm married={married} handleChange={handleSpouseFamilyRowChange} />}

                    {/* 다음으로 */}
                    <Stack direction="horizontal" gap={2}>
                        <Button variant="light" onClick={handlePrevButtonClick} style={{ flex: '1' }} >이전</Button>
                        <Button variant="dark" type="submit" style={{ flex: '1' }} >다음</Button>
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
        return familyList.map((relationship, index) => (
            <option value={relationship} key={index} >
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
        return livingTogetherData.map((livingTogether, index) => (
            <option key={index} value={livingTogether.value}>{livingTogether.data}</option>
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
function FamilyForm({ married, handleChange, userBirth, hasSeperateHouseSpouse }) {

    const hasSpouse = !hasSeperateHouseSpouse && (married === 1 || married === 2);
    const isMarried = married > 0;
    const initFamilyList = hasSpouse
        ? [{ index: 0, livingTogether: 1, relationship: 1, birthday: userBirth, isMarried: isMarried, houseCount: 0 },
        { index: 1, livingTogether: 1, relationship: 2, isMarried: isMarried, houseCount: 0 }]
        : [{ index: 0, livingTogether: 1, relationship: 1, birthday: userBirth, isMarried: isMarried, houseCount : 0 }];

    const [familyDataList, setFamilyDataList] = useState(initFamilyList);

    const [sequence, setSequence] = useState(2);

    useEffect(() => {
        handleChange(familyDataList);
    }, [familyDataList]);

    // 세대구성원 수정
    function handleFamilyRowChange(index, familyRow) {

        const updatedFamilyData = familyDataList.map((row) =>
            row.index === index ? familyRow : row
        );

        setFamilyDataList(updatedFamilyData);
    }

    // 세대구성원 추가
    function handleAdd() {
        setFamilyDataList((prev) => ([
            ...prev,
            { index: sequence, relationship: null, livingTogether: 1, houseCount: 0, birthday: null, houseCount: null, houseSoldDate: null, isMarried: null }
        ]));
        setSequence(seq => seq + 1);
    }

    // 세대구성원 삭제
    function handleRemove(index) {
        const updatedFamilyData = familyDataList.filter(prev => prev.index !== index)
        setFamilyDataList(updatedFamilyData);
    }

    // 관계 드롭다운 변경(초기화)
    function handleResetData(index, relationship) {
        const updatedFamilyData = familyDataList.map((row) =>
            row.index === index
                ? { index: row.index, relationship: relationship, livingTogether: 1, houseCount: 0, birthday: null, houseCount: null, houseSoldDate: null, isMarried: null }
                : row
        );

        setFamilyDataList(updatedFamilyData);
    }

    return (
        <>
            본인 세대의 세대구성원
            <Table>
                <thead>
                    <FamilyFormHead />
                </thead>
                <tbody>
                    <SelfFormRow handleChange={handleFamilyRowChange} rowData={familyDataList[0]} userBirth={userBirth} />
                    {hasSpouse && <SpouseFormRow index={1} livingTogether={1} handleChange={handleFamilyRowChange} value={familyDataList[1]} />}

                    {familyDataList
                        .filter((row) => row.relationship !== 1 && row.relationship !== 2)
                        .map((familyData) =>
                            <React.Fragment key={familyData.index} >
                                <FamilyFormRow married={married}
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
function SpouseFamilyForm({ married, handleChange }) {

    const [loopCount, setLoopCount] = useState(0);
    const [familyDataList, setFamilyDataList] = useState([]);

    // 세대구성원 추가/수정
    function handleFamilyRowChange({ index, familyRow }) {

        const updatedFamilyData = familyDataList.length > index
            ? familyDataList.map((item, idx) =>
                idx === index ? { ...familyRow } : item // 해당 index에서만 교체
            )
            : [...familyDataList, familyRow]; // 인덱스가 없으면 새로운 항목 추가

        setFamilyDataList(updatedFamilyData);
        handleChange(updatedFamilyData);
    }

    function handleButtonClick() {
        setLoopCount(prev => prev + 1);
    }

    // 세대구성원 삭제
    function handleRemove(index) {

        const updatedFamilyData = familyDataList.filter(prev => prev.index !== index)

        setFamilyDataList(updatedFamilyData);
        handleChange(updatedFamilyData);
        setLoopCount(prev => prev - 1);
    }

    return (
        <>
            배우자 세대의 세대구성원
            <Table>
                <thead>
                    <FamilyFormHead />
                </thead>
                <tbody>
                    < SpouseFormRow index={0} livingTogether={2} handleChange={handleFamilyRowChange} />
                    {familyDataList
                        .filter((row) => row.relationship !== 2)
                        .map((row) =>
                            <React.Fragment key={row.index} >
                                <FamilyFormRow index={row.index} married={married}
                                    handleChange={handleFamilyRowChange} handleRemove={handleRemove}
                                    rowData={row} />
                            </React.Fragment>
                        )}

                </tbody>
            </Table>
            <Button variant="light" onClick={handleButtonClick}>동거인 추가</Button>
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

        resetData(rowData.index, value);
    }

    // 속성 값 수정
    function handleChangeFormValue({ key, value }) {

        const updatedFamilyRowData = {
            ...rowData,
            [key]: value
        };

        handleChange(rowData.index, updatedFamilyRowData);
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
        handleRemove(rowData.index);
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
                <InputDateType name={`birth-${rowData.index}-${rowData.livingTogether}`}
                    dataName={'birthday'} onChange={handleChangeFormValue}
                    value={rowData.birthday} required={isRequireBirthday}
                    disabled={!isRequireBirthday} />
            </td>

            {/* 혼인 여부 */}
            <td>
                <Form.Check
                    type={'checkbox'}
                    name={`married-${rowData.index}-${rowData.livingTogether}`}
                    label={'기혼'}
                    data-name={'isMarried'}
                    onChange={handleCheckChanged}
                    id={`married-${rowData.index}-${rowData.livingTogether}`}
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
                    name={`house-${rowData.index}-${rowData.livingTogether}`}
                    data-name={'houseCount'}
                    onChange={handleInputChanged}
                    onBlur={handleBlur}
                    value={rowData.houseCount || 0}
                    required={rowData.relationship !== FamilyMember.UNBORN_CHILD}
                    disabled={rowData.relationship === FamilyMember.UNBORN_CHILD}
                />
            </td>

            {/* 주택 처분 날짜 */}
            <td>
                <InputDateType name={`houseSold-${rowData.index}-${rowData.livingTogether}`}
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

function SelfFormRow({ handleChange, rowData, userBirth }) {

    const [hasError, setHasError] = useState(false);

    function handleRowChange({ key, value }) {

        const newRowData = { ...rowData, [key]: value };
        handleChange(rowData.index, newRowData);
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

        const value = formatDateToCustomFormat(e.target.value);
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
                        value={userBirth || ''}
                        disabled
                        readOnly
                    />
                </td>

                {/* 혼인 여부 */}
                <td>
                    {rowData.isMarried ? "기혼" : "미혼"}
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
                        value={rowData.houseCount || 0}
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
                        value={rowData.houseSoldDate || ''}
                        maxLength={8}
                    />
                    {hasError && <p className="inputTypeError">올바르지 않은 형식입니다.</p>}
                </td>

            </tr>
        </>
    );
}

function SpouseFormRow({ index, livingTogether, handleChange }) {

    const [hasError, setHasError] = useState(false);
    const [rowData, setRowData] = useState({
        index: index, relationship: 2,
        livingTogether: livingTogether, houseCount: 0, isMarried: true
    });

    function handleRowChange({ key, value }) {

        const newRowData = { ...rowData, [key]: value };
        setRowData(newRowData);
        handleChange({ index: index, familyRow: newRowData });
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
        const value = formatDateToCustomFormat(e.target.value);
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
                        value={rowData.houseCount || 0}
                        required
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
                        value={rowData.houseSoldDate}
                        onChange={handleChanged}
                        onBlur={handleBlurDate}
                    />
                    {hasError && <p className="inputTypeError">올바르지 않은 형식입니다.</p>}
                </td>

            </tr>
        </>
    );
}

function InputDateType({name, dataName, onChange, required, disabled, value}) {

    const [hasError, setHasError] = useState(false);

    function handleChanged(e) {
        onChange({ key: dataName, value: e.target.value });
    }

    // 폼 Input date 타입 관리
    function handleBlur(e) {

        const value = formatDateToCustomFormat(e.target.value);
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
                minLength={required ? 0 : 8}
                maxLength={8}
            />
            {(hasError && !disabled) && <p className="inputTypeError">올바르지 않은 형식입니다.</p>}
        </>
    );
}