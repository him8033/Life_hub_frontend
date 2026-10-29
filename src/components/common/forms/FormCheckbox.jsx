'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { FormItem, FormMessage } from '@/components/ui/form';
import styles from '@/styles/common/forms/FormInput.module.css';

export default function FormCheckbox({
    name,
    label,
    disabled = false,
    size = 'md',
    className = '',
}) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem className={`${styles.formItem} ${className}`}>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={!!field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={disabled}
                            className="w-4 h-4 accent-[var(--primary-500)]"
                        />
                        <span className="text-[var(--text-sm)] text-[var(--text-secondary)]">
                            {label}
                        </span>
                    </label>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}