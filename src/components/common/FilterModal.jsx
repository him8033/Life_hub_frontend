'use client';

import { useEffect } from 'react';
import Button from '@/components/common/buttons/Button';
import SimpleSelect from '@/components/common/forms/SimpleSelect';
import styles from '@/styles/common/FilterModal.module.css';
import { FiX } from 'react-icons/fi';

export default function FilterModalLive({
    isOpen,
    onClose,
    onClear,
    filters = [],
    title = "Filters",
    clearButtonText = "Clear All",
    closeButtonText = "Close",
    isLoading = false,
    className = '',
}) {
    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={`${styles.modal} ${className}`}>
                {/* Header */}
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                        aria-label="Close filters"
                    >
                        <FiX />
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    {filters.map((filter, index) => (
                        <div key={index} className={styles.filterSection}>
                            {filter.type === 'select' && (
                                <div className={styles.selectWrapper}>
                                    <label className={styles.selectLabel}>{filter.label}</label>
                                    <SimpleSelect
                                        value={filter.value}
                                        onChange={(e) => filter.onChange(e.target.value)}
                                        options={filter.options}
                                        disabled={filter.disabled || isLoading}
                                        placeholder={filter.placeholder || `Select ${filter.label}`}
                                        className={styles.selectField}
                                    />
                                </div>
                            )}

                            {filter.type === 'radio' && (
                                <div className={styles.radioGroup}>
                                    <label className={styles.radioLabel}>{filter.label}</label>
                                    <div className={styles.radioOptions}>
                                        {filter.options.map((option, idx) => (
                                            <label key={idx} className={styles.radioOption}>
                                                <input
                                                    type="radio"
                                                    name={filter.name}
                                                    value={option.value}
                                                    checked={filter.value === option.value}
                                                    onChange={(e) => filter.onChange(e.target.value)}
                                                    disabled={filter.disabled || isLoading}
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {filter.type === 'checkbox' && (
                                <div className={styles.checkboxGroup}>
                                    <label className={styles.checkboxLabel}>{filter.label}</label>
                                    <div className={styles.checkboxOptions}>
                                        {filter.options.map((option, idx) => (
                                            <label key={idx} className={styles.checkboxOption}>
                                                <input
                                                    type="checkbox"
                                                    value={option.value}
                                                    checked={filter.value.includes(option.value)}
                                                    onChange={(e) => {
                                                        const newValue = e.target.checked
                                                            ? [...filter.value, option.value]
                                                            : filter.value.filter(v => v !== option.value);
                                                        filter.onChange(newValue);
                                                    }}
                                                    disabled={filter.disabled || isLoading}
                                                />
                                                <span>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={onClear}
                        disabled={isLoading}
                    >
                        {clearButtonText}
                    </Button>
                    <Button
                        variant="outline"
                        size="md"
                        onClick={onClose}
                    >
                        {closeButtonText}
                    </Button>
                </div>
            </div>
        </>
    );
}