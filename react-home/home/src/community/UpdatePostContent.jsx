import React, { useEffect, useState } from 'react';
import { getUserIdFromToken } from '../api/TokenUtils';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function UpdatePostContent() {
    const { postId } = useParams();  // URL에서 postId를 가져옴
    const [title, setTitle] = useState('');  // 제목 상태
    const [subject, setSubject] = useState('');  // 내용 상태
    const [loading, setLoading] = useState(true);  // 데이터 로딩 상태

    // 게시글 정보 가져오기
    useEffect(() => {
        // 게시글 데이터 fetch
        fetch(`http://localhost:8989/community/${postId}`)
            .then((res) => res.json())
            .then((data) => {
                setTitle(data.title);  // 제목을 상태에 설정
                setSubject(data.subject);  // 내용을 상태에 설정
                setLoading(false);  // 데이터 로딩 완료
            })
            .catch((err) => {
                console.error("게시글 가져오기 실패:", err);
                setLoading(false);
            });
    }, [postId]);

    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    // 제목 입력 변경 함수
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // 내용 입력 변경 함수
    const handleSubjectChange = (e) => {
        setSubject(e.target.value);
    };

    // 폼 제출 처리
    const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("userId", userId);
    console.log("token", token);
    console.log("title", title);
    console.log("subject", subject);

    const postData = {
        userId,
        title,
        subject,
    };

    try {
        const response = await fetch(`http://localhost:8989/community/${postId}`, {
            method: 'PATCH',  // PATCH 메소드 사용하여 일부 수정
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
            credentials: 'include',
        });

        const data = await response.json();

        // 수정 성공 시, 해당 게시물 페이지로 이동
        if (response.ok) {
            // 응답에서 postId를 받았다면 해당 게시글 페이지로 이동
            window.location.href = `http://localhost:3000/community/${postId}`;
        } else {
            alert("게시글 수정에 실패하였습니다.");
        }
    } catch (error) {
        console.error("게시글 수정 중 오류 발생:", error);
        alert("게시글 수정 중 오류가 발생했습니다.");
    }
};

    // 데이터 로딩 중이라면 로딩 화면을 표시
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="community-posting-content" style={{ width: '90%', margin: '0 auto' }}>
            <p className='heading-text'>게시글 수정</p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* 제목 입력 */}
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input 
                        type="text" 
                        id="title" 
                        className="form-control" 
                        value={title} 
                        onChange={handleTitleChange} 
                        maxLength={85}
                        style={{
                            borderColor: '#d6d6d6',
                            boxShadow: 'none',
                            backgroundColor: 'white'
                        }}
                        required
                    />
                </div>
                <br/>
                {/* 내용 입력 */}
                <div className="form-group">
                    <label htmlFor="subject">내용</label>
                    <textarea 
                        id="subject" 
                        className="form-control" 
                        value={subject} 
                        onChange={handleSubjectChange} 
                        rows="17"
                        maxLength={20000}
                        style={{
                            borderColor: '#d6d6d6',
                            boxShadow: 'none',
                            resize: 'none' 
                        }}
                        required
                    />
                </div>

                <br/>

                {/* 제출/취소 버튼 */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
                    <Button style={{ whiteSpace: 'nowrap', width: '200px' }} variant="dark" type="submit">수정</Button>
                    <Button 
                        onClick={(e) => {
                            e.preventDefault();  // 기본 동작 막기
                            window.location.href = '/community';  // 페이지 이동
                        }} 
                        style={{
                            whiteSpace: 'nowrap',
                            width: '200px',
                            backgroundColor: '#f0f0f0',  // 회색 배경색
                            borderColor: '#f0f0f0',  // 회색 테두리
                            color: 'black'  // 텍스트 색을 흰색으로 설정
                        }}
                    >
                        취소
                    </Button>
                </div>
            </form>
        </div>
    );
}