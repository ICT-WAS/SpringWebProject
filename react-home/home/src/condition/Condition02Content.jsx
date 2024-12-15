import { Button, Dropdown, Form, Stack, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDateToCustomFormat } from "./InputNumberItem";
import { placeholderText } from "./placeholderText";
import { FamilyMember, familyMemberNames } from "./family.ts";

export default function Condition02Content() {

    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);

    /* 제출용 데이터 */
    const [formData1, setFormData1] = useState({});
    const [accountDTOList, setAccountDTOList] = useState({});
    const [familyDataList, setFamilyDataList] = useState([]);
    const [spouseFamilyDataList, setSpouseFamilyDataList] = useState([]);

    const [myData, setMyData] = useState([{ relationship: 1, livingTogether: 1 }]);
    const [spouseData, setSpouseData] = useState([]);

    const [married, setMarried] = useState(0);

    const [hasSeperateHouseSpouse, setHasSeperateHouseSpouse] = useState(false);
    const [userBirth, setUserBirth] = useState(null);

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
        setUserBirth(userData.birthday);

        setMyData([{ relationship: 1, livingTogether: 1 }]);

        if (prevMarried === 0) {
            return;
        }

        if (nextHasSeperateSpouse) {
            setSpouseData([{ relationship: 2, livingTogether: 2 }])
        } else {
            // 배우자 추가
            setSpouseData({ relationship: 2, livingTogether: 1 });
        }

    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 실행

    function handlePrevButtonClick(e) {

        sessionStorage.removeItem('formData1');
        navigate("/condition-1");
    }

    // 세대구성원 추가/수정
    function handleFamilyRowChange({ index, familyRow }) {

        const updatedFamilyData = familyDataList.length > index
            ? familyDataList.map((item, idx) =>
                idx === index ? { ...familyRow } : item // 해당 index에서만 교체
            )
            : [...familyDataList, familyRow]; // 인덱스가 없으면 새로운 항목 추가

        setFamilyDataList(updatedFamilyData);
    }

    // 배우자 세대구성원 추가/수정
    function handleSpouseFamilyRowChange({ index, familyRow }) {

        const updatedFamilyData = spouseFamilyDataList.length > index
            ? spouseFamilyDataList.map((item, idx) =>
                idx === index ? { ...familyRow } : item // 해당 index에서만 교체
            )
            : [...spouseFamilyDataList, familyRow]; // 인덱스가 없으면 새로운 항목 추가

        setSpouseFamilyDataList(updatedFamilyData);
    }

    function handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
            return;
        } 

        let finalFamilyData = [ ...familyDataList, ...myData];
        if(spouseData.length > 0) {
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

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Stack direction='vertical' gap={5} >

                {/* 본인 세대의 세대원 */}
                <FamilyForm married={married} handleChange={handleFamilyRowChange} userBirth={userBirth} hasSeperateHouseSpouse={hasSeperateHouseSpouse} />

                {/* 배우자 세대의 세대원 */}
                {hasSeperateHouseSpouse && <SpouseFamilyForm index={0} married={married} handleChange={handleSpouseFamilyRowChange} />}

                {/* 다음으로 */}
                <Stack direction="horizontal" gap={2}>
                    <Button variant="light" onClick={handlePrevButtonClick} style={{ flex: '1' }} >이전</Button>
                    <Button variant="dark"  type="submit" style={{ flex: '1' }} >다음</Button>
                </Stack>
            </Stack>

        </Form>
        </>
    );
}

/* 본인과의 관계 */
function FamilyRelationshipDropdown({ married, handleChange }) {

    const [slectedItem, setSlectedItem] = useState('선택'); 

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
        return familyList.map((relationship) => (
            <Dropdown.Item key={relationship}
                onClick={() => handleChangedDropdown(relationship)}>
                {familyMemberNames[relationship]}
            </Dropdown.Item>
        ));
    }

    function handleChangedDropdown(relationship) {
        setSlectedItem(familyMemberNames[relationship]);

        handleChange({ key: 'relationship', value: Number(relationship) });

    }

    return (
        <Dropdown style={{ flex: 1 }}>
            <Dropdown.Toggle variant="warning" className='dropdown-transparent flex-fill' >
                {slectedItem}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {relationshipList()}
            </Dropdown.Menu>
        </Dropdown>
    );

}

