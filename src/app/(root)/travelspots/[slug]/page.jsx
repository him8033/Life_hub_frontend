'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
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
    FaChevronRight,
    FaPhone,
    FaEnvelope,
    FaStar,
    FaStarHalfAlt,
    FaDatabase,
    FaMapPin,
    FaChevronDown,
    FaCamera,
    FaComment,
    FaMap
} from 'react-icons/fa';
import NearbySpotsTab from '@/components/travelspots/NearbySpotsTab';

export default function PublicTravelSpotViewPage() {
    const params = useParams();
    const slug = params.slug;
    const [activeTab, setActiveTab] = useState('photos');
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Ref for content wrapper
    const contentWrapperRef = useRef(null);

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

    // Function to scroll to content
    const scrollToContent = () => {
        if (contentWrapperRef.current) {
            contentWrapperRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Alternative: Scroll by percentage of viewport height
    const scrollToContentAlt = () => {
        window.scrollTo({
            top: window.innerHeight * 0.9, // Scroll to 90% of viewport height
            behavior: 'smooth'
        });
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

    if (!travelSpot) {
        return <NotFoundState
            title="Travel Spot Not Found"
            message="The travel spot you're looking for doesn't exist."
            backLabel="Back to Travel Spots"
            backTo={ROUTES.PUBLIC.TRAVELSPOTS}
            fullPage={true}
        />;
    }

    // Reviews
    const reviews = [
        {
            id: 1,
            author: "Rajesh Kumar",
            rating: 4.5,
            comment: "Absolutely breathtaking views! The mountain air is so refreshing. The walking trails are well-maintained and suitable for all age groups. Highly recommended for a weekend getaway.",
            date: "15 June 2023"
        },
        {
            id: 2,
            author: "Priya Sharma",
            rating: 5,
            comment: "The best family vacation spot! My kids loved the open spaces and we enjoyed the guided nature walk. The resort staff were extremely helpful and the food was delicious.",
            date: "2 May 2023"
        }
    ];

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            {images.length > 0 ? (
                <section className={styles.heroSection}>
                    <div className={styles.heroSlides}>
                        {images.map((image, index) => (
                            <div
                                key={image.id}
                                className={`${styles.heroSlide} ${index === currentImageIndex ? styles.active : ''}`}
                                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${image.image_url})` }}
                            />
                        ))}
                    </div>

                    <div className={styles.heroContent}>
                        <div className={styles.heroTag}>
                            <FaMapMarkerAlt /> {getLocationText()}
                        </div>
                        <h1 className={styles.heroTitle}>{travelSpot.name}</h1>
                        <p className={styles.heroSubtitle}>{travelSpot.short_description}</p>

                        {/* Hero Actions */}
                        <div className={styles.heroActions}>
                            <button
                                onClick={handleShare}
                                className={styles.heroActionButton}
                                title="Share"
                            >
                                <FaShareAlt /> Share
                            </button>
                            <button
                                className={styles.heroActionButton}
                                title="Save to favorites"
                            >
                                <FaHeart /> Save
                            </button>
                            {travelSpot.latitude && travelSpot.longitude && (
                                <button
                                    className={styles.heroActionButton}
                                    onClick={handleGetDirections}
                                    title="Get Directions"
                                >
                                    <FaDirections /> Directions
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Hero Dots */}
                    {images.length > 1 && (
                        <div className={styles.heroDots}>
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.heroDot} ${index === currentImageIndex ? styles.active : ''}`}
                                    onClick={() => goToImage(index)}
                                    aria-label={`Go to image ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                className={`${styles.heroNav} ${styles.prevNav}`}
                                onClick={prevImage}
                                aria-label="Previous image"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                className={`${styles.heroNav} ${styles.nextNav}`}
                                onClick={nextImage}
                                aria-label="Next image"
                            >
                                <FaChevronRight />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                        <div className={styles.imageCounter}>
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    )}

                    {/* Scroll Indicator */}
                    <button
                        className={styles.heroScrollIndicator}
                        onClick={scrollToContentAlt}
                        aria-label="Scroll to explore content"
                    >
                        <span>Scroll to explore</span>
                        <FaChevronDown className={styles.scrollIcon} />
                    </button>
                </section>
            ) : (
                <section className={`${styles.heroSection} ${styles.noImages}`}>
                    <div className={styles.noImageContent}>
                        <div className={styles.noImageIcon}>
                            <FaGlobe />
                        </div>
                        <h1 className={styles.heroTitle}>{travelSpot.name}</h1>
                        <p className={styles.heroSubtitle}>{travelSpot.short_description}</p>
                        <div className={styles.noImageTag}>
                            <FaMapMarkerAlt /> {getLocationText()}
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content Container */}
            <div className={styles.contentWrapper} ref={contentWrapperRef}>
                {/* Main Content - Details & Map */}
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
                                    <div className={styles.detailIcon}>
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div className={styles.detailContent}>
                                        <div className={styles.detailLabel}>Location</div>
                                        <div className={styles.detailValue}>{getLocationText()}</div>
                                    </div>
                                </div>

                                <div className={styles.detailCard}>
                                    <div className={styles.detailIcon}>
                                        <FaRupeeSign />
                                    </div>
                                    <div className={styles.detailContent}>
                                        <div className={styles.detailLabel}>Entry Fee</div>
                                        <div className={styles.detailValue}>{getEntryFee()}</div>
                                    </div>
                                </div>

                                <div className={styles.detailCard}>
                                    <div className={styles.detailIcon}>
                                        <FaClock />
                                    </div>
                                    <div className={styles.detailContent}>
                                        <div className={styles.detailLabel}>Opening Hours</div>
                                        <div className={styles.detailValue}>{getOpeningHours()}</div>
                                    </div>
                                </div>

                                <div className={styles.detailCard}>
                                    <div className={styles.detailIcon}>
                                        <FaCalendarAlt />
                                    </div>
                                    <div className={styles.detailContent}>
                                        <div className={styles.detailLabel}>Best Time to Visit</div>
                                        <div className={styles.detailValue}>
                                            {travelSpot.best_time_to_visit || 'March to June, September to November'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className={styles.categoriesSection}>
                                <div className={styles.detailLabel}>Categories</div>
                                <div className={styles.categories}>
                                    {travelSpot.category_details?.map(cat => (
                                        <span key={cat.spotcategory_id} className={styles.categoryTag}>
                                            <FaTag /> {cat.name}
                                        </span>
                                    )) || (
                                            <>
                                                <span className={styles.categoryTag}><FaTag /> Nature</span>
                                                <span className={styles.categoryTag}><FaTag /> Adventure</span>
                                                <span className={styles.categoryTag}><FaTag /> Photography</span>
                                            </>
                                        )}
                                </div>
                            </div>
                        </section>

                        {/* Description Section */}
                        <section className={styles.descriptionSection}>
                            <h2 className={styles.sectionTitle}>About This Place</h2>
                            <div className={styles.descriptionContent}>
                                <p>{travelSpot.long_description || travelSpot.short_description}</p>
                                <p>This popular tourist destination features beautiful landscapes, peaceful walking trails, and a serene environment perfect for relaxation. Visitors can enjoy various activities including hiking, photography, and nature walks.</p>
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

                    {/* Right Column - Map & Additional Info */}
                    <div className={styles.rightColumn}>
                        {/* Map Section */}
                        <section className={styles.mapSection}>
                            <div className={styles.mapHeader}>
                                <h3 className={styles.mapTitle}>
                                    <FaMap /> Location Map
                                </h3>
                                {travelSpot.latitude && travelSpot.longitude && (
                                    <button
                                        className={styles.directionsButton}
                                        onClick={handleGetDirections}
                                    >
                                        <FaDirections /> Get Directions
                                    </button>
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

                        {/* Contact & Quick Info */}
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
                                    <div className={styles.quickInfoValue}>
                                        {formatDateTime(travelSpot.created_at)}
                                    </div>
                                </div>
                                <div className={styles.quickInfoCard}>
                                    <div className={styles.quickInfoLabel}>Last Updated</div>
                                    <div className={styles.quickInfoValue}>
                                        {formatDateTime(travelSpot.updated_at)}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Tabs Section */}
                <section className={styles.tabsSection}>
                    <div className={styles.tabsHeader}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'photos' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('photos')}
                        >
                            <FaCamera /> Gallery
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            <FaComment /> Reviews
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'nearby' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('nearby')}
                        >
                            <FaMap /> Nearby Spots
                        </button>
                    </div>

                    <div className={styles.tabContent}>
                        {activeTab === 'photos' && images.length > 0 && (
                            <div className={styles.photosTab}>
                                <div className={styles.photosHeader}>
                                    <h3>Photo Gallery</h3>
                                    <span className={styles.photoCount}>{images.length} photos</span>
                                </div>
                                <div className={styles.photosGrid}>
                                    {images.map((image, index) => (
                                        <div key={image.id} className={styles.photoItem}>
                                            <img
                                                src={image.image_url}
                                                alt={image.caption || `Image ${index + 1}`}
                                                loading="lazy"
                                            />
                                            {image.caption && (
                                                <div className={styles.photoCaption}>{image.caption}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className={styles.reviewsTab}>
                                <div className={styles.reviewsHeader}>
                                    <h3>Visitor Reviews</h3>
                                    <div className={styles.averageRating}>
                                        <FaStar /> 4.8/5 (1,234 reviews)
                                    </div>
                                </div>
                                <div className={styles.reviewsList}>
                                    {reviews.map(review => (
                                        <div key={review.id} className={styles.reviewCard}>
                                            <div className={styles.reviewHeader}>
                                                <div className={styles.reviewAuthor}>
                                                    <div className={styles.authorAvatar}>
                                                        {review.author.charAt(0)}
                                                    </div>
                                                    <div className={styles.authorInfo}>
                                                        <div className={styles.authorName}>{review.author}</div>
                                                        <div className={styles.reviewDate}>{review.date}</div>
                                                    </div>
                                                </div>
                                                <div className={styles.reviewRating}>
                                                    {[...Array(5)].map((_, i) => {
                                                        if (i < Math.floor(review.rating)) {
                                                            return <FaStar key={i} />;
                                                        } else if (i === Math.floor(review.rating) && review.rating % 1 !== 0) {
                                                            return <FaStarHalfAlt key={i} />;
                                                        } else {
                                                            return <FaStar key={i} className={styles.emptyStar} />;
                                                        }
                                                    })}
                                                    <span className={styles.ratingValue}>{review.rating}/5</span>
                                                </div>
                                            </div>
                                            <p className={styles.reviewComment}>{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
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