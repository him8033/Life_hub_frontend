'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SpotCategoryTable from '@/components/travelspots/spotcategory/SpotCategoryTable';
import listingStyles from '@/styles/common/Listing.module.css';
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
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import { MdOutlineCategory } from 'react-icons/md';

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

    // UI states
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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
            setCurrentPage(1); // Reset to first page when search changes
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle filter changes
    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    }, []);

    const handleClearFilters = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setFilters({
            is_active: '',
        });
        setOrdering('-created_at');
        setCurrentPage(1);
        setIsFilterOpen(false);
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
                isLoading: false,
            });

            if (!ok) {
                setIsDeleting(false);
                return;
            }

            const res = await deleteSpotCategory(slug).unwrap();
            showSnackbar(res?.message || 'Spot Category deleted successfully', 'success', 5000);
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
                    ? `"${name}" will be hidden from users. Users will no longer be able to see this spot category.`
                    : `"${name}" will be visible to users. Users will be able to see and use this spot category.`,
                confirmText: currentStatus ? 'Hide' : 'Show',
                cancelText: 'Cancel',
                type: currentStatus ? 'warning' : 'info',
                isLoading: false,
            });

            if (!ok) {
                setIsToggling(false);
                return;
            }

            const res = await updateSpotCategory({
                slug,
                data: { is_active: !currentStatus },
            }).unwrap();

            showSnackbar(
                currentStatus
                    ? `"${name}" is now hidden from users`
                    : `"${name}" is now visible to users`,
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

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        setCurrentPage(1);
    };

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
        <div className={listingStyles.listingContainer}>
            {/* Header */}
            <div className={listingStyles.listingHeader}>
                <div className={listingStyles.titleSection}>
                    <h1 className={listingStyles.listingTitle}>Spot Categories</h1>
                    <div className={listingStyles.headerActions}>
                        <div className={listingStyles.searchContainer}>
                            <FiSearch className={listingStyles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={listingStyles.searchInput}
                                disabled={isDeleting || isToggling}
                            />
                        </div>
                        <Link
                            href={ROUTES.DASHBOARD.TRAVELSPOT.SPOTCATEGORY.CREATE}
                            className={listingStyles.primaryButton}
                            style={isDeleting || isToggling ? { opacity: 0.7, pointerEvents: 'none' } : {}}
                        >
                            Add Spot Category
                        </Link>
                    </div>
                </div>

                {/* Quick Filters Bar */}
                <div className={listingStyles.quickFilters}>
                    <div className={listingStyles.filterControls}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={listingStyles.filterToggle}
                        >
                            <FiFilter />
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <span className={listingStyles.filterBadge}>
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                        
                        <div className={listingStyles.quickFilterRow}>
                            <div className={listingStyles.quickFilter}>
                                <select
                                    value={filters.is_active}
                                    onChange={(e) => handleFilterChange('is_active', e.target.value)}
                                    className={listingStyles.quickSelect}
                                >
                                    <option value="">All Status</option>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                            
                            <div className={listingStyles.quickFilter}>
                                <select
                                    value={ordering}
                                    onChange={(e) => setOrdering(e.target.value)}
                                    className={listingStyles.quickSelect}
                                >
                                    <option value="">Sort by</option>
                                    <option value="-created_at">Newest First</option>
                                    <option value="created_at">Oldest First</option>
                                    <option value="name">Name A-Z</option>
                                    <option value="-name">Name Z-A</option>
                                </select>
                            </div>
                        </div>
                        
                        {activeFilterCount > 0 && (
                            <button
                                onClick={handleClearFilters}
                                className={listingStyles.clearFiltersButton}
                            >
                                <FiX />
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className={listingStyles.resultsSection}>
                {/* Results Info and Controls */}
                <div className={listingStyles.resultsHeader}>
                    <div className={listingStyles.resultsInfo}>
                        <span className={listingStyles.resultsCount}>
                            Showing {spotCategories.length} of {totalCount} spot categories
                            {totalPages > 0 && ` (Page ${currentPage} of ${totalPages})`}
                        </span>
                        <div className={listingStyles.pageControls}>
                            <div className={listingStyles.pageSizeSelector}>
                                <label>Show:</label>
                                <select
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className={listingStyles.pageSizeSelect}
                                    disabled={isFetching}
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                {spotCategories.length === 0 ? (
                    <div className={listingStyles.emptyState}>
                        <div className={listingStyles.emptyIcon}>
                            <MdOutlineCategory/>
                        </div>
                        <p className={listingStyles.emptyText}>
                            {debouncedSearch || activeFilterCount > 0
                                ? 'No spot categories match your search criteria.'
                                : 'No spot categories found. Add your first spot category!'
                            }
                        </p>
                        {(debouncedSearch || activeFilterCount > 0) && (
                            <button
                                onClick={handleClearFilters}
                                className={listingStyles.clearButton}
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <SpotCategoryTable
                            spotCategories={spotCategories}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                            onEdit={(slug) => router.push(ROUTES.DASHBOARD.TRAVELSPOT.SPOTCATEGORY.EDIT(slug))}
                            isLoading={isDeleting || isToggling || isFetching}
                        />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className={listingStyles.pagination}>
                                <div className={listingStyles.paginationInfo}>
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className={listingStyles.paginationButtons}>
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1 || isFetching}
                                        className={listingStyles.paginationButton}
                                    >
                                        First
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1 || isFetching}
                                        className={listingStyles.paginationButton}
                                    >
                                        Previous
                                    </button>
                                    
                                    <div className={listingStyles.pageNumbers}>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    disabled={isFetching}
                                                    className={`${listingStyles.pageNumber} ${currentPage === pageNum ? listingStyles.activePage : ''}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages || isFetching}
                                        className={listingStyles.paginationButton}
                                    >
                                        Next
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages || isFetching}
                                        className={listingStyles.paginationButton}
                                    >
                                        Last
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Loading Overlay */}
            {isFetching && spotCategories.length > 0 && (
                <div className={listingStyles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}