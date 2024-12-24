import axios from "axios";
import { getUserIdFromToken } from "../api/TokenUtils";
import { useEffect } from "react";

function TypeSolution({ type }) {
    
    // 유저 고유 id 가져오기
    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    // 현재 URL에서 houseId 추출
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/');
    const houseId = pathSegments[pathSegments.length - 1];

    // 데이터 요청 함수
    function fetchDate(houseId, userId, type) {
        userId = userId||0;
        axios
            .get(`http://localhost:8989/house/solution/${houseId}/${userId}/${type}`, {
            })
            .then((response) => {
                console.log(response.data.satisfied);
                console.log(response.data.unsatisfied);
                console.log(response.data.solution);
                console.log(response.data.unlogged);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
            });
    };

    useEffect(() => {
        if(type){
            fetchDate(houseId, userId, type);
        }
    }, [type]);


    return (
        <>
            <p>
                {type}
                <br />
                {houseId}
                <br />
                {userId}
            </p>
        </>
    )
}

export default TypeSolution;