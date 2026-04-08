'use client';

import { useRouter } from 'next/navigation';
import styles from '@/styles/travelspots/PublicTravelSpotCard.module.css';
import { ROUTES } from '@/routes/routes.constants';
import { FiMapPin } from 'react-icons/fi';

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
            const { state, district, village } = travelSpot.location;
            const parts = [village, district, state].filter(Boolean);
            return parts.join(', ') || 'Unknown Location';
        }
        return travelSpot.full_address || 'Unknown Location';
    };

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
                {/* Location Badge - Top Right */}
                <div className={styles.locationBadge}>
                    <FiMapPin className={styles.locationIcon} />
                    <span className={styles.locationText}>{getLocationText()}</span>
                </div>
            </div>

            {/* Card Content */}
            <div className={styles.cardContent}>
                {/* Title */}
                <h3 className={styles.cardTitle}>{travelSpot.name}</h3>

                {/* Categories - Pill shaped */}
                {travelSpot.category_details && travelSpot.category_details.length > 0 && (
                    <div className={styles.categoriesContainer}>
                        {travelSpot.category_details.slice(0, 3).map((category) => (
                            <span key={category.id} className={styles.categoryPill}>
                                {category.name}
                            </span>
                        ))}
                        {travelSpot.category_details.length > 3 && (
                            <span className={styles.categoryPillMore}>
                                +{travelSpot.category_details.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Short Description - 3 lines */}
                {travelSpot.short_description && (
                    <p className={styles.cardDescription}>
                        {travelSpot.short_description}
                    </p>
                )}
            </div>
        </div>
    );
}