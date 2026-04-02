'use client';

import { useId } from 'react'; // Import useId
import formStyles from '@/styles/forms/FormElements.module.css';

export default function FormSelect({
    label,
    required = false,
    value,
    onChange,
    options = [],
    disabled = false,
    loading = false,
    placeholder = "Select an option",
    error,
    hint,
    className = '',
    ...props
}) {
    // Generate a stable ID that's consistent between server and client
    const selectId = useId();

    return (
        <div className={`${formStyles.formGroup} ${className}`}>
            {label && (
                <label htmlFor={selectId} className={formStyles.formLabel}>
                    {label}
                    {required && <span className={formStyles.required}>*</span>}
                </label>
            )}
            <select
                id={selectId}
                value={value}
                onChange={onChange}
                className={formStyles.formSelect}
                disabled={disabled || loading}
                required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
                {...props}
            >
                <option value="">
                    {loading ? 'Loading...' : placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </option>
                ))}
            </select>
            {hint && !error && (
                <p id={`${selectId}-hint`} className={formStyles.hintText}>
                    {hint}
                </p>
            )}
            {error && (
                <p id={`${selectId}-error`} className={formStyles.errorText}>
                    {error}
                </p>
            )}
        </div>
    );
}