// src/components/travelspots/SpotCategoryForm.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import ButtonLoading from '@/components/Application/ButtonLoading';
import { FiHash, FiTag, FiCheck } from 'react-icons/fi';
import { spotCategorySchema } from '@/lib/validations/spotCategorySchema';
import useSlugGenerator from '@/hooks/useSlugGenerator';
import styles from '@/styles/travelspots/spotcategory/SpotCategoryForm.module.css';
import { useCheckSpotCategoryNameQuery } from '@/services/api/spotcategoryApi';

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
    const { data, isFetching } = useCheckSpotCategoryNameQuery({
        name: debouncedName,
        exclude_id: initialData?.spotcategory_id,
    }, {
        skip: !debouncedName || debouncedName.length < 3,
    });

    // Initialize form
    const form = useForm({
        resolver: zodResolver(spotCategorySchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    });

    const {
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = form;

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
            onBackendError(form);
        }
    }, [form, onBackendError]);

    const isSlugValid = (value) =>
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

    return (
        <div className={styles.categoryForm}>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Name Field */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className={styles.formItem}>
                                <FormLabel className={styles.formLabel}>
                                    <FiTag className={styles.inputIcon} />
                                    Category Name
                                    <span className={styles.required}>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            generateFrom(e.target.value);
                                            setName(e.target.value);
                                        }}
                                        placeholder="e.g., Beaches, Mountains, Cities"
                                        className={styles.formInput}
                                        autoFocus={mode === 'create'}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <div className={styles.helperText}>
                                    Enter a descriptive name for the category
                                </div>
                                {/* Duplicate Name Check */}
                                {isFetching && (
                                    <span className="text-sm text-gray-500">
                                        Checking name availability...
                                    </span>
                                )}

                                {data?.data?.exists && !isFetching && (
                                    <span className="text-sm text-red-500">
                                        This travel spot name already exists
                                    </span>
                                )}

                                {data && !data.data.exists && !isFetching && name.length >= 3 && (
                                    <span className="text-sm text-green-600">
                                        Name is available
                                    </span>
                                )}
                                <FormMessage className={styles.errorMessage} />
                            </FormItem>
                        )}
                    />

                    {/* Slug Field */}
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className={styles.formItem}>
                                <FormLabel className={styles.formLabel}>
                                    <FiHash className={styles.inputIcon} />
                                    URL Slug
                                    <span className={styles.required}>*</span>
                                </FormLabel>
                                <FormControl>
                                    <div className={styles.slugContainer}>
                                        <div className={styles.slugPrefix}>/category/</div>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                updateManually(e.target.value);
                                            }}
                                            placeholder="beaches"
                                            className={styles.slugInput}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </FormControl>

                                {/* Slug Validation */}
                                {field.value && (
                                    <div className={styles.validationContainer}>
                                        <div className={styles.validationItem}>
                                            {isSlugValid(field.value) ? (
                                                <div className={styles.validationValid}>
                                                    <FiCheck /> Valid URL slug format
                                                </div>
                                            ) : (
                                                <div className={styles.validationInvalid}>
                                                    Use lowercase letters, numbers, and hyphens only
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.helperText}>
                                    This will be used in the URL. Use lowercase letters, numbers, and hyphens.
                                </div>
                                <FormMessage className={styles.errorMessage} />
                            </FormItem>
                        )}
                    />

                    {/* Preview */}
                    {watch('slug') && (
                        <div className={styles.previewSection}>
                            <h4 className={styles.previewTitle}>URL Preview</h4>
                            <div className={styles.previewUrl}>
                                https://lifehub.com/category/
                                <span className={styles.previewSlug}>
                                    {watch('slug')}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className={styles.formActions}>
                        <ButtonLoading
                            type="submit"
                            text={mode === 'create' ? 'Create Category' : 'Update Category'}
                            isLoading={isSubmitting}
                            className={styles.submitButton}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default SpotCategoryForm;