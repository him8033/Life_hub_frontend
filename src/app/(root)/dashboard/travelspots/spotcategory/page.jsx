'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SpotCategoryTable from '@/components/travelspots/spotcategory/SpotCategoryTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useDeleteSpotCategoryMutation,
    useGetAdminSpotCategoriesQuery,
    useUpdateSpotCategoryMutation
} from '@/services/api/spotcategoryApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { useConfirm } from '@/context/ConfirmContext';
import { MdOutlineCategory } from 'react-icons/md';
import styles from '@/styles/common/CommonListing.module.css';
import { FiPlus } from 'react-icons/fi';

export default function SpotCategoriesPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('-created_at');
    const [filters, setFilters] = useState({
        is_active: '',
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Operation states
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    // API hooks
    const {
        data,
        error,
        isLoading,
        isFetching,
        refetch
    } = useGetAdminSpotCategoriesQuery({
        page: currentPage,
        page_size: pageSize,
        ordering,
        search: debouncedSearch,
        ...filters,
    });

    const [deleteSpotCategory] = useDeleteSpotCategoryMutation();
    const [updateSpotCategory] = useUpdateSpotCategoryMutation();

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
            is_active: '',
        });
        setOrdering('-created_at');
        setCurrentPage(1);
    };

    const handleDelete = async (slug, name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Spot Category',
                message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger',
            });

            if (!ok) return;

            await deleteSpotCategory(slug).unwrap();
            showSnackbar('Spot Category deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar('Failed to delete Spot Category. Please try again.', 'error', 5000);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async (slug, currentStatus, name) => {
        try {
            setIsToggling(true);
            const ok = await confirm({
                title: currentStatus ? 'Hide Spot Category' : 'Show Spot Category',
                message: currentStatus
                    ? `"${name}" will be hidden from users.`
                    : `"${name}" will be visible to users.`,
                confirmText: currentStatus ? 'Hide' : 'Show',
                cancelText: 'Cancel',
                type: currentStatus ? 'warning' : 'info',
            });

            if (!ok) return;

            await updateSpotCategory({
                slug,
                data: { is_active: !currentStatus },
            }).unwrap();

            showSnackbar(
                currentStatus
                    ? `"${name}" is now hidden`
                    : `"${name}" is now visible`,
                'success',
                3000
            );
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar(
                    currentStatus
                        ? 'Failed to hide Spot Category'
                        : 'Failed to show Spot Category',
                    'error',
                    5000
                );
            }
        } finally {
            setIsToggling(false);
        }
    };

    // Calculate pagination data
    const spotCategories = data?.data?.results || [];
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
            value: filters.is_active,
            onChange: (value) => handleFilterChange('is_active', value),
            options: [
                { value: 'all', label: 'All Status' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
            ],
        },
        {
            value: ordering,
            onChange: (value) => setOrdering(value),
            options: [
                { value: '-created_at', label: 'Newest First' },
                { value: 'created_at', label: 'Oldest First' },
                { value: 'name', label: 'Name A-Z' },
                { value: '-name', label: 'Name Z-A' },
            ],
        },
    ];

    if (isLoading) {
        return <Loader text="Loading Spot Categories..." />;
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load Spot Categories. Please try again."}
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
                    <MdOutlineCategory className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>Spot Categories</h1>
                </div>
                <Link
                    href={ROUTES.DASHBOARD.TRAVELSPOT.SPOTCATEGORY.CREATE}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Create Spot Category
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
                    placeholder: "Search by name...",
                    size: "md",
                }}
                paginationProps={{
                    dataLength: spotCategories.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <SpotCategoryTable
                    spotCategories={spotCategories}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onEdit={(slug) => router.push(ROUTES.DASHBOARD.TRAVELSPOT.SPOTCATEGORY.EDIT(slug))}
                    isLoading={isDeleting || isToggling || isFetching}
                />
            </TableLayout>

            {/* Loading Overlay */}
            {isFetching && spotCategories.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}