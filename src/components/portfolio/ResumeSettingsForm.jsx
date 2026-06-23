'use client';

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiFileText, FiFolder, FiLayout } from 'react-icons/fi';

// Reusable Components
import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';

// API Hooks
import { useGetSnapshotsQuery, useGetPublicResumeTemplatesQuery } from '@/services/api/portfolioApi';

// Schema
import { resumeProjectSchema } from '@/lib/validations/portfolio/resumeProjectSchema';

// Styles
import styles from '@/styles/portfolio/resume/ResumeSettingsForm.module.css';

const fontOptions = [
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
];

const layoutOptions = [
    { value: 'single_column', label: 'Single Column' },
    { value: 'two_column', label: 'Two Column' },
    { value: 'sidebar', label: 'Sidebar' },
];

const colorOptions = [
    { value: '#2563EB', label: 'Blue' },
    { value: '#059669', label: 'Green' },
    { value: '#DC2626', label: 'Red' },
    { value: '#7C3AED', label: 'Purple' },
    { value: '#D97706', label: 'Amber' },
    { value: '#0891B2', label: 'Cyan' },
    { value: '#4F46E5', label: 'Indigo' },
    { value: '#DB2777', label: 'Pink' },
    { value: '#1F2937', label: 'Dark' },
    { value: '#000000', label: 'Black' },
];

const ResumeSettingsForm = ({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    mode = 'create',
    onCancel,
}) => {
    const { data: snapshotsData } = useGetSnapshotsQuery({ page_size: 100 });
    const snapshots = snapshotsData?.data?.results || snapshotsData?.data || [];

    const { data: templatesData } = useGetPublicResumeTemplatesQuery();
    const templates = templatesData?.data || [];

    const isEdit = mode === 'edit';

    // Initialize form
    const methods = useForm({
        resolver: zodResolver(resumeProjectSchema),
        defaultValues: {
            title: initialData?.title || '',
            snapshot_id: initialData?.profile_snapshot_id || initialData?.profile_snapshot || '',
            template_id: initialData?.resume_template_id || initialData?.template_id || '',
            font_family: initialData?.font_family || 'Poppins',
            primary_color: initialData?.primary_color || '#2563EB',
            layout: initialData?.layout || 'single_column',
            is_public: String(initialData?.is_public ?? false),
        },
    });

    const {
        watch,
        reset,
        setValue,
    } = methods;

    const selectedColor = watch('primary_color');
    const selectedTemplate = watch('template_id');

    /* Edit mode prefill */
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            reset({
                title: initialData.title || '',
                snapshot_id: initialData.profile_snapshot_id || initialData.profile_snapshot || '',
                template_id: initialData.resume_template_id || initialData.template_id || '',
                font_family: initialData.font_family || 'Poppins',
                primary_color: initialData.primary_color || '#2563EB',
                layout: initialData.layout || 'single_column',
                is_public: String(initialData.is_public ?? false),
            });
        }
    }, [mode, initialData, reset]);

    useEffect(() => {
        if (onBackendError) {
            onBackendError(methods);
        }
    }, [methods, onBackendError]);

    // Pre-fill snapshot from URL query param
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const snapshotParam = urlParams.get('snapshot');
        if (snapshotParam && !initialData) {
            setValue('snapshot_id', snapshotParam);
        }
    }, []);

    const getTemplateOptions = () => {
        if (templates.length > 0) {
            return templates.map(t => ({
                value: t.template_id,
                label: `${t.name}${t.is_ats_friendly ? ' (ATS Friendly)' : ''}${t.is_premium ? ' ⭐ Premium' : ''}`,
            }));
        }
        return [
            { value: 'rtm_default_1', label: 'Modern ATS' },
            { value: 'rtm_default_2', label: 'Minimal' },
        ];
    };

    const selectedTemplateData = templates.find(t => t.template_id === selectedTemplate);

    return (
        <div className={styles.formContainer}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    {/* Snapshot Selection (only for create + existing mode) */}
                    {!isEdit && mode === 'existing' && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}><FiFolder /> Select Snapshot</h3>
                            <p className={styles.sectionDesc}>Choose the profile snapshot with your data</p>
                            <FormSelect
                                name="snapshot_id"
                                label="Profile Snapshot *"
                                options={snapshots.map(s => ({
                                    value: s.profile_snapshot_id,
                                    label: `${s.title}${s.target_role ? ` (${s.target_role})` : ''}`,
                                }))}
                                placeholder="Select a snapshot..."
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    )}

                    {/* Resume Details */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiFileText /> Resume Details</h3>
                        <FormInput
                            name="title"
                            label="Resume Title *"
                            placeholder="e.g., Backend Engineer Resume"
                            icon={<FiFileText />}
                            required
                            autoFocus={mode === 'create'}
                            disabled={isSubmitting}
                            description="Give your resume a descriptive name"
                        />
                    </div>

                    {/* Template & Presentation */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiLayout /> Template & Presentation</h3>

                        <div className={styles.formGroup}>
                            <FormSelect
                                name="template_id"
                                label="Resume Template *"
                                options={getTemplateOptions()}
                                placeholder="Select a template..."
                                required
                                disabled={isSubmitting}
                                description="Choose the design template for your resume"
                            />
                            {selectedTemplateData?.preview_image_url && (
                                <div className={styles.templatePreview}>
                                    <img
                                        src={selectedTemplateData.preview_image_url}
                                        alt={selectedTemplateData.name}
                                        className={styles.previewImg}
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.formRow}>
                            <FormSelect
                                name="font_family"
                                label="Font Family"
                                options={fontOptions}
                                disabled={isSubmitting}
                                description="Choose the font for your resume text"
                            />
                            <FormSelect
                                name="layout"
                                label="Layout"
                                options={layoutOptions}
                                disabled={isSubmitting}
                                description="Select the column layout"
                            />
                        </div>

                        <div className={styles.colorField}>
                            <label className={styles.colorLabel}>Primary Color</label>
                            <div className={styles.colorSelect}>
                                {colorOptions.map(c => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        className={`${styles.colorBtn} ${selectedColor === c.value ? styles.selected : ''}`}
                                        style={{ backgroundColor: c.value }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            methods.setValue('primary_color', c.value);
                                        }}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                            <input type="hidden" {...methods.register('primary_color')} />
                            <p className={styles.fieldDescription}>Select the accent color for headings and links</p>
                        </div>

                        {/* Visibility - Now with proper spacing from color section */}
                        <div className={styles.visibilityField}>
                            <FormSelect
                                name="is_public"
                                label="Visibility"
                                options={[
                                    { value: 'false', label: '🔒 Private - Only you can access' },
                                    { value: 'true', label: '🌐 Public - Anyone with link can view' },
                                ]}
                                disabled={isSubmitting}
                                description="Control who can view this resume"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <ButtonGroup align="end" className={styles.formActions}>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                if (onCancel) {
                                    onCancel();
                                } else {
                                    reset();
                                }
                            }}
                            disabled={isSubmitting}
                        >
                            {onCancel ? 'Cancel' : 'Reset'}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting}
                            loadingText={isEdit ? 'Saving...' : 'Creating...'}
                        >
                            {isEdit ? 'Save Changes' : 'Create Resume'}
                        </Button>
                    </ButtonGroup>
                </form>
            </FormProvider>
        </div>
    );
};

export default ResumeSettingsForm;