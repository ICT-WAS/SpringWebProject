import React from 'react';

const RecommandedButton = () => {
    return (
      <a
        href="https://www.easylaw.go.kr/CSP/CnpClsMain.laf?csmSeq=1773&ccfNo=2&cciNo=1&cnpClsNo=4"
        target="_blank"          // 새 탭에서 열기
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          backgroundColor: 'black',  // 검정색 배경
          color: 'white',            // 텍스트 색상
          padding: '10px 20px',      // 버튼 크기
          textDecoration: 'none',    // 링크의 밑줄 제거
          textAlign: 'center',       // 텍스트 중앙 정렬
          borderRadius: '4px',       // 모서리 둥글게
        }}
      >
        대상자 확인하러 가기
      </a>
    );
  };
  
  export default RecommandedButton;