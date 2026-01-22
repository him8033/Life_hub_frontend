'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import TravelSpotMap from '@/components/travelspots/TravelSpotMap';
import styles from '@/styles/travelspots/PublicTravelSpotView.module.css';
import { ROUTES } from '@/routes/routes.constants';
import { useGetTravelSpotBySlugQuery } from '@/services/api/travelspotApi';
import { formatDateTime } from '@/utils/date.utils';
import { FaMapMarkerAlt, FaGlobe, FaDirections, FaShareAlt, FaHeart } from 'react-icons/fa';

export default function PublicTravelSpotViewPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;
    const [activeTab, setActiveTab] = useState('details');

    const { data, error, isLoading, refetch } = useGetTravelSpotBySlugQuery(slug, { skip: !slug });
    const travelSpot = data?.data || null;

    const handleBackToList = () => {
        router.push(ROUTES.PUBLIC.TRAVELSPOTS);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: travelSpot.name,
                text: travelSpot.short_description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleGetDirections = () => {
        if (travelSpot.latitude && travelSpot.longitude) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${travelSpot.latitude},${travelSpot.longitude}`,
                '_blank'
            );
        }
    };

    if (isLoading) {
        return <Loader text="Loading travel spot details..." />;
    }

    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Travel Spot Not Found"
                message="The travel spot you're looking for doesn't exist or is no longer available."
                backLabel="Back to Travel Spots"
                backTo={ROUTES.PUBLIC.TRAVELSPOTS}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load travel spot details. Please try again."}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    return (
        <div className={styles.container}>
            {/* Back Button */}
            <div className={styles.backSection}>
                <button
                    onClick={handleBackToList}
                    className={styles.backButton}
                >
                    ← Back to Travel Spots
                </button>
            </div>

            {/* Main Content */}
            <div className={styles.content}>
                {/* Left Column - Details */}
                <div className={styles.detailsColumn}>
                    {/* Header Card */}
                    <div className={styles.headerCard}>
                        <div className={styles.headerTop}>
                            <span className={styles.cityBadge}>
                                <FaMapMarkerAlt /> {travelSpot.city}
                            </span>
                            <div className={styles.headerActions}>
                                <button
                                    onClick={handleShare}
                                    className={styles.iconButton}
                                    title="Share"
                                >
                                    <FaShareAlt />
                                </button>
                                <button
                                    className={styles.iconButton}
                                    title="Save to favorites"
                                >
                                    <FaHeart />
                                </button>
                            </div>
                        </div>
                        <h1 className={styles.title}>{travelSpot.name}</h1>
                        <p className={styles.subtitle}>{travelSpot.short_description}</p>
                    </div>

                    {/* Details Card */}
                    <div className={styles.detailsCard}>
                        <h2 className={styles.sectionTitle}>
                            <FaGlobe /> Location Details
                        </h2>

                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Full Address:</span>
                            <p className={styles.detailValue}>{travelSpot.full_address}</p>
                        </div>

                        {travelSpot.latitude && travelSpot.longitude && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Coordinates:</span>
                                <div className={styles.coordinates}>
                                    <span className={styles.coordinate}>
                                        <strong>Latitude:</strong> {travelSpot.latitude}
                                    </span>
                                    <span className={styles.coordinate}>
                                        <strong>Longitude:</strong> {travelSpot.longitude}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Categories */}
                        {travelSpot.category_details && travelSpot.category_details.length > 0 && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Categories:</span>
                                <div className={styles.categories}>
                                    {travelSpot.category_details.map(cat => (
                                        <span key={cat.spotcategory_id} className={styles.categoryTag}>
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Meta Information */}
                        <div className={styles.metaInfo}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Added On:</span>
                                <span className={styles.metaValue}>{formatDateTime(travelSpot.created_at)}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Last Updated:</span>
                                <span className={styles.metaValue}>{formatDateTime(travelSpot.updated_at)}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Spot ID:</span>
                                <span className={styles.metaValue}>{travelSpot.travelspot_id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Map */}
                <div className={styles.mapColumn}>
                    <div className={styles.mapCard}>
                        <div className={styles.mapHeader}>
                            <h2 className={styles.mapTitle}>
                                <FaMapMarkerAlt /> Location Map
                            </h2>
                            <div className={styles.mapActions}>
                                {travelSpot.latitude && travelSpot.longitude && (
                                    <button
                                        className={styles.directionsButton}
                                        onClick={handleGetDirections}
                                    >
                                        <FaDirections /> Get Directions
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Map Component */}
                    </div>
                        <TravelSpotMap
                            latitude={travelSpot.latitude}
                            longitude={travelSpot.longitude}
                            name={travelSpot.name}
                            city={travelSpot.city}
                            address={travelSpot.full_address}
                            height="500px"
                            zoom={travelSpot.latitude && travelSpot.longitude ? 14 : 10}
                            interactive={true}
                        />
                </div>
            </div>

            {/* Tabs for additional content */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        More Details
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'nearby' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('nearby')}
                    >
                        Nearby Spots
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'photos' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('photos')}
                    >
                        Photos
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'details' && (
                        <div className={styles.tabPane}>
                            <h3>Additional Information</h3>
                            <p>More detailed information about this travel spot will appear here.</p>
                            {/* Add more details as needed */}
                        </div>
                    )}
                    {activeTab === 'nearby' && (
                        <div className={styles.tabPane}>
                            <h3>Nearby Travel Spots</h3>
                            <p>Other travel spots in the same area will be displayed here.</p>
                        </div>
                    )}
                    {activeTab === 'photos' && (
                        <div className={styles.tabPane}>
                            <h3>Photo Gallery</h3>
                            <p>Photos of this travel spot will be displayed here.</p>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className={styles.tabPane}>
                            <h3>Visitor Reviews</h3>
                            <p>Reviews and ratings from other travelers will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}