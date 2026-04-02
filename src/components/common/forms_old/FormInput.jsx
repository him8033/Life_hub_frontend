'use client';

import { useId } from 'react';
import formStyles from '@/styles/forms/FormElements.module.css';

export default function FormInput({
    label,
    required = false,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled = false,
    error,
    hint,
    className = '',
    ...props
}) {
    const inputId = useId();

    return (
        <div className={`${formStyles.formGroup} ${className}`}>
            {label && (
                <label htmlFor={inputId} className={formStyles.formLabel}>
                    {label}
                    {required && <span className={formStyles.required}>*</span>}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                value={value}
                onChange={onChange}
                className={formStyles.formInput}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                {...props}
            />
            {hint && !error && (
                <p id={`${inputId}-hint`} className={formStyles.hintText}>
                    {hint}
                </p>
            )}
            {error && (
                <p id={`${inputId}-error`} className={formStyles.errorText}>
                    {error}
                </p>
            )}
        </div>
    );
}