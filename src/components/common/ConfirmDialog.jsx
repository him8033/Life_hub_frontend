'use client';

import { FiAlertTriangle, FiInfo, FiHelpCircle, FiX } from 'react-icons/fi';
import styles from '@/styles/common/ConfirmDialog.module.css';

export default function ConfirmDialog({
    title = 'Confirm',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'default', // 'default', 'danger', 'warning', 'info'
    isLoading = false,
}) {
    // Get icon based on type
    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <FiAlertTriangle className={styles.iconSvg} />;
            case 'warning':
                return <FiAlertTriangle className={styles.iconSvg} />;
            case 'info':
                return <FiInfo className={styles.iconSvg} />;
            default:
                return <FiHelpCircle className={styles.iconSvg} />;
        }
    };

    return (
        <div className={styles.backdrop} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                <button onClick={onCancel} className={styles.closeButton}>
                    <FiX />
                </button>

                {/* Icon */}
                <div className={`${styles.iconWrapper} ${styles[type]}`}>
                    {getIcon()}
                </div>

                {/* Title */}
                <h3 className={styles.title}>{title}</h3>

                {/* Message */}
                <div className={styles.messageContainer}>
                    <p className={styles.message}>{message}</p>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button
                        onClick={onCancel}
                        className={styles.cancelButton}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`${styles.confirmButton} ${styles[type]}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className={styles.spinner}></span>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}