import axios from "axios";
import { getUserIdFromToken } from "../api/TokenUtils";
import { useEffect, useState } from "react";
import RecommandedButton from "./RecommandedButton";

function TypeSolution({ type }) {

    // 유저 고유 id 가져오기
    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    // 현재 URL에서 houseId 추출
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/');
    const houseId = pathSegments[pathSegments.length - 1];

    const [satisfied, setSatisfied] = useState([]);
    const [unsatisfied, setUnsatisfied] = useState([]);
    const [solution, setSolution] = useState([]);
    const [unlogged, setUnlogged] = useState([]);
    const [checkCondition, setCheckCondition] = useState([]);

    // 데이터 요청 함수
    function fetchDate(houseId, userId, type) {
        userId = userId || 0;
        axios
            .get(`http://localhost:8989/house/solution/${houseId}/${userId}/${type}`, {
            })
            .then((response) => {
                setSatisfied(response.data.satisfied);
                setUnsatisfied(response.data.unsatisfied);
                setSolution(response.data.solution);
                setUnlogged(response.data.unlogged);
                setCheckCondition(response.data.checkCondition);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
            });
    };

    useEffect(() => {
        if (type) {
            fetchDate(houseId, userId, type);
        }
    }, [houseId, userId, type]);

    return (
        <>
            <p>
                <p className="heading-text">{type} 공급 조건</p>
                {(userId === 0 || userId === null) && (
                    <>
                    <p>로그인을 하면 정확한 진단이 가능합니다.</p>
                        {unlogged.map((message, index) => (
                            <div key={index}><p className="card-body-text" style={{color: 'black'}}>▷{message}</p></div>
                        ))}
                    </>
                )}

                {(userId !== 0 && userId !== null) && (
                    <>
                    {(checkCondition.length < 1) && (
                        <>
                        <p>조건을 등록하면 정확한 진단이 가능합니다.</p>
                        {unlogged.map((message, index) => (
                            <div key={index}><p className="card-body-text" style={{color: 'black'}}>▷{message}</p></div>
                        ))}
                        {type==="기관추천" && (
                            <>
                            <hr/>
                            <p className="heading-text" style={{fontSize: '20px'}}>※기관추천 특별공급은 별도로 대상자 여부를 확인해야합니다.</p>
                                <RecommandedButton/>
                            </>
                        )}
                        </>
                    )}

                    {(checkCondition.length === 1) && (
                        <>
                        {satisfied.length >= 1 && (
                            <>
                            <hr/>
                            <p className="heading-text" style={{fontSize: '20px'}}>충족하는 조건</p>
                            {satisfied.map((message, index) => (
                                <div key={index}><p className="card-body-text" style={{color: 'black'}}>▷{message}</p></div>
                            ))}
                            </>
                        )}
                        
                        {unsatisfied.length >= 1 && (
                            <>
                            <hr/>
                            <p className="heading-text" style={{fontSize: '20px'}}>충족하지 못하는 조건</p>
                            {unsatisfied.map((message, index) => (
                                <div key={index}><p className="card-body-text" style={{color: 'black'}}>▷{message}</p></div>
                            ))}
                            </>
                        )}

                        {solution.length >= 1 && (
                            <>
                            <hr/>
                            <p className="heading-text" style={{fontSize: '20px'}}>맞춤형 솔루션</p>
                            {solution.map((message, index) => (
                                <div key={index}><p className="card-body-text" style={{color: 'black'}}>▷{message}</p></div>
                            ))}
                            </>
                        )}

                        {type==="기관추천" && (
                            <>
                            <hr/>
                            <p className="heading-text" style={{fontSize: '20px'}}>※기관추천 특별공급은 별도로 대상자 여부를 확인해야합니다.</p>
                                <RecommandedButton/>
                            </>
                        )}
                        
                        </>
                        
                    )}
                    </>
                )}
            </p>
        </>
    )
}

export default TypeSolution;