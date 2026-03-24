'use client';

import styles from '@/styles/auth/AuthButton.module.css';

export default function AuthButton({
    children,
    type = 'button',
    onClick,
    isLoading = false,
    loadingText = 'Signing In...',
    icon,
    fullWidth = true,
    className = '',
    disabled = false,
    ...props
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading || disabled}
            className={`${styles.submitButton} ${fullWidth ? styles.fullWidth : ''} ${className}`}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className={styles.spinner}></span>
                    {loadingText}
                </>
            ) : (
                <>
                    {children}
                    {icon && <span className={styles.buttonIcon}>{icon}</span>}
                </>
            )}
        </button>
    );
}