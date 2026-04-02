'use client';

import listingStyles from '@/styles/common/table/TableLayout.module.css';
import TableHeader from './TableHeader';
import TablePagination from './TablePagination';

export default function TableLayout({
    children,

    // Header props
    headerProps = {},
    showHeader = true,

    // Pagination props
    paginationProps = {},
    showFooter = true,

    // Additional styling
    className = '',
    containerClassName = '',
}) {
    return (
        <div className={`${listingStyles.tableLayoutContainer} ${containerClassName}`}>
            {/* Header */}
            {showHeader && <TableHeader {...headerProps} />}

            {/* Table Content */}
            <div className={`${listingStyles.tableContent} ${className}`}>
                {children}
            </div>

            {/* Footer */}
            {showFooter && <TablePagination {...paginationProps} />}
        </div>
    );
}