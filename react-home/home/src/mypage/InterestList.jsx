import Header from '../common/Header';
import Stack from 'react-bootstrap/Stack';
import Container from 'react-bootstrap/Container';
import Footer from '../common/Footer';
import InterestListContent from './InterestListContent';
import { getUserIdFromToken } from '../api/TokenUtils';

export default function InterestList() {
  const token = localStorage.getItem("accessToken");
  const userId = getUserIdFromToken(token);

  // userId가 없다면 로그인 페이지로 리다이렉트
  if(userId === null) {
    window.location.href = '/login';
    return null; // 사용자 리다이렉트 시 렌더링을 방지
  }

  return (
    <Container className="p-5" fluid="md">
      <Stack direction="vertical" gap={5}>
        <Header />
            <InterestListContent />
        <Footer />
      </Stack>
    </Container>
  );
}
