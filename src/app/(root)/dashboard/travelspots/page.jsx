'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TravelSpotTable from '@/components/travelspots/TravelSpotTable';
import listingStyles from '@/styles/common/Listing.module.css';
import {
    useDeleteTravelSpotMutation,
    useGetAdminTravelSpotsQuery,
    useGetTravelSpotVisitorsQuery,
    useUpdateTravelSpotMutation
} from '@/services/api/travelspotApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { useConfirm } from '@/context/ConfirmContext';
import {
    useGetStatesByCountryQuery,
    useGetDistrictsByStateQuery,
    useGetSubDistrictsByDistrictQuery,
    useGetVillagesBySubDistrictQuery,
} from '@/services/api/locationsApi';
import { useGetPublicSpotCategoriesQuery } from '@/services/api/spotcategoryApi';
import { FiFilter, FiX, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { MountainIcon } from 'lucide-react';
import { formatDateTime } from '@/utils/date.utils';

export default function TravelSpotsPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('-created_at');
    const [filters, setFilters] = useState({
        state: '',
        district: '',
        sub_district: '',
        village: '',
        category: '',
        min_views: '',
        is_active: '',
    });

    // UI states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

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
    } = useGetAdminTravelSpotsQuery({
        page: currentPage,
        page_size: pageSize,
        ordering,
        search: debouncedSearch,
        ...filters,
    });

    const [deleteTravelSpot] = useDeleteTravelSpotMutation();
    const [updateTravelSpot] = useUpdateTravelSpotMutation();

    // Location API hooks
    const { data: statesData, isLoading: isStateLoading } = useGetStatesByCountryQuery(1);
    const { data: districtsData, isLoading: isDistrictLoading } = useGetDistrictsByStateQuery(filters.state, {
        skip: !filters.state
    });
    const { data: subDistrictsData, isLoading: isSubDistrictLoading } = useGetSubDistrictsByDistrictQuery(filters.district, {
        skip: !filters.district
    });
    const { data: villagesData, isLoading: isVillageLoading } = useGetVillagesBySubDistrictQuery({
        sub_district_id: filters.sub_district,
        limit: 1000
    }, {
        skip: !filters.sub_district
    });
    const { data: catRes, isLoading: isLoadingCategories } = useGetPublicSpotCategoriesQuery();

    // Visitors modal state
    const [selectedSpotId, setSelectedSpotId] = useState(null);
    const { data: visitorsData, isLoading: isVisitorsLoading } = useGetTravelSpotVisitorsQuery(selectedSpotId, {
        skip: !selectedSpotId,
    });

    // Transform categories data
    const categories = catRes?.data?.map(c => ({
        id: c.id,
        name: c.name,
    })) || [];

    const states = statesData?.data || [];
    const districts = districtsData?.data || [];
    const subDistricts = subDistrictsData?.data || [];
    const villages = villagesData?.data?.results || [];

    // Count active filters
    const activeFilterCount = Object.values(filters).filter(value => value).length;

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
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };

            // Reset dependent fields when parent changes
            if (key === 'state') {
                newFilters.district = '';
                newFilters.sub_district = '';
                newFilters.village = '';
            } else if (key === 'district') {
                newFilters.sub_district = '';
                newFilters.village = '';
            } else if (key === 'sub_district') {
                newFilters.village = '';
            }

            setCurrentPage(1); // Reset to first page when filters change
            return newFilters;
        });
    }, []);

    const handleClearFilters = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setFilters({
            state: '',
            district: '',
            sub_district: '',
            village: '',
            category: '',
            min_views: '',
            is_active: '',
        });
        setOrdering('-created_at');
        setCurrentPage(1);
        setIsFilterOpen(false);
    };

    const handleViewVisitors = (travelspotId) => {
        setSelectedSpotId(travelspotId);
    };

    const handleDelete = async (travelspot_id, name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Travel Spot',
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

            const res = await deleteTravelSpot(travelspot_id).unwrap();
            showSnackbar(res?.message || 'Travel spot deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar('Failed to delete travel spot. Please try again.', 'error', 5000);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async (travelspot_id, currentStatus, name) => {
        try {
            setIsToggling(true);
            const ok = await confirm({
                title: currentStatus ? 'Hide Travel Spot' : 'Show Travel Spot',
                message: currentStatus
                    ? `"${name}" will be hidden from users. Users will no longer be able to see this travel spot.`
                    : `"${name}" will be visible to users. Users will be able to see and interact with this travel spot.`,
                confirmText: currentStatus ? 'Hide' : 'Show',
                cancelText: 'Cancel',
                type: currentStatus ? 'warning' : 'info',
                isLoading: false,
            });

            if (!ok) {
                setIsToggling(false);
                return;
            }

            const res = await updateTravelSpot({
                travelspot_id,
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
                        ? 'Failed to hide travel spot'
                        : 'Failed to show travel spot',
                    'error',
                    5000
                );
            }
        } finally {
            setIsToggling(false);
        }
    };

    // Calculate pagination data
    const travelSpots = data?.data?.results || [];
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
        return <Loader text="Loading travel spots..." />;
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load travel spots. Please try again."}
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
                    <h1 className={listingStyles.listingTitle}>Travel Spots</h1>
                    <div className={listingStyles.headerActions}>
                        <div className={listingStyles.searchContainer}>
                            <FiSearch className={listingStyles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search by name, address, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={listingStyles.searchInput}
                                disabled={isDeleting || isToggling}
                            />
                        </div>
                        <Link
                            href={ROUTES.DASHBOARD.TRAVELSPOT.CREATE}
                            className={listingStyles.primaryButton}
                            style={isDeleting || isToggling ? { opacity: 0.7, pointerEvents: 'none' } : {}}
                        >
                            Add Travel Spot
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

                            {/* Category Filter */}
                            <div className={listingStyles.quickFilter}>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className={listingStyles.quickSelect}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Min Views Filter */}
                            <div className={listingStyles.quickFilter}>
                                <select
                                    value={filters.min_views}
                                    onChange={(e) => handleFilterChange('min_views', e.target.value)}
                                    className={listingStyles.quickSelect}
                                >
                                    <option value="">Any Views</option>
                                    <option value="100">100+</option>
                                    <option value="500">500+</option>
                                    <option value="1000">1000+</option>
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
                                    <option value="-view_count">Most Views</option>
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

                    {/* Expanded Filters Panel */}
                    {isFilterOpen && (
                        <div className={listingStyles.expandedFilters}>
                            <div className={listingStyles.filterGrid}>
                                {/* State Filter */}
                                <div className={listingStyles.filterField}>
                                    <label className={listingStyles.filterLabel}>State</label>
                                    <select
                                        value={filters.state}
                                        onChange={(e) => handleFilterChange('state', e.target.value)}
                                        className={listingStyles.filterSelect}
                                    >
                                        <option value="">All States</option>
                                        {states.map(state => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* District Filter */}
                                <div className={listingStyles.filterField}>
                                    <label className={listingStyles.filterLabel}>District</label>
                                    <select
                                        value={filters.district}
                                        onChange={(e) => handleFilterChange('district', e.target.value)}
                                        className={listingStyles.filterSelect}
                                        disabled={!filters.state}
                                    >
                                        <option value="">All Districts</option>
                                        {districts.map(district => (
                                            <option key={district.id} value={district.id}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sub-district Filter */}
                                <div className={listingStyles.filterField}>
                                    <label className={listingStyles.filterLabel}>Sub-district</label>
                                    <select
                                        value={filters.sub_district}
                                        onChange={(e) => handleFilterChange('sub_district', e.target.value)}
                                        className={listingStyles.filterSelect}
                                        disabled={!filters.district}
                                    >
                                        <option value="">All Sub-districts</option>
                                        {subDistricts.map(subDistrict => (
                                            <option key={subDistrict.id} value={subDistrict.id}>
                                                {subDistrict.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Village Filter */}
                                <div className={listingStyles.filterField}>
                                    <label className={listingStyles.filterLabel}>Village</label>
                                    <select
                                        value={filters.village}
                                        onChange={(e) => handleFilterChange('village', e.target.value)}
                                        className={listingStyles.filterSelect}
                                        disabled={!filters.sub_district}
                                    >
                                        <option value="">All Villages</option>
                                        {villages.map(village => (
                                            <option key={village.id} value={village.id}>
                                                {village.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Advanced Filters Toggle */}
                            <button
                                onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                                className={listingStyles.advancedToggle}
                            >
                                {isAdvancedFiltersOpen ? <FiChevronUp /> : <FiChevronDown />}
                                Advanced Filters
                            </button>

                            {/* Advanced Filters (Hidden by default) */}
                            {isAdvancedFiltersOpen && (
                                <div className={listingStyles.advancedFilters}>
                                    <div className={listingStyles.filterGrid}>
                                        {/* Sub-district Filter */}
                                        {/* <div className={listingStyles.filterField}>
                                            <label className={listingStyles.filterLabel}>Sub-district</label>
                                            <select
                                                value={filters.sub_district}
                                                onChange={(e) => handleFilterChange('sub_district', e.target.value)}
                                                className={listingStyles.filterSelect}
                                                disabled={!filters.district}
                                            >
                                                <option value="">All Sub-districts</option>
                                                {subDistricts.map(subDistrict => (
                                                    <option key={subDistrict.id} value={subDistrict.id}>
                                                        {subDistrict.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div> */}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            <div className={listingStyles.resultsSection}>
                {/* Results Info and Controls */}
                <div className={listingStyles.resultsHeader}>
                    <div className={listingStyles.resultsInfo}>
                        <span className={listingStyles.resultsCount}>
                            Showing {travelSpots.length} of {totalCount} travel spots
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
                {travelSpots.length === 0 ? (
                    <div className={listingStyles.emptyState}>
                        <div className={listingStyles.emptyIcon}>
                            <MountainIcon/>
                        </div>
                        <p className={listingStyles.emptyText}>
                            {debouncedSearch || activeFilterCount > 0
                                ? 'No travel spots match your search criteria.'
                                : 'No travel spots found. Add your first travel spot!'
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
                        <TravelSpotTable
                            travelSpots={travelSpots}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                            onEdit={(travelspot_id) => router.push(ROUTES.DASHBOARD.TRAVELSPOT.EDIT(travelspot_id))}
                            onView={(travelspot_id) => router.push(ROUTES.DASHBOARD.TRAVELSPOT.VIEW(travelspot_id))}
                            onViewVisitors={handleViewVisitors}
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

            {/* Visitors Modal */}
            {selectedSpotId && (
                <div className={listingStyles.modalOverlay} onClick={() => setSelectedSpotId(null)}>
                    <div className={listingStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={listingStyles.modalHeader}>
                            <h3>Visitor Details</h3>
                            <button
                                onClick={() => setSelectedSpotId(null)}
                                className={listingStyles.modalClose}
                            >
                                ×
                            </button>
                        </div>
                        <div className={listingStyles.modalBody}>
                            {isVisitorsLoading ? (
                                <Loader text="Loading visitors..." />
                            ) : visitorsData?.data?.length > 0 ? (
                                <div className={listingStyles.visitorsList}>
                                    <div className={listingStyles.visitorHeader}>
                                        <span>User</span>
                                        <span>IP Address</span>
                                        <span>Visited At</span>
                                    </div>
                                    {visitorsData.data.map((visitor) => (
                                        <div key={visitor.id} className={listingStyles.visitorItem}>
                                            <span>{visitor.user_email || "Guest"}</span>
                                            <span className={listingStyles.ipAddress}>{visitor.ip_address}</span>
                                            <span className={listingStyles.visitTime}>
                                                {visitor.viewed_at ? formatDateTime(visitor.viewed_at) : '—'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={listingStyles.noVisitors}>No visitors found for this travel spot.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {isFetching && travelSpots.length > 0 && (
                <div className={listingStyles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}