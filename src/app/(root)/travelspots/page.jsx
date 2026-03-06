'use client';

import { useState, useEffect, useCallback } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TravelSpotCard from '@/components/travelspots/TravelSpotCard';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import FormSelect from '@/components/common/forms/FormSelect';
import { PrimaryButton, SecondaryButton } from '@/components/common/forms/FormButtons';
import styles from '@/styles/pages/PublicTravelSpots.module.css';

import { useLazyGetPublicTravelSpotsQuery } from '@/services/api/travelspotApi';
import { useGetPublicSpotCategoriesQuery } from '@/services/api/spotcategoryApi';
import {
    useGetStatesByCountryQuery,
    useGetDistrictsByStateQuery,
    useGetSubDistrictsByDistrictQuery,
    useGetVillagesBySubDistrictQuery,
} from '@/services/api/locationsApi';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FilterIcon } from 'lucide-react';

export default function PublicTravelSpotsPage() {
    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Sort state
    const [sortBy, setSortBy] = useState('');

    // Filter states
    const [filters, setFilters] = useState({
        state: '',
        district: '',
        sub_district: '',
        village: '',
        category: '',
        min_views: ''
    });

    // UI states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState([]);

    // Pagination states
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Data states
    const [travelSpots, setTravelSpots] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // API hooks
    const [getTravelSpots, { data, error, isLoading, isFetching }] = useLazyGetPublicTravelSpotsQuery();
    const { data: catRes, isLoading: isLoadingCategories } = useGetPublicSpotCategoriesQuery();

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

    // Transform categories data
    const categories = catRes?.data?.map(c => ({
        id: c.id,
        name: c.name,
        count: c.total_spots || 0,
    })) || [];

    const states = statesData?.data || [];
    const districts = districtsData?.data || [];
    const subDistricts = subDistrictsData?.data || [];
    const villages = villagesData?.data?.results || [];

    // Transform data for select options
    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name
    }));

    const stateOptions = states.map(state => ({
        value: state.id,
        label: state.name
    }));

    const districtOptions = districts.map(district => ({
        value: district.id,
        label: district.name
    }));

    const subDistrictOptions = subDistricts.map(subDistrict => ({
        value: subDistrict.id,
        label: subDistrict.name
    }));

    const villageOptions = villages.map(village => ({
        value: village.id,
        label: village.name
    }));

    const minViewsOptions = [
        { value: '100', label: '100+ Views' },
        { value: '500', label: '500+ Views' },
        { value: '1000', label: '1000+ Views' },
        { value: '5000', label: '5000+ Views' },
    ];

    const sortOptions = [
        { value: 'most_visited', label: 'Most Visited' },
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'name', label: 'Name (A-Z)' },
        { value: 'desc_name', label: 'Name (Z-A)' },
    ];

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Initial fetch
    useEffect(() => {
        fetchTravelSpots();
    }, []);

    // Fetch when filters, search, or sort changes
    useEffect(() => {
        if (!isInitialLoad) {
            fetchTravelSpots();
        }
        setIsInitialLoad(false);
    }, [debouncedSearch, sortBy, filters.state, filters.district, filters.sub_district, filters.village, filters.category, filters.min_views]);

    const fetchTravelSpots = useCallback(async (cursor = null) => {
        try {
            const params = {
                ...(cursor && { cursor }),
                ...(debouncedSearch && { search: debouncedSearch }),
                ...(sortBy === 'name' && { ordering: 'name' }),
                ...(sortBy === 'desc_name' && { ordering: '-name' }),
                ...(sortBy === 'oldest' && { ordering: 'created_at' }),
                ...(sortBy === 'newest' && { ordering: '-created_at' }),
                ...(sortBy === 'most_visited' && { ordering: '-view_count' }),
                ...(filters.state && { state: filters.state }),
                ...(filters.district && { district: filters.district }),
                ...(filters.sub_district && { sub_district: filters.sub_district }),
                ...(filters.village && { village: filters.village }),
                ...(filters.category && { category: filters.category }),
                ...(filters.min_views && { min_views: filters.min_views }),
            };

            const result = await getTravelSpots(params).unwrap();

            if (cursor) {
                setTravelSpots(prev => [...prev, ...(result.results || [])]);
            } else {
                setTravelSpots(result.results || []);
            }

            setNextCursor(result.next ? extractCursor(result.next) : null);
            setHasMore(!!result.next);
            setTotalCount(result.count || result.results?.length || 0);

            if (!cursor) {
                updateAppliedFilters();
            }
        } catch (error) {
            console.error('Failed to fetch travel spots:', error);
        }
    }, [getTravelSpots, debouncedSearch, sortBy, filters]);

    const extractCursor = (url) => {
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('cursor');
        } catch {
            return null;
        }
    };

    const updateAppliedFilters = () => {
        const applied = [];

        if (filters.state) {
            const state = states.find(s => s.id.toString() === filters.state.toString());
            if (state) applied.push(`State: ${state.name}`);
        }

        if (filters.district) {
            const district = districts.find(d => d.id.toString() === filters.district.toString());
            if (district) applied.push(`District: ${district.name}`);
        }

        if (filters.sub_district) {
            const subDistrict = subDistricts.find(sd => sd.id.toString() === filters.sub_district.toString());
            if (subDistrict) applied.push(`Sub-district: ${subDistrict.name}`);
        }

        if (filters.village) {
            const village = villages.find(v => v.id.toString() === filters.village.toString());
            if (village) applied.push(`Village: ${village.name}`);
        }

        if (filters.category) {
            const category = categories.find(c => c.id.toString() === filters.category.toString());
            if (category) applied.push(`Category: ${category.name}`);
        }

        if (filters.min_views) applied.push(`Min Views: ${filters.min_views}+`);

        setAppliedFilters(applied);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };

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

            return newFilters;
        });
    };

    const handleApplyFilters = () => {
        fetchTravelSpots();
        setIsFilterOpen(false);
    };

    const handleClearFilters = () => {
        setFilters({
            state: '',
            district: '',
            sub_district: '',
            village: '',
            category: '',
            min_views: ''
        });
        setAppliedFilters([]);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTravelSpots();
    };

    const handleLoadMore = () => {
        if (nextCursor && hasMore) {
            fetchTravelSpots(nextCursor);
        }
    };

    if (isLoading && travelSpots.length === 0) {
        return <Loader text="Loading travel spots..." />;
    }

    if (error && travelSpots.length === 0) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load travel spots. Please try again."}
                errorType="error"
                onRetry={() => fetchTravelSpots()}
                retryMsg="Refresh"
            />
        );
    }

    return (
        <PageLayout
            heroTitle="Explore Travel Spots"
            heroDescription="Discover amazing places to visit across India"
            showHero={true}
        >
            {/* Top Bar - Search, Filters Button, Sort */}
            <div className={styles.topBar}>
                <div className={styles.searchContainer}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchBox}>
                            <MagnifyingGlassIcon className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search by name, address, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button type="submit" className={styles.searchButton}>
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                <div className={styles.categoryFilter}>
                    <FormSelect
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        options={categoryOptions}
                        disabled={isLoadingCategories}
                        placeholder="All Categories"
                    />
                </div>

                <div className={styles.controlsContainer}>
                    <div className={styles.sortContainer}>
                        <FormSelect
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            options={sortOptions}
                            placeholder="Sort By"
                        />
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className={styles.filterButton}
                    >
                        <FilterIcon className={styles.filterIcon} />
                        Filters
                        {appliedFilters.length > 0 && (
                            <span className={styles.filterBadge}>
                                {appliedFilters.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Filters Sidebar (Modal for mobile) */}
                {isFilterOpen && (
                    <>
                        <div className={styles.filterOverlay} onClick={() => setIsFilterOpen(false)} />
                        <div className={styles.filterSidebar}>
                            <div className={styles.filterHeader}>
                                <h3 className={styles.filterTitle}>Filters</h3>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className={styles.filterClose}
                                >
                                    ×
                                </button>
                            </div>

                            <div className={styles.filterContent}>
                                {/* State Filter */}
                                <div className={styles.filterSection}>
                                    <FormSelect
                                        label="State"
                                        value={filters.state}
                                        onChange={(e) => handleFilterChange('state', e.target.value)}
                                        options={stateOptions}
                                        disabled={isStateLoading}
                                        placeholder="All States"
                                    />
                                </div>

                                {/* District Filter */}
                                <div className={styles.filterSection}>
                                    <FormSelect
                                        label="District"
                                        value={filters.district}
                                        onChange={(e) => handleFilterChange('district', e.target.value)}
                                        options={districtOptions}
                                        disabled={!filters.state || isDistrictLoading}
                                        placeholder="All Districts"
                                    />
                                </div>

                                {/* Sub-district Filter */}
                                <div className={styles.filterSection}>
                                    <FormSelect
                                        label="City/Sub-district"
                                        value={filters.sub_district}
                                        onChange={(e) => handleFilterChange('sub_district', e.target.value)}
                                        options={subDistrictOptions}
                                        disabled={!filters.district || isSubDistrictLoading}
                                        placeholder="All Sub-districts"
                                    />
                                </div>

                                {/* Village Filter */}
                                <div className={styles.filterSection}>
                                    <FormSelect
                                        label="Village/Town"
                                        value={filters.village}
                                        onChange={(e) => handleFilterChange('village', e.target.value)}
                                        options={villageOptions}
                                        disabled={!filters.sub_district || isVillageLoading}
                                        placeholder="All Villages"
                                    />
                                </div>

                                {/* Minimum Views Filter */}
                                <div className={styles.filterSection}>
                                    <FormSelect
                                        label="Minimum Views"
                                        value={filters.min_views}
                                        onChange={(e) => handleFilterChange('min_views', e.target.value)}
                                        options={minViewsOptions}
                                        placeholder="Any Popularity"
                                    />
                                </div>
                            </div>

                            <div className={styles.filterFooter}>
                                <SecondaryButton onClick={handleClearFilters}>
                                    Clear All
                                </SecondaryButton>
                                <PrimaryButton
                                    onClick={handleApplyFilters}
                                    disabled={isStateLoading || isDistrictLoading || isSubDistrictLoading || isVillageLoading}
                                >
                                    Apply Filters
                                </PrimaryButton>
                            </div>
                        </div>
                    </>
                )}

                {/* Results Section */}
                <div className={styles.resultsSection}>
                    <div className={styles.resultsInfo}>
                        <p className={styles.resultsCount}>
                            {totalCount > 0
                                ? `Showing ${travelSpots.length} travel spots`
                                : 'No travel spots found'}
                        </p>
                    </div>

                    <div className={styles.spotsContainer}>
                        {travelSpots.length === 0 && !isFetching ? (
                            <div className={styles.noResults}>
                                <div className={styles.noResultsIcon}>🏞️</div>
                                <p className={styles.noResultsMessage}>
                                    {debouncedSearch || appliedFilters.length > 0
                                        ? 'No travel spots match your search criteria. Try different filters.'
                                        : 'No travel spots available at the moment.'}
                                </p>
                                {(debouncedSearch || appliedFilters.length > 0) && (
                                    <SecondaryButton onClick={handleClearFilters}>
                                        Clear all filters
                                    </SecondaryButton>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className={styles.spotsGrid}>
                                    {travelSpots.map((spot) => (
                                        <TravelSpotCard
                                            key={spot.id}
                                            travelSpot={spot}
                                        />
                                    ))}
                                </div>

                                {hasMore && travelSpots.length > 0 && (
                                    <div className={styles.paginationControls}>
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={!nextCursor || isFetching}
                                            className={`${styles.paginationButton} ${!nextCursor ? styles.disabled : ''}`}
                                        >
                                            {isFetching ? 'Loading...' : 'Load More'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {isFetching && travelSpots.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading more spots..." />
                </div>
            )}
        </PageLayout>
    );
}