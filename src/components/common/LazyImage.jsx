'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/common/LazyImage.module.css';
import { FiImage } from 'react-icons/fi';

// Custom hook for Intersection Observer
export const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const targetRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsIntersecting(true);
                observer.disconnect();
            }
        }, {
            rootMargin: '50px',
            threshold: 0.01,
            ...options
        });

        const currentTarget = targetRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
            observer.disconnect();
        };
    }, [options]);

    return [targetRef, isIntersecting];
};

// Reusable Lazy Image Component
const LazyImage = ({
    src,
    alt,
    className = '',
    placeholderClassName = '',
    wrapperClassName = '',
    fallbackSrc = '/images/placeholders/default.png',
    rootMargin = '50px',
    threshold = 0.01,
    showPlaceholder = true,
    placeholderIcon = true,
    onLoad,
    onError,
    objectFit = 'cover',
    style = {},
    ...props
}) => {
    const [ref, isInView] = useIntersectionObserver({ rootMargin, threshold });
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);
    const imgRef = useRef(null);

    useEffect(() => {
        setImageSrc(src);
        setIsLoaded(false);
        setHasError(false);
    }, [src]);

    const handleLoad = (e) => {
        setIsLoaded(true);
        setHasError(false);
        if (onLoad) onLoad(e);
    };

    const handleError = (e) => {
        setHasError(true);
        setIsLoaded(true);
        setImageSrc(fallbackSrc);
        if (onError) onError(e);
    };

    // Combined styles for the image
    const imageStyle = {
        objectFit: objectFit,
        ...style,
    };

    return (
        <div
            ref={ref}
            className={`${styles.lazyImageWrapper} ${wrapperClassName}`}
        >
            {/* Placeholder - only show while image is loading */}
            {showPlaceholder && !isLoaded && (
                <div className={`${styles.imagePlaceholder} ${placeholderClassName}`}>
                    {placeholderIcon && <FiImage className={styles.placeholderIcon} />}
                </div>
            )}

            {/* Actual Image - render when in view */}
            {isInView && (
                <img
                    ref={imgRef}
                    src={hasError ? fallbackSrc : imageSrc}
                    alt={alt}
                    className={`${styles.lazyImage} ${className}`}
                    style={imageStyle}
                    onLoad={handleLoad}
                    onError={handleError}
                    {...props}
                />
            )}
        </div>
    );
};

export default LazyImage;