// src/components/portfolio/sections/common/SectionModal.jsx

'use client';

import React from 'react';
import { FiX } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import styles from '@/styles/portfolio/sections/common/SectionModal.module.css';

export const SectionModal = ({
    opened,
    onClose,
    title,
    subtitle,
    children,
    onSave,
    isSaving = false,
    saveText = 'Save',
    size = 'lg',
}) => {
    if (!opened) return null;

    // Handle backdrop click to close
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && opened) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [opened, onClose]);

    // Prevent body scroll when modal is open
    React.useEffect(() => {
        if (opened) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [opened]);

    return (
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
            <div className={`${styles.modalContent} ${styles[size]}`}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div>
                        <h3 className={styles.modalTitle}>{title}</h3>
                        {subtitle && <p className={styles.modalSubtitle}>{subtitle}</p>}
                    </div>
                    <button
                        className={styles.modalCloseBtn}
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className={styles.modalBody}>
                    {children}
                </div>

                {/* Footer Actions */}
                <div className={styles.modalActions}>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onSave}
                        isLoading={isSaving}
                        loadingText="Saving..."
                    >
                        {saveText}
                    </Button>
                </div>
            </div>
        </div>
    );
};