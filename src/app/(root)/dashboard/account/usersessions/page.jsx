'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    FiMonitor,
} from 'react-icons/fi';
import UserSessionTable from '@/components/dashboard/account/usersessions/UserSessionTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetUserSessionListQuery,
    useRevokeUserSessionMutation,
} from '@/services/api/dashboard/account/usersessions/usersessionApi';
import { useConfirm } from '@/context/ConfirmContext';
import { useSnackbar } from '@/context/SnackbarContext';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { extractErrorMessage } from '@/utils/errorHandler';
import styles from '@/styles/common/CommonListing.module.css';

export default function UserSessionsPage() {
    const confirm = useConfirm();
    const { showSnackbar } = useSnackbar();

    const [revokeUserSession] = useRevokeUserSessionMutation();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('-created_at');
    const [filters, setFilters] = useState({
        is_active: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isRevoking, setIsRevoking] = useState(false);

    const { data, error, isLoading, isFetching, refetch } = useGetUserSessionListQuery({
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
        setFilters({ is_active: '' });
        setOrdering('-created_at');
        setCurrentPage(1);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    const handleRevokeSession = async (usersession_id, user_email) => {
        try {
            setIsRevoking(true);
            const ok = await confirm({
                title: 'Revoke Session',
                message: `Are you sure you want to revoke ${user_email}'s session? This will force the user to log in again.`,
                confirmText: 'Revoke',
                cancelText: 'Cancel',
                type: 'warning',
            });

            if (!ok) return;

            await revokeUserSession({
                usersession_id,
                reason: 'Revoked by admin',
            }).unwrap();
            showSnackbar('Session revoked successfully', 'success', 5000);
            refetch();
        } catch (err) {
            const msg =
                err.data?.non_field_errors?.[0] ||
                err.data?.message ||
                'Failed to revoke session';
            showSnackbar(msg, 'error', 5000);
        } finally {
            setIsRevoking(false);
        }
    };

    const usersessions = data?.data?.results || data?.results || [];
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
            value: filters.is_active,
            onChange: (v) => handleFilterChange('is_active', v),
            options: [
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Revoked' },
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

    if (isLoading) return <Loader text="Loading user sessions..." />;

    if (error) {
        return (
            <ErrorState
                message={extractErrorMessage(error, 'Failed to load user sessions. Please try again.')}
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
                    <FiMonitor className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>User Sessions</h1>
                </div>
            </div>

            <TableLayout
                headerProps={{
                    searchTerm,
                    setSearchTerm,
                    filters: headerFilters,
                    activeFilterCount,
                    onClearFilters: handleClearFilters,
                    placeholder: 'Search by user email, device, or IP...',
                    size: 'md',
                    showFilterButton: false,
                }}
                paginationProps={{
                    dataLength: usersessions.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <UserSessionTable
                    usersessions={usersessions}
                    onRevoke={handleRevokeSession}
                    isLoading={isRevoking || isFetching}
                />
            </TableLayout>

            {isFetching && usersessions.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}
