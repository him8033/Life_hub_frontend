'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import TravelSpotMap from '@/components/travelspots/TravelSpotMap';
import NearbySpotsTab from '@/components/travelspots/NearbySpotsTab';
import HeroSection from '@/components/travelspots/HeroSection';
import ReviewSection from '@/components/travelspots/ReviewSection';
import ImageGallerySection from '@/components/travelspots/ImageGallerySection';
import Button from '@/components/common/buttons/Button';
import PublicTravelSpotViewShimmer from '@/components/travelspots/shimmer/PublicTravelSpotViewShimmer';
import styles from '@/styles/travelspots/PublicTravelSpotView.module.css';
import { ROUTES } from '@/routes/routes.constants';
import { useGetTravelSpotBySlugQuery } from '@/services/api/travelspotApi';
import { useGetTravelSpotImagesQuery } from '@/services/api/spotImageApi';
import { formatDateTime, formatTime } from '@/utils/date.utils';
import {
    FaMapMarkerAlt,
    FaInfoCircle,
    FaMapPin,
    FaTag,
    FaDirections,
    FaMap,
    FaShareAlt,
    FaClock,
    FaRupeeSign,
    FaCalendarAlt,
    FaCamera,
    FaMap as FaMapIcon,
    FaLocationArrow
} from 'react-icons/fa';

