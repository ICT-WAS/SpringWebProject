import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Pagination } from 'react-bootstrap';

 /* Pagination */
const PaginationItem = forwardRef(({ onPageChanged, totalCount, pageSize }, ref) => {
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const maxPageInScreen = 10;

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalCount / pageSize);  // 전체 페이지 수

  // 10개 단위로 페이지 범위 계산
  const rangeStart = Math.floor((currentPage - 1) / maxPageInScreen) * maxPageInScreen + 1;  // 현재 페이지를 기준으로 시작 페이지
  const rangeEnd = Math.min(rangeStart + maxPageInScreen - 1, totalPages);  // 시작 페이지 + 9 (최대 10개까지 표시)

  const resetPage = (filter) => {
    setCurrentPage(1);
    onPageChanged(1, filter);
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
            disabled={currentPage <= 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange((Math.trunc(currentPage / maxPageInScreen) - 1) * maxPageInScreen + 1)}
            disabled={currentPage - maxPageInScreen < 1}
          />
          {paginationItems}
          <Pagination.Next
            onClick={() => handlePageChange((Math.trunc((currentPage - 1) / maxPageInScreen) + 1 ) * maxPageInScreen + 1)}
            disabled={ Math.trunc((currentPage - 1) / maxPageInScreen) >= Math.trunc((totalPages - 1) / maxPageInScreen) }
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages}
          />
        </Pagination>
      </div>
    </>
  );
});

export default PaginationItem;