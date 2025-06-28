import React, { useEffect } from "react";
import Pagination from "react-bootstrap/Pagination";
import './style.scss'

const Paginations = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const pagesCount = Math.ceil(itemsCount / itemsPerPage);
  const isCurrentPageFirst = currentPage === 1 || !pagesCount;
  const isCurrentPageLast = currentPage === pagesCount || !pagesCount;

  const changePage = number => {
    if (currentPage === number) return;
    setCurrentPage(number);
  };

  const onPageNumberClick = pageNumber => {
    changePage(pageNumber);
  };

  const onPreviousPageClick = () => {
    changePage(currentPage - 1);
  };

  const onNextPageClick = () => {
    changePage(currentPage + 1);
  };


  let isPageNumberOutOfRange;

  const pageNumbers = [...new Array(pagesCount)].map((_, index) => {
    const pageNumber = index + 1;
    const isPageNumberFirst = pageNumber === 1;
    const isPageNumberLast = pageNumber === pagesCount;
    const isCurrentPageWithinTwoPageNumbers =
      Math.abs(pageNumber - currentPage) <= 2;

    if (
      isPageNumberFirst ||
      isPageNumberLast ||
      isCurrentPageWithinTwoPageNumbers
    ) {
      isPageNumberOutOfRange = false;
      return (
        <Pagination.Item
          key={pageNumber}
          onClick={() => onPageNumberClick(pageNumber)}
          active={pageNumber === currentPage}
        >
          {pageNumber}
        </Pagination.Item>
      );
    }

    if (!isPageNumberOutOfRange) {
      isPageNumberOutOfRange = true;
      return <Pagination.Ellipsis key={pageNumber} className="muted" />;
    }

    return null;
  });

  return (
    <>
        <Pagination size="sm">
          <Pagination.Prev
            onClick={onPreviousPageClick}
            disabled={isCurrentPageFirst}
          >Prev</Pagination.Prev>
          {pageNumbers}
          <Pagination.Next
            onClick={onNextPageClick}
            disabled={isCurrentPageLast}
          >Next</Pagination.Next>
        </Pagination>
    </>
  );
};


export default Paginations;
