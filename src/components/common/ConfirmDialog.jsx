'use client';

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
    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={`${styles.icon} ${styles[type]}`}>
                        {type === 'danger' && '⚠️'}
                        {type === 'warning' && '⚠️'}
                        {type === 'info' && 'ℹ️'}
                        {type === 'default' && '❓'}
                    </div>
                    <h3 className={styles.title}>{title}</h3>
                </div>

                {/* Message with proper text wrapping */}
                <div className={styles.messageContainer}>
                    <p className={styles.message}>{message}</p>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button
                        onClick={onCancel}
                        className={styles.cancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`${styles.confirm} ${styles[type]}`}
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