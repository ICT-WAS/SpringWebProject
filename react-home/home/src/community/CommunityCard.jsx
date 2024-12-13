import { Card } from 'react-bootstrap';

export default function CommunityCard({post}) {
    // 제목과 내용을 최대 글자 수로 자르기
    const truncatedTitle = post.title.length > 50 ? post.title.slice(0, 50) + "..." : post.title;
    const truncatedContent = post.subject.length > 60 ? post.subject.slice(0, 60) + "..." : post.subject;

    // 작성일 포맷 변환 (ISO 8601 -> yyyy-MM-dd HH:mm 형식)
    // 작성일 포맷 변환 (ISO 8601 -> yyyy-MM-dd HH:mm 형식)
    const formattedDate = new Date(post.createdAt)
                            .toLocaleString("ko-KR", { hour12: false })
                            .replace(",", "")
                            .replace("T", "")
                            .replaceAll(". ", "-")
                            .slice(0, 17);
    const modifiedDate = formattedDate.slice(0, formattedDate.lastIndexOf("-")) + " " + formattedDate.slice(formattedDate.lastIndexOf("-") + 1);

    return (
        <>
            <Card body>
                {/* 제목과 작성자를 가로로 배치 */}
                <div className="d-flex justify-content-between">
                    <p className="card-header-text" style={{ fontWeight: 'normal' }}>
                        <a href={`/community/${post.postId}`} className="link-body-emphasis link-underline link-underline-opacity-0">
                            {truncatedTitle}
                        </a>
                    </p>
                    <p className="card-body-text" style={{ fontSize: '0.85rem', color: '#6c757d', width: '200px'  }}>
                        {post.user.username}
                    </p>
                </div>

                {/* 내용과 작성일시를 가로로 배치 */}
                <div className="d-flex justify-content-between">
                    <p className="card-body-text" style={{ fontWeight: 'normal' }}>
                        {truncatedContent}
                    </p>
                    <p className="card-body-text" style={{ fontSize: '0.85rem', color: '#6c757d', width: '200px' }}>
                        {modifiedDate}
                    </p>
                </div>
            </Card>
        </>
    );
  }