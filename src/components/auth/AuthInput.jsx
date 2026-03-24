'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import styles from '@/styles/auth/AuthInput.module.css';

export default function AuthInput({
    name,
    label,
    type = 'text',
    placeholder,
    icon: Icon,
    required = false,
    showPasswordToggle = false,
    autoComplete = 'off',
    maxLength,
    showCharCount = false,
    pattern,
    description,
    className = '',
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const { control, watch } = useFormContext();
    const value = watch(name) || '';

    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    // Update character count
    useEffect(() => {
        if (showCharCount && value) {
            setCharCount(value.length);
        }
    }, [value, showCharCount]);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={`${styles.formItem} ${className}`}>
                    {/* Label Row with Character Counter */}
                    {label && (
                        <div className={styles.labelRow}>
                            <FormLabel className={styles.formLabel}>
                                {Icon && <span className={styles.labelIcon}>{Icon}</span>}
                                {label}
                                {required && <span className={styles.required}>*</span>}
                            </FormLabel>
                            {showCharCount && maxLength && (
                                <span className={styles.charCount}>
                                    {charCount}/{maxLength}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Input Container */}
                    <div className={styles.inputContainer}>
                        <FormControl>
                            <Input
                                type={inputType}
                                placeholder={placeholder}
                                autoComplete={autoComplete}
                                maxLength={maxLength}
                                pattern={pattern}
                                className={`${styles.input} ${field.value ? styles.hasValue : ''}`}
                                {...field}
                                value={field.value || ''}
                            />
                        </FormControl>

                        {/* Password Toggle Button */}
                        {showPasswordToggle && type === 'password' && (
                            <button
                                type="button"
                                className={styles.eyeButton}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        )}
                    </div>

                    {/* Description */}
                    {description && (
                        <FormDescription className={styles.description}>
                            {description}
                        </FormDescription>
                    )}

                    {/* Error Message */}
                    <FormMessage className={styles.errorMessage} />
                </FormItem>
            )}
        />
    );
}