/* 동거기간 */
function LivingTogetherDateDropdown({ handleChange, required, disabled }) {

    const livingTogetherData = [
        { data: '1년 미만', value: 0 },
        { data: '1년 이상 3년 미만', value: 1 },
        { data: '3년 이상', value: 2 }];

    const livingTogetherDataList = () => {
        return livingTogetherData.map((livingTogether, index) => (
            <option key={index} value={livingTogether.value}>{livingTogether.data}</option>
        ));
    }

    function handleChanged(e) {
        const value = Number(e.target.value);
        handleChange({ key: 'livingTogetherDate', value: value });
    }

    return (
        <Form.Select required={required} disabled={disabled} onChange={handleChanged}>
            <option value="" >선택</option>
            {livingTogetherDataList()}
        </Form.Select>
    );

}

/* 본인 세대의 세대원 */
function FamilyForm({ married, handleChange, userBirth, hasSeperateHouseSpouse }) {

    const [loopCount, setLoopCount] = useState(0);
    const hasSpouse = !hasSeperateHouseSpouse && (married === 1 || married === 2);

    function handleButtonClick() {
        setLoopCount(prev => prev + 1);
    }

    return (
        <>
            본인 세대의 세대구성원
            <Table>
                <thead>
                    <FamilyFormHead />
                </thead>
                <tbody>
                    <SelfFormRow married={married} userBirth={userBirth} />
                    {hasSpouse && <SpouseFormRow />}
                    {Array.from({ length: loopCount }, (_, index) => (
                        <FamilyFormRow index={index} livingTogether={1} married={married} handleChange={handleChange} />
                    ))}

                </tbody>
            </Table>
            <Button variant="light" onClick={handleButtonClick}>동거인 추가</Button>
        </>
    );
}

/* 배우자 세대의 세대원 */
function SpouseFamilyForm({ married, handleChange }) {

    const [loopCount, setLoopCount] = useState(0);

    function handleButtonClick() {
        setLoopCount(prev => prev + 1);
    }

    return (
        <>
            배우자 세대의 세대구성원
            <Table>
                <thead>
                    <FamilyFormHead />
                </thead>
                <tbody>
                    < SpouseFormRow />
                    {Array.from({ length: loopCount }, (_, index) => (
                        <>
                            <FamilyFormRow index={index} livingTogether={2} married={married} handleChange={handleChange} />
                        </>
                    ))}

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

function FamilyFormRow({ livingTogether, index, married, handleChange }) {

    const [familyRowData, setFamilyRowData] = useState({ livingTogether: livingTogether });
    const [relationship, setRelationship] = useState(null);
    const [resetValue, setResetValue] = useState(false);

    const [hasError, setHasError] = useState(false);

    const isRequireBirthday = relationship === FamilyMember.CHILD || relationship === FamilyMember.MOTHER || relationship === FamilyMember.FATHER;
    const isRequireLivingTogetherDate = !(relationship === FamilyMember.UNBORN_CHILD || relationship === FamilyMember.SON_IN_LAW_OR_DAUGHTER_IN_LAW);

    function resetFormData(relationship) {
        setFamilyRowData({
            livingTogether: livingTogether,
            relationship: relationship
        });
    }

    function handleChangeRelation({ key, value }) {

        if(relationship === value) {
            return;
        }

        setRelationship(value);
        resetFormData(value);
        setResetValue(true);
    }

    function handleChangeFormValue({ key, value }) {

        const nextFamilyRowData = (prev) => ({
            ...prev,
            [key]: value
        });

        setFamilyRowData((prev) => nextFamilyRowData(prev));
        handleChange({ index: index, familyRow: nextFamilyRowData(familyRowData) });
    }

    // 폼 Input 타입 관리
    function handleInputChanged(e) {
        const name = e.target.getAttribute('data-name');
        let value = Number(e.target.value);

        if(value < 0) {
            value = 0;
        }

        handleChangeFormValue({ key: name, value: value });
    }

    // 폼 Input date 타입 관리
    function handleDateInputChanged(e) {
        const name = e.target.getAttribute('data-name');
        const value = formatDateToCustomFormat(e.target.value.toString());
        if(value == null) {
            setHasError(true);
        } else {
            setHasError(false);
        }
        
        handleChangeFormValue({ key: name, value: value });
    }

    function handleFocus() {
        if(resetValue) {
            setResetValue(false);
        }
    }

    return (
        <>
            <tr key={index}>

                {/* 관계 */}
                <td>
                    <FamilyRelationshipDropdown index={index} married={married} handleChange={handleChangeRelation} />
                </td>

                {/* 동거기간 */}
                <td>
                    <LivingTogetherDateDropdown handleChange={handleChangeFormValue} 
                        required={isRequireLivingTogetherDate}
                        disabled={!isRequireLivingTogetherDate} />
                </td>

                {/* 생년월일 */}
                <td>
                    <Form.Control
                        type="number"
                        placeholder={placeholderText.dateType}
                        name={`birth-${index}`}
                        data-name={'birthday'}
                        {...(resetValue ? { value: "" } : {})}
                        onFocus={handleFocus}
                        onBlur={handleDateInputChanged}
                        required={isRequireBirthday}
                        disabled={!isRequireBirthday}
                    />
                </td>

                {/* 혼인 여부 */}
                <td>
                    <Form.Check
                        type={'checkbox'}
                        name={`married-${index}`}
                        label={'기혼'}
                        data-name={'isMarried'}
                        {...(resetValue ? { value: "" } : {})}
                        onFocus={handleFocus}
                        id={`married-${index}`}
                        style={{ flex: 1 }}
                        disabled={relationship !== FamilyMember.CHILD}
                    />
                </td>

                {/* 주택/분양권 소유 수 */}
                <td>
                    <Form.Control
                        type="number"
                        placeholder={placeholderText.houseCountType}
                        name={`house-${index}`}
                        data-name={'houseCount'}
                        {...(resetValue ? { value: "" } : {})}
                        onFocus={handleFocus}
                        onBlur={handleInputChanged}
                        required={relationship !== FamilyMember.UNBORN_CHILD}
                        disabled={relationship === FamilyMember.UNBORN_CHILD}
                    />
                </td>

                {/* 주택 처분 날짜 */}
                <td>
                    <Form.Control
                        type="number"
                        placeholder={placeholderText.dateType}
                        name={`houseSold-${index}`}
                        data-name={'houseSoldDate'}
                        {...(resetValue ? { value: "" } : {})}
                        onFocus={handleFocus}
                        onBlur={handleDateInputChanged}
                        disabled={relationship === FamilyMember.UNBORN_CHILD}
                    />
                    {hasError && <p className="inputTypeError">올바르지 않은 형식입니다.</p>}
                </td>

            </tr>
        </>
    );
}

function SelfFormRow({ married, userBirth }) {
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
                        type="number"
                        placeholder={userBirth}
                        disabled
                        readOnly
                    />
                </td>

                {/* 혼인 여부 */}
                <td>
                    {married === 0 ? "미혼" : "기혼"}
                </td>

                {/* 주택/분양권 소유 수 */}
                <td>
                    <Form.Control
                        type="number"
                        placeholder={placeholderText.houseCountType}
                        name={`house`}
                        required
                    />
                </td>

                {/* 주택 처분 날짜 */}
                <td>
                    <Form.Control
                        type="number"
                        placeholder={placeholderText.dateType}
                        name={`houseSold`}
                    />
                </td>

            </tr>
        </>
    );
}

function SpouseFormRow({ index }) {
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
                        name={`birth-${index}`}
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
                        type="number"
                        placeholder={placeholderText.houseCountType}
                        name={`house-${index}`}
                        required
                    />
                </td>

                {/* 주택 처분 날짜 */}
                <td>
                    <Form.Control
                        type="number"
                        placeholder={placeholderText.dateType}
                        name={`houseSold-${index}`}
                    />
                </td>

            </tr>
        </>
    );
}
