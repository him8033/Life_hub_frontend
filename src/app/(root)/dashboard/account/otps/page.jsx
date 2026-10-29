'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    FiLock,
} from 'react-icons/fi';
import OTPTable from '@/components/dashboard/account/otps/OTPTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetOTPListQuery,
} from '@/services/api/dashboard/account/otps/otpApi';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { extractErrorMessage } from '@/utils/errorHandler';
import styles from '@/styles/common/CommonListing.module.css';

export default function OTPsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('-created_at');
    const [filters, setFilters] = useState({
        is_used: '',
        purpose: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data, error, isLoading, isFetching, refetch } = useGetOTPListQuery({
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
        setFilters({ is_used: '', purpose: '' });
        setOrdering('-created_at');
        setCurrentPage(1);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    const otps = data?.data?.results || data?.results || [];
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
            value: filters.is_used,
            onChange: (v) => handleFilterChange('is_used', v),
            options: [
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Used' },
                { value: 'false', label: 'Pending' },
            ],
        },
        {
            value: filters.purpose,
            onChange: (v) => handleFilterChange('purpose', v),
            options: [
                { value: '', label: 'All Purposes' },
                { value: 'email-verification', label: 'Email Verification' },
                { value: 'password-reset', label: 'Password Reset' },
                { value: 'phone-verification', label: 'Phone Verification' },
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

    if (isLoading) return <Loader text="Loading OTP records..." />;

    if (error) {
        return (
            <ErrorState
                message={extractErrorMessage(error, 'Failed to load OTP records. Please try again.')}
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
                    <FiLock className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>OTP Records</h1>
                </div>
            </div>

            <TableLayout
                headerProps={{
                    searchTerm,
                    setSearchTerm,
                    filters: headerFilters,
                    activeFilterCount,
                    onClearFilters: handleClearFilters,
                    placeholder: 'Search by user email or purpose...',
                    size: 'md',
                    showFilterButton: false,
                }}
                paginationProps={{
                    dataLength: otps.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <OTPTable
                    otps={otps}
                    isLoading={isFetching}
                />
            </TableLayout>

            {isFetching && otps.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}
