'use client';

import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import styles from '@/styles/common/forms/FormSelect.module.css';
import { FiChevronDown } from 'react-icons/fi';

export default function FormSelect({
    name,
    label,
    options = [],
    placeholder = "Select an option",
    icon: Icon,
    required = false,
    disabled = false,
    description,
    size = 'md', // sm, md, lg
    className = '',
    selectClassName = '',
    labelClassName = '',
    loading = false,
    emptyOption = true,
    emptyOptionLabel = "Select an option",
    onChange,
    ...props
}) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name];

    const selectOptions = [
        ...(emptyOption ? [{ value: '', label: emptyOptionLabel }] : []),
        ...options
    ];

    // Size classes
    const sizeClass = styles[`select${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const labelSizeClass = styles[`label${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const iconSizeClass = styles[`icon${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const descriptionSizeClass = styles[`description${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const errorSizeClass = styles[`error${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const wrapperSizeClass = styles[`wrapper${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={`${styles.formItem} ${className}`}>
                    {/* Label */}
                    {label && (
                        <FormLabel className={`${styles.formLabel} ${labelSizeClass} ${labelClassName}`}>
                            {Icon && <span className={styles.labelIcon}>{Icon}</span>}
                            {label}
                            {required && <span className={styles.required}>*</span>}
                        </FormLabel>
                    )}

                    {/* Select Container */}
                    <FormControl>
                        <div className={`${styles.selectWrapper} ${wrapperSizeClass}`}>
                            <select
                                {...field}
                                value={field.value || ''}
                                disabled={disabled || loading}
                                className={`${styles.select} ${sizeClass} ${error ? styles.selectError : ''} ${field.value ? styles.hasValue : ''} ${selectClassName}`}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    field.onChange(value);
                                    if (onChange) onChange(value);
                                }}
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
                            <FiChevronDown className={`${styles.selectIcon} ${iconSizeClass}`} />

                            {/* Loading Indicator */}
                            {loading && (
                                <div className={styles.loadingSpinner}>
                                    <div className={styles.spinner}></div>
                                </div>
                            )}
                        </div>
                    </FormControl>

                    {/* Description */}
                    {description && (
                        <FormDescription className={`${styles.description} ${descriptionSizeClass}`}>
                            {description}
                        </FormDescription>
                    )}

                    {/* Error Message */}
                    <FormMessage className={`${styles.errorMessage} ${errorSizeClass}`} />
                </FormItem>
            )}
        />
    );
}