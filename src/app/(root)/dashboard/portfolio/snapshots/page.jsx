'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SnapshotTable from '@/components/portfolio/SnapshotTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetSnapshotsQuery,
    useDeleteSnapshotMutation,
    useDuplicateSnapshotMutation,
} from '@/services/api/portfolioApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { FiFolder } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';
import styles from '@/styles/common/CommonListing.module.css';

export default function PortfolioPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('-created_at');
    const [filters, setFilters] = useState({
        visibility: '',
        // is_template: '',
        // is_public: '',
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Operation states
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);

    // API hooks
    const {
        data,
        error,
        isLoading,
        isFetching,
        refetch
    } = useGetSnapshotsQuery({
        page: currentPage,
        page_size: pageSize,
        ordering,
        search: debouncedSearch,
        ...filters,
    });

    const [deleteSnapshot] = useDeleteSnapshotMutation();
    const [duplicateSnapshot] = useDuplicateSnapshotMutation();

    // Count active filters
    const activeFilterCount = Object.values(filters).filter(value => value).length + (debouncedSearch ? 1 : 0);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle filter changes
    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setCurrentPage(1);
    }, []);

    const handleClearFilters = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setFilters({
            visibility: '',
            // is_template: '',
            // is_public: '',
        });
        setOrdering('-created_at');
        setCurrentPage(1);
    };

    const handleDelete = async (snapshotId, title) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Snapshot',
                message: `Are you sure you want to delete "${title}"? This action cannot be undone. All associated data will be permanently removed.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger',
            });

            if (!ok) return;

            await deleteSnapshot(snapshotId).unwrap();
            showSnackbar('Snapshot deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            const errorMsg = extractErrorMessage(error, 'Failed to delete snapshot. Please try again.');
            showSnackbar(errorMsg, 'error', 5000);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDuplicate = async (snapshotId, title) => {
        try {
            setIsDuplicating(true);
            const ok = await confirm({
                title: 'Duplicate Snapshot',
                message: `Are you sure you want to duplicate "${title}"? A new copy will be created with all data.`,
                confirmText: 'Duplicate',
                cancelText: 'Cancel',
                type: 'info',
            });

            if (!ok) return;

            await duplicateSnapshot(snapshotId).unwrap();
            showSnackbar(`"${title}" duplicated successfully`, 'success', 5000);
            refetch();
        } catch (error) {
            const errorMsg = extractErrorMessage(error, 'Failed to duplicate snapshot. Please try again.');
            showSnackbar(errorMsg, 'error', 5000);
        } finally {
            setIsDuplicating(false);
        }
    };

    // Calculate pagination data
    const snapshots = data?.data?.results || [];
    const totalCount = data?.data?.count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    // Define filters for header
    const headerFilters = [
        {
            value: ordering,
            onChange: (value) => setOrdering(value),
            options: [
                { value: '-created_at', label: 'Newest First' },
                { value: 'created_at', label: 'Oldest First' },
                { value: 'title', label: 'Title A-Z' },
                { value: '-title', label: 'Title Z-A' },
                // { value: '-updated_at', label: 'Recently Updated' },
                { value: '-version', label: 'Highest Version' },
            ],
        },
        {
            value: filters.visibility,
            onChange: (value) => handleFilterChange('visibility', value),
            options: [
                { value: '', label: 'All Visibility' },
                { value: 'private', label: 'Private' },
                { value: 'public', label: 'Public' },
            ],
        },
        // {
        //     value: filters.is_template,
        //     onChange: (value) => handleFilterChange('is_template', value),
        //     options: [
        //         { value: '', label: 'All Types' },
        //         { value: 'true', label: 'Templates' },
        //         { value: 'false', label: 'Regular' },
        //     ],
        // },
        // {
        //     value: filters.is_public,
        //     onChange: (value) => handleFilterChange('is_public', value),
        //     options: [
        //         { value: '', label: 'All Access' },
        //         { value: 'true', label: 'Public' },
        //         { value: 'false', label: 'Not Public' },
        //     ],
        // },
    ];

    if (isLoading) {
        return <Loader text="Loading snapshots..." />;
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load snapshots. Please try again."}
                errorType="error"
                onRetry={() => refetch()}
                retryMsg="Refresh"
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitleWrapper}>
                    <FiFolder className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>My Portfolios & Resumes</h1>
                </div>
                <Link
                    href={ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.CREATE}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Create Snapshot
                </Link>
            </div>

            {/* Table Layout */}
            <TableLayout
                headerProps={{
                    searchTerm,
                    setSearchTerm,
                    filters: headerFilters,
                    activeFilterCount,
                    onClearFilters: handleClearFilters,
                    placeholder: "Search by title, role, or description...",
                    size: "md",
                }}
                paginationProps={{
                    dataLength: snapshots.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <SnapshotTable
                    snapshots={snapshots}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onEdit={(snapshotId) => router.push(ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.EDIT(snapshotId))}
                    onView={(snapshotId) => router.push(ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.VIEW(snapshotId))}
                    isLoading={isDeleting || isDuplicating || isFetching}
                />
            </TableLayout>

            {/* Loading Overlay */}
            {isFetching && snapshots.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}