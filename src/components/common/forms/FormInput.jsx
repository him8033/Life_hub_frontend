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
import { Input } from '@/components/ui/input';
import styles from '@/styles/common/forms/FormInput.module.css';

export default function FormInput({
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
    size = 'md', // sm, md, lg
    className = '',
    inputClassName = '',
    labelClassName = '',
    onChange,
    ...props
}) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name];

    // Filter out props that shouldn't be passed to Input
    const { rightContent, leftContent, ...inputProps } = props;

    // Size classes
    const sizeClass = styles[`input${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const labelSizeClass = styles[`label${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const descriptionSizeClass = styles[`description${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const errorSizeClass = styles[`error${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={`${styles.formItem} ${className}`}>
                    {label && (
                        <FormLabel className={`${styles.formLabel} ${labelSizeClass} ${labelClassName}`}>
                            {Icon && <span className={styles.labelIcon}>{Icon}</span>}
                            {label}
                            {required && <span className={styles.required}>*</span>}
                        </FormLabel>
                    )}

                    <FormControl>
                        <Input
                            type={type}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                            maxLength={maxLength}
                            pattern={pattern}
                            disabled={disabled}
                            readOnly={readOnly}
                            className={`${styles.input} ${sizeClass} ${error ? styles.inputError : ''} ${field.value ? styles.hasValue : ''} ${inputClassName}`}
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => {
                                field.onChange(e);
                                if (onChange) onChange(e);
                            }}
                            {...inputProps}
                        />
                    </FormControl>

                    {description && (
                        <FormDescription className={`${styles.description} ${descriptionSizeClass}`}>
                            {description}
                        </FormDescription>
                    )}

                    {rightContent && (
                        <div className={styles.rightContent}>
                            {rightContent}
                        </div>
                    )}
                    <FormMessage className={`${styles.errorMessage} ${errorSizeClass}`} />
                </FormItem>
            )}
        />
    );
}