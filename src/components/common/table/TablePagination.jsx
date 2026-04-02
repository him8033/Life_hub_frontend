'use client';

import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import listingStyles from '@/styles/common/table/TablePagination.module.css';

export default function TablePagination({
    dataLength = 0,
    totalCount = 0,
    currentPage = 1,
    totalPages = 1,
    pageSize = 10,
    onPageChange,
    onPageSizeChange,
    isFetching = false,
    showPageSizeSelector = true,
    showResultsInfo = true,
}) {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const handlePageSizeChange = (e) => {
        if (onPageSizeChange) {
            onPageSizeChange(parseInt(e.target.value));
        }
    };

    if (totalCount === 0) return null;

    return (
        <div className={listingStyles.paginationContainer}>
            {/* Results Info and Page Size Selector */}
            <div className={listingStyles.paginationTop}>
                {showResultsInfo && (
                    <div className={listingStyles.resultsInfo}>
                        <span className={listingStyles.resultsCount}>
                            Showing <strong>{dataLength}</strong> of <strong>{totalCount}</strong> results
                        </span>
                        {totalPages > 0 && (
                            <span className={listingStyles.pageIndicator}>
                                Page {currentPage} of {totalPages}
                            </span>
                        )}
                    </div>
                )}

                {showPageSizeSelector && (
                    <div className={listingStyles.pageSizeSelector}>
                        <label>Show:</label>
                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className={listingStyles.pageSizeSelect}
                            disabled={isFetching}
                        >
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className={listingStyles.paginationControls}>
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1 || isFetching}
                        className={listingStyles.paginationBtn}
                        title="First page"
                    >
                        <FaAngleDoubleLeft />
                    </button>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isFetching}
                        className={listingStyles.paginationBtn}
                        title="Previous page"
                    >
                        <FaChevronLeft />
                    </button>

                    <div className={listingStyles.pageNumbers}>
                        {getPageNumbers().map((page, index) => (
                            page === '...' ? (
                                <span key={index} className={listingStyles.pageDots}>...</span>
                            ) : (
                                <button
                                    key={index}
                                    onClick={() => onPageChange(page)}
                                    disabled={isFetching}
                                    className={`${listingStyles.pageNumber} ${currentPage === page ? listingStyles.activePage : ''}`}
                                >
                                    {page}
                                </button>
                            )
                        ))}
                    </div>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || isFetching}
                        className={listingStyles.paginationBtn}
                        title="Next page"
                    >
                        <FaChevronRight />
                    </button>
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages || isFetching}
                        className={listingStyles.paginationBtn}
                        title="Last page"
                    >
                        <FaAngleDoubleRight />
                    </button>
                </div>
            )}
        </div>
    );
}