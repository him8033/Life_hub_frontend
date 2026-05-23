'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiFileText, FiCheck, FiStar, FiImage, FiTrash2 } from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import SquareImageUpload from '@/components/common/SquareImageUpload';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';
import { resumeTemplateSchema } from '@/lib/validations/resumeTemplateSchema';
import styles from '@/styles/portfolio/admin/MasterSkillForm.module.css';

const ResumeTemplateForm = ({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    mode = 'create'
}) => {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [removeImage, setRemoveImage] = useState(false);

    const methods = useForm({
        resolver: zodResolver(resumeTemplateSchema),
        defaultValues: {
            name: initialData?.name || '',
            is_ats_friendly: String(initialData?.is_ats_friendly ?? false),
            is_premium: String(initialData?.is_premium ?? false),
            is_active: String(initialData?.is_active ?? true),
        },
    });

    const { reset, handleSubmit } = methods;

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            reset({
                name: initialData.name || '',
                is_ats_friendly: String(initialData.is_ats_friendly ?? false),
                is_premium: String(initialData.is_premium ?? false),
                is_active: String(initialData.is_active ?? true),
            });
            if (initialData.preview_image_url) {
                setImagePreview(initialData.preview_image_url);
            }
            setRemoveImage(false);
        }
    }, [mode, initialData, reset]);

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
        formData.append('is_ats_friendly', data.is_ats_friendly === 'true');
        formData.append('is_premium', data.is_premium === 'true');
        formData.append('is_active', data.is_active === 'true');

        if (removeImage) {
            formData.append('remove_image', 'true');
        } else if (imageFile) {
            formData.append('preview_image', imageFile, imageFile.name);
        }

        onSubmit(formData);
    };

    return (
        <div className={styles.formContainer}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormInput
                        name="name"
                        label="Template Name"
                        placeholder="e.g., Modern ATS, Creative, Minimal"
                        icon={<FiFileText />}
                        required
                        autoFocus={mode === 'create'}
                        disabled={isSubmitting}
                        description="Enter a descriptive name for the template"
                        className={styles.formItem}
                    />

                    <FormSelect
                        name="is_ats_friendly"
                        label="ATS Friendly"
                        options={[
                            { value: 'true', label: 'Yes - ATS Optimized' },
                            { value: 'false', label: 'No' },
                        ]}
                        disabled={isSubmitting}
                        description="ATS-friendly templates pass through applicant tracking systems"
                        className={styles.formItem}
                    />

                    <FormSelect
                        name="is_premium"
                        label="Premium Template"
                        options={[
                            { value: 'true', label: 'Yes - Premium' },
                            { value: 'false', label: 'No - Free' },
                        ]}
                        disabled={isSubmitting}
                        description="Premium templates are available to paid users only"
                        className={styles.formItem}
                    />

                    <FormSelect
                        name="is_active"
                        label="Status"
                        options={[
                            { value: 'true', label: 'Active' },
                            { value: 'false', label: 'Inactive' },
                        ]}
                        disabled={isSubmitting}
                        description="Inactive templates won't appear in selection lists"
                        className={styles.formItem}
                    />

                    {/* Preview Image Upload */}
                    <div className={styles.formItem}>
                        <label className={styles.imageLabel}>
                            <FiImage /> Template Preview Image
                        </label>

                        {mode === 'edit' && initialData?.preview_image_url && !imageFile && !removeImage && (
                            <div className={styles.existingImageContainer}>
                                <img
                                    src={initialData.preview_image_url}
                                    alt="Current preview"
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

                        {(!initialData?.preview_image_url || imageFile || removeImage) && (
                            <SquareImageUpload
                                onImageSelect={handleImageSelect}
                                onRemove={handleImageRemove}
                                previewUrl={imagePreview}
                                disabled={isSubmitting}
                                maxSizeMB={5}
                                label={removeImage ? 'Upload New Preview' : 'Upload Preview Image'}
                                size="medium"
                                enableCrop={true}
                                aspectRatio={3 / 4}
                                showCropControls={true}
                            />
                        )}
                    </div>

                    <ButtonGroup align="end" className={styles.formActions}>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                reset();
                                handleImageRemove();
                                setRemoveImage(false);
                                if (initialData?.preview_image_url) {
                                    setImagePreview(initialData.preview_image_url);
                                }
                            }}
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
                            {mode === 'create' ? 'Create Template' : 'Update Template'}
                        </Button>
                    </ButtonGroup>
                </form>
            </FormProvider>
        </div>
    );
};

export default ResumeTemplateForm;