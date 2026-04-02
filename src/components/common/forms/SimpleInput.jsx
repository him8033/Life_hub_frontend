'use client';

import { useState } from 'react';
import styles from '@/styles/common/forms/FormInput.module.css';

export default function SimpleInput({
    name,
    label,
    type = 'text',
    placeholder,
    icon: Icon,
    required = false,
    autoComplete = 'off',
    maxLength,
    pattern,
    description,
    disabled = false,
    readOnly = false,
    value: externalValue,
    defaultValue = '',
    size = 'md', // sm, md, lg
    className = '',
    inputClassName = '',
    labelClassName = '',
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

    const hasValue = value && value.toString().length > 0;

    // Size classes
    const sizeClass = styles[`input${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';

    return (
        <div className={`${styles.formItem} ${className}`}>
            {label && (
                <label className={`${styles.formLabel} ${styles[`label${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${labelClassName}`}>
                    {Icon && <span className={styles.labelIcon}>{Icon}</span>}
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}

            <input
                type={type}
                name={name}
                value={value || ''}
                placeholder={placeholder}
                autoComplete={autoComplete}
                maxLength={maxLength}
                pattern={pattern}
                disabled={disabled}
                readOnly={readOnly}
                className={`${styles.input} ${sizeClass} ${error ? styles.inputError : ''} ${hasValue ? styles.hasValue : ''} ${inputClassName}`}
                onChange={handleChange}
                onBlur={onBlur}
                {...props}
            />

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