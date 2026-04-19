'use client';

import styles from '@/styles/travelspots/shimmer/PublicTravelSpotViewShimmer.module.css';
import { FaMapMarkerAlt, FaShareAlt, FaHeart, FaDirections, FaChevronLeft, FaChevronRight, FaChevronDown, FaPause } from 'react-icons/fa';

// Individual Shimmer Components
const ShimmerDetailCard = () => (
    <div className={styles.shimmerDetailCard}>
        <div className={styles.shimmerDetailIcon} />
        <div className={styles.shimmerDetailContent}>
            <div className={styles.shimmerDetailLabel} />
            <div className={styles.shimmerDetailValue} />
        </div>
    </div>
);

const ShimmerLocationItem = () => (
    <div className={styles.shimmerLocationItem}>
        <div className={styles.shimmerLocationLabel} />
        <div className={styles.shimmerLocationValue} />
    </div>
);

// Hero Shimmer
export const ShimmerHero = () => (
    <section className={styles.shimmerHeroSection}>
        <div className={styles.shimmerHeroBackground} />

        <div className={styles.shimmerHeroContent}>
            <div className={styles.shimmerHeroTag}>
                <FaMapMarkerAlt className={styles.shimmerIcon} />
                <div className={styles.shimmerTagText} />
            </div>

            <div className={styles.shimmerHeroTitle} />
            <div className={styles.shimmerHeroSubtitle} />

            <div className={styles.shimmerHeroActions}>
                <div className={styles.shimmerActionButton}>
                    <FaShareAlt className={styles.shimmerIcon} />
                    <div className={styles.shimmerButtonText} />
                </div>
                <div className={styles.shimmerActionButton}>
                    <FaHeart className={styles.shimmerIcon} />
                    <div className={styles.shimmerButtonText} />
                </div>
                <div className={styles.shimmerActionButton}>
                    <FaDirections className={styles.shimmerIcon} />
                    <div className={styles.shimmerButtonText} />
                </div>
            </div>
        </div>

        <button className={`${styles.shimmerHeroNav} ${styles.shimmerPrevNav}`} disabled>
            <FaChevronLeft />
        </button>
        <button className={`${styles.shimmerHeroNav} ${styles.shimmerNextNav}`} disabled>
            <FaChevronRight />
        </button>

        <div className={styles.shimmerHeroDots}>
            {Array.from({ length: 4 }).map((_, index) => (
                <button
                    key={index}
                    className={`${styles.shimmerHeroDot} ${index === 0 ? styles.shimmerActiveDot : ''}`}
                    disabled
                />
            ))}
        </div>

        <div className={styles.shimmerImageControls}>
            <div className={styles.shimmerImageCounter} />
            <button className={styles.shimmerAutoSlideToggle} disabled>
                <FaPause />
            </button>
        </div>

        <button className={styles.shimmerScrollIndicator} disabled>
            <div className={styles.shimmerScrollText} />
            <FaChevronDown className={styles.shimmerScrollIcon} />
        </button>
    </section>
);

export const ShimmerSpotInformation = () => (
    <section className={styles.shimmerSection}>
        <div className={styles.shimmerSectionTitle} />
        <div className={`${styles.shimmerGrid} ${styles.gridCols4}`}>
            {Array.from({ length: 4 }).map((_, i) => (
                <ShimmerDetailCard key={i} />
            ))}
        </div>
    </section>
);

export const ShimmerDescription = () => (
    <section className={styles.shimmerDescriptionSection}>
        <div className={styles.shimmerSectionTitle} />
        <div className={styles.shimmerDescription}>
            <div className={styles.shimmerTextLine} />
            <div className={styles.shimmerTextLine} />
            <div className={styles.shimmerTextLine} style={{ width: '80%' }} />
            <div className={styles.shimmerTextLine} style={{ width: '60%' }} />
            <div className={styles.shimmerTextLine} style={{ width: '90%' }} />
        </div>
    </section>
);

export const ShimmerLocationDetails = () => (
    <section className={styles.shimmerLocationSection}>
        <div className={styles.shimmerSectionTitle} />
        <div className={styles.shimmerLocationGrid}>
            {Array.from({ length: 5 }).map((_, i) => (
                <ShimmerLocationItem key={i} />
            ))}
        </div>
    </section>
);

export const ShimmerMap = () => (
    <section className={styles.shimmerMap}>
        <div className={styles.shimmerMapHeader}>
            <div className={styles.shimmerMapTitle} />
            <div className={styles.shimmerMapButton} />
        </div>
        <div className={styles.shimmerMapContainer} />
        <div className={styles.shimmerMapAddress} />
    </section>
);

export const ShimmerQuickInfo = () => (
    <section className={styles.shimmerQuickInfo}>
        <div className={styles.shimmerQuickInfoTitle} />
        <div className={styles.shimmerQuickInfoGrid}>
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.shimmerQuickInfoCard}>
                    <div className={styles.shimmerQuickInfoLabel} />
                    <div className={styles.shimmerQuickInfoValue} />
                </div>
            ))}
        </div>
    </section>
);

export const ShimmerTabs = () => (
    <section className={styles.shimmerTabs}>
        <div className={styles.shimmerTabsHeader}>
            <div className={styles.shimmerTab} />
            <div className={styles.shimmerTab} />
        </div>
        <div className={styles.shimmerTabContent}>
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.shimmerGalleryItem} />
            ))}
        </div>
    </section>
);

// Main Layout Shimmer Component
const PublicTravelSpotViewShimmer = () => {
    return (
        <div className={styles.container}>
            <ShimmerHero />
            <div className={styles.contentWrapper}>
                <div className={styles.mainContent}>
                    <div className={styles.leftColumn}>
                        <ShimmerSpotInformation />
                        <ShimmerDescription />
                        <ShimmerLocationDetails />
                    </div>

                    <div className={styles.rightColumn}>
                        <ShimmerMap />
                        <ShimmerQuickInfo />
                    </div>
                </div>

                <ShimmerTabs />
            </div>
        </div>
    );
};

export default PublicTravelSpotViewShimmer;