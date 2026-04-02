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
import { Textarea } from '@/components/ui/textarea';
import styles from '@/styles/common/forms/FormInput.module.css';

export default function FormTextarea({
    name,
    label,
    placeholder,
    icon: Icon,
    required = false,
    rows = 4,
    maxLength,
    description,
    disabled = false,
    readOnly = false,
    size = 'md', // sm, md, lg
    className = '',
    inputClassName = '',
    labelClassName = '',
    ...props
}) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name];

    // Size classes
    const sizeClass = styles[`textarea${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const labelSizeClass = styles[`label${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const descriptionSizeClass = styles[`description${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const errorSizeClass = styles[`error${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';

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

                    {/* Textarea Container */}
                    <FormControl>
                        <Textarea
                            placeholder={placeholder}
                            rows={rows}
                            maxLength={maxLength}
                            disabled={disabled}
                            readOnly={readOnly}
                            className={`${styles.textarea} ${sizeClass} ${error ? styles.inputError : ''} ${field.value ? styles.hasValue : ''} ${inputClassName}`}
                            {...field}
                            value={field.value || ''}
                            {...props}
                        />
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