import React, { useState } from 'react';
import { getUserIdFromToken } from '../api/TokenUtils';
import { Button } from 'react-bootstrap';

export default function CommunityPostingContent() {
    // 제목과 내용 상태를 관리
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
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
            const response = await fetch('http://localhost:8989/community', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
                credentials: 'include',
            });

            const data = await response.json();

            // 응답에서 postId를 받았을 때
            if (data.postId) {
                // 성공적으로 게시물 작성된 경우, 해당 게시물로 이동
                window.location.href = `http://localhost:3000/community/${data.postId}`;
            } else {
                // postId가 없으면 알림
                alert("게시글 등록에 실패하였습니다.");
            }
        } catch (error) {
            console.error("게시글 작성 중 오류 발생:", error);
            alert("게시글 작성 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="community-posting-content">
            <p className='heading-text'>새 글 작성</p>
            
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
                    <input type='hidden' name={`${userId}`} value={userId} required></input>
                </div>

                <br/>

                {/* 제출/취소 버튼 */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
                    <Button style={{ whiteSpace: 'nowrap', width: '200px' }} variant="dark" type="submit">등록</Button>
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
