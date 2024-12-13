import { Button, Container, Dropdown, Form, Row, Stack, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FamilyInputNumberSubItem, formatDateToCustomFormat, InputNumberItem, InputNumberLoopSubItemWithFollowQuestions, InputNumberSubItem } from "./InputNumberItem";
import { FamilyRadioButtonSubItem, RadioButtonItem, RadioButtonSubItem } from "./RadioButtonItem";
import { CheckButtonSubItem, CheckButtonSubItemWithFollowQuestions } from "./CheckButtonItem";
import { placeholderText } from "./placeholderText";
import { familyList, FamilyMember, familyMemberNames, getEnumKeyFromValue } from "./family.ts";

export default function Condition02Content() {

    const navigate = useNavigate();
    const [married, setMarried] = useState(0);

    /* 제출용 데이터 */
    const [formData1, setFormData1] = useState({});

    const [myData, setMyData] = useState([{ relationship: 1, livingTogether: 1 }]);
    const [spouseData, setSpouseData] = useState([]);
    const [familyData, setFamilyData] = useState([]);
    const [spouseFamilyData, setSpouseFamilyData] = useState([]);
    const [hasSeperateHouseSpouse, setHasSeperateHouseSpouse] = useState(false);
    const [userBirth, setUserBirth] = useState(null);

    useEffect(() => {
        /* 이전 폼 데이터 읽어오기 */
        
        const sessionData = sessionStorage.getItem('formData1');
        if (!sessionData) return;

        let userData = null;
        try {
            userData = JSON.parse(sessionData);
            setFormData1(userData);
        } catch (error) { }

        const nextHasSeperateSpouse = userData.spouse === 'N';
        const prevMarried = Number(userData.married);
        setMarried(prevMarried);
        setHasSeperateHouseSpouse(nextHasSeperateSpouse);
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

    function handleNextButtonClick(e) {

        let finalFamilyData = [ ...familyData, ...myData];
        if(spouseData.length > 0) {
            finalFamilyData = [...finalFamilyData, ...spouseData];
        }
        
        const finalHasSpouse = (married === 1 || married === 2);

        sessionStorage.removeItem('hasSpouse');

        sessionStorage.setItem('hasSpouse', finalHasSpouse);
        sessionStorage.setItem('familyData', JSON.stringify(finalFamilyData));
        sessionStorage.setItem('formData1', JSON.stringify(formData1));

        navigate("/condition-3");
    }

    // 세대구성원 추가/수정
    function handleFamilyRowChange({ index, familyRow }) {

        const updatedFamilyData = familyData.length > index
            ? familyData.map((item, idx) =>
                idx === index ? { ...familyRow } : item // 해당 index에서만 교체
            )
            : [...familyData, familyRow]; // 인덱스가 없으면 새로운 항목 추가

        setFamilyData(updatedFamilyData);
    }

    // 배우자 세대구성원 추가/수정
    function handleSpouseFamilyRowChange({ index, familyRow }) {

        const updatedFamilyData = spouseFamilyData.length > index
            ? spouseFamilyData.map((item, idx) =>
                idx === index ? { ...familyRow } : item // 해당 index에서만 교체
            )
            : [...spouseFamilyData, familyRow]; // 인덱스가 없으면 새로운 항목 추가

        setSpouseFamilyData(updatedFamilyData);
    }

    return (
        <Form>
            <Stack direction='vertical' gap={5} >

                {/* 본인 세대의 세대원 */}
                <FamilyForm married={married} handleChange={handleFamilyRowChange} userBirth={userBirth} hasSeperateHouseSpouse={hasSeperateHouseSpouse} />

                {/* 배우자 세대의 세대원 */}
                {hasSeperateHouseSpouse && <SpouseFamilyForm index={0} married={married} handleChange={handleSpouseFamilyRowChange} />}

                {/* 다음으로 */}
                <Stack direction="horizontal" gap={2}>
                    <Button variant="light" onClick={handlePrevButtonClick} style={{ flex: '1' }} >이전</Button>
                    <Button variant="dark" onClick={handleNextButtonClick} style={{ flex: '1' }} >다음</Button>
                </Stack>
            </Stack>

        </Form>
    );
}

{/* 본인과의 관계 드롭다운 */ }
function FamilyRelationshipDropdown({ married, handleChange }) {

    const [slectedItem, setSlectedItem] = useState('선택');     // 한글
    const [slectedValue, setSlectedValue] = useState(0);   // 숫자값

    // 미혼 3~8
    const notMarriedFamilyList = Object.keys(FamilyMember).filter(key =>
        (typeof FamilyMember[key] !== 'number') && key > 2 && key < 8
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
        (typeof FamilyMember[key] !== 'number') && key > 2 && key < 13
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
        setSlectedValue(relationship);

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

{/* 동거기간 드롭다운 */ }
function LivingTogetherDateDropdown({ handleChange }) {

    const [slectedItem, setSlectedItem] = useState('선택');     // 한글

    const livingTogetherData = [
        { data: '1년 미만', value: 0 },
        { data: '1년 이상 3년 미만', value: 1 },
        { data: '3년 이상', value: 2 }];

    const livingTogetherDataList = () => {
        return livingTogetherData.map((livingTogether) => (
            <Dropdown.Item key={livingTogether}
                data-value={livingTogether.value}
                data-name={livingTogether.data}
                onClick={(e) => handleChangedDropdown(e)}>
                {livingTogether.data}
            </Dropdown.Item>
        ));
    }

    function handleChangedDropdown(e) {
        const value = e.target.getAttribute('data-value');
        const name = e.target.getAttribute('data-name');
        setSlectedItem(name);

        handleChange({ key: 'livingTogetherDate', value: Number(value) });
    }

    return (
        <Dropdown style={{ flex: 1 }}>
            <Dropdown.Toggle variant="warning" className='dropdown-transparent flex-fill' >
                {slectedItem}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {livingTogetherDataList()}
            </Dropdown.Menu>
        </Dropdown>
    );

}

{/* 본인 세대의 세대원 */ }
function FamilyForm({ married, handleChange, userBirth, hasSeperateHouseSpouse }) {

    const [loopCount, setLoopCount] = useState(0);
    const hasSpouse = !hasSeperateHouseSpouse && (married == 1 || married == 2);

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
                        <>
                            <FamilyFormRow index={index} livingTogether={1} married={married} handleChange={handleChange} />
                        </>
                    ))}

                </tbody>
            </Table>
            <Button variant="light" onClick={handleButtonClick}>동거인 추가</Button>
        </>
    );
}

