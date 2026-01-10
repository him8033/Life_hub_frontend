'use client';

import { useRouter } from 'next/navigation';
import styles from '@/styles/common/PageNotFound.module.css';
import Image from 'next/image';

export default function PageNotFound({
    title = 'Page Not Found',
    message = 'The page you are looking for does not exist or has been moved.',
    homeLabel = 'Go to Home',
    homePath = '/',
    backLabel = 'Go Back',
    showBackButton = true,
    showHomeButton = true,
    show404 = true,
    background = 'gradient', // 'gradient', 'white', 'light', 'dark', 'custom'
    customBackground = null,
    className = '',
}) {
    const router = useRouter();

    const goHome = () => {
        router.push(homePath);
    };

    const goBack = () => {
        router.back();
    };

    // Container style for custom background
    const containerStyle = customBackground ? {
        background: customBackground,
    } : {};

    return (
        <div
            className={`${styles.pageContainer} ${styles[background]} ${className}`}
            style={containerStyle}
        >
            <div className={styles.contentWrapper}>
                {/* Left side - Illustration/Image */}
                <div className={styles.illustrationSection}>
                    <div className={styles.illustration}>
                        {/* You can use an image or SVG here */}
                        {/* <div className={styles.imageContainer}>
                            <Image
                                src="/404pageimgs.webp" // or /404-image.png
                                alt="404 Not Found"
                                width={500}
                                height={400}
                                className={styles.image}
                                priority
                            />
                        </div> */}
                        <div className={styles.illustrationContent}>
                            <div className={styles.errorCode}>404</div>
                            <div className={styles.errorIcon}>🔍</div>
                        </div>
                    </div>
                </div>

                {/* Right side - Content */}
                <div className={styles.contentSection}>
                    {show404 && (
                        <div className={styles.statusBadge}>
                            404 ERROR
                        </div>
                    )}

                    <h1 className={styles.title}>
                        {title}
                    </h1>

                    <p className={styles.message}>
                        {message}
                    </p>

                    {/* Action Buttons */}
                    <div className={styles.actions}>
                        {showBackButton && (
                            <button
                                onClick={goBack}
                                className={styles.backButton}
                            >
                                ← {backLabel}
                            </button>
                        )}

                        {showHomeButton && (
                            <button
                                onClick={goHome}
                                className={styles.homeButton}
                            >
                                {homeLabel}
                            </button>
                        )}
                    </div>

                    {/* Optional: Search or additional help */}
                    <div className={styles.helpSection}>
                        <p className={styles.helpText}>
                            You can also try:
                        </p>
                        <ul className={styles.suggestions}>
                            <li>• Double-check the URL</li>
                            <li>• Use the search function</li>
                            <li>• Contact support if you believe this is an error</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}