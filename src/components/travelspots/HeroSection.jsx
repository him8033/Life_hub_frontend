'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FaMapMarkerAlt, FaShareAlt, FaHeart, FaDirections, FaChevronLeft, FaChevronRight, FaChevronDown, FaPause, FaPlay } from 'react-icons/fa';
import styles from '@/styles/travelspots/HeroSection.module.css';

const HeroSection = ({
    images,
    currentImageIndex: externalImageIndex,
    travelSpot,
    locationText,
    onPrevImage: externalOnPrevImage,
    onNextImage: externalOnNextImage,
    onGoToImage: externalOnGoToImage,
    onShare,
    onGetDirections,
    onScrollToContent,
    autoSlideInterval = 3000, // 3 seconds default
    enableAutoSlide = true
}) => {
    const [internalImageIndex, setInternalImageIndex] = useState(0);
    const [isAutoSliding, setIsAutoSliding] = useState(enableAutoSlide);
    const timerRef = useRef(null);
    const containerRef = useRef(null);

    // Use external index if provided, otherwise use internal
    const currentImageIndex = externalImageIndex !== undefined ? externalImageIndex : internalImageIndex;

    // Use external handlers if provided, otherwise use internal
    const onPrevImage = externalOnPrevImage || (() => {
        setInternalImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    });

    const onNextImage = externalOnNextImage || (() => {
        setInternalImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    });

    const onGoToImage = externalOnGoToImage || ((index) => {
        setInternalImageIndex(index);
    });

    // Auto-slide function
    const startAutoSlide = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (isAutoSliding && images.length > 1) {
            timerRef.current = setInterval(() => {
                onNextImage();
            }, autoSlideInterval);
        }
    }, [isAutoSliding, images.length, autoSlideInterval, onNextImage]);

    const stopAutoSlide = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const toggleAutoSlide = () => {
        setIsAutoSliding(!isAutoSliding);
    };

    // Reset timer when image changes manually
    useEffect(() => {
        if (isAutoSliding && images.length > 1) {
            stopAutoSlide();
            startAutoSlide();
        }
    }, [currentImageIndex, isAutoSliding, images.length, stopAutoSlide, startAutoSlide]);

    // Start/stop auto-slide based on isAutoSliding
    useEffect(() => {
        if (isAutoSliding && images.length > 1) {
            startAutoSlide();
        } else {
            stopAutoSlide();
        }

        return () => stopAutoSlide();
    }, [isAutoSliding, images.length, startAutoSlide, stopAutoSlide]);

    // Pause auto-slide on hover
    const handleMouseEnter = () => {
        if (isAutoSliding) {
            stopAutoSlide();
        }
    };

    const handleMouseLeave = () => {
        if (isAutoSliding) {
            startAutoSlide();
        }
    };

    // No images case
    if (images.length === 0) {
        return (
            <section className={`${styles.heroSection} ${styles.noImages}`}>
                <div className={styles.noImageContent}>
                    <div className={styles.noImageIcon}>🌍</div>
                    <h1 className={styles.heroTitle}>{travelSpot.name}</h1>
                    <p className={styles.heroSubtitle}>{travelSpot.short_description}</p>
                    <div className={styles.noImageTag}>
                        <FaMapMarkerAlt /> {locationText}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className={styles.heroSection}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={containerRef}
        >
            {/* Slides */}
            <div className={styles.heroSlides}>
                {images.map((image, index) => (
                    <div
                        key={image.id || index}
                        className={`${styles.heroSlide} ${index === currentImageIndex ? styles.active : ''}`}
                        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${image.image_url})` }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className={styles.heroContent}>
                <div className={styles.heroTag}>
                    <FaMapMarkerAlt /> {locationText}
                </div>
                <h1 className={styles.heroTitle}>{travelSpot.name}</h1>
                <p className={styles.heroSubtitle}>{travelSpot.short_description}</p>

                <div className={styles.heroActions}>
                    <button onClick={onShare} className={styles.heroActionButton}>
                        <FaShareAlt /> Share
                    </button>
                    <button className={styles.heroActionButton}>
                        <FaHeart /> Save
                    </button>
                    {travelSpot.latitude && travelSpot.longitude && (
                        <button className={styles.heroActionButton} onClick={onGetDirections}>
                            <FaDirections /> Directions
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button className={`${styles.heroNav} ${styles.prevNav}`} onClick={onPrevImage}>
                        <FaChevronLeft />
                    </button>
                    <button className={`${styles.heroNav} ${styles.nextNav}`} onClick={onNextImage}>
                        <FaChevronRight />
                    </button>
                </>
            )}

            {/* Dots */}
            {images.length > 1 && (
                <div className={styles.heroDots}>
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.heroDot} ${index === currentImageIndex ? styles.active : ''}`}
                            onClick={() => onGoToImage(index)}
                        />
                    ))}
                </div>
            )}

            {/* Image Counter & Auto-slide Toggle */}
            {images.length > 1 && (
                <div className={styles.imageControls}>
                    <div className={styles.imageCounter}>
                        {currentImageIndex + 1} / {images.length}
                    </div>
                    <button
                        className={styles.autoSlideToggle}
                        onClick={toggleAutoSlide}
                        title={isAutoSliding ? "Pause slideshow" : "Play slideshow"}
                    >
                        {isAutoSliding ? <FaPause /> : <FaPlay />}
                    </button>
                </div>
            )}

            {/* Progress Bar for Auto-slide */}
            {isAutoSliding && images.length > 1 && (
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{
                            animation: `progress ${autoSlideInterval}ms linear forwards`,
                            animationPlayState: isAutoSliding ? 'running' : 'paused'
                        }}
                    />
                </div>
            )}

            {/* Scroll Indicator */}
            <button className={styles.heroScrollIndicator} onClick={onScrollToContent}>
                <span>Scroll to explore</span>
                <FaChevronDown className={styles.scrollIcon} />
            </button>
        </section>
    );
};

export default HeroSection;