'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiCheck, FiGlobe, FiTag, FiFileText, FiChevronRight } from 'react-icons/fi';

// Shadcn Components
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';

// Custom Components
import ReactMultiSelect from '@/components/ui/ReactMultiSelect';

// Hooks & Utils
import useSlugGenerator from '@/hooks/useSlugGenerator';
import { basicInfoSchema } from '@/lib/validations/travelspotSchema';

// API
import { useGetPublicSpotCategoriesQuery } from '@/services/api/spotcategoryApi';

// Styles
import styles from '@/styles/travelspots/steps/Step1BasicInfo.module.css';

const Step1BasicInfo = ({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    onCancel,
    mode = 'create'
}) => {
    // Fetch categories
    const { data: categoriesData, isLoading: isLoadingCategories } = useGetPublicSpotCategoriesQuery();

    // Format categories for multi-select
    const categories = categoriesData?.data?.map(cat => ({
        value: cat.spotcategory_id,
        label: cat.name,
        // count: cat.spotCount || 0,
    })) || [];

    // Get default values
    const getDefaultValues = () => {
        if (mode === 'edit' && initialData) {
            return {
                name: initialData.name || '',
                slug: initialData.slug || '',
                short_description: initialData.short_description || '',
                categories: initialData.categories || [],
            };
        }

        return {
            name: '',
            slug: '',
            short_description: '',
            categories: [],
        };
    };

    // Initialize form
    const form = useForm({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: getDefaultValues(),
    });

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = form;

    // Watch form values
    const shortDescription = watch('short_description');
    const selectedCategories = watch('categories');

    // Slug generator hook with updateManually
    const { slug, generateFrom, updateManually } = useSlugGenerator(
        mode === 'edit' ? initialData.slug || '' : ''
    );

    // Sync slug only in create mode or when manually updated
    useEffect(() => {
        if (mode === 'create') {
            setValue('slug', slug);
        }
    }, [slug, setValue, mode]);

    useEffect(() => {
        if (onBackendError) {
            onBackendError(form);
        }
    }, [form, onBackendError]);

    // Handle form submission
    const handleFormSubmit = (data) => {
        onSubmit(data);
    };

    // Handle cancel
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    // Slug validation
    const isSlugValid = (value) => {
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
    };

    // Get character count class
    const getCharCountClass = (length, max) => {
        if (length > max) return styles.charCountLimit;
        if (length > max * 0.9) return styles.charCountNearLimit;
        return styles.charCountGood;
    };

    return (
        <div className={styles.stepContainer}>
            {/* Step Header */}
            <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>Basic Information</h1>
                <p className={styles.stepDescription}>
                    Provide the essential details about your travel spot. You'll add location and other details in the next steps.
                </p>
            </div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
                    {/* Name & Slug Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <FiTag className={styles.icon} />
                                Spot Identification
                            </h2>
                            <p className={styles.sectionSubtitle}>
                                Basic details to identify your travel spot
                            </p>
                        </div>

                        {/* Name Field */}
                        <div className={styles.formGroup}>
                            <FormField
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className={styles.labelContainer}>
                                            <FormLabel className={styles.label}>
                                                Spot Name
                                                <span className={styles.required}>*</span>
                                            </FormLabel>
                                            <FormDescription className={styles.fieldInfo}>
                                                Keep it descriptive and clear
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Lotus Temple"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    generateFrom(e.target.value);
                                                }}
                                                className={styles.input}
                                                autoFocus={mode === 'create'}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage className={styles.errorMessage} />
                                        <p className={styles.helperText}>
                                            Enter the official or commonly known name of the travel spot
                                        </p>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Slug Field */}
                        <div className={styles.formGroup}>
                            <FormField
                                control={control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className={styles.labelContainer}>
                                            <FormLabel className={styles.label}>
                                                URL Slug
                                                <span className={styles.required}>*</span>
                                            </FormLabel>
                                            <FormDescription className={styles.fieldInfo}>
                                                Used in website URLs
                                            </FormDescription>
                                        </div>
                                        <div className={styles.slugContainer}>
                                            <span className={styles.slugPrefix}>travelhub.com/</span>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., lotus-temple"
                                                    {...field}
                                                    className={`${styles.input} ${styles.slugInput}`}
                                                    disabled={isSubmitting}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        updateManually(e.target.value);
                                                    }}
                                                />
                                            </FormControl>
                                        </div>

                                        {/* Slug Validation */}
                                        {field.value && (
                                            <div className={styles.slugValidation}>
                                                {isSlugValid(field.value) ? (
                                                    <div className={styles.slugValid}>
                                                        <FiCheck className={styles.checkIcon} />
                                                        Valid URL slug format
                                                    </div>
                                                ) : (
                                                    <div className={styles.slugInvalid}>
                                                        Use lowercase letters, numbers, and hyphens only
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <FormMessage className={styles.errorMessage} />
                                        <p className={styles.slugHelper}>
                                            This will be used in the website URL. Example: travelhub.com/{field.value || 'your-slug'}
                                        </p>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Categories Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <FiGlobe className={styles.icon} />
                                Categories
                            </h2>
                            <p className={styles.sectionSubtitle}>
                                Help travelers find your spot by categorizing it
                            </p>
                        </div>

                        <div className={styles.formGroup}>
                            <FormField
                                control={control}
                                name="categories"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className={styles.labelContainer}>
                                            <FormLabel className={styles.label}>
                                                Select Categories
                                                <span className={styles.required}>*</span>
                                            </FormLabel>
                                            <FormDescription className={styles.fieldInfo}>
                                                Choose all that apply
                                            </FormDescription>
                                        </div>
                                        <div className={styles.multiSelectContainer}>
                                            <FormControl>
                                                <ReactMultiSelect
                                                    options={categories}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Search and select categories..."
                                                    disabled={isSubmitting || isLoadingCategories}
                                                    searchable={true}
                                                    maxHeight={250}
                                                    className={styles.multiSelect}
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage className={styles.errorMessage} />

                                        {/* Selected Categories Info */}
                                        {selectedCategories?.length > 0 && (
                                            <div className={styles.charCount}>
                                                <span className={styles.charCountText}>
                                                    {selectedCategories.length} category{selectedCategories.length !== 1 ? 's' : ''} selected
                                                </span>
                                            </div>
                                        )}

                                        <p className={styles.helperText}>
                                            Select categories that best describe your travel spot (at least 1 required)
                                        </p>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Short Description Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <FiFileText className={styles.icon} />
                                Short Description
                            </h2>
                            <p className={styles.sectionSubtitle}>
                                A quick overview of what makes this place special
                            </p>
                        </div>

                        <div className={styles.formGroup}>
                            <FormField
                                control={control}
                                name="short_description"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className={styles.labelContainer}>
                                            <FormLabel className={styles.label}>
                                                Short Description
                                            </FormLabel>
                                            <FormDescription className={styles.fieldInfo}>
                                                Short summary (max 500 characters)
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your travel spot in a few sentences. What makes it special?"
                                                {...field}
                                                className={styles.textarea}
                                                rows={3}
                                                maxLength={500}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>

                                        {/* Character Count */}
                                        <div className={styles.charCount}>
                                            <span className={styles.charCountText}>
                                                Short summary for listings and search results
                                            </span>
                                            <span className={getCharCountClass(shortDescription?.length || 0, 500)}>
                                                {shortDescription?.length || 0}/500
                                            </span>
                                        </div>

                                        <FormMessage className={styles.errorMessage} />
                                        <p className={styles.helperText}>
                                            Describe your travel spot in a few sentences. This appears in search results and listings.
                                        </p>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={styles.backButton}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={styles.nextButton}
                            disabled={isSubmitting || !isValid}
                        >
                            {isSubmitting ? (
                                <span className={styles.loadingButton}>
                                    <div className={styles.spinner}></div>
                                    Saving...
                                </span>
                            ) : (
                                <>
                                    Save & Continue
                                    <FiChevronRight className={styles.icon} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Step1BasicInfo;