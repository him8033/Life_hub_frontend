'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { FiTag, FiHash, FiCheck, FiX } from 'react-icons/fi';

// Reusable Components
import FormInput from '@/components/common/forms/FormInput';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';

// Hooks & Schema
import useSlugGenerator from '@/hooks/useSlugGenerator';
import { spotCategorySchema } from '@/lib/validations/spotCategorySchema';
import { useCheckSpotCategoryNameQuery } from '@/services/api/spotcategoryApi';

// Styles
import styles from '@/styles/travelspots/spotcategory/SpotCategoryForm.module.css';

/* ---------------- Helpers ---------------- */
const useDebounce = (value, delay = 500) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
};

const SpotCategoryForm = ({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    mode = 'create' // 'create' or 'edit'
}) => {
    const { slug, generateFrom, updateManually, reset: resetSlug } = useSlugGenerator(initialData.slug);

    const [name, setName] = useState("");
    const debouncedName = useDebounce(name, 500);
    const { data, isFetching: isCheckingName } = useCheckSpotCategoryNameQuery({
        name: debouncedName,
        exclude_id: initialData?.spotcategory_id,
    }, {
        skip: !debouncedName || debouncedName.length < 3,
    });

    // Initialize form
    const methods = useForm({
        resolver: zodResolver(spotCategorySchema),
        defaultValues: {
            name: initialData?.name || '',
            slug: initialData?.slug || '',
        },
    });

    const {
        setValue,
        watch,
        reset,
        setError,
        clearErrors,
        formState: { errors },
    } = methods;

    useEffect(() => {
        if (!debouncedName || debouncedName.length < 3) return;

        if (data?.data?.exists === true) {
            setError('name', {
                type: 'manual',
                message: 'This category name already exists',
            });
        } else if (data?.data?.exists === false) {
            clearErrors('name');
        }
    }, [data, debouncedName, setError, clearErrors]);

    const watchedSlug = watch('slug');
    const isSlugValid = (value) =>
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

    /* Sync slug hook → form */
    useEffect(() => {
        setValue('slug', slug);
    }, [slug, setValue]);

    /* Edit mode prefill */
    useEffect(() => {
        if (mode === 'edit' && initialData?.slug) {
            resetSlug(initialData.slug);
            reset({
                name: initialData.name || '',
                slug: initialData.slug || '',
            });
        }
    }, [mode, initialData, reset, resetSlug]);

    useEffect(() => {
        if (onBackendError) {
            onBackendError(methods);
        }
    }, [methods, onBackendError]);

    // Determine name field status
    const isNameAvailable = data?.data?.exists === false && name.length >= 3;
    const isNameDuplicate = data?.data?.exists === true && name.length >= 3;
    const isChecking = isCheckingName && name.length >= 3;

    return (
        <div className={styles.categoryForm}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    {/* Name Field */}
                    <FormInput
                        name="name"
                        label="Category Name"
                        placeholder="e.g., Beaches, Mountains, Cities"
                        icon={<FiTag />}
                        required
                        autoFocus={mode === 'create'}
                        disabled={isSubmitting}
                        description="Enter a descriptive name for the category"
                        className={styles.formItem}
                        onChange={(e) => {
                            generateFrom(e.target.value);
                            setName(e.target.value);
                        }}
                        rightContent={
                            isChecking ? (
                                <span className={styles.checkingStatus}>Checking...</span>
                            ) : isNameDuplicate ? (
                                <span className={styles.errorStatus}>
                                    <FiX /> Name already exists
                                </span>
                            ) : isNameAvailable ? (
                                <span className={styles.successStatus}>
                                    <FiCheck /> Name available
                                </span>
                            ) : null
                        }
                    />

                    {/* Slug Field */}
                    <FormInput
                        name="slug"
                        label="URL Slug"
                        placeholder="beaches"
                        icon={<FiHash />}
                        required
                        disabled={isSubmitting}
                        description="This will be used in the URL. Use lowercase letters, numbers, and hyphens."
                        className={styles.formItem}
                        onChange={(e) => {
                            updateManually(e.target.value);
                        }}
                        rightContent={
                            watchedSlug && (
                                <div className={styles.slugValidation}>
                                    {isSlugValid(watchedSlug) ? (
                                        <span className={styles.validStatus}>
                                            <FiCheck /> Valid format
                                        </span>
                                    ) : (
                                        <span className={styles.invalidStatus}>
                                            <FiX /> Use lowercase, numbers, and hyphens only
                                        </span>
                                    )}
                                </div>
                            )
                        }
                    />

                    {/* URL Preview */}
                    {watchedSlug && isSlugValid(watchedSlug) && (
                        <div className={styles.previewSection}>
                            <h4 className={styles.previewTitle}>URL Preview</h4>
                            <div className={styles.previewUrl}>
                                https://lifehub.com/category/
                                <span className={styles.previewSlug}>
                                    {watchedSlug}
                                </span>
                            </div>
                        </div>
                    )}

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
                            disabled={isSubmitting || isNameDuplicate || isChecking}
                        >
                            {mode === 'create' ? 'Create Category' : 'Update Category'}
                        </Button>
                    </ButtonGroup>
                </form>
            </FormProvider>
        </div>
    );
};

export default SpotCategoryForm;