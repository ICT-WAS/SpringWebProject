import axios from 'axios';
import { useEffect, useState } from "react";
import { Container, Stack } from 'react-bootstrap';
import Spinners from '../common/Spinners';
import { getUserIdFromToken } from '../api/TokenUtils';
import CommunityCard from '../community/CommunityCard';

export default function CollectionCommentPostContent() {

     const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    const [comments, setComments] = useState([]);
    const [totalCount, setTotalCount] = useState();
    const [loading, setLoading] = useState(false);

    const fetchPosts = () => {
        setLoading(true);
        axios
            .get(`http://localhost:8989/community/comments/${userId}`)
            .then((response) => {
                const nextComments = response.data.map(comment => ({
                    ...comment,
                    title: comment.comments,
                    subject: "",
                    postId: comment.post.postId,
                    post: undefined,
                  }));

                  console.log(nextComments)

                setComments(nextComments);
                setTotalCount(response.data?.length);
                setLoading(false);
            })
            .catch((error) => {
                console.error("데이터 요청 실패:", error);
                setLoading(false);
            });
    };


    useEffect(() => {
        fetchPosts();
    }, []);


    return (
        <>
        <Container className="px-5" fluid="md">
            <Stack direction='vertical' gap={3}>

                <p className='heading-text'>
                    내가 쓴 댓글
                </p>

                <p className='card-body-text' >{totalCount || 0} 건</p>
                {loading && <Spinners />}
                {totalCount < 1 && <p className='filter-values'>작성한 댓글이 없습니다.</p>}
                <Comments comments={comments} />
            </Stack>
            </Container>
        </>
    );
}

function Comments({ comments }) {
    return comments.map((comment) => (
        <div key={comment.commentId}>
            <CommunityCard post={comment} />
        </div>
    ));
}
