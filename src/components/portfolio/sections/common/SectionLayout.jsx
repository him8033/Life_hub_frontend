// src/components/portfolio/sections/common/SectionLayout.jsx

'use client';

import React from 'react';
import Button from '@/components/common/buttons/Button';
import Loader from '@/components/common/Loader';
import { FiSave, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
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
    onPrevious,
    onNext,
    children,
    saveButtonText,
    cancelButtonText = 'Cancel',
    showCancel = false,
    showPrevious = false,
    showNext = false,
    isFirstStep = false,
    isLastStep = false,
    previousSectionName = '',
    nextSectionName = '',
    isEditing = true,
}) => {
    if (isLoading) {
        return (
            <div className={styles.container}>
                <Loader text={`Loading ${title}...`} />
            </div>
        );
    }

    const renderIcon = () => {
        if (!Icon) return null;
        try {
            if (typeof Icon === 'function' || typeof Icon === 'object') {
                return <Icon className={styles.headerIcon} size={20} />;
            }
            return null;
        } catch (e) {
            return null;
        }
    };

    return (
        <div className={styles.wrapper}>
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

                {/* Content - Scrollable */}
                <div className={styles.content}>
                    {children}
                </div>
            </div>

            {/* Floating Navigation Buttons */}
            {(showPrevious || showNext) && (
                <div className={styles.floatingNav}>
                    {showPrevious && (
                        <button
                            className={`${styles.floatingBtn} ${styles.prevBtn}`}
                            onClick={onPrevious}
                            disabled={isSaving || isFirstStep}
                            title={`Previous: ${previousSectionName}`}
                        >
                            <FiArrowLeft size={20} />
                            {previousSectionName && (
                                <span className={styles.btnLabel}>{previousSectionName}</span>
                            )}
                        </button>
                    )}
                    {showNext && (
                        <button
                            className={`${styles.floatingBtn} ${styles.nextBtn}`}
                            onClick={onNext}
                            disabled={isSaving || isLastStep}
                            title={`Next: ${nextSectionName}`}
                        >
                            {nextSectionName && (
                                <span className={styles.btnLabel}>{nextSectionName}</span>
                            )}
                            <FiArrowRight size={20} />
                        </button>
                    )}
                </div>
            )}
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