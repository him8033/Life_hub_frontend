'use client';

import { useState, useEffect, useMemo } from 'react';
import TravelSpotCard from '@/components/travelspots/TravelSpotCard';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import styles from '@/styles/travelspots/PublicTravelSpots.module.css';
import { ROUTES } from '@/routes/routes.constants';
import { useGetPublicTravelSpotsQuery, useGetTravelSpotsQuery } from '@/services/api/travelspotApi';

export default function PublicTravelSpotsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const { data, error, isLoading, refetch } = useGetPublicTravelSpotsQuery();

    const travelSpots = data?.data || [];

    // Get unique cities for filter
    const uniqueCities = useMemo(() => {
        const cities = travelSpots.map(spot => spot.city);
        return [...new Set(cities)].sort();
    }, [travelSpots]);

    // Filter and sort travel spots
    const filteredAndSortedSpots = useMemo(() => {
        let filtered = travelSpots.filter(spot => {
            const matchesSearch =
                spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                spot.short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                spot.city.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCity = cityFilter === 'all' || spot.city === cityFilter;

            return matchesSearch && matchesCity;
        });

        // Sort the filtered results
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'city':
                    return a.city.localeCompare(b.city);
                case 'newest':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'oldest':
                    return new Date(a.created_at) - new Date(b.created_at);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [travelSpots, searchTerm, cityFilter, sortBy]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setCityFilter('all');
        setSortBy('name');
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
        <div className={styles.publicContainer}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Explore Travel Spots</h1>
                    <p className={styles.subtitle}>
                        Discover amazing places to visit across different cities
                    </p>
                </div>
            </header>

            {/* Filters Section */}
            <div className={styles.filtersSection}>
                <div className={styles.filtersContainer}>
                    {/* Search */}
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Search by name, city, or Description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                        <span className={styles.searchIcon}>🔍</span>
                    </div>

                    {/* City Filter */}
                    <div className={styles.filterGroup}>
                        <select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Cities</option>
                            {uniqueCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort By */}
                    <div className={styles.filterGroup}>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="city">Sort by City</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(searchTerm || cityFilter !== 'all' || sortBy !== 'name') && (
                        <button
                            onClick={handleClearFilters}
                            className={styles.clearButton}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Results Info */}
            <div className={styles.resultsInfo}>
                <p className={styles.resultsCount}>
                    Showing {filteredAndSortedSpots.length} of {travelSpots.length} travel spots
                </p>
            </div>

            {/* Travel Spots Grid */}
            <div className={styles.spotsContainer}>
                {filteredAndSortedSpots.length === 0 ? (
                    <div className={styles.noResults}>
                        <p className={styles.noResultsMessage}>
                            {travelSpots.length === 0
                                ? 'No travel spots available at the moment.'
                                : 'No travel spots match your search criteria.'}
                        </p>
                        {(searchTerm || cityFilter !== 'all') && (
                            <button
                                onClick={handleClearFilters}
                                className={styles.clearButton}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={styles.spotsGrid}>
                        {filteredAndSortedSpots.map((spot) => (
                            <TravelSpotCard
                                key={spot.id}
                                travelSpot={spot}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className={styles.footer}>
                <p className={styles.footerText}>
                    © {new Date().getFullYear()} LifeHub Travel Spots. All rights reserved.
                </p>
            </footer>
        </div>
    );
}