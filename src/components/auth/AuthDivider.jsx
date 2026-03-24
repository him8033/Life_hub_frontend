'use client';

import styles from '@/styles/auth/AuthDivider.module.css';

export default function AuthDivider({
    text = 'or',
    className = '',
}) {
    return (
        <div className={`${styles.divider} ${className}`}>
            <span className={styles.dividerText}>{text}</span>
        </div>
    );
}