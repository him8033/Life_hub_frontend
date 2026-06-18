'use client';

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiFileText, FiFolder, FiLayout } from 'react-icons/fi';
import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';
import { useGetSnapshotsQuery, useGetPublicResumeTemplatesQuery } from '@/services/api/portfolioApi';
import { resumeProjectSchema } from '@/lib/validations/portfolio/resumeProjectSchema';
import styles from '@/styles/portfolio/resume/ResumeForm.module.css';

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

export default function ResumeForm({ initialData, onSubmit, isSubmitting, mode = 'create' }) {
    // Fetch snapshots
    const { data: snapshotsData } = useGetSnapshotsQuery({ page_size: 100 });
    const snapshots = snapshotsData?.data?.results || snapshotsData?.data || [];

    // Fetch resume templates
    const { data: templatesData } = useGetPublicResumeTemplatesQuery();
    const templates = templatesData?.data || [];

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

    const { reset, handleSubmit, watch } = methods;
    const selectedColor = watch('primary_color');
    const selectedTemplate = watch('template_id');

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

    // Pre-fill snapshot if passed via URL query param
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const snapshotParam = urlParams.get('snapshot');
        if (snapshotParam && !initialData) {
            methods.setValue('snapshot_id', snapshotParam);
        }
    }, []);

    const handleFormSubmit = (formData) => {
        const payload = {
            title: formData.title,
            snapshot_id: formData.snapshot_id,
            template_id: formData.template_id,
            font_family: formData.font_family,
            primary_color: formData.primary_color,
            layout: formData.layout,
            is_public: formData.is_public === 'true',
        };
        onSubmit(payload);
    };

    // Get selected template preview
    const selectedTemplateData = templates.find(t => t.template_id === selectedTemplate);

    return (
        <div className={styles.formContainer}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    {/* Snapshot Selection */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiFolder /> Select Snapshot</h3>
                        <p className={styles.sectionDesc}>Choose the profile snapshot with your data</p>
                        <FormSelect
                            name="snapshot_id"
                            label="Profile Snapshot *"
                            options={snapshots.map(s => ({
                                value: s.profile_snapshot_id,
                                label: `${s.title}${s.target_role ? ` (${s.target_role})` : ''}`
                            }))}
                            placeholder="Select a snapshot..."
                            required
                            disabled={isSubmitting || mode === 'edit'}
                        />
                    </div>

                    {/* Resume Details */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiFileText /> Resume Details</h3>
                        <FormInput
                            name="title"
                            label="Resume Title *"
                            placeholder="e.g., Backend Engineer Resume"
                            icon={<FiFileText />}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Template & Presentation */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiLayout /> Template & Presentation</h3>

                        {/* Template Selection */}
                        <div className={styles.formGroup}>
                            <FormSelect
                                name="template_id"
                                label="Resume Template *"
                                options={templates.map(t => ({
                                    value: t.template_id,
                                    label: `${t.name}${t.is_ats_friendly ? ' (ATS Friendly)' : ''}${t.is_premium ? ' ⭐ Premium' : ''}`
                                }))}
                                placeholder="Select a template..."
                                required
                                disabled={isSubmitting}
                            />
                            {selectedTemplateData?.preview_image_url && (
                                <div className={styles.templatePreview}>
                                    <img src={selectedTemplateData.preview_image_url} alt={selectedTemplateData.name} className={styles.previewImg} />
                                </div>
                            )}
                        </div>

                        <div className={styles.formRow}>
                            <FormSelect name="font_family" label="Font Family" options={fontOptions} disabled={isSubmitting} />
                            <FormSelect name="layout" label="Layout" options={layoutOptions} disabled={isSubmitting} />
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
                                        onClick={() => methods.setValue('primary_color', c.value)}
                                        title={c.label}
                                    />
                                ))}
                            </div>
                            <input type="hidden" {...methods.register('primary_color')} />
                        </div>

                        <FormSelect
                            name="is_public"
                            label="Visibility"
                            options={[{ value: 'false', label: '🔒 Private - Only you can access' }, { value: 'true', label: '🌐 Public - Anyone with link can view' }]}
                            disabled={isSubmitting}
                        />
                    </div>

                    <ButtonGroup align="end" className={styles.formActions}>
                        <Button type="button" variant="secondary" onClick={() => reset()} disabled={isSubmitting}>
                            Reset
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting} loadingText="Saving...">
                            {mode === 'create' ? 'Create Resume' : 'Update Resume'}
                        </Button>
                    </ButtonGroup>
                </form>
            </FormProvider>
        </div>
    );
}