export default function PublicTravelSpotViewPage() {
    const params = useParams();
    const slug = params.slug;
    const [activeTab, setActiveTab] = useState('photos');
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const contentWrapperRef = useRef(null);

    // Fetch travel spot details
    const { data: spotData, error, isLoading, refetch } = useGetTravelSpotBySlugQuery(slug, { skip: !slug });
    const { data: imagesData } = useGetTravelSpotImagesQuery(
        spotData?.data?.travelspot_id,
        { skip: !spotData?.data?.travelspot_id }
    );

    const travelSpot = spotData?.data || null;

    useEffect(() => {
        if (imagesData?.data) {
            setImages(imagesData.data);
        } else if (travelSpot?.primary_image?.image) {
            setImages([{
                id: 1,
                image_url: travelSpot.primary_image.image,
                caption: travelSpot.primary_image.caption || travelSpot.name,
                is_primary: true
            }]);
        }
    }, [imagesData, travelSpot]);

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

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight * 0.9,
            behavior: 'smooth'
        });
    };

    const getLocationText = () => {
        if (travelSpot?.location) {
            const { state } = travelSpot.location;
            return state || 'Unknown Location';
        }
        return travelSpot?.full_address || 'Unknown Location';
    };

    const getEntryFee = () => {
        if (!travelSpot?.entry_fee || travelSpot.entry_fee === '0.00') {
            return 'Free Entry';
        }
        return `₹${travelSpot.entry_fee}`;
    };

    const getOpeningHours = () => {
        if (travelSpot?.opening_time && travelSpot?.closing_time) {
            return `${formatTime(travelSpot.opening_time)} - ${formatTime(travelSpot.closing_time)}`;
        }
        return 'Not specified';
    };

    // Show shimmer while loading
    if (isLoading) {
        return <PublicTravelSpotViewShimmer />;
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

    if (!travelSpot) {
        return (
            <NotFoundState
                title="Travel Spot Not Found"
                message="The travel spot you're looking for doesn't exist."
                backLabel="Back to Travel Spots"
                backTo={ROUTES.PUBLIC.TRAVELSPOTS}
                fullPage={true}
            />
        );
    }

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <HeroSection
                images={images}
                currentImageIndex={currentImageIndex}
                travelSpot={travelSpot}
                locationText={getLocationText()}
                onPrevImage={prevImage}
                onNextImage={nextImage}
                onGoToImage={goToImage}
                onShare={handleShare}
                onGetDirections={handleGetDirections}
                onScrollToContent={scrollToContent}
            />

            {/* Main Content */}
            <div className={styles.contentWrapper} ref={contentWrapperRef}>
                <div className={styles.mainContent}>
                    {/* Left Column - Details */}
                    <div className={styles.leftColumn}>
                        {/* Basic Information */}
                        <section className={styles.detailsSection}>
                            <h2 className={styles.sectionTitle}>
                                <FaInfoCircle /> Spot Information
                            </h2>
                            <div className={styles.detailsGrid}>
                                <div className={styles.detailCard}>
                                    <div className={styles.detailIcon}><FaLocationArrow /></div>
                                    <div className={styles.detailContent}>
                                        <div className={styles.detailLabel}>Location</div>
                                        <div className={styles.detailValue}>{getLocationText()}</div>
                                    </div>
                                </div>
                                <div className={styles.detailCard}>
                                    <div className={styles.detailIcon}><FaRupeeSign /></div>
                                    <div className={styles.detailContent}>
                                        <div className={styles.detailLabel}>Entry Fee</div>
                                        <div className={styles.detailValue}>{getEntryFee()}</div>
                                    </div>
                                </div>
                                <div className={styles.detailCard}>
                                    <div className={styles.detailIcon}><FaClock /></div>
                                    <div className={styles.detailContent}>
                                        <div className={styles.detailLabel}>Opening Hours</div>
                                        <div className={styles.detailValue}>{getOpeningHours()}</div>
                                    </div>
                                </div>
                                <div className={styles.detailCard}>
                                    <div className={styles.detailIcon}><FaCalendarAlt /></div>
                                    <div className={styles.detailContent}>
                                        <div className={styles.detailLabel}>Best Time to Visit</div>
                                        <div className={styles.detailValue}>
                                            {travelSpot.best_time_to_visit || 'March to June, September to November'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            {travelSpot.category_details?.length > 0 && (
                                <div className={styles.categoriesSection}>
                                    <div className={styles.detailLabel}>Categories</div>
                                    <div className={styles.categories}>
                                        {travelSpot.category_details.map(cat => (
                                            <span key={cat.spotcategory_id} className={styles.categoryTag}>
                                                <FaTag /> {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Description */}
                        <section className={styles.descriptionSection}>
                            <h2 className={styles.sectionTitle}>About This Place</h2>
                            <div className={styles.descriptionContent}>
                                <p>{travelSpot.long_description || travelSpot.short_description}</p>
                            </div>
                        </section>

                        {/* Location Details */}
                        <section className={styles.locationSection}>
                            <h2 className={styles.sectionTitle}>
                                <FaMapPin /> Location Details
                            </h2>
                            <div className={styles.locationGrid}>
                                {travelSpot.full_address && (
                                    <div className={styles.locationItem}>
                                        <div className={styles.locationLabel}>Full Address</div>
                                        <div className={styles.locationValue}>{travelSpot.full_address}</div>
                                    </div>
                                )}
                                {travelSpot.location?.state && (
                                    <div className={styles.locationItem}>
                                        <div className={styles.locationLabel}>State</div>
                                        <div className={styles.locationValue}>{travelSpot.location.state}</div>
                                    </div>
                                )}
                                {travelSpot.location?.district && (
                                    <div className={styles.locationItem}>
                                        <div className={styles.locationLabel}>District</div>
                                        <div className={styles.locationValue}>{travelSpot.location.district}</div>
                                    </div>
                                )}
                                {travelSpot.location?.village && (
                                    <div className={styles.locationItem}>
                                        <div className={styles.locationLabel}>Village / Town</div>
                                        <div className={styles.locationValue}>{travelSpot.location.village}</div>
                                    </div>
                                )}
                                {travelSpot.location?.pincode && (
                                    <div className={styles.locationItem}>
                                        <div className={styles.locationLabel}>PIN Code</div>
                                        <div className={styles.locationValue}>{travelSpot.location.pincode}</div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Map & Quick Info */}
                    <div className={styles.rightColumn}>
                        <section className={styles.mapSection}>
                            <div className={styles.mapHeader}>
                                <h3 className={styles.mapTitle}>
                                    <FaMap /> Location Map
                                </h3>
                                {travelSpot.latitude && travelSpot.longitude && (
                                    <Button
                                        variant="primary"
                                        size="md"
                                        onClick={handleGetDirections}
                                        icon={<FaDirections />}
                                    >
                                        Get Directions
                                    </Button>
                                )}
                            </div>
                            <div className={styles.mapContainer}>
                                <TravelSpotMap
                                    latitude={travelSpot.latitude}
                                    longitude={travelSpot.longitude}
                                    name={travelSpot.name}
                                    city={getLocationText()}
                                    address={travelSpot.full_address}
                                    height="300px"
                                    zoom={travelSpot.latitude && travelSpot.longitude ? 14 : 10}
                                    interactive={true}
                                />
                            </div>
                            {travelSpot.full_address && (
                                <div className={styles.mapAddress}>
                                    <FaMapMarkerAlt /> {travelSpot.full_address}
                                </div>
                            )}
                        </section>

                        <section className={styles.quickInfoSection}>
                            <h3 className={styles.quickInfoTitle}>Quick Information</h3>
                            <div className={styles.quickInfoGrid}>
                                <div className={styles.quickInfoCard}>
                                    <div className={styles.quickInfoLabel}>Status</div>
                                    <div className={`${styles.quickInfoValue} ${travelSpot.is_active ? styles.active : styles.inactive}`}>
                                        {travelSpot.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <div className={styles.quickInfoCard}>
                                    <div className={styles.quickInfoLabel}>Created</div>
                                    <div className={styles.quickInfoValue}>{formatDateTime(travelSpot.created_at)}</div>
                                </div>
                                <div className={styles.quickInfoCard}>
                                    <div className={styles.quickInfoLabel}>Last Updated</div>
                                    <div className={styles.quickInfoValue}>{formatDateTime(travelSpot.updated_at)}</div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Tabs Section */}
                <section className={styles.tabsSection}>
                    <div className={styles.tabsHeader}>
                        <Button
                            variant={activeTab === 'photos' ? 'primary' : 'ghost'}
                            size="md"
                            onClick={() => setActiveTab('photos')}
                            icon={<FaCamera />}
                            iconPosition="left"
                            className={`${styles.tabBtn} ${activeTab === 'photos' ? styles.activeTab : ''}`}
                        >
                            Gallery
                        </Button>
                        <Button
                            variant={activeTab === 'nearby' ? 'primary' : 'ghost'}
                            size="md"
                            onClick={() => setActiveTab('nearby')}
                            icon={<FaMapIcon />}
                            iconPosition="left"
                            className={`${styles.tabBtn} ${activeTab === 'nearby' ? styles.activeTab : ''}`}
                        >
                            Nearby Spots
                        </Button>
                    </div>

                    <div className={styles.tabContent}>
                        {activeTab === 'photos' && (
                            <ImageGallerySection images={images} />
                        )}

                        {activeTab === 'nearby' && (
                            <div className={styles.nearbyTab}>
                                <NearbySpotsTab slug={slug} initialLimit={5} />
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}