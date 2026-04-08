'use client';

import { FiLoader } from 'react-icons/fi';
import styles from '@/styles/common/Loader.module.css';

export default function Loader({
    size = 'large', // 'small', 'medium', 'large'
    color,
    showText = true,
    text = 'Loading...',
    fullPage = true,
    className = '',
    variant = 'primary', // 'primary', 'secondary', 'success', 'warning'
    withOverlay = false,
}) {
    const getSize = () => {
        switch (size) {
            case 'small':
                return styles.small;
            case 'large':
                return styles.large;
            case 'medium':
            default:
                return styles.medium;
        }
    };

    const getColor = () => {
        if (color) return color;

        switch (variant) {
            case 'secondary':
                return 'var(--secondary)';
            case 'success':
                return 'var(--success)';
            case 'warning':
                return 'var(--warning)';
            case 'primary':
            default:
                return 'var(--primary)';
        }
    };

    const spinnerColor = getColor();

    return (
        <div
            className={`${styles.loaderContainer} 
                       ${fullPage ? styles.fullPage : ''} 
                       ${withOverlay ? styles.withOverlay : ''}
                       ${className}`}
        >
            <div className={styles.loaderContent}>
                <div className={styles.spinnerWrapper}>
                    <div
                        className={`${styles.loadingSpinner} ${getSize()}`}
                        style={{ borderTopColor: spinnerColor }}
                    ></div>
                    {size === 'large' && (
                        <FiLoader className={styles.spinnerIcon} style={{ color: spinnerColor }} />
                    )}
                </div>

                {showText && (
                    <div className={styles.textContainer}>
                        <p className={styles.loadingText}>{text}</p>
                        <div className={styles.loadingDots}>
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}