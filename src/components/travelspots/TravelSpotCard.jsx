'use client';

import { useRouter } from 'next/navigation';
import styles from '@/styles/travelspots/PublicTravelSpotCard.module.css';
import { ROUTES } from '@/routes/routes.constants';

export default function TravelSpotCard({ travelSpot }) {
    const router = useRouter();
    const imageSrc = travelSpot.primary_image?.image || "/images/placeholders/default.png";
    const imageAlt = travelSpot.primary_image?.caption || travelSpot.name;

    const handleCardClick = () => {
        router.push(ROUTES.PUBLIC.TRAVELSPOT.VIEW(travelSpot.slug));
    };

    // Get location display text
    const getLocationText = () => {
        if (travelSpot.location) {
            const { state } = travelSpot.location;
            return state || 'Unknown Location';
        }
        return travelSpot.full_address || 'Unknown Location';
    };

    // Get entry fee display
    // const getEntryFee = () => {
    //     if (!travelSpot.entry_fee || travelSpot.entry_fee === '0.00') {
    //         return 'Free Entry';
    //     }
    //     return `Entry Fee: ₹${travelSpot.entry_fee}`;
    // };

    return (
        <div
            className={styles.card}
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick();
                }
            }}
        >
            {/* Card Image */}
            <div className={styles.cardImageContainer}>
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className={styles.cardImage}
                    loading="lazy"
                />
                {/* Badge overlay */}
                <div className={styles.cardBadge}>
                    <span className={styles.badgeCity}>{getLocationText()}</span>
                </div>
            </div>

            {/* Card Content */}
            <div className={styles.cardContent}>
                {/* Title and Categories */}
                <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{travelSpot.name}</h3>

                    {travelSpot.category_details && travelSpot.category_details.length > 0 && (
                        <div className={styles.categoriesContainer}>
                            {travelSpot.category_details.slice(0, 2).map((category) => (
                                <span key={category.id} className={styles.categoryTag}>
                                    {category.name}
                                </span>
                            ))}
                            {travelSpot.category_details.length > 3 && (
                                <span className={styles.categoryTag}>
                                    +{travelSpot.category_details.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Short Description */}
                {travelSpot.short_description && (
                    <p className={styles.cardDescription}>
                        {travelSpot.short_description.length > 150
                            ? `${travelSpot.short_description.substring(0, 150)}...`
                            : travelSpot.short_description}
                    </p>
                )}

                {/* Additional Info */}
                {/* <div className={styles.cardFooter}>
                    <div className={styles.details}>
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Location:</span>
                            <span className={styles.detailValue}>{getLocationText()}</span>
                        </div>

                        {travelSpot.entry_fee && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Entry:</span>
                                <span className={styles.detailValue}>{getEntryFee()}</span>
                            </div>
                        )}

                        {travelSpot.best_time_to_visit && (
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Best Time:</span>
                                <span className={styles.detailValue}>{travelSpot.best_time_to_visit}</span>
                            </div>
                        )}
                    </div>
                </div> */}
            </div>
        </div>
    );
}