'use client';

import { useState } from 'react';
import styles from '@/styles/common/forms/FormSelect.module.css';
import { FiChevronDown } from 'react-icons/fi';

export default function SimpleSelect({
    name,
    label,
    options = [],
    placeholder = "Select an option",
    icon: Icon,
    required = false,
    disabled = false,
    description,
    value: externalValue,
    defaultValue = '',
    size = 'md', // sm, md, lg
    className = '',
    selectClassName = '',
    labelClassName = '',
    loading = false,
    emptyOption = true,
    emptyOptionLabel = "Select an option",
    onChange,
    onBlur,
    error,
    ...props
}) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = externalValue !== undefined ? externalValue : internalValue;

    const handleChange = (e) => {
        const newValue = e.target.value;
        if (externalValue === undefined) {
            setInternalValue(newValue);
        }
        if (onChange) onChange(e);
    };

    const selectOptions = [
        ...(emptyOption ? [{ value: '', label: emptyOptionLabel }] : []),
        ...options
    ];

    // Size classes
    const sizeClass = styles[`select${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';

    return (
        <div className={`${styles.formItem} ${className}`}>
            {label && (
                <label className={`${styles.formLabel} ${styles[`label${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${labelClassName}`}>
                    {Icon && <span className={styles.labelIcon}>{Icon}</span>}
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}

            <div className={`${styles.selectWrapper} ${styles[`wrapper${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>
                <select
                    name={name}
                    value={value || ''}
                    disabled={disabled || loading}
                    className={`${styles.select} ${sizeClass} ${error ? styles.selectError : ''} ${value ? styles.hasValue : ''} ${selectClassName}`}
                    onChange={handleChange}
                    onBlur={onBlur}
                    {...props}
                >
                    {selectOptions.map((option, index) => (
                        <option
                            key={index}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <FiChevronDown className={`${styles.selectIcon} ${styles[`icon${size.charAt(0).toUpperCase() + size.slice(1)}`]}`} />

                {loading && (
                    <div className={styles.loadingSpinner}>
                        <div className={styles.spinner}></div>
                    </div>
                )}
            </div>

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