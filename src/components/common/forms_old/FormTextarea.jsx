'use client';

import { useId } from 'react';
import formStyles from '@/styles/forms/FormElements.module.css';

export default function FormTextarea({
    label,
    required = false,
    value,
    onChange,
    placeholder,
    disabled = false,
    error,
    hint,
    rows = 4,
    className = '',
    ...props
}) {
    const textareaId = useId();

    return (
        <div className={`${formStyles.formGroup} ${className}`}>
            {label && (
                <label htmlFor={textareaId} className={formStyles.formLabel}>
                    {label}
                    {required && <span className={formStyles.required}>*</span>}
                </label>
            )}
            <textarea
                id={textareaId}
                value={value}
                onChange={onChange}
                className={formStyles.formTextarea}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                aria-invalid={!!error}
                aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
                {...props}
            />
            {hint && !error && (
                <p id={`${textareaId}-hint`} className={formStyles.hintText}>
                    {hint}
                </p>
            )}
            {error && (
                <p id={`${textareaId}-error`} className={formStyles.errorText}>
                    {error}
                </p>
            )}
        </div>
    );
}