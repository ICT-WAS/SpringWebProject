import { Card } from 'react-bootstrap';

export default function CommunityCard({community}) {
    return (
      <>
        <Card body>
          <p className='card-header-text'>
            <a href='#' className='link-body-emphasis link-underline link-underline-opacity-0' >
            {community.title}
            </a>
            </p>
          <p className='card-body-text'>{community.content}</p>
        </Card>
      </>
    );
  }