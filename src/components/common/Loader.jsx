'use client';

import styles from '@/styles/common/Loader.module.css';

export default function Loader({
    size = 'large', // 'small', 'medium', 'large'
    color = '#2563eb', // Custom color
    showText = true,
    text = 'Loading...',
    fullPage = true,
    className = '',
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

    return (
        <div
            className={`${styles.loaderContainer} 
                       ${fullPage ? styles.fullPage : ''} 
                       ${className}`}
        >
            <div className={styles.loaderContent}>
                <div
                    className={`${styles.loadingSpinner} ${getSize()}`}
                    style={{ borderTopColor: color }}
                ></div>

                {showText && (
                    <p
                        className={styles.loadingText}
                        style={{ color: color }}
                    >
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
}