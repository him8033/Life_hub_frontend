'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGetNearbyTravelSpotsQuery } from '@/services/api/travelspotApi';
import { ROUTES } from '@/routes/routes.constants';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaChevronRight, FaSpinner } from 'react-icons/fa';
import Button from '@/components/common/buttons/Button';
import SimpleSelect from '@/components/common/forms/SimpleSelect';
import styles from '@/styles/travelspots/NearbySpotsTab.module.css';

export default function NearbySpotsTab({ slug }) {
    const router = useRouter();
    const [sortBy, setSortBy] = useState('distance');
    const [radius, setRadius] = useState('50');
    const [spots, setSpots] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [forceRefetch, setForceRefetch] = useState(0);

    // Options
    const radiusOptions = [
        { value: '1', label: 'Within 1km' },
        { value: '2.5', label: 'Within 2.5km' },
        { value: '5', label: 'Within 5km' },
        { value: '10', label: 'Within 10km' },
        { value: '25', label: 'Within 25km' },
        { value: '50', label: 'Within 50km' },
        { value: '100', label: 'Within 100km' },
    ];

    const sortOptions = [
        { value: 'distance', label: 'Closest First' },
        { value: 'most_visited', label: 'Most Visited' },
    ];

    // Query parameters that should trigger a new API call
    const queryParams = {
        slug,
        radius: parseInt(radius),
        sort: sortBy,
        limit: 6,
        cursor: nextCursor
    };

    const {
        data: nearbyData,
        error,
        isLoading,
        isFetching,
        refetch
    } = useGetNearbyTravelSpotsQuery(queryParams, {
        skip: !slug
    });

    // Reset states and force refetch when sort or radius changes
    const handleFilterChange = useCallback(() => {
        setSpots([]);
        setNextCursor(null);
        setHasMore(true);
        setForceRefetch(prev => prev + 1);
    }, []);

    // Separate useEffect for filter changes
    useEffect(() => {
        handleFilterChange();
    }, [sortBy, radius, handleFilterChange]);

    // Update spots when data changes with deduplication
    useEffect(() => {
        if (nearbyData?.data?.results) {
            const newResults = nearbyData.data.results;

            if (nextCursor) {
                // Filter out duplicates when loading more
                const existingIds = new Set(spots.map(spot => spot.travelspot_id));
                const filteredResults = newResults.filter(
                    spot => !existingIds.has(spot.travelspot_id)
                );

                setSpots(prev => [...prev, ...filteredResults]);
            } else {
                // Initial load or filter change
                // Remove duplicates from new results
                const uniqueMap = new Map();
                newResults.forEach(spot => {
                    uniqueMap.set(spot.travelspot_id, spot);
                });
                setSpots(Array.from(uniqueMap.values()));
            }

            setHasMore(!!nearbyData.data.next);
        }
    }, [nearbyData]);

    // Manually trigger refetch when forceRefetch changes
    useEffect(() => {
        if (forceRefetch > 0) {
            refetch();
        }
    }, [forceRefetch, refetch]);

    const handleSpotClick = useCallback((spotSlug) => {
        router.push(ROUTES.PUBLIC.TRAVELSPOT.VIEW(spotSlug));
    }, [router]);

    const handleLoadMore = () => {
        if (nearbyData?.data?.next && !isFetching) {
            // Extract cursor from next URL
            const nextUrl = new URL(nearbyData.data.next);
            const cursor = nextUrl.searchParams.get('cursor');
            setNextCursor(cursor);
        }
    };

    const resetFilters = () => {
        setSortBy('distance');
        setRadius('50');
    };

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p>Unable to load nearby spots</p>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={refetch}
                >
                    Try Again
                </Button>
            </div>
        );
    }

    const isLoadingInitial = isLoading && spots.length === 0;
    const isLoadingMore = isFetching && nextCursor;

    return (
        <div className={styles.container}>
            {/* Header with Filters */}
            <div className={styles.header}>
                <h3 className={styles.title}>
                    <FaMapMarkerAlt /> Nearby Spots
                    {spots.length > 0 && (
                        <span className={styles.countBadge}>
                            {spots.length}{hasMore ? '+' : ''}
                        </span>
                    )}
                </h3>

                <div className={styles.filtersRow}>
                    <SimpleSelect
                        name="radius"
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                        options={radiusOptions}
                        disabled={isFetching}
                        size="sm"
                        placeholder="Select Radius"
                        className={styles.filterSelect}
                    />

                    <SimpleSelect
                        name="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        options={sortOptions}
                        disabled={isFetching}
                        size="sm"
                        placeholder="Sort By"
                        className={styles.filterSelect}
                    />
                </div>
            </div>

            {/* Loading State for Initial Load */}
            {isLoadingInitial && (
                <div className={styles.loadingGrid}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={`skeleton_${i}`} className={styles.skeletonCard}>
                            <div className={styles.skeletonImage}></div>
                            <div className={styles.skeletonText}></div>
                            <div className={styles.skeletonText}></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Spots Grid */}
            {!isLoadingInitial && spots.length > 0 && (
                <>
                    <div className={styles.compactGrid}>
                        {spots.map((spot, index) => (
                            <div
                                key={`${spot.travelspot_id}_${index}`}
                                className={styles.compactCard}
                                onClick={() => handleSpotClick(spot.slug)}
                            >
                                <div className={styles.compactImageWrapper}>
                                    <img
                                        src={spot.primary_image || '/images/default-travel.jpg'}
                                        alt={spot.name}
                                        className={styles.compactImage}
                                        loading="lazy"
                                    />
                                    <div className={styles.distanceBadge}>
                                        {spot.distance_km?.toFixed(1)} km
                                    </div>
                                </div>

                                <div className={styles.compactContent}>
                                    <h4 className={styles.compactTitle}>
                                        {spot.name}
                                    </h4>

                                    <div className={styles.compactMeta}>
                                        <span className={styles.metaItem}>
                                            {spot.distance_km?.toFixed(1)} km away
                                        </span>
                                        {spot.view_count && (
                                            <span className={styles.metaItem}>
                                                • {spot.view_count.toLocaleString()} visits
                                            </span>
                                        )}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={styles.viewButton}
                                        icon={<FaChevronRight />}
                                        iconPosition="right"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                        <div className={styles.loadMoreContainer}>
                            <Button
                                variant="outline"
                                size="md"
                                onClick={handleLoadMore}
                                disabled={isFetching}
                                isLoading={isLoadingMore}
                                loadingText="Loading..."
                            >
                                Load More Spots
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!isLoadingInitial && spots.length === 0 && !isFetching && (
                <div className={styles.emptyState}>
                    <FaMapMarkerAlt className={styles.emptyIcon} />
                    <p>No nearby spots found within {radius}km radius</p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                    >
                        Reset Filters
                    </Button>
                </div>
            )}
        </div>
    );
}