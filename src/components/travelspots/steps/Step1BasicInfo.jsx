'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiTag, FiGlobe, FiFileText, FiChevronRight, FiCheck, FiX, FiHash } from 'react-icons/fi';

// UI Components
import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import FormMultiSelect from '@/components/common/forms/FormMultiSelect';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';

// Hooks & API
import useSlugGenerator from '@/hooks/useSlugGenerator';
import { basicInfoSchema } from '@/lib/validations/travelspotSchema';
import { useGetPublicSpotCategoriesQuery } from '@/services/api/spotcategoryApi';
import { useCheckTravelSpotNameQuery } from '@/services/api/travelspotApi';

// Styles
import styles from '@/styles/travelspots/steps/CommonStepStyles.module.css';
import StepHeader from './StepHeader';
import StepActions from './StepActions';
import FormSection from './FormSection';

/* ---------------- Helpers ---------------- */
const useDebounce = (value, delay = 500) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
};

const Step1BasicInfo = ({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    onCancel,
    mode = 'create'
}) => {
    // Slug generator
    const { slug, generateFrom, updateManually, reset: resetSlug } = useSlugGenerator(
        mode === 'edit' ? initialData.slug || '' : ''
    );

    // Categories
    const { data: catRes, isLoading: isLoadingCategories } = useGetPublicSpotCategoriesQuery();
    const categories = catRes?.data?.map(c => ({
        value: c.spotcategory_id,
        label: c.name,
        count: c.total_spots || 0,
    })) || [];

    // Name availability check
    const [name, setName] = useState("");
    const debouncedName = useDebounce(name, 500);
    const { data: nameCheckData, isFetching: isCheckingName } = useCheckTravelSpotNameQuery({
        name: debouncedName,
        exclude_id: initialData?.travelspot_id,
    }, {
        skip: !debouncedName || debouncedName.length < 3,
    });

    // Initialize form
    const methods = useForm({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: {
            name: initialData?.name || '',
            slug: initialData?.slug || '',
            short_description: initialData?.short_description || '',
            categories: initialData?.categories || [],
        },
    });

    const {
        setValue,
        watch,
        reset,
        setError,
        clearErrors,
        formState: { errors, isValid },
    } = methods;

    // Watch form values
    const shortDescription = watch('short_description');
    const selectedCategories = watch('categories');
    const currentName = watch('name');
    const watchedSlug = watch('slug');

    // Name availability validation
    useEffect(() => {
        if (!debouncedName || debouncedName.length < 3) return;

        if (nameCheckData?.data?.exists === true) {
            setError('name', {
                type: 'manual',
                message: 'This travel spot name already exists',
            });
        } else if (nameCheckData?.data?.exists === false) {
            clearErrors('name');
        }
    }, [nameCheckData, debouncedName, setError, clearErrors]);

    // Sync slug hook → form
    useEffect(() => {
        setValue('slug', slug);
    }, [slug, setValue]);

    // Edit mode prefill
    useEffect(() => {
        if (mode === 'edit' && initialData?.slug) {
            resetSlug(initialData.slug);
            reset({
                name: initialData.name || '',
                slug: initialData.slug || '',
                short_description: initialData.short_description || '',
                categories: initialData.categories || [],
            });
            setName(initialData.name || '');
        }
    }, [mode, initialData, reset, resetSlug]);

    // Backend error handling
    useEffect(() => {
        if (onBackendError) {
            onBackendError(methods);
        }
    }, [methods, onBackendError]);

    // Determine name field status
    const isNameAvailable = nameCheckData?.data?.exists === false && name.length >= 3;
    const isNameDuplicate = nameCheckData?.data?.exists === true && name.length >= 3;
    const isChecking = isCheckingName && name.length >= 3;

    // Slug validation
    const isSlugValid = (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

    return (
        <div className={styles.stepContainer}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className={styles.form}>
                    {/* Step Header */}
                    <StepHeader
                        title="Basic Information"
                        description="Provide the essential details about your travel spot. You'll add location and other details in the next steps."
                    />

                    {/* Name & Slug Section */}
                    <FormSection
                        icon={FiTag}
                        title="Spot Identification"
                        subtitle="Basic details to identify your travel spot"
                    >
                        <div className={styles.formGrid}>
                            {/* Name Field */}
                            <div className={styles.formGroup}>
                                <FormInput
                                    name="name"
                                    label="Spot Name"
                                    placeholder="e.g., Lotus Temple"
                                    icon={<FiTag />}
                                    required
                                    size="md"
                                    autoFocus={mode === 'create'}
                                    disabled={isSubmitting}
                                    description="Enter the official or commonly known name of the travel spot"
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
                            </div>

                            {/* Slug Field */}
                            <div className={styles.formGroup}>
                                <FormInput
                                    name="slug"
                                    label="URL Slug"
                                    placeholder="e.g., lotus-temple"
                                    icon={<FiHash />}
                                    required
                                    size="md"
                                    disabled={isSubmitting}
                                    description="This will be used in the URL. Use lowercase letters, numbers, and hyphens."
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
                            </div>
                        </div>

                        {/* URL Preview */}
                        {watchedSlug && isSlugValid(watchedSlug) && (
                            <div className={styles.previewSection}>
                                <h4 className={styles.previewTitle}>URL Preview</h4>
                                <div className={styles.previewUrl}>
                                    travelhub.com/spot/
                                    <span className={styles.previewSlug}>
                                        {watchedSlug}
                                    </span>
                                </div>
                            </div>
                        )}
                    </FormSection>

                    {/* Categories Section */}
                    <FormSection
                        icon={FiGlobe}
                        title="Categories"
                        subtitle="Help travelers find your spot by categorizing it"
                    >
                        <div className={styles.formGroup}>
                            <FormMultiSelect
                                name="categories"
                                label="Select Categories"
                                options={categories.map(cat => ({
                                    value: cat.value,
                                    label: `${cat.label} ${cat.count ? `(${cat.count})` : '(0)'}`
                                }))}
                                placeholder="Search and select categories..."
                                required
                                size="md"
                                disabled={isSubmitting || isLoadingCategories}
                                description="Select categories that best describe your travel spot"
                            />

                            {/* Selected Categories Count */}
                            {selectedCategories?.length > 0 && (
                                <div className={styles.selectedCount}>
                                    <span className={styles.selectedCountBadge}>
                                        {selectedCategories.length} category{selectedCategories.length !== 1 ? 's' : ''} selected
                                    </span>
                                </div>
                            )}
                        </div>
                    </FormSection>

                    {/* Short Description Section */}
                    <FormSection
                        icon={FiFileText}
                        title="Short Description"
                        subtitle="A quick overview of what makes this place special"
                    >
                        <div className={styles.formGroup}>
                            <FormTextarea
                                name="short_description"
                                label="Short Description"
                                placeholder="Describe your travel spot in a few sentences. What makes it special?"
                                rows={4}
                                maxLength={500}
                                size="md"
                                disabled={isSubmitting}
                                description="Describe your travel spot in a few sentences. This appears in search results and listings."
                            />

                            {/* Character Count */}
                            <div className={styles.charCount}>
                                <span className={styles.charCountText}>
                                    {shortDescription?.length || 0}/500 characters
                                </span>
                            </div>
                        </div>
                    </FormSection>

                    {/* Form Actions */}
                    <StepActions
                        onBack={onCancel}
                        onNext={methods.handleSubmit(onSubmit)}
                        onCancel={onCancel}
                        isSubmitting={isSubmitting}
                        isValid={isValid && !isNameDuplicate && !isChecking}
                        backText="Cancel"
                        nextText="Save & Continue"
                        showBack={false}
                        showCancel={true}
                        showNext={true}
                        align="end"
                    />
                </form>
            </FormProvider>
        </div>
    );
};

export default Step1BasicInfo;