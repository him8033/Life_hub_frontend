'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import TravelSpotMap from '@/components/travelspots/TravelSpotMap';
import styles from '@/styles/travelspots/PublicTravelSpotView.module.css';
import { ROUTES } from '@/routes/routes.constants';
import { useGetTravelSpotBySlugQuery } from '@/services/api/travelspotApi';
import { useGetTravelSpotImagesQuery } from '@/services/api/spotImageApi';
import { formatDateTime, formatTime } from '@/utils/date.utils';
import {
    FaMapMarkerAlt,
    FaGlobe,
    FaDirections,
    FaShareAlt,
    FaHeart,
    FaClock,
    FaRupeeSign,
    FaCalendarAlt,
    FaTag,
    FaInfoCircle,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';

export default function PublicTravelSpotViewPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;
    const [activeTab, setActiveTab] = useState('details');
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Fetch travel spot details
    const { data: spotData, error, isLoading, refetch } = useGetTravelSpotBySlugQuery(slug, { skip: !slug });

    // Fetch travel spot images
    const { data: imagesData } = useGetTravelSpotImagesQuery(
        spotData?.data?.travelspot_id,
        { skip: !spotData?.data?.travelspot_id }
    );

    const travelSpot = spotData?.data || null;

    useEffect(() => {
        if (imagesData?.data) {
            setImages(imagesData.data);
        } else if (travelSpot?.primary_image?.image) {
            // If no images array but we have primary image, create array with it
            setImages([{
                id: 1,
                image_url: travelSpot.primary_image.image,
                caption: travelSpot.primary_image.caption || travelSpot.name,
                is_primary: true
            }]);
        }
    }, [imagesData, travelSpot]);

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

    // Get location display text
    const getLocationText = () => {
        if (travelSpot.location) {
            const { city, district, state } = travelSpot.location;
            return city || district || state || 'Unknown Location';
        }
        return travelSpot.full_address || 'Unknown Location';
    };

    // Get entry fee display
    const getEntryFee = () => {
        if (!travelSpot.entry_fee || travelSpot.entry_fee === '0.00') {
            return 'Free Entry';
        }
        return `₹${travelSpot.entry_fee}`;
    };

    // Format opening hours
    const getOpeningHours = () => {
        if (travelSpot.opening_time && travelSpot.closing_time) {
            return `${formatTime(travelSpot.opening_time)} - ${formatTime(travelSpot.closing_time)}`;
        }
        return 'Not specified';
    };

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
                {/* Left Column - Images and Details */}
                <div className={styles.leftColumn}>
                    {/* Image Carousel */}
                    {images.length > 0 ? (
                        <div className={styles.imageCarousel}>
                            <div className={styles.carouselContainer}>
                                <img
                                    src={images[currentImageIndex].image_url}
                                    alt={images[currentImageIndex].caption || travelSpot.name}
                                    className={styles.mainImage}
                                />

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            className={`${styles.carouselNav} ${styles.prevButton}`}
                                            onClick={prevImage}
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        <button
                                            className={`${styles.carouselNav} ${styles.nextButton}`}
                                            onClick={nextImage}
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </>
                                )}

                                {/* Image Counter */}
                                <div className={styles.imageCounter}>
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className={styles.thumbnailContainer}>
                                    {images.map((image, index) => (
                                        <button
                                            key={image.id}
                                            className={`${styles.thumbnail} ${index === currentImageIndex ? styles.activeThumbnail : ''}`}
                                            onClick={() => goToImage(index)}
                                        >
                                            <img
                                                src={image.image_url}
                                                alt={image.caption || `Image ${index + 1}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.noImage}>
                            <div className={styles.noImagePlaceholder}>
                                <FaGlobe className={styles.noImageIcon} />
                                <p>No images available</p>
                            </div>
                        </div>
                    )}

                    {/* Details Card */}
                    <div className={styles.detailsCard}>
                        <div className={styles.detailsHeader}>
                            <h1 className={styles.title}>{travelSpot.name}</h1>
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

                        <div className={styles.locationBadge}>
                            <FaMapMarkerAlt />
                            <span>{getLocationText()}</span>
                        </div>

                        <p className={styles.shortDescription}>
                            {travelSpot.short_description}
                        </p>

                        {travelSpot.long_description && (
                            <div className={styles.longDescription}>
                                <h3 className={styles.sectionTitle}>
                                    <FaInfoCircle /> Description
                                </h3>
                                <p>{travelSpot.long_description}</p>
                            </div>
                        )}

                        {/* Quick Facts */}
                        <div className={styles.quickFacts}>
                            <div className={styles.factItem}>
                                <div className={styles.factIcon}>
                                    <FaRupeeSign />
                                </div>
                                <div className={styles.factContent}>
                                    <span className={styles.factLabel}>Entry Fee</span>
                                    <span className={styles.factValue}>{getEntryFee()}</span>
                                </div>
                            </div>

                            <div className={styles.factItem}>
                                <div className={styles.factIcon}>
                                    <FaClock />
                                </div>
                                <div className={styles.factContent}>
                                    <span className={styles.factLabel}>Timing</span>
                                    <span className={styles.factValue}>{getOpeningHours()}</span>
                                </div>
                            </div>

                            {travelSpot.best_time_to_visit && (
                                <div className={styles.factItem}>
                                    <div className={styles.factIcon}>
                                        <FaCalendarAlt />
                                    </div>
                                    <div className={styles.factContent}>
                                        <span className={styles.factLabel}>Best Time</span>
                                        <span className={styles.factValue}>{travelSpot.best_time_to_visit}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Categories */}
                        {travelSpot.category_details && travelSpot.category_details.length > 0 && (
                            <div className={styles.categoriesSection}>
                                <h3 className={styles.sectionTitle}>
                                    <FaTag /> Categories
                                </h3>
                                <div className={styles.categories}>
                                    {travelSpot.category_details.map(cat => (
                                        <span key={cat.spotcategory_id} className={styles.categoryTag}>
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact Information */}
                        <div className={styles.contactSection}>
                            <h3 className={styles.sectionTitle}>
                                <FaGlobe /> Location Details
                            </h3>
                            <div className={styles.contactDetails}>
                                <div className={styles.contactItem}>
                                    <span className={styles.contactLabel}>Full Address:</span>
                                    <p className={styles.contactValue}>{travelSpot.full_address}</p>
                                </div>

                                <div className={styles.contactItem}>
                                    <span className={styles.contactLabel}>Coordinates:</span>
                                    <div className={styles.coordinates}>
                                        <span className={styles.coordinate}>
                                            <strong>Latitude:</strong> {travelSpot.latitude}
                                        </span>
                                        <span className={styles.coordinate}>
                                            <strong>Longitude:</strong> {travelSpot.longitude}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Map and Additional Info */}
                <div className={styles.rightColumn}>
                    {/* Map Card */}
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

                        <TravelSpotMap
                            latitude={travelSpot.latitude}
                            longitude={travelSpot.longitude}
                            name={travelSpot.name}
                            city={getLocationText()}
                            address={travelSpot.full_address}
                            height="400px"
                            zoom={travelSpot.latitude && travelSpot.longitude ? 14 : 10}
                            interactive={true}
                        />
                    </div>

                    {/* Additional Information Card */}
                    <div className={styles.infoCard}>
                        <h3 className={styles.sectionTitle}>Additional Information</h3>

                        <div className={styles.metaInfo}>
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Travel Spot ID:</span>
                                <span className={styles.metaValue}>{travelSpot.travelspot_id}</span>
                            </div>

                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Added On:</span>
                                <span className={styles.metaValue}>{formatDateTime(travelSpot.created_at)}</span>
                            </div>

                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Last Updated:</span>
                                <span className={styles.metaValue}>{formatDateTime(travelSpot.updated_at)}</span>
                            </div>

                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Status:</span>
                                <span className={`${styles.statusBadge} ${travelSpot.is_active ? styles.active : styles.inactive}`}>
                                    {travelSpot.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Photo Gallery Preview */}
                    {images.length > 0 && (
                        <div className={styles.photosPreview}>
                            <h3 className={styles.sectionTitle}>Photo Gallery</h3>
                            <div className={styles.previewGrid}>
                                {images.slice(0, 4).map((image, index) => (
                                    <div key={image.id} className={styles.previewImage}>
                                        <img
                                            src={image.image_url}
                                            alt={image.caption || `Image ${index + 1}`}
                                            onClick={() => goToImage(index)}
                                        />
                                        {index === 3 && images.length > 4 && (
                                            <div className={styles.moreOverlay}>
                                                +{images.length - 4} more
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
                        Photos ({images.length})
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
                            <div className={styles.additionalInfo}>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>District:</span>
                                        <span className={styles.infoValue}>{travelSpot.location?.district}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>State:</span>
                                        <span className={styles.infoValue}>{travelSpot.location?.state}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Country:</span>
                                        <span className={styles.infoValue}>{travelSpot.location?.country}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>PIN Code:</span>
                                        <span className={styles.infoValue}>{travelSpot.location?.zipcode}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'nearby' && (
                        <div className={styles.tabPane}>
                            <h3>Nearby Travel Spots</h3>
                            <p>Other travel spots in the same area will be displayed here.</p>
                        </div>
                    )}
                    {activeTab === 'photos' && images.length > 0 && (
                        <div className={styles.tabPane}>
                            <h3>Photo Gallery ({images.length} photos)</h3>
                            <div className={styles.photoGrid}>
                                {images.map((image, index) => (
                                    <div key={image.id} className={styles.photoItem}>
                                        <img
                                            src={image.image_url}
                                            alt={image.caption || `Image ${index + 1}`}
                                            className={styles.photo}
                                        />
                                        {image.caption && (
                                            <p className={styles.photoCaption}>{image.caption}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
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