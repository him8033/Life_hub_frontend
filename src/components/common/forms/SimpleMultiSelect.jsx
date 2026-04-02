'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '@/styles/common/forms/FormSelect.module.css';
import { FiChevronDown, FiX } from 'react-icons/fi';

export default function SimpleMultiSelect({
    name,
    label,
    options = [],
    placeholder = "Select options",
    icon: Icon,
    required = false,
    disabled = false,
    description,
    value: externalValue,
    defaultValue = [],
    size = 'md', // sm, md, lg
    className = '',
    selectClassName = '',
    labelClassName = '',
    loading = false,
    maxSelections,
    onChange,
    onBlur,
    error,
    ...props
}) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const value = externalValue !== undefined ? externalValue : internalValue;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                if (onBlur) onBlur();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onBlur]);

    const handleSelect = (selectedValue) => {
        let newValues;
        if (value.includes(selectedValue)) {
            newValues = value.filter(v => v !== selectedValue);
        } else {
            if (maxSelections && value.length >= maxSelections) {
                return;
            }
            newValues = [...value, selectedValue];
        }

        if (externalValue === undefined) {
            setInternalValue(newValues);
        }
        if (onChange) onChange(newValues);
    };

    const handleRemove = (valueToRemove, e) => {
        e.stopPropagation();
        const newValues = value.filter(v => v !== valueToRemove);
        if (externalValue === undefined) {
            setInternalValue(newValues);
        }
        if (onChange) onChange(newValues);
    };

    const getSelectedLabels = () => {
        return value.map(val => {
            const option = options.find(opt => opt.value === val);
            return option?.label || val;
        });
    };

    // Size classes
    const sizeClass = styles[`multiSelect${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const tagSizeClass = styles[`tag${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const iconSizeClass = styles[`icon${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const dropdownSizeClass = styles[`dropdown${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';

    return (
        <div className={`${styles.formItem} ${className}`} ref={wrapperRef}>
            {label && (
                <label className={`${styles.formLabel} ${styles[`label${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${labelClassName}`}>
                    {Icon && <span className={styles.labelIcon}>{Icon}</span>}
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}

            <div className={`${styles.multiSelectWrapper} ${styles[`wrapper${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>
                <div
                    className={`${styles.multiSelect} ${sizeClass} ${error ? styles.selectError : ''} ${value.length > 0 ? styles.hasValue : ''} ${selectClassName}`}
                    onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
                >
                    <div className={styles.selectedTags}>
                        {value.length === 0 ? (
                            <span className={`${styles.placeholder} ${styles[`placeholder${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>
                                {placeholder}
                            </span>
                        ) : (
                            getSelectedLabels().map((label, index) => (
                                <span key={index} className={`${styles.selectedTag} ${tagSizeClass}`}>
                                    {label}
                                    <button
                                        type="button"
                                        className={styles.removeTag}
                                        onClick={(e) => handleRemove(value[index], e)}
                                    >
                                        <FiX size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
                                    </button>
                                </span>
                            ))
                        )}
                    </div>
                    <FiChevronDown className={`${styles.selectIcon} ${iconSizeClass} ${isOpen ? styles.iconRotated : ''}`} />
                </div>

                {isOpen && !disabled && !loading && (
                    <div className={`${styles.dropdown} ${dropdownSizeClass}`}>
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className={`${styles.dropdownItem} ${styles[`dropdownItem${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${value.includes(option.value) ? styles.selected : ''}`}
                                onClick={() => handleSelect(option.value)}
                            >
                                <input
                                    type="checkbox"
                                    checked={value.includes(option.value)}
                                    readOnly
                                    className={`${styles.checkbox} ${styles[`checkbox${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}
                                />
                                <span className={styles[`itemLabel${size.charAt(0).toUpperCase() + size.slice(1)}`]}>{option.label}</span>
                                {option.count !== undefined && (
                                    <span className={`${styles.count} ${styles[`count${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>({option.count})</span>
                                )}
                            </div>
                        ))}

                        {options.length === 0 && (
                            <div className={`${styles.noOptions} ${styles[`noOptions${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>
                                No options available
                            </div>
                        )}
                    </div>
                )}

                {loading && (
                    <div className={styles.loadingSpinner}>
                        <div className={styles.spinner}></div>
                    </div>
                )}
            </div>

            {maxSelections && value.length >= maxSelections && (
                <div className={`${styles.maxWarning} ${styles[`warning${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>
                    Maximum {maxSelections} selections allowed
                </div>
            )}

            {description && (
                <p className={`${styles.description} ${styles[`description${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>
                    {description}
                </p>
            )}

            {error && (
                <p className={`${styles.errorMessage} ${styles[`error${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>{error}</p>
            )}
        </div>
    );
}