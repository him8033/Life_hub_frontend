'use client';

import { useParams, useRouter } from 'next/navigation';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import styles from '@/styles/travelspots/PublicTravelSpotView.module.css';
import { ROUTES } from '@/routes/routes.constants';
import { useGetTravelSpotBySlugQuery } from '@/services/api/travelspotApi';
import { formatDateTime } from '@/utils/date.utils';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function PublicTravelSpotViewPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;

    const { data, error, isLoading, refetch } = useGetTravelSpotBySlugQuery(slug, { skip: !slug, });
    const travelSpot = data?.data || null;

    const handleBackToList = () => {
        router.push(ROUTES.PUBLIC.TRAVELSPOTS);
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
        <div className={styles.viewContainer}>
            {/* Back Button */}
            <div className={styles.backSection}>
                <button
                    onClick={router.back}
                    className={styles.backButton}
                >
                    ← Back to All Travel Spots
                </button>
            </div>

            {/* Main Content */}
            <div className={styles.content}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.badge}>
                        <span className={styles.cityBadge}>{travelSpot.city}</span>
                    </div>
                    <h1 className={styles.title}>{travelSpot.name}</h1>
                    <p className={styles.subtitle}>{travelSpot.short_description}</p>
                </header>

                {/* Details Grid */}
                <div className={styles.detailsGrid}>
                    {/* Location Details */}
                    <div className={styles.detailSection}>
                        <h3 className={styles.sectionTitle}>Location Details</h3>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Full Address:</span>
                            <p className={styles.detailText}>{travelSpot.full_address}</p>
                        </div>

                        {travelSpot.latitude && travelSpot.longitude && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Coordinates:</span>
                                <div className={styles.coordinates}>
                                    <span className={styles.coordinate}>
                                        <strong>Lat:</strong> {travelSpot.latitude}
                                    </span>
                                    <span className={styles.coordinate}>
                                        <strong>Long:</strong> {travelSpot.longitude}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Map Preview (Placeholder) */}
                    <div className={styles.mapSection}>
                        <h3 className={styles.sectionTitle}>Location Map</h3>
                        <div className={styles.mapPlaceholder}>
                            <p className={styles.mapText}>
                                <FaMapMarkerAlt /> {travelSpot.city} - {travelSpot.name}
                            </p>
                            <p className={styles.mapHelp}>
                                Map view would be displayed here
                            </p>
                            {travelSpot.latitude && travelSpot.longitude && (
                                <p className={styles.mapCoords}>
                                    Coordinates: {travelSpot.latitude}, {travelSpot.longitude}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className={styles.infoSection}>
                        <h3 className={styles.sectionTitle}>Additional Information</h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Travel Spot ID:</span>
                                <span className={styles.infoValue}>{travelSpot.travelspot_id}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Added On:</span>
                                <span className={styles.infoValue}>{formatDateTime(travelSpot.created_at)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Last Updated:</span>
                                <span className={styles.infoValue}>{formatDateTime(travelSpot.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <button
                        onClick={handleBackToList}
                        className={styles.backToListButton}
                    >
                        ← Back to All Travel Spots
                    </button>
                </div>
            </div>
        </div>
    );
}