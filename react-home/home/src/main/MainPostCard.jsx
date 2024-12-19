import { Card } from 'react-bootstrap';

export default function MainPostCard({post}) {
    // 제목과 내용을 최대 글자 수로 자르기
    
    const truncatedTitle = post.title.length > 15 ? post.title.slice(0, 15) + "..." : post.title;
    const truncatedContent = post.subject.length > 20 ? post.subject.slice(0, 20) + "..." : post.subject;
    const truncatedContent2 = truncatedContent.replaceAll("<br>", "   ").replaceAll("<b", " ");

    return (
        <>
            <Card body>
                <div className="d-flex justify-content-between">
                    <p className="card-header-text" style={{ fontWeight: 'normal', userSelect: 'none' }}>
                        <a href={`/community/${post.postId}`} className="link-body-emphasis link-underline link-underline-opacity-0">
                            {truncatedTitle}
                        </a>
                    </p>
                    <p className="card-body-text" style={{ fontSize: '0.85rem', color: '#6c757d', width: '200px'  }}>
                    </p>
                </div>

                <div className="d-flex justify-content-between">
                    <p className="card-body-text" style={{ fontWeight: 'normal', userSelect: 'none'  }}>
                        {truncatedContent2}
                    </p>
                    <p className="card-body-text" style={{ fontSize: '0.85rem', color: '#6c757d', width: '200px' }}>
                    </p>
                </div>
            </Card>
        </>
    );
  }