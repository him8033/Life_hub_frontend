'use client';

import { useState } from 'react';
import { FiAlertCircle, FiAlertTriangle, FiInfo, FiRefreshCw } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import styles from '@/styles/common/ErrorState.module.css';

export default function ErrorState({
    message,
    onRetry,
    errorType = 'error',
    retryMsg = 'Try Again',
    loadingMsg = 'Retrying...',
    showIcon = true,
    className = '',
    title = 'Something went wrong',
}) {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = async () => {
        if (!onRetry || isRetrying) return;

        setIsRetrying(true);
        try {
            await onRetry();
        } catch (error) {
            console.error('Retry failed:', error);
        } finally {
            setIsRetrying(false);
        }
    };

    const getIcon = () => {
        switch (errorType) {
            case 'warning':
                return <FiAlertTriangle className={styles.iconSvg} />;
            case 'info':
                return <FiInfo className={styles.iconSvg} />;
            case 'error':
            default:
                return <FiAlertCircle className={styles.iconSvg} />;
        }
    };

    const getTitle = () => {
        switch (errorType) {
            case 'warning':
                return 'Warning';
            case 'info':
                return 'Information';
            case 'error':
            default:
                return title || 'Error';
        }
    };

    return (
        <div className={`${styles.container} ${className}`}>
            <div className={`${styles.content} ${styles[errorType]}`}>
                {showIcon && (
                    <div className={styles.iconWrapper}>
                        {getIcon()}
                    </div>
                )}

                <div className={styles.textContent}>
                    <h3 className={styles.title}>{getTitle()}</h3>
                    <p className={styles.message}>{message}</p>
                </div>

                {onRetry && (
                    <Button
                        variant={errorType === 'error' ? 'danger' : errorType === 'warning' ? 'warning' : 'primary'}
                        size="md"
                        onClick={handleRetry}
                        disabled={isRetrying}
                        icon={isRetrying ? undefined : <FiRefreshCw />}
                        iconPosition="left"
                        className={isRetrying ? styles.retryingButton : ''}
                    >
                        {isRetrying ? loadingMsg : retryMsg}
                    </Button>
                )}
            </div>
        </div>
    );
}