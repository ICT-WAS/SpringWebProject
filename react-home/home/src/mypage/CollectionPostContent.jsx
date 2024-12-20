import axios from 'axios';
import { useEffect, useState } from "react";
import CommunityCard from '../main/MainPostCard';
import { Container, Stack } from 'react-bootstrap';
import Spinners from '../common/Spinners';
import { getUserIdFromToken } from '../api/TokenUtils';

export default function CollectionPostContent() {

    const token = localStorage.getItem("accessToken");
    const userId = getUserIdFromToken(token);

    const [posts, setPosts] = useState([]);
    const [totalCount, setTotalCount] = useState();
    const [loading, setLoading] = useState(false);

    const fetchPosts = () => {
        setLoading(true);
        axios
            .get(`http://localhost:8989/community/posts/${userId}`)
            .then((response) => {
                setPosts(response.data);
                setTotalCount(response.data?.length);
                setLoading(false);

                
                console.log(response.data.content);
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
                    내가 쓴 글
                </p>
                
                <p className='card-body-text' >{totalCount || 0} 건</p>
                {loading && <Spinners />}
                {totalCount < 1 && <p className='filter-values'>작성한 글이 없없습니다.</p>}
                <Posts posts={posts} />
            </Stack>
            </Container>
        </>
    );
}

function Posts({ posts }) {
    return posts.map((post) => (
        <div key={post.postId}>
            <CommunityCard post={post} />
        </div>
    ));
}
