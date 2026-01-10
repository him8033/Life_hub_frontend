'use client';

import { useRouter } from 'next/navigation';
import styles from '@/styles/travelspots/PublicTravelSpotCard.module.css';
import { ROUTES } from '@/routes/routes.constants';
import { formatDateTime } from '@/utils/date.utils';

export default function TravelSpotCard({ travelSpot }) {
    const router = useRouter();

    const handleViewDetails = () => {
        router.push(ROUTES.TRAVELSPOT.VIEW(travelSpot.slug));
    };

    return (
        <div className={styles.card}>
            {/* Card Header */}
            <div className={styles.cardHeader}>
                <div className={styles.cardBadge}>
                    <span className={styles.badgeCity}>{travelSpot.city}</span>
                </div>
                <h3 className={styles.cardTitle}>{travelSpot.name}</h3>
                <p className={styles.cardSubtitle}>{travelSpot.short_description}</p>
            </div>

            {/* Card Body */}
            <div className={styles.cardBody}>
                <div className={styles.details}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Address:</span>
                        <p className={styles.detailValue}>{travelSpot.full_address}</p>
                    </div>

                    {travelSpot.latitude && travelSpot.longitude && (
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Coordinates:</span>
                            <p className={styles.detailValue}>
                                {travelSpot.latitude}, {travelSpot.longitude}
                            </p>
                        </div>
                    )}

                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Added:</span>
                        <span className={styles.detailValue}>
                            {formatDateTime(travelSpot.created_at)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className={styles.cardFooter}>
                <button
                    onClick={handleViewDetails}
                    className={styles.viewButton}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}