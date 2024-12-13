import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Pagination } from 'react-bootstrap';

 /* Pagination */
const PaginationItem = forwardRef(({ onPageChanged, totalCount, pageSize }, ref) => {
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalCount / pageSize);  // 전체 페이지 수

  // 10개 단위로 페이지 범위 계산
  const rangeStart = Math.floor((currentPage - 1) / 10) * 10 + 1;  // 현재 페이지를 기준으로 시작 페이지
  const rangeEnd = Math.min(rangeStart + 9, totalPages);  // 시작 페이지 + 9 (최대 10개까지 표시)

  const resetPage = () => {
    handlePageChange(1);
  };

  // 부모에게 메서드를 expose
  useImperativeHandle(ref, () => ({
    resetPage,
  }));

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    onPageChanged(pageNumber);
  };

  // 페이지 아이템 생성
  const paginationItems = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <>
      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <Pagination className="custom-pagination">
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {paginationItems}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </>
  );
});

export default PaginationItem;