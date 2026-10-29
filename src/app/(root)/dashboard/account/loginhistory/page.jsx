'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    FiClock,
} from 'react-icons/fi';
import LoginHistoryTable from '@/components/dashboard/account/loginhistory/LoginHistoryTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetLoginHistoryListQuery,
} from '@/services/api/dashboard/account/loginhistory/loginhistoryApi';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { extractErrorMessage } from '@/utils/errorHandler';
import styles from '@/styles/common/CommonListing.module.css';

export default function LoginHistoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('-created_at');
    const [filters, setFilters] = useState({
        success: '',
        login_method: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data, error, isLoading, isFetching, refetch } = useGetLoginHistoryListQuery({
        page: currentPage,
        page_size: pageSize,
        ordering,
        search: debouncedSearch,
        ...filters,
    });

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const handleFilterChange = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    }, []);

    const handleClearFilters = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setFilters({ success: '', login_method: '' });
        setOrdering('-created_at');
        setCurrentPage(1);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    const loginhistory = data?.data?.results || data?.results || [];
    const pagination = data?.data?.pagination || {};
    const totalCount = pagination.total ?? data?.data?.count ?? data?.count ?? 0;
    const totalPages = pagination.total_pages ?? Math.max(1, Math.ceil(totalCount / pageSize));

    const handlePageChange = (p) => {
        if (p >= 1 && p <= totalPages) setCurrentPage(p);
    };
    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const headerFilters = [
        {
            value: filters.success,
            onChange: (v) => handleFilterChange('success', v),
            options: [
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Success' },
                { value: 'false', label: 'Failed' },
            ],
        },
        {
            value: filters.login_method,
            onChange: (v) => handleFilterChange('login_method', v),
            options: [
                { value: '', label: 'All Methods' },
                { value: 'email_password', label: 'Email/Password' },
                { value: 'google', label: 'Google' },
                { value: 'github', label: 'GitHub' },
            ],
        },
        {
            value: ordering,
            onChange: (v) => setOrdering(v),
            options: [
                { value: '-created_at', label: 'Newest First' },
                { value: 'created_at', label: 'Oldest First' },
            ],
        },
    ];

    if (isLoading) return <Loader text="Loading login history..." />;

    if (error) {
        return (
            <ErrorState
                message={extractErrorMessage(error, 'Failed to load login history. Please try again.')}
                errorType="error"
                onRetry={() => refetch()}
                retryMsg="Refresh"
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.pageTitleWrapper}>
                    <FiClock className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>Login History</h1>
                </div>
            </div>

            <TableLayout
                headerProps={{
                    searchTerm,
                    setSearchTerm,
                    filters: headerFilters,
                    activeFilterCount,
                    onClearFilters: handleClearFilters,
                    placeholder: 'Search by user email, IP, or device...',
                    size: 'md',
                    showFilterButton: false,
                }}
                paginationProps={{
                    dataLength: loginhistory.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <LoginHistoryTable
                    loginhistory={loginhistory}
                    isLoading={isFetching}
                />
            </TableLayout>

            {isFetching && loginhistory.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}