{/* 배우자 세대의 세대원 */ }
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

    function handleChangeFormValue({ key, value }) {

        const nextFamilyRowData = {
            ...familyRowData,
            [key]: value
        };

        setFamilyRowData(nextFamilyRowData);
        handleChange({ index: index, familyRow: nextFamilyRowData });
    }

    // 폼 Input 타입 관리
    function handleInputChanged(e) {
        const name = e.target.getAttribute('data-name');
        const value = e.target.value;

        handleChangeFormValue({ key: name, value: value });
    }

    // 폼 Input date 타입 관리
    function handleDateInputChanged(e) {
        const name = e.target.getAttribute('data-name');
        const value = formatDateToCustomFormat(e.target.value);
        
        handleChangeFormValue({ key: name, value: value });
    }

    return (
        <>
            <tr key={index}>

                {/* 관계 */}
                <td>
                    <FamilyRelationshipDropdown index={index} married={married} handleChange={handleChangeFormValue} />
                </td>

                {/* 동거기간 */}
                <td>
                    <LivingTogetherDateDropdown handleChange={handleChangeFormValue} />
                </td>

                {/* 생년월일 */}
                <td>
                    <Form.Control
                        type="number"
                        placeholder={placeholderText.dateType}
                        name={`birth-${index}`}
                        data-name={'birthday'}
                        required
                        onBlur={handleDateInputChanged}
                    />
                </td>

                {/* 혼인 여부 */}
                <td>
                    <Form.Check
                        type={'checkbox'}
                        name={`married-${index}`}
                        label={'기혼'}
                        data-name={'isMarried'}
                        id={`married-${index}`}
                        style={{ flex: 1 }}
                    />
                </td>

                {/* 주택/분양권 소유 수 */}
                <td>
                    <Form.Control
                        type="number"
                        placeholder={placeholderText.houseCountType}
                        name={`house-${index}`}
                        data-name={'houseCount'}
                        onBlur={handleInputChanged}
                        required
                    />
                </td>

                {/* 주택 처분 날짜 */}
                <td>
                    <Form.Control
                        type="number"
                        placeholder={placeholderText.dateType}
                        name={`houseSold-${index}`}
                        data-name={'houseSoldDate'}
                        onBlur={handleDateInputChanged}
                        required
                    />
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
                        required
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
                        required
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
                        required
                    />
                </td>

            </tr>
        </>
    );
}
