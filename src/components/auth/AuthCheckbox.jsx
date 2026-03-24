'use client';

import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';

import styles from '@/styles/auth/AuthCheckbox.module.css';

export default function AuthCheckbox({
    name,
    label,
    className = '',
    disabled = false,
}) {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={`${styles.checkboxWrapper} ${className}`}>
                    <label className={styles.checkboxLabel}>
                        <FormControl>
                            <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                disabled={disabled}
                                className={styles.checkbox}
                            />
                        </FormControl>

                        <span className={styles.checkboxText}>
                            {label}
                        </span>
                    </label>

                    {/* Zod Error Message */}
                    <FormMessage className={styles.errorMessage} />
                </FormItem>
            )}
        />
    );
}