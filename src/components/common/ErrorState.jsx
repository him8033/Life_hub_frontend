'use client';

import styles from '@/styles/common/ErrorState.module.css';

export default function ErrorState({ 
    message, 
    onRetry, 
    errorType = 'error', // 'error', 'warning', 'info'
    retryMsg = 'Try Again',
    showIcon = true,
    className = '',
    cardBackground = 'white', // Custom background color for card
    textColor = null, // Custom text color
    buttonBackground = null, // Custom button background
}) {
    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        }
    };

    const getIcon = () => {
        switch (errorType) {
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            case 'error':
            default:
                return '❌';
        }
    };

    // Prepare inline styles for dynamic colors
    const cardStyle = {
        backgroundColor: cardBackground,
    };

    const messageStyle = textColor ? {
        color: textColor,
    } : {};

    const buttonStyle = buttonBackground ? {
        backgroundColor: buttonBackground,
    } : {};

    return (
        <div className={`${styles.container} ${className}`}>
            <div 
                className={`${styles.content} ${styles[errorType]}`}
                style={cardStyle}
            >
                {showIcon && (
                    <div className={styles.icon}>
                        {getIcon()}
                    </div>
                )}
                
                <div className={styles.textContent}>
                    <p 
                        className={styles.message}
                        style={messageStyle}
                    >
                        {message}
                    </p>
                </div>

                {onRetry && (
                    <button 
                        onClick={handleRetry} 
                        className={styles.retryButton}
                        style={buttonStyle}
                    >
                        {retryMsg}
                    </button>
                )}
            </div>
        </div>
    );
}