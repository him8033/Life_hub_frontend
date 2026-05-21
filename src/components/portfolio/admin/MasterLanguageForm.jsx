'use client';

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiFlag, FiHash, FiStar, FiCode } from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';
import { masterLanguageSchema } from '@/lib/validations/masterLanguageSchema';
import styles from '@/styles/portfolio/admin/MasterSkillForm.module.css';

const MasterLanguageForm = ({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    mode = 'create'
}) => {
    const methods = useForm({
        resolver: zodResolver(masterLanguageSchema),
        defaultValues: {
            name: initialData?.name || '',
            code: initialData?.code || '',
            icon: initialData?.icon || '',
            position: initialData?.position || 0,
        },
    });

    const { reset, handleSubmit } = methods;

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            reset({
                name: initialData.name || '',
                code: initialData.code || '',
                icon: initialData.icon || '',
                position: initialData.position || 0,
            });
        }
    }, [mode, initialData, reset]);

    useEffect(() => {
        if (onBackendError) {
            onBackendError(methods);
        }
    }, [methods, onBackendError]);

    const handleFormSubmit = (data) => {
        const payload = {
            ...data,
        };
        onSubmit(payload);
    };

    return (
        <div className={styles.formContainer}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormInput
                        name="name"
                        label="Language Name"
                        placeholder="e.g., English, Hindi, French"
                        icon={<FiFlag />}
                        required
                        autoFocus={mode === 'create'}
                        disabled={isSubmitting}
                        description="Enter the language name"
                        className={styles.formItem}
                    />

                    <FormInput
                        name="code"
                        label="Language Code"
                        placeholder="e.g., EN, HI, FR"
                        icon={<FiCode />}
                        disabled={isSubmitting}
                        description="Optional: ISO language code (e.g., EN, HI, FR)"
                        className={styles.formItem}
                    />

                    <FormInput
                        name="icon"
                        label="Icon"
                        placeholder="e.g., 🇬🇧, 🇮🇳, 🇫🇷 (emoji flag or icon)"
                        icon={<FiStar />}
                        disabled={isSubmitting}
                        description="Optional: Emoji or icon for visual display"
                        className={styles.formItem}
                    />

                    <FormInput
                        name="position"
                        label="Display Order"
                        type="number"
                        placeholder="0"
                        disabled={isSubmitting}
                        description="Lower numbers appear first. Default is 0"
                        className={styles.formItem}
                    />

                    <ButtonGroup align="end" className={styles.formActions}>
                        <Button
                            variant="secondary"
                            onClick={() => reset()}
                            disabled={isSubmitting}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting}
                            loadingText={mode === 'create' ? 'Creating...' : 'Updating...'}
                        >
                            {mode === 'create' ? 'Create Language' : 'Update Language'}
                        </Button>
                    </ButtonGroup>
                </form>
            </FormProvider>
        </div>
    );
};

export default MasterLanguageForm;