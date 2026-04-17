'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import TravelSpotCard from '@/components/travelspots/TravelSpotCard';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import SimpleSelect from '@/components/common/forms/SimpleSelect';
import SimpleInput from '@/components/common/forms/SimpleInput';
import Button from '@/components/common/buttons/Button';
import FilterModal from '@/components/common/FilterModal';
import styles from '@/styles/pages/PublicTravelSpots.module.css';

import { useLazyGetPublicTravelSpotsQuery } from '@/services/api/travelspotApi';
import { useGetPublicSpotCategoriesQuery } from '@/services/api/spotcategoryApi';
import {
    useGetStatesByCountryQuery,
    useGetDistrictsByStateQuery,
    useGetSubDistrictsByDistrictQuery,
    useGetVillagesBySubDistrictQuery,
} from '@/services/api/locationsApi';
import { FiFilter, FiSearch } from 'react-icons/fi';

// Shimmer/Skeleton Card Component
const ShimmerCard = () => (
    <div className={styles.shimmerCard}>
        <div className={styles.shimmerImage} />
        <div className={styles.shimmerContent}>
            <div className={styles.shimmerTitle} />
            <div className={styles.shimmerText} />
            <div className={styles.shimmerText} />
            <div className={styles.shimmerButton} />
        </div>
    </div>
);

// Custom hook to get shimmer count based on screen size
const useShimmerCount = () => {
    const [shimmerCount, setShimmerCount] = useState(6);
    const [loadMoreShimmerCount, setLoadMoreShimmerCount] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            
            // Determine number of columns based on screen width
            let columns = 3; // Default for laptop (>=1024px)
            
            if (width < 480) {
                columns = 1; // Mobile: 1 column
            } else if (width < 768) {
                columns = 1; // Small tablet: 1 column
            } else if (width < 1024) {
                columns = 2; // Tablet: 2 columns
            } else {
                columns = 3; // Desktop/Laptop: 3 columns
            }
            
            // For initial load: show 2 rows
            setShimmerCount(columns * 2);
            
            // For load more: show 1 row
            setLoadMoreShimmerCount(columns);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { shimmerCount, loadMoreShimmerCount };
};

export default function PublicTravelSpotsPage() {
    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Sort state
    const [sortBy, setSortBy] = useState('');

    // Filter states (applied immediately)
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
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    
    // Track previous filter/sort values to detect changes
    const prevFiltersRef = useRef({ ...filters, sortBy, debouncedSearch });

    // Get responsive shimmer counts
    const { shimmerCount, loadMoreShimmerCount } = useShimmerCount();

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
        value: String(state.id),
        label: state.name
    }));

    const districtOptions = districts.map(district => ({
        value: String(district.id),
        label: district.name
    }));

    const subDistrictOptions = subDistricts.map(subDistrict => ({
        value: String(subDistrict.id),
        label: subDistrict.name
    }));

    const villageOptions = villages.map(village => ({
        value: String(village.id),
        label: village.name
    }));

    const minViewsOptions = [
        { value: '', label: 'Any Popularity' },
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

    // Detect filter/sort/search changes and clear data immediately
    useEffect(() => {
        const currentValues = { ...filters, sortBy, debouncedSearch };
        const prevValues = prevFiltersRef.current;
        
        // Check if any filter, sort, or search has changed
        const hasChanged = 
            prevValues.state !== currentValues.state ||
            prevValues.district !== currentValues.district ||
            prevValues.sub_district !== currentValues.sub_district ||
            prevValues.village !== currentValues.village ||
            prevValues.category !== currentValues.category ||
            prevValues.min_views !== currentValues.min_views ||
            prevValues.sortBy !== currentValues.sortBy ||
            prevValues.debouncedSearch !== currentValues.debouncedSearch;
        
        if (hasChanged && !isInitialLoad) {
            // Clear existing data immediately to show shimmer
            setTravelSpots([]);
            setTotalCount(0);
            setHasFetchedOnce(false);
            setNextCursor(null);
            setHasMore(true);
        }
        
        prevFiltersRef.current = currentValues;
    }, [filters, sortBy, debouncedSearch, isInitialLoad]);

    // Fetch when filters, search, or sort changes
    useEffect(() => {
        if (!isInitialLoad) {
            fetchTravelSpots();
        }
        setIsInitialLoad(false);
    }, [debouncedSearch, sortBy, filters.state, filters.district, filters.sub_district, filters.village, filters.category, filters.min_views]);

    const fetchTravelSpots = useCallback(async (cursor = null) => {
        try {
            // Set loading more state if cursor exists
            if (cursor) {
                setIsLoadingMore(true);
            }

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
        } finally {
            setHasFetchedOnce(true);
            setIsLoadingMore(false);
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
            const state = states.find(s => String(s.id) === String(filters.state));
            if (state) applied.push(`State: ${state.name}`);
        }

        if (filters.district) {
            const district = districts.find(d => String(d.id) === String(filters.district));
            if (district) applied.push(`District: ${district.name}`);
        }

        if (filters.sub_district) {
            const subDistrict = subDistricts.find(sd => String(sd.id) === String(filters.sub_district));
            if (subDistrict) applied.push(`Sub-district: ${subDistrict.name}`);
        }

        if (filters.village) {
            const village = villages.find(v => String(v.id) === String(filters.village));
            if (village) applied.push(`Village: ${village.name}`);
        }

        if (filters.category) {
            const category = categories.find(c => String(c.id) === String(filters.category));
            if (category) applied.push(`Category: ${category.name}`);
        }

        if (filters.min_views) applied.push(`Min Views: ${filters.min_views}+`);

        setAppliedFilters(applied);
    };

    const handleFilterChange = (key, value) => {
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

            return newFilters;
        });
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const handleCategoryChange = (value) => {
        handleFilterChange('category', value);
    };

    const handleOpenFilters = () => {
        setIsFilterOpen(true);
    };

    const handleCloseFilters = () => {
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
        setIsFilterOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const handleLoadMore = () => {
        if (nextCursor && hasMore && !isLoadingMore) {
            fetchTravelSpots(nextCursor);
        }
    };

    // Handle SimpleSelect onChange (extracts value from event)
    const handleSimpleSelectChange = (handler) => (e) => {
        handler(e.target.value);
    };

    // Define filter configuration for the modal
    const filterConfig = [
        {
            type: 'select',
            label: 'State',
            value: filters.state,
            onChange: (value) => handleFilterChange('state', value),
            options: stateOptions,
            disabled: isStateLoading,
            placeholder: 'All States',
        },
        {
            type: 'select',
            label: 'District',
            value: filters.district,
            onChange: (value) => handleFilterChange('district', value),
            options: districtOptions,
            disabled: !filters.state || isDistrictLoading,
            placeholder: 'All Districts',
        },
        {
            type: 'select',
            label: 'City/Sub-district',
            value: filters.sub_district,
            onChange: (value) => handleFilterChange('sub_district', value),
            options: subDistrictOptions,
            disabled: !filters.district || isSubDistrictLoading,
            placeholder: 'All Sub-districts',
        },
        {
            type: 'select',
            label: 'Village/Town',
            value: filters.village,
            onChange: (value) => handleFilterChange('village', value),
            options: villageOptions,
            disabled: !filters.sub_district || isVillageLoading,
            placeholder: 'All Villages',
        },
        {
            type: 'select',
            label: 'Minimum Views',
            value: filters.min_views,
            onChange: (value) => handleFilterChange('min_views', value),
            options: minViewsOptions,
            placeholder: 'Any Popularity',
        },
    ];

    // Error handling
    if (error && travelSpots.length === 0 && !isLoading && hasFetchedOnce) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load travel spots. Please try again."}
                errorType="error"
                onRetry={() => {
                    setHasFetchedOnce(false);
                    fetchTravelSpots();
                }}
                retryMsg="Refresh"
            />
        );
    }

    // Determine if we should show shimmer loading
    const showShimmer = (isLoading && !isLoadingMore) || (!hasFetchedOnce && travelSpots.length === 0) || (isLoading && travelSpots.length === 0);

    // Determine if we should show empty state
    const showEmptyState = hasFetchedOnce && travelSpots.length === 0 && !isLoading && !isFetching;

    return (
        <PageLayout
            heroTitle="Explore Travel Spots"
            heroDescription="Discover amazing places to visit across India"
            showHero={true}
        >
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.searchContainer}>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchBox}>
                            <SimpleInput
                                name="search"
                                placeholder="Search by name, address, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="md"
                                icon={FiSearch}
                                className={styles.searchInput}
                            />
                            <Button type="submit" variant="primary" size="md">
                                Search
                            </Button>
                        </div>
                    </form>
                </div>

                <div className={styles.controlsContainer}>
                    <div className={styles.categoryFilter}>
                        <SimpleSelect
                            name="category"
                            value={filters.category}
                            onChange={handleSimpleSelectChange(handleCategoryChange)}
                            options={categoryOptions}
                            disabled={isLoadingCategories}
                            placeholder="All Categories"
                            size="md"
                            emptyOption={true}
                            emptyOptionLabel="All Categories"
                        />
                    </div>
                    <div className={styles.sortContainer}>
                        <SimpleSelect
                            name="sort"
                            value={sortBy}
                            onChange={handleSimpleSelectChange(handleSortChange)}
                            options={sortOptions}
                            placeholder="Sort By"
                            size="md"
                            emptyOption={true}
                            emptyOptionLabel="Sort By"
                        />
                    </div>

                    <div className={styles.filterButtonWrapper}>
                        <Button
                            variant="outline"
                            size="md"
                            onClick={handleOpenFilters}
                            icon={<FiFilter size={16} />}
                        >
                            Filters
                        </Button>
                        {appliedFilters.length > 0 && (
                            <span className={styles.filterBadge}>
                                {appliedFilters.length}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            <FilterModal
                isOpen={isFilterOpen}
                onClose={handleCloseFilters}
                onClear={handleClearFilters}
                filters={filterConfig}
                title="Filters"
                clearButtonText="Clear All"
                closeButtonText="Close"
                isLoading={isStateLoading || isDistrictLoading || isSubDistrictLoading || isVillageLoading}
            />

            {/* Results Section */}
            <div className={styles.mainContent}>
                <div className={styles.resultsSection}>
                    <div className={styles.resultsInfo}>
                        <p className={styles.resultsCount}>
                            {!showShimmer && !showEmptyState && totalCount > 0
                                ? `Showing ${travelSpots.length} of ${totalCount} travel spots`
                                : ''}
                        </p>
                    </div>

                    <div className={styles.spotsContainer}>
                        {showShimmer ? (
                            // Loading shimmer with responsive count
                            <div className={styles.spotsGrid}>
                                {Array.from({ length: shimmerCount }).map((_, index) => (
                                    <ShimmerCard key={`shimmer-${index}`} />
                                ))}
                            </div>
                        ) : showEmptyState ? (
                            // Empty state
                            <div className={styles.noResults}>
                                <div className={styles.noResultsIcon}>🏞️</div>
                                <p className={styles.noResultsMessage}>
                                    {debouncedSearch || appliedFilters.length > 0
                                        ? 'No travel spots match your search criteria. Try different filters.'
                                        : 'No travel spots available at the moment.'}
                                </p>
                                {(debouncedSearch || appliedFilters.length > 0) && (
                                    <Button variant="primary" size="md" onClick={handleClearFilters}>
                                        Clear all filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className={styles.spotsGrid}>
                                    {travelSpots.map((spot) => (
                                        <TravelSpotCard key={spot.id} travelSpot={spot} />
                                    ))}
                                    
                                    {/* Load More Shimmer Cards with responsive count */}
                                    {isLoadingMore && (
                                        <>
                                            {Array.from({ length: loadMoreShimmerCount }).map((_, index) => (
                                                <ShimmerCard key={`load-more-shimmer-${index}`} />
                                            ))}
                                        </>
                                    )}
                                </div>

                                {/* Load More Button */}
                                {hasMore && travelSpots.length > 0 && !isLoadingMore && (
                                    <div className={styles.paginationControls}>
                                        <Button
                                            variant="outline"
                                            size="md"
                                            onClick={handleLoadMore}
                                            disabled={isLoadingMore}
                                            fullWidth
                                        >
                                            Load More
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}