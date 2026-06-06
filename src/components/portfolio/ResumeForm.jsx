'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiFileText, FiFolder, FiLayout } from 'react-icons/fi';
import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';
import { useGetSnapshotsQuery } from '@/services/api/portfolioApi';
import { resumeProjectSchema } from '@/lib/validations/portfolio/resumeProjectSchema';
import styles from '@/styles/portfolio/resume/ResumeForm.module.css';

const templateOptions = [
    { value: 'modern_ats', label: 'Modern ATS' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'creative', label: 'Creative' },
    { value: 'corporate', label: 'Corporate' },
];

const fontOptions = [
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Montserrat', label: 'Montserrat' },
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
];

export default function ResumeForm({ initialData, onSubmit, isSubmitting, mode = 'create' }) {
    const { data: snapshotsData } = useGetSnapshotsQuery({ page_size: 100 });
    const snapshots = snapshotsData?.data?.results || snapshotsData?.data || [];

    const methods = useForm({
        resolver: zodResolver(resumeProjectSchema),
        defaultValues: {
            title: initialData?.title || '',
            snapshot_id: initialData?.profile_snapshot_id || initialData?.profile_snapshot || '',
            template_key: initialData?.template_key || 'modern_ats',
            font_family: initialData?.font_family || 'Poppins',
            primary_color: initialData?.primary_color || '#2563EB',
            layout: initialData?.layout || 'single_column',
            is_public: String(initialData?.is_public ?? false),
        },
    });

    const { reset, handleSubmit, watch } = methods;
    const selectedColor = watch('primary_color');

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            reset({
                title: initialData.title || '',
                snapshot_id: initialData.profile_snapshot_id || initialData.profile_snapshot || '',
                template_key: initialData.template_key || 'modern_ats',
                font_family: initialData.font_family || 'Poppins',
                primary_color: initialData.primary_color || '#2563EB',
                layout: initialData.layout || 'single_column',
                is_public: String(initialData.is_public ?? false),
            });
        }
    }, [mode, initialData, reset]);

    // Pre-fill snapshot if passed via URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const snapshotParam = urlParams.get('snapshot');
        if (snapshotParam && !initialData) {
            methods.setValue('snapshot_id', snapshotParam);
        }
    }, []);

    const handleFormSubmit = (formData) => {
        const payload = {
            ...formData,
            is_public: formData.is_public === 'true',
        };
        // Remove profile_snapshot_id if it exists (use snapshot_id instead)
        delete payload.profile_snapshot_id;
        onSubmit(payload);
    };

    return (
        <div className={styles.formContainer}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    {/* Snapshot Selection */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiFolder /> Select Snapshot</h3>
                        <p className={styles.sectionDesc}>Choose the profile snapshot to use for this resume</p>
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
                        <FormInput name="title" label="Resume Title *" placeholder="e.g., Backend Engineer Resume" icon={<FiFileText />} required disabled={isSubmitting} />
                    </div>

                    {/* Presentation Settings */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiLayout /> Presentation Settings</h3>
                        <div className={styles.formRow}>
                            <FormSelect name="template_key" label="Template" options={templateOptions} disabled={isSubmitting} />
                            <FormSelect name="font_family" label="Font Family" options={fontOptions} disabled={isSubmitting} />
                        </div>
                        <div className={styles.formRow}>
                            <FormSelect name="layout" label="Layout" options={layoutOptions} disabled={isSubmitting} />
                            <div className={styles.colorField}>
                                <label className={styles.colorLabel}>Primary Color</label>
                                <div className={styles.colorSelect}>
                                    {colorOptions.map(c => (
                                        <button key={c.value} type="button"
                                            className={`${styles.colorBtn} ${selectedColor === c.value ? styles.selected : ''}`}
                                            style={{ backgroundColor: c.value }}
                                            onClick={() => methods.setValue('primary_color', c.value)}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <FormSelect name="is_public" label="Visibility"
                            options={[{ value: 'false', label: 'Private' }, { value: 'true', label: 'Public' }]}
                            disabled={isSubmitting}
                        />
                    </div>

                    <ButtonGroup align="end" className={styles.formActions}>
                        <Button type="button" variant="secondary" onClick={() => reset()} disabled={isSubmitting}>Reset</Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting} loadingText="Saving...">
                            {mode === 'create' ? 'Create Resume' : 'Update Resume'}
                        </Button>
                    </ButtonGroup>
                </form>
            </FormProvider>
        </div>
    );
}