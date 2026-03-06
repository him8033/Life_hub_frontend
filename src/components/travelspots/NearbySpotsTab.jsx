'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGetNearbyTravelSpotsQuery } from '@/services/api/travelspotApi';
import { ROUTES } from '@/routes/routes.constants';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaChevronRight, FaSpinner } from 'react-icons/fa';
import styles from '@/styles/travelspots/NearbySpotsTab.module.css';

export default function NearbySpotsTab({ slug }) {
    const router = useRouter();
    const [sortBy, setSortBy] = useState('distance');
    const [radius, setRadius] = useState('50');
    const [spots, setSpots] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [forceRefetch, setForceRefetch] = useState(0);

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
                <button onClick={refetch} className={styles.retryButton}>
                    Try Again
                </button>
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
                    <select
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                        className={styles.filterSelect}
                        disabled={isFetching}
                    >
                        <option value="1">Within 1km</option>
                        <option value="2.5">Within 2.5km</option>
                        <option value="5">Within 5km</option>
                        <option value="10">Within 10km</option>
                        <option value="25">Within 25km</option>
                        <option value="50">Within 50km</option>
                        <option value="100">Within 100km</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={styles.filterSelect}
                        disabled={isFetching}
                    >
                        <option value="distance">Closest First</option>
                        <option value="most_visited">Most Visited</option>
                    </select>
                </div>
            </div>

            {/* Loading State for Initial Load */}
            {isLoadingInitial && (
                <div className={styles.loadingGrid}>
                    {[1, 2, 3].map((i) => (
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

                                    <button className={styles.viewButton}>
                                        View Details <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                        <div className={styles.loadMoreContainer}>
                            <button
                                onClick={handleLoadMore}
                                className={styles.loadMoreButton}
                                disabled={isFetching}
                            >
                                {isLoadingMore ? (
                                    <>
                                        <FaSpinner className={styles.spinner} />
                                        Loading...
                                    </>
                                ) : (
                                    'Load More Spots'
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!isLoadingInitial && spots.length === 0 && !isFetching && (
                <div className={styles.emptyState}>
                    <FaMapMarkerAlt className={styles.emptyIcon} />
                    <p>No nearby spots found within {radius}km radius</p>
                    <button onClick={resetFilters} className={styles.resetButton}>
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
}