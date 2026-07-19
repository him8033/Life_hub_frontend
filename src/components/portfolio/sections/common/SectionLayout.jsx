// src/components/portfolio/sections/common/SectionLayout.jsx

'use client';

import React from 'react';
import Button from '@/components/common/buttons/Button';
import Loader from '@/components/common/Loader';
import { FiSave } from 'react-icons/fi';
import styles from '@/styles/portfolio/sections/common/SectionLayout.module.css';

export const SectionLayout = ({
    title,
    subtitle,
    icon: Icon,
    isLoading = false,
    isSaving = false,
    hasData = false,
    onSave,
    onCancel,
    children,
    saveButtonText,
    cancelButtonText = 'Cancel',
    showCancel = false,
    isEditing = true, // Always editing by default
}) => {
    if (isLoading) {
        return (
            <div className={styles.container}>
                <Loader text={`Loading ${title}...`} />
            </div>
        );
    }

    // Safely render icon
    const renderIcon = () => {
        if (!Icon) return null;
        try {
            // If Icon is a valid React component
            if (typeof Icon === 'function' || typeof Icon === 'object') {
                return <Icon className={styles.headerIcon} size={20} />;
            }
            return null;
        } catch (e) {
            return null;
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    {Icon && renderIcon()}
                    <div>
                        <h3 className={styles.title}>{title}</h3>
                        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    </div>
                </div>
                <div className={styles.headerActions}>
                    {showCancel && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onCancel}
                            disabled={isSaving}
                        >
                            {cancelButtonText}
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        size="sm"
                        isLoading={isSaving}
                        loadingText={isSaving ? 'Saving...' : ''}
                        icon={<FiSave size={16} />}
                        onClick={onSave}
                    >
                        {saveButtonText || (hasData ? 'Update' : 'Save')}
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export const SectionEmptyState = ({ title, message, icon: Icon }) => {
    const renderIcon = () => {
        if (!Icon) return null;
        try {
            if (typeof Icon === 'function' || typeof Icon === 'object') {
                return <Icon size={32} className={styles.emptyIcon} />;
            }
            return null;
        } catch (e) {
            return null;
        }
    };

    return (
        <div className={styles.emptyState}>
            {Icon && renderIcon()}
            <p className={styles.emptyTitle}>{title || 'No data added yet'}</p>
            <p className={styles.emptyMessage}>{message || 'Click the edit button to add your information.'}</p>
        </div>
    );
};