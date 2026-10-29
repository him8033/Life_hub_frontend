'use client';

import { useFormContext, Controller } from 'react-hook-form';
import {
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from '@/components/ui/form';
import styles from '@/styles/common/forms/FormSelect.module.css';

export default function FormCheckboxGroup({
    name,
    label,
    options = [],
    required = false,
    disabled = false,
    description,
    size = 'md',
    className = '',
    labelClassName = '',
}) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const values = field.value || [];

                const toggle = (val) => {
                    const next = values.includes(val)
                        ? values.filter((v) => v !== val)
                        : [...values, val];
                    field.onChange(next);
                };

                return (
                    <FormItem className={`${styles.formItem} ${className}`}>
                        {label && (
                            <FormLabel
                                className={`${styles.formLabel} ${labelClassName}`}
                            >
                                {label}
                                {required && (
                                    <span className={styles.required}>*</span>
                                )}
                            </FormLabel>
                        )}

                        <div className="flex flex-col gap-2">
                            {options.map((opt) => (
                                <label
                                    key={opt.value}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        value={opt.value}
                                        checked={values.includes(opt.value)}
                                        onChange={() => toggle(opt.value)}
                                        disabled={disabled}
                                        className="w-4 h-4 accent-[var(--primary-500)]"
                                    />
                                    <span className="text-[var(--text-primary)] capitalize">
                                        {opt.label}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {description && (
                            <FormDescription className={styles.description}>
                                {description}
                            </FormDescription>
                        )}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}