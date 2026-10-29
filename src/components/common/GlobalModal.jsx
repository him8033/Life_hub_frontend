'use client';

import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiX } from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import FormMultiSelect from '@/components/common/forms/FormMultiSelect';
import FormSearchSelect from '@/components/common/forms/FormSearchSelect';
import FormTextarea from '@/components/common/forms/FormTextarea';
import FormCheckbox from '@/components/common/forms/FormCheckbox';
import FormCheckboxGroup from '@/components/common/forms/FormCheckboxGroup';
import Button from '@/components/common/buttons/Button';

import styles from '@/styles/common/GlobalModal.module.css';

export default function GlobalModal({
    title,
    subtitle,
    icon,
    iconColor = 'var(--primary-500)',
    fields = [],
    schema,
    defaultValues = {},
    submitText = 'Save',
    cancelText = 'Cancel',
    onSubmit,
    size = 'md',
    variant = 'default',
    children,
    onClose,
}) {
    const methods = useForm({
        resolver: schema ? zodResolver(schema) : undefined,
        defaultValues,
        mode: 'onBlur',
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    // Esc to close
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose(null);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const submit = async (data) => {
        try {
            const result = onSubmit ? await onSubmit(data) : data;
            onClose(result ?? data);
        } catch (err) {
            // Caller shows snackbar and throws; keep modal open
            console.error(err);
        }
    };

    return (
        <div className={styles.backdrop} onClick={() => onClose(null)}>
            <div
                className={`${styles.modal} ${styles[size]}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        {icon && (
                            <span
                                className={styles.icon}
                                style={{ color: iconColor }}
                            >
                                {icon}
                            </span>
                        )}
                        <div>
                            <h2 className={styles.title}>{title}</h2>
                            {subtitle && (
                                <p className={styles.subtitle}>{subtitle}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => onClose(null)}
                        className={styles.closeButton}
                        aria-label="Close"
                    >
                        <FiX />
                    </button>
                </div>

                {/* Body */}
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(submit)}
                        className={styles.form}
                    >
                        <div className={styles.body}>
                            {children
                                ? children(methods)
                                : fields.map((f) => (
                                    <FieldRenderer key={f.name} field={f} />
                                ))}
                        </div>

                        {/* Footer */}
                        <div className={styles.actions}>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => onClose(null)}
                                disabled={isSubmitting}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                type="submit"
                                variant={
                                    variant === 'default' ? 'primary' : variant
                                }
                                isLoading={isSubmitting}
                                loadingText="Saving..."
                            >
                                {submitText}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}

/* ---------------------------------------------------
   Field renderer — maps field config to your Form* components
--------------------------------------------------- */
function FieldRenderer({ field }) {
    const { type = 'text', ...rest } = field;

    switch (type) {
        case 'select':
            return <FormSelect {...rest} />;

        case 'multi-select':
            return <FormMultiSelect {...rest} />;

        case 'search-select':
            return <FormSearchSelect {...rest} />;

        case 'checkbox':
            return <FormCheckbox {...rest} />;

        case 'checkbox-group':
            return <FormCheckboxGroup {...rest} />;

        case 'textarea':
            return <FormTextarea {...rest} />;

        // text, email, password, number, tel, url, date, etc.
        default:
            return <FormInput type={type} {...rest} />;
    }
}