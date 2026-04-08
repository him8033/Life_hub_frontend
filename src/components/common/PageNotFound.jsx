'use client';

import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiHome, FiSearch, FiHelpCircle } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import styles from '@/styles/common/PageNotFound.module.css';

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
                        <div className={styles.illustrationContent}>
                            {show404 && (
                                <div className={styles.errorCode}>404</div>
                            )}
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
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={goBack}
                                icon={<FiArrowLeft />}
                                iconPosition="left"
                            >
                                {backLabel}
                            </Button>
                        )}

                        {showHomeButton && (
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={goHome}
                                icon={<FiHome />}
                                iconPosition="left"
                            >
                                {homeLabel}
                            </Button>
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