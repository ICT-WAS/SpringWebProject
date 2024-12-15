import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ListGroup, Button, Form, Row, Col } from 'react-bootstrap';
import { getUserIdFromToken } from '../api/TokenUtils';

export default function PostDetailContent() {
    const { postId } = useParams();  // URL에서 postId를 가져옵니다.
    const navigate = useNavigate();  // navigate 객체 추가
    const [post, setPost] = useState(null);  // 게시글 정보 상태
    const [comments, setComments] = useState([]);  // 댓글 목록 상태
    const [newComment, setNewComment] = useState("");  // 새 댓글 작성 상태
    const [newReply, setNewReply] = useState("");  // 새 답글 작성 상태
    const [replyTo, setReplyTo] = useState(null);  // 답글을 달 댓글의 ID
    const [count, setCount] = useState();  // 댓글 총 수
    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);
    // 상태 추가: 수정된 댓글과 해당 댓글의 ID
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState("");

    // 댓글 수정 함수
    const handleEditComment = (commentId, currentContent) => {
        setEditingCommentId(commentId);  // 수정 중인 댓글 ID 저장
        setEditedComment(currentContent); // 해당 댓글의 기존 내용을 저장하여 수정할 수 있게 함
    };

    const handleSaveEdit = async (commentId, _userId) => {
        if (_userId !== userId) {
            alert("댓글 작성자가 아닙니다.");
            return; // 댓글 작성자가 아닐 경우 함수 종료
        }
    
        const updatedCommentData = {
            comments: editedComment.replace(/\n/g, "<br>"),  // 줄바꿈을 <br>로 변환
            postId: postId,
            userId: userId,
        };
    
        try {
            const response = await fetch(`http://localhost:8989/community/${commentId}/comment`, {
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCommentData), // 수정된 댓글 데이터
            });
    
            // 서버가 응답을 OK로 반환하면 성공 처리
            if (response.ok) {
                const data = await response.text();
    
                // 댓글 수정 성공 시
                setComments(comments.map((comment) =>
                    comment.commentId === commentId ? { ...comment, comments: editedComment } : comment
                ));
                setEditingCommentId(null);  // 수정 상태 종료
                setEditedComment("");  // 입력 필드 초기화
                alert("댓글이 수정되었습니다.");  // 사용자에게 성공 메시지 표시
            } else {
                const errorMessage = await response.text(); // 실패 메시지 읽기
                alert(errorMessage); // 실패 메시지 표시
            }
        } catch (err) {
            console.error("댓글 수정 실패:", err);
            alert("댓글 수정 중 오류가 발생했습니다.");
        }
    };

    // 댓글 수정 취소 함수
    const handleCancelEdit = () => {
        setEditingCommentId(null);  // 수정 취소
        setEditedComment("");  // 입력 필드 초기화
    };

    // 댓글 삭제 함수 (기존 코드와 동일)
    const handleDeleteComment = (commentId, _userId) => {
        const confirmDelete = window.confirm("이 댓글을 삭제하시겠습니까?");
        if(_userId !== userId){
            console.log(_userId);
            console.log(userId);
            alert("댓글의 작성자가 아닙니다.");
            return;
        }
        if (confirmDelete) {
            fetch(`http://localhost:8989/community/${commentId}/comment`, {
                method: 'DELETE',
            })
            .then((res) => {
                if (res.ok) {
                    setComments(comments.filter(comment => comment.commentId !== commentId));
                    setCount(count-1);
                } else {
                    alert("댓글 삭제에 실패했습니다.");
                }
            })
            .catch((err) => console.error("댓글 삭제 실패:", err));
        }
    };



    // 게시글 정보 가져오기
    useEffect(() => {
        fetch(`http://localhost:8989/community/${postId}`)
            .then((res) => res.json())
            .then((data) => setPost(data))
            .catch((err) => console.error("게시글 가져오기 실패:", err));
    }, [postId]);

    // 댓글 목록 가져오기
    useEffect(() => {
        fetch(`http://localhost:8989/community/${postId}/comments`)
            .then((res) => res.json())
            .then((data) => {
                // 댓글을 일반 댓글과 대댓글로 분리
                const normalComments = [];
                const replies = [];
                setCount(data.length);

                data.forEach((comment) => {
                    if (comment.parentComment) {
                        // 대댓글은 replies 배열에 추가
                        replies.push(comment);
                    } else {
                        // 일반 댓글은 normalComments 배열에 추가
                        normalComments.push(comment);
                    }
                });
                
                // 댓글과 대댓글을 상태에 설정
                setComments(normalComments);

                // 대댓글은 일반 댓글의 replies 배열로 설정
                normalComments.forEach((normalComment) => {
                    normalComment.replies = replies.filter(
                        (reply) => reply.parentComment.commentId === normalComment.commentId
                    );
                });
            })
            .catch((err) => console.error("댓글 가져오기 실패:", err));
    }, [postId]);

    // 댓글 작성 함수
    const handleCommentSubmit = () => {
        const commentData = {
            comments: newComment.replace(/\n/g, "<br>"),  // 줄바꿈을 <br>로 변환
            depth: 1,  // 댓글이므로 depth는 1
            postId: postId,
            userId: userId
        };

        fetch(`http://localhost:8989/community/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData)
        })
            .then((res) => res.json())
            .then((data) => {
                setComments([...comments, data]);  // 새 댓글 추가
                setNewComment("");  // 입력 필드 초기화
                setCount(count+1);
            })
            .catch((err) => console.error("댓글 작성 실패:", err));
    };

    // 답글 작성 함수
    const handleReplySubmit = (commentId) => {
        const replyData = {
            comments: newReply.replace(/\n/g, "<br>"),
            depth: 2,  // 답글이므로 depth는 2
            parentCommentId: commentId,
            postId: postId,
            userId
        };

        fetch(`http://localhost:8989/community/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(replyData)
        })
            .then((res) => res.json())
            .then((data) => {
                // 댓글에 답글 추가
                setComments(comments.map(comment => 
                    comment.commentId === commentId
                        ? { ...comment, replies: [...(comment.replies || []), data] }
                        : comment
                ));
                setNewReply("");  // 입력 필드 초기화
                setReplyTo(null);  // 답글 작성 취소
                setCount(count+1);
            })
            .catch((err) => console.error("답글 작성 실패:", err));
    };

    // 게시글 수정 함수
    const handleEdit = () => {
        if(userId !== post.user.id){
            alert("게시글 작성자가 아닙니다.");
            return;
        }
        navigate(`/community/posting/${postId}`);  // 게시글 수정 페이지로 이동
    };

    // 게시글 삭제 함수
    const handleDelete = () => {
        const confirmDelete = window.confirm("이 게시글을 삭제하시겠습니까?");
        if(userId !== post.user.id){
            alert("게시글 작성자가 아닙니다.");
            return;
        }
        if (confirmDelete) {
            fetch(`http://localhost:8989/community/${postId}`, {
                method: 'DELETE',
            })
            .then((res) => {
                if (res.ok) {
                    navigate("/community");  // 삭제 후 목록 페이지로 리디렉션
                } else {
                    alert("게시글 삭제에 실패했습니다.");
                }
            })
            .catch((err) => console.error("게시글 삭제 실패:", err));
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    const createdDateTime = new Date(post.createdAt)
                                .toLocaleString("ko-KR", { hour12: false })
                                .replace(",", "")
                                .replace("T", "")
                                .replaceAll(". ", "-")
                                .slice(0, 22)
                                .replace("-", "년 ")
                                .replace("-", "월 ")
                                .replace("-", "일 ");

    const updatedDateTime = new Date(post.updatedAt)
                                .toLocaleString("ko-KR", { hour12: false })
                                .replace(",", "")
                                .replace("T", "")
                                .replaceAll(". ", "-")
                                .slice(0, 22)
                                .replace("-", "년 ")
                                .replace("-", "월 ")
                                .replace("-", "일 ");

    return (
        <div style={{ width: '90%', margin: '0 auto' }}>
            {/* 제목 글자 굵기 수정 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontWeight: 'bold', fontSize: '24px'}}>{post.title}</h2>
                
                {/* 수정 및 삭제 버튼 */}
                {post.user && post.user.id === userId && (
                    <div>
                        <Button 
                            variant="link" 
                            onClick={handleEdit} 
                            style={{ marginRight: '10px', borderRadius: '20px', padding: '5px 15px', border: '1px solid black', color: 'black', textDecoration: 'none' }}>
                            수정
                        </Button>

                        <Button 
                            variant="link" 
                            onClick={handleDelete} 
                            style={{ color: 'red', borderRadius: '20px', padding: '5px 15px', border: '1px solid red', textDecoration: 'none' }}>
                            삭제
                        </Button>
                    </div>
                )}
            </div>
            
            <Row className="mb-3">
                <Col style={{ color: 'gray', fontSize: '16px'}}><small>작성일: {createdDateTime}</small></Col>
                
                {/* 수정일이 null일 경우 수정일 정보는 표시되지 않도록 */}
                {post.updatedAt && <Col style={{ color: 'gray', fontSize: '16px'}}><small>수정일: {updatedDateTime}</small></Col>}
                
                {/* 작성자 존재 여부 확인 후 출력 */}
                {post.user && <Col style={{ color: 'gray', fontSize: '16px'}}><small>작성자: {post.user.username}</small></Col>}
            </Row>

            {/* 글과 댓글 간 거리 띄우기 */}
            <div style={{ marginBottom: '50px', fontSize: '18px' }} dangerouslySetInnerHTML={{ __html: post.subject }}></div>

            <h4 style={{ marginTop: '30px', fontSize: '16px' }}>댓글 ({count})</h4>
            {/* 댓글 작성 */}
            <div className="d-flex justify-content-between align-items-stretch" style={{ marginBottom: '30px'}}>
                <Form.Control
                    as="textarea"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 작성해주세요"
                    style={{ width: '85%' }}
                />
                <Button onClick={handleCommentSubmit} className="mt-2" variant="dark" style={{ width: '13%', whiteSpace: 'nowrap' }} disabled={!newComment.trim()}>전송</Button>
            </div>
            
            <ListGroup style={{ marginBottom: '20px' }}>
            {comments.map((comment) => (
                <ListGroup.Item key={comment.commentId} style={{ paddingLeft: comment.parentComment ? '40px' : '0' }}>
                    {/* 댓글 작성자가 존재하는지 확인 후 출력 */}
                    <strong style={{ fontSize: '14px', marginLeft: '10px' }}>{comment.user ? comment.user.username : '알 수 없는 사용자'}</strong>
                    <span style={{ fontSize: '12px', color: 'gray', marginLeft: '4px' }}>
                        ({new Date(comment.createdAt)
                            .toLocaleString("ko-KR", { hour12: false })
                            .replace(",", "")
                            .replace("T", "")
                            .replaceAll(". ", "-")
                            .slice(0, 22)
                            .replace("-", "년 ")
                            .replace("-", "월 ")
                            .replace("-", "일 ")
                        })
                        {/* 수정일이 존재하면 수정일도 표시 */}
                        {comment.updatedAt && (
                            <> / 수정일: {new Date(comment.updatedAt)
                                .toLocaleString("ko-KR", { hour12: false })
                                .replace(",", "")
                                .replace("T", "")
                                .replaceAll(". ", "-")
                                .slice(0, 22)
                                .replace("-", "년 ")
                                .replace("-", "월 ")
                                .replace("-", "일 ")
                            }
                            </>
                        )}
                    </span>

                    {/* 댓글 내용 */}
                    {editingCommentId === comment.commentId ? (
                        <div style={{ width: '90%', margin: '0 auto' }}>
                            {/* 수정할 댓글 내용을 텍스트박스에 넣기 */}
                            <textarea
                                value={editedComment}
                                onChange={(e) => setEditedComment(e.target.value)}
                                rows="3"
                                style={{ width: '100%' }}
                            />
                            <div style={{ marginTop: '10px' }}>
                                <Button style={{ whiteSpace: 'nowrap' }}
                                        variant="dark" 
                                        onClick={() => handleSaveEdit(comment.commentId, comment.user.id)}>저장</Button>
                                <Button variant="secondary" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>취소</Button>
                            </div>
                        </div>
                    ) : (
                        <p style={{ fontSize: '16px', marginLeft: '10px'}} dangerouslySetInnerHTML={{ __html: comment.comments }} />
                    )}

                    {/* 댓글 수정 및 삭제 버튼 (일반 댓글과 대댓글 모두 적용) */}
                    {(comment.user && comment.user.id === userId) && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button 
                                variant="link" 
                                onClick={() => handleEditComment(comment.commentId, comment.comments)} 
                                style={{ marginRight: '10px', borderRadius: '20px', padding: '5px 15px', border: '1px solid black', color: 'black', textDecoration: 'none' }}>
                                수정
                            </Button>
                            <Button 
                                variant="link" 
                                onClick={() => handleDeleteComment(comment.commentId, comment.user.id)} 
                                style={{ color: 'red', borderRadius: '20px', padding: '5px 15px', border: '1px solid red', textDecoration: 'none' }}>
                                삭제
                            </Button>
                        </div>
                    )}

                    {!comment.parentComment && (  // parentComment가 없을 경우에만 버튼을 렌더링
                        <Button 
                            style={{ textDecoration: 'none', color: 'gray' }} 
                            variant="link" 
                            onClick={() => setReplyTo(comment.commentId)}
                        >
                            답글 달기
                        </Button>
                    )}

                    {/* 답글 입력창 추가 */}
                    {replyTo === comment.commentId && (
                        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                            <Form.Control
                                as="textarea"
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                placeholder="답글을 작성해주세요"
                                style={{ flex: 1, marginRight: '10px' }}  // 버튼과 여백을 두기 위해 marginRight 추가
                            />
                            <Button style={{ whiteSpace: 'nowrap' }}
                                    variant="dark"
                                    onClick={() => handleReplySubmit(comment.commentId)} className="mt-2">답글 작성</Button>
                        </div>
                    )}

                    {/* 대댓글 */}
                    {comment.replies && comment.replies.length > 0 && (
                        <ListGroup variant="flush">
                            {comment.replies.map(reply => (
                                <ListGroup.Item key={reply.commentId} style={{ paddingLeft: '40px' }}>
                                    <strong style={{ fontSize: '14px', marginLeft: '10px' }}>{reply.user ? reply.user.username : '알 수 없는 사용자'}</strong>
                                    <span style={{ fontSize: '12px', color: 'gray', marginLeft: '4px' }}>
                                        ({new Date(reply.createdAt)
                                            .toLocaleString("ko-KR", { hour12: false })
                                            .replace(",", "")
                                            .replace("T", "")
                                            .replaceAll(". ", "-")
                                            .slice(0, 22)
                                            .replace("-", "년 ")
                                            .replace("-", "월 ")
                                            .replace("-", "일 ")
                                        })
                                        {/* 수정일이 존재하면 수정일도 표시 */}
                                        {reply.updatedAt && (
                                            <> / 수정일: {new Date(reply.updatedAt)
                                                .toLocaleString("ko-KR", { hour12: false })
                                                .replace(",", "")
                                                .replace("T", "")
                                                .replaceAll(". ", "-")
                                                .slice(0, 22)
                                                .replace("-", "년 ")
                                                .replace("-", "월 ")
                                                .replace("-", "일 ")
                                            }
                                            </>
                                        )}
                                    </span>

                                    {/* 대댓글 내용 */}
                                    {editingCommentId === reply.commentId ? (
                                        <div>
                                            <textarea
                                                value={editedComment}
                                                onChange={(e) => setEditedComment(e.target.value)}
                                                rows="3"
                                                style={{ width: '100%' }}
                                            />
                                            <div style={{ marginTop: '10px' }}>
                                                <Button variant="dark" style={{ whiteSpace: 'nowrap' }} onClick={() => handleSaveEdit(reply.commentId, reply.user.id)}>저장</Button>
                                                <Button variant="secondary" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>취소</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ fontSize: '16px', marginLeft: '10px'}} dangerouslySetInnerHTML={{ __html: reply.comments }} />
                                    )}

                                    {/* 대댓글 수정 및 삭제 버튼 */}
                                    {(reply.user && reply.user.id === userId) && (
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button 
                                                variant="link" 
                                                onClick={() => handleEditComment(reply.commentId, reply.comments)} 
                                                style={{ marginRight: '10px', borderRadius: '20px', padding: '5px 15px', border: '1px solid black', color: 'black', textDecoration: 'none' }}>
                                                수정
                                            </Button>
                                            <Button 
                                                variant="link" 
                                                onClick={() => handleDeleteComment(reply.commentId, reply.user.id)} 
                                                style={{ color: 'red', borderRadius: '20px', padding: '5px 15px', border: '1px solid red', textDecoration: 'none' }}>
                                                삭제
                                            </Button>
                                        </div>
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </ListGroup.Item>
            ))}

            </ListGroup>
        </div>
    );
}
