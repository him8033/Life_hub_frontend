'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { FiFolder, FiTarget, FiFileText, FiGlobe } from 'react-icons/fi';

// Reusable Components
import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import FormSelect from '@/components/common/forms/FormSelect';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';

// Schema
import { snapshotSchema } from '@/lib/validations/portfolio/snapshotSchema';

// Styles
import styles from '@/styles/portfolio/SnapshotForm.module.css';

const visibilityOptions = [
    { value: 'private', label: 'Private - Only you can see' },
    { value: 'public', label: 'Public - Anyone can view' },
];

const SnapshotForm = ({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    mode = 'create' // 'create' or 'edit'
}) => {
    // Initialize form
    const methods = useForm({
        resolver: zodResolver(snapshotSchema),
        defaultValues: {
            title: initialData?.title || '',
            target_role: initialData?.target_role || '',
            description: initialData?.description || '',
            visibility: initialData?.visibility || 'private',
        },
    });

    const {
        reset,
    } = methods;

    /* Edit mode prefill */
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            reset({
                title: initialData.title || '',
                target_role: initialData.target_role || '',
                description: initialData.description || '',
                visibility: initialData.visibility || 'private',
            });
        }
    }, [mode, initialData, reset]);

    useEffect(() => {
        if (onBackendError) {
            onBackendError(methods);
        }
    }, [methods, onBackendError]);

    return (
        <div className={styles.snapshotForm}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    {/* Title Field */}
                    <FormInput
                        name="title"
                        label="Snapshot Title"
                        placeholder="e.g., Backend Engineer Resume"
                        icon={<FiFolder />}
                        required
                        autoFocus={mode === 'create'}
                        disabled={isSubmitting}
                        description="Give your snapshot a clear and descriptive name"
                        className={styles.formItem}
                    />

                    {/* Target Role Field */}
                    <FormInput
                        name="target_role"
                        label="Target Role"
                        placeholder="e.g., Senior Backend Developer"
                        icon={<FiTarget />}
                        disabled={isSubmitting}
                        description="The job role or position you're targeting with this snapshot"
                        className={styles.formItem}
                    />

                    {/* Description Field */}
                    <FormTextarea
                        name="description"
                        label="Description"
                        placeholder="Brief description of this snapshot's purpose and focus..."
                        rows={4}
                        disabled={isSubmitting}
                        description="Optional: Describe what makes this snapshot unique"
                        className={styles.formItem}
                    />

                    {/* Visibility Field */}
                    <FormSelect
                        name="visibility"
                        label="Visibility"
                        options={visibilityOptions}
                        disabled={isSubmitting}
                        description="Control who can access this snapshot. Private snapshots are only visible to you."
                        className={styles.formItem}
                        emptyOption={false}
                    />

                    {/* Form Actions */}
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
                            {mode === 'create' ? 'Create Snapshot' : 'Update Snapshot'}
                        </Button>
                    </ButtonGroup>
                </form>
            </FormProvider>
        </div>
    );
};

export default SnapshotForm;