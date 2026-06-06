'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiTag, FiHash, FiStar, FiImage, FiTrash2 } from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import FormTextarea from '@/components/common/forms/FormTextarea';
import SquareImageUpload from '@/components/common/SquareImageUpload';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';
import useSlugGenerator from '@/hooks/useSlugGenerator';
import { masterSkillSchema } from '@/lib/validations/portfolio/admin/masterSkillSchema';
import { useGetPublicSkillCategoriesQuery } from '@/services/api/portfolioApi';
import styles from '@/styles/portfolio/admin/MasterSkillForm.module.css';

const MasterSkillForm = ({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    mode = 'create'
}) => {
    const { data: categoriesData } = useGetPublicSkillCategoriesQuery();
    const categories = categoriesData?.data || [];

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [removeImage, setRemoveImage] = useState(false);

    // Auto-generate slug hook
    const { slug, generateFrom, updateManually, reset: resetSlug } = useSlugGenerator(initialData.slug);

    const categoryOptions = categories.map(cat => ({
        value: cat.skillcategory_id,
        label: cat.name,
    }));

    const methods = useForm({
        resolver: zodResolver(masterSkillSchema),
        defaultValues: {
            name: initialData?.name || '',
            slug: initialData?.slug || '',
            category_id: initialData?.category_value || '',
            icon: initialData?.icon || '',
            description: initialData?.description || '',
            priority: initialData?.priority || 0,
        },
    });

    const { setValue, reset, handleSubmit } = methods;

    /* Sync slug hook → form */
    useEffect(() => {
        setValue('slug', slug);
    }, [slug, setValue]);

    /* Edit mode prefill */
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            resetSlug(initialData.slug);
            reset({
                name: initialData.name || '',
                slug: initialData.slug || '',
                category_id: initialData.category_value || '',
                icon: initialData.icon || '',
                description: initialData.description || '',
                priority: initialData.priority || 0,
            });
            // ...
        }
    }, [mode, initialData, reset, resetSlug]);

    useEffect(() => {
        if (onBackendError) {
            onBackendError(methods);
        }
    }, [methods, onBackendError]);

    const handleImageSelect = (file, previewUrl) => {
        setImageFile(file);
        setImagePreview(previewUrl);
        setRemoveImage(false);
    };

    const handleImageRemove = () => {
        setImageFile(null);
        setImagePreview('');
        setRemoveImage(false);
    };

    const handleRemoveExistingImage = () => {
        setImageFile(null);
        setImagePreview('');
        setRemoveImage(true);
    };

    const handleFormSubmit = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('slug', data.slug);
        formData.append('category_id', data.category_id);

        if (data.icon) {
            formData.append('icon', data.icon);
        }

        if (data.description) {
            formData.append('description', data.description);
        }

        if (data.priority !== undefined) {
            formData.append('priority', data.priority);
        }

        // Handle image
        if (removeImage) {
            formData.append('remove_image', 'true');
        } else if (imageFile) {
            formData.append('image', imageFile, imageFile.name);
        }

        onSubmit(formData);
    };

    const handleReset = () => {
        reset();
        handleImageRemove();
        setRemoveImage(false);
        if (mode === 'edit' && initialData?.image_url) {
            setImagePreview(initialData.image_url);
        }
        resetSlug(initialData?.slug || '');
    };

    return (
        <div className={styles.formContainer}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormSelect
                        name="category_id"
                        label="Category *"
                        options={categoryOptions}
                        placeholder="Select skill category"
                        required
                        disabled={isSubmitting}
                        description="Select the category this skill belongs to"
                        className={styles.formItem}
                    />

                    <FormInput
                        name="name"
                        label="Skill Name"
                        placeholder="e.g., Python, React, Docker"
                        icon={<FiTag />}
                        required
                        autoFocus={mode === 'create'}
                        disabled={isSubmitting}
                        description="Enter the skill name"
                        className={styles.formItem}
                        onChange={(e) => {
                            generateFrom(e.target.value);
                        }}
                    />

                    <FormInput
                        name="slug"
                        label="Slug"
                        placeholder="e.g., python, react, docker"
                        icon={<FiHash />}
                        required
                        disabled={isSubmitting}
                        description="Auto-generated from name. You can also edit manually."
                        className={styles.formItem}
                        onChange={(e) => {
                            updateManually(e.target.value);
                        }}
                    />

                    <FormInput
                        name="icon"
                        label="Icon"
                        placeholder="e.g., 🐍, ⚛️, 🐳 (emoji or icon name)"
                        icon={<FiStar />}
                        disabled={isSubmitting}
                        description="Optional: Emoji or icon identifier"
                        className={styles.formItem}
                    />

                    <FormTextarea
                        name="description"
                        label="Description"
                        placeholder="Brief description of this skill..."
                        rows={3}
                        disabled={isSubmitting}
                        description="Optional: Describe what this skill covers"
                        className={styles.formItem}
                    />

                    <FormInput
                        name="priority"
                        label="Display Priority"
                        type="number"
                        placeholder="0"
                        disabled={isSubmitting}
                        description="Lower numbers appear first. Default is 0"
                        className={styles.formItem}
                    />

                    {/* Image Upload Section */}
                    <div className={styles.formItem}>
                        <label className={styles.imageLabel}>
                            <FiImage /> Skill Image (Optional)
                        </label>

                        {/* Show existing image with remove option */}
                        {mode === 'edit' && initialData?.image_url && !imageFile && !removeImage && (
                            <div className={styles.existingImageContainer}>
                                <img
                                    src={initialData.image_url}
                                    alt="Current skill image"
                                    className={styles.existingImage}
                                />
                                <button
                                    type="button"
                                    className={styles.removeImageButton}
                                    onClick={handleRemoveExistingImage}
                                    disabled={isSubmitting}
                                >
                                    <FiTrash2 /> Remove Image
                                </button>
                            </div>
                        )}

                        {/* Show uploader when no existing image, or after removing, or new file selected */}
                        {(!initialData?.image_url || imageFile || removeImage) && (
                            <SquareImageUpload
                                onImageSelect={handleImageSelect}
                                onRemove={handleImageRemove}
                                previewUrl={imagePreview}
                                disabled={isSubmitting}
                                maxSizeMB={5}
                                label={removeImage ? 'Upload New Image' : 'Upload Skill Image'}
                                size="medium"
                                enableCrop={true}
                                aspectRatio={1}
                                showCropControls={true}
                            />
                        )}
                    </div>

                    <ButtonGroup align="end" className={styles.formActions}>
                        <Button
                            variant="secondary"
                            onClick={handleReset}
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
                            {mode === 'create' ? 'Create Skill' : 'Update Skill'}
                        </Button>
                    </ButtonGroup>
                </form>
            </FormProvider>
        </div>
    );
};

export default MasterSkillForm;