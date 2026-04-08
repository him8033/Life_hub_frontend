'use client';

import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiSearch, FiAlertCircle, FiMapPin } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import styles from '@/styles/common/NotFoundState.module.css';

export default function NotFoundState({
    title = 'Not Found',
    message = 'The requested resource was not found.',
    backLabel = 'Go Back',
    backTo = null, // If null, uses router.back()
    showIcon = true,
    icon = '🔍',
    iconType = 'default', // 'default', 'search', 'alert', 'location'
    cardBackground = null,
    fullPage = true,
    className = '',
    onRetry,
    retryLabel = 'Try Again',
}) {
    const router = useRouter();

    const handleBack = () => {
        if (backTo) {
            router.push(backTo);
        } else {
            router.back();
        }
    };

    // Get icon based on type
    const getIcon = () => {
        if (icon !== '🔍') return icon;

        switch (iconType) {
            case 'search':
                return <FiSearch className={styles.iconSvg} />;
            case 'alert':
                return <FiAlertCircle className={styles.iconSvg} />;
            case 'location':
                return <FiMapPin className={styles.iconSvg} />;
            default:
                return '🔍';
        }
    };

    const iconElement = getIcon();

    const Container = fullPage ? 'div' : 'div';

    return (
        <Container className={`${styles.container} ${fullPage ? styles.fullPage : ''} ${className}`}>
            <div className={styles.content}>
                {showIcon && (
                    <div className={styles.iconWrapper}>
                        {typeof iconElement === 'string' ? (
                            <span className={styles.icon}>{iconElement}</span>
                        ) : (
                            <div className={styles.iconSvgWrapper}>{iconElement}</div>
                        )}
                    </div>
                )}

                <div className={styles.textContent}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.message}>{message}</p>
                </div>

                <div className={styles.actions}>
                    {onRetry && (
                        <Button
                            variant="outline"
                            size="md"
                            onClick={onRetry}
                        >
                            {retryLabel}
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleBack}
                        icon={<FiArrowLeft />}
                        iconPosition="left"
                    >
                        {backLabel}
                    </Button>
                </div>
            </div>
        </Container>
    );
}