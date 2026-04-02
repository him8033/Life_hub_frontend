'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TravelSpotTable from '@/components/travelspots/TravelSpotTable';
import TableLayout from '@/components/common/table/TableLayout';
import FilterModal from '@/components/common/FilterModal';
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
import { MdOutlineTour } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';
import { formatDateTime } from '@/utils/date.utils';
import styles from '@/styles/common/CommonListing.module.css';

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
    const [isLocationFilterOpen, setIsLocationFilterOpen] = useState(false);

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

    // Transform data
    const categories = catRes?.data?.map(c => ({
        id: c.id,
        name: c.name,
    })) || [];

    const states = statesData?.data || [];
    const districts = districtsData?.data || [];
    const subDistricts = subDistrictsData?.data || [];
    const villages = villagesData?.data?.results || [];

    // Min Views Options
    const minViewsOptions = [
        { value: '', label: 'Any Views' },
        { value: '100', label: '100+ Views' },
        { value: '500', label: '500+ Views' },
        { value: '1000', label: '1000+ Views' },
        { value: '5000', label: '5000+ Views' },
        { value: '10000', label: '10000+ Views' },
        { value: '50000', label: '50000+ Views' },
    ];

    // Count active filters
    const activeFilterCount = Object.values(filters).filter(value => value).length + (debouncedSearch ? 1 : 0);
    const locationFilterCount = [filters.state, filters.district, filters.sub_district, filters.village].filter(Boolean).length;

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

            setCurrentPage(1);
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
        setIsLocationFilterOpen(false);
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
            });

            if (!ok) return;

            await deleteTravelSpot(travelspot_id).unwrap();
            showSnackbar('Travel spot deleted successfully', 'success', 5000);
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
                    ? `"${name}" will be hidden from users.`
                    : `"${name}" will be visible to users.`,
                confirmText: currentStatus ? 'Hide' : 'Show',
                cancelText: 'Cancel',
                type: currentStatus ? 'warning' : 'info',
            });

            if (!ok) return;

            await updateTravelSpot({
                travelspot_id,
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

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    // Define location filters for modal
    const locationFiltersConfig = [
        {
            type: 'select',
            label: 'State',
            value: filters.state,
            onChange: (value) => handleFilterChange('state', value),
            options: states.map(state => ({
                value: state.id,
                label: state.name
            })),
            disabled: isStateLoading,
            placeholder: 'All States',
        },
        {
            type: 'select',
            label: 'District',
            value: filters.district,
            onChange: (value) => handleFilterChange('district', value),
            options: districts.map(district => ({
                value: district.id,
                label: district.name
            })),
            disabled: !filters.state || isDistrictLoading,
            placeholder: 'All Districts',
        },
        {
            type: 'select',
            label: 'City/Sub-district',
            value: filters.sub_district,
            onChange: (value) => handleFilterChange('sub_district', value),
            options: subDistricts.map(subDistrict => ({
                value: subDistrict.id,
                label: subDistrict.name
            })),
            disabled: !filters.district || isSubDistrictLoading,
            placeholder: 'All Sub-districts',
        },
        {
            type: 'select',
            label: 'Village/Town',
            value: filters.village,
            onChange: (value) => handleFilterChange('village', value),
            options: villages.map(village => ({
                value: village.id,
                label: village.name
            })),
            disabled: !filters.sub_district || isVillageLoading,
            placeholder: 'All Villages',
        },
        {
            type: 'select',
            label: 'Minimum Views',
            value: filters.min_views,
            onChange: (value) => handleFilterChange('min_views', value),
            options: minViewsOptions,
            placeholder: 'Any Views',
        },
    ];

    // Define header filters (status, category, sort)
    const headerFilters = [
        {
            value: filters.is_active,
            onChange: (value) => handleFilterChange('is_active', value),
            options: [
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
            ],
        },
        {
            value: filters.category,
            onChange: (value) => handleFilterChange('category', value),
            options: [
                { value: '', label: 'All Categories' },
                ...categories.map(cat => ({ value: cat.id, label: cat.name })),
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
                { value: '-view_count', label: 'Most Views' },
            ],
        },
    ];

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
        <div className={styles.pageContainer}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitleWrapper}>
                    <MdOutlineTour className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>Travel Spots</h1>
                </div>
                <Link
                    href={ROUTES.DASHBOARD.TRAVELSPOT.CREATE}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Add Travel Spot
                </Link>
            </div>

            {/* Table Layout with Integrated Filter Button */}
            <TableLayout
                headerProps={{
                    searchTerm,
                    setSearchTerm,
                    filters: headerFilters,
                    activeFilterCount: activeFilterCount - locationFilterCount,
                    onOpenFilters: () => setIsLocationFilterOpen(true),
                    onClearFilters: handleClearFilters,
                    placeholder: "Search by name, address, or description...",
                    size: "md",
                    showFilterButton: true,
                    filterButtonText: "Location & Views",
                }}
                paginationProps={{
                    dataLength: travelSpots.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <TravelSpotTable
                    travelSpots={travelSpots}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onEdit={(slug) => router.push(ROUTES.DASHBOARD.TRAVELSPOT.EDIT(slug))}
                    onView={(slug) => router.push(ROUTES.DASHBOARD.TRAVELSPOT.VIEW(slug))}
                    onViewVisitors={handleViewVisitors}
                    isLoading={isDeleting || isToggling || isFetching}
                />
            </TableLayout>

            {/* Location & Views Filters Modal */}
            <FilterModal
                isOpen={isLocationFilterOpen}
                onClose={() => setIsLocationFilterOpen(false)}
                onClear={handleClearFilters}
                filters={locationFiltersConfig}
                title="Location & Views Filters"
                clearButtonText="Clear All"
                closeButtonText="Close"
                isLoading={isStateLoading || isDistrictLoading || isSubDistrictLoading || isVillageLoading}
            />

            {/* Visitors Modal */}
            {selectedSpotId && (
                <div className={styles.modalOverlay} onClick={() => setSelectedSpotId(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Visitor Details</h3>
                            <button
                                onClick={() => setSelectedSpotId(null)}
                                className={styles.modalClose}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            {isVisitorsLoading ? (
                                <Loader text="Loading visitors..." />
                            ) : visitorsData?.data?.length > 0 ? (
                                <div className={styles.visitorsList}>
                                    <div className={styles.visitorHeader}>
                                        <span>User</span>
                                        <span>IP Address</span>
                                        <span>Visited At</span>
                                    </div>
                                    {visitorsData.data.map((visitor) => (
                                        <div key={visitor.id} className={styles.visitorItem}>
                                            <span>{visitor.user_email || "Guest"}</span>
                                            <span className={styles.ipAddress}>{visitor.ip_address}</span>
                                            <span className={styles.visitTime}>
                                                {visitor.viewed_at ? formatDateTime(visitor.viewed_at) : '—'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.noVisitors}>No visitors found for this travel spot.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {isFetching && travelSpots.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}