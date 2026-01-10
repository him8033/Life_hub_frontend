'use client';

import { useRouter } from 'next/navigation';
import styles from '@/styles/common/NotFoundState.module.css';

export default function NotFoundState({
    title = 'Not Found',
    message = 'The requested resource was not found.',
    backLabel = 'Go Back',
    backTo = null, // If null, uses router.back()
    showIcon = true,
    icon = '🔍',
    cardBackground = 'white',
    textColor = null,
    buttonBackground = '#2563eb',
    fullPage = true,
    className = '',
}) {
    const router = useRouter();

    const handleBack = () => {
        if (backTo) {
            router.push(backTo);
        } else {
            router.back();
        }
    };

    // Prepare inline styles
    const cardStyle = {
        backgroundColor: cardBackground,
    };

    const textStyle = textColor ? {
        color: textColor,
    } : {};

    const buttonStyle = buttonBackground ? {
        backgroundColor: buttonBackground,
    } : {};

    const Container = fullPage ? 'div' : 'div';

    return (
        <Container className={`${styles.container} ${fullPage ? styles.fullPage : ''} ${className}`}>
            <div 
                className={styles.content}
                style={cardStyle}
            >
                {showIcon && (
                    <div className={styles.icon}>
                        {icon}
                    </div>
                )}
                
                <div className={styles.textContent}>
                    <h2 
                        className={styles.title}
                        style={textStyle}
                    >
                        {title}
                    </h2>
                    
                    <p 
                        className={styles.message}
                        style={textStyle}
                    >
                        {message}
                    </p>
                </div>

                <button
                    onClick={handleBack}
                    className={styles.backButton}
                    style={buttonStyle}
                >
                    {backLabel}
                </button>
            </div>
        </Container>
    );
}