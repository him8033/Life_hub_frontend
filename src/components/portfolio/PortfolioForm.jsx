'use client';

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiGlobe, FiFolder, FiLayout, FiSearch, FiLink, FiHome, FiFileText } from 'react-icons/fi';
import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import FormTextarea from '@/components/common/forms/FormTextarea';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';
import { useGetSnapshotsQuery, useGetPublicPortfolioThemesQuery } from '@/services/api/portfolioApi';
import { portfolioProjectSchema } from '@/lib/validations/portfolio/portfolioProjectSchema';
import styles from '@/styles/portfolio/resume/ResumeForm.module.css';

export default function PortfolioForm({ initialData, onSubmit, isSubmitting, mode = 'create' }) {
    const { data: snapshotsData } = useGetSnapshotsQuery({ page_size: 100 });
    const { data: themesData } = useGetPublicPortfolioThemesQuery();

    const snapshots = snapshotsData?.data?.results || snapshotsData?.data || [];
    const themes = themesData?.data || [];

    const methods = useForm({
        resolver: zodResolver(portfolioProjectSchema),
        defaultValues: {
            title: initialData?.title || '',
            snapshot_id: initialData?.profile_snapshot_id || '',
            theme_id: initialData?.portfolio_theme_id || '',
            custom_domain: initialData?.custom_domain || '',
            seo_title: initialData?.seo_title || '',
            seo_description: initialData?.seo_description || '',
            hero_title: initialData?.hero_title || '',
            hero_subtitle: initialData?.hero_subtitle || '',
            is_public: String(initialData?.is_public ?? false),
        },
    });

    const { reset, handleSubmit } = methods;

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            reset({
                title: initialData.title || '',
                snapshot_id: initialData.profile_snapshot_id || '',
                theme_id: initialData.portfolio_theme_id || '',
                custom_domain: initialData.custom_domain || '',
                seo_title: initialData.seo_title || '',
                seo_description: initialData.seo_description || '',
                hero_title: initialData.hero_title || '',
                hero_subtitle: initialData.hero_subtitle || '',
                is_public: String(initialData.is_public ?? false),
            });
        }
    }, [mode, initialData, reset]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const snapshotParam = urlParams.get('snapshot');
        if (snapshotParam && !initialData) {
            methods.setValue('snapshot_id', snapshotParam);
        }
    }, []);

    const handleFormSubmit = (formData) => {
        const payload = { ...formData, is_public: formData.is_public === 'true' };
        onSubmit(payload);
    };

    return (
        <div className={styles.formContainer}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    {/* Snapshot Selection */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiFolder /> Select Snapshot</h3>
                        <p className={styles.sectionDesc}>Choose the profile snapshot to use for this portfolio</p>
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

                    {/* Portfolio Details */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiGlobe /> Portfolio Details</h3>
                        <FormInput
                            name="title"
                            label="Portfolio Title *"
                            placeholder="e.g., Rahul Dev Portfolio"
                            icon={<FiGlobe />}
                            required
                            disabled={isSubmitting}
                        />
                        <FormSelect
                            name="theme_id"
                            label="Theme *"
                            options={themes.map(t => ({
                                value: t.theme_id,
                                label: `${t.name}${t.is_premium ? ' ⭐' : ''}`
                            }))}
                            placeholder="Select a theme..."
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Hero Section */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiHome /> Hero Section</h3>
                        <p className={styles.sectionDesc}>Customize the hero section of your portfolio</p>
                        <FormInput
                            name="hero_title"
                            label="Hero Title"
                            placeholder="e.g., Hi, I'm Rahul Sharma"
                            icon={<FiHome />}
                            disabled={isSubmitting}
                        />
                        <FormTextarea
                            name="hero_subtitle"
                            label="Hero Subtitle"
                            placeholder="A passionate backend developer..."
                            rows={2}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* SEO Settings */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiSearch /> SEO Settings</h3>
                        <p className={styles.sectionDesc}>Optimize your portfolio for search engines</p>
                        <FormInput
                            name="seo_title"
                            label="SEO Title"
                            placeholder="e.g., Rahul Sharma - Backend Developer Portfolio"
                            icon={<FiSearch />}
                            disabled={isSubmitting}
                        />
                        <FormTextarea
                            name="seo_description"
                            label="SEO Description"
                            placeholder="Meta description for search engines..."
                            rows={2}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Advanced */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiLink /> Advanced</h3>
                        <FormInput
                            name="custom_domain"
                            label="Custom Domain"
                            placeholder="e.g., rahulsharma.dev"
                            icon={<FiLink />}
                            disabled={isSubmitting}
                        />
                        <FormSelect
                            name="is_public"
                            label="Visibility"
                            options={[
                                { value: 'false', label: 'Private' },
                                { value: 'true', label: 'Public' }
                            ]}
                            disabled={isSubmitting}
                        />
                    </div>

                    <ButtonGroup align="end" className={styles.formActions}>
                        <Button type="button" variant="secondary" onClick={() => reset()} disabled={isSubmitting}>
                            Reset
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting} loadingText="Saving...">
                            {mode === 'create' ? 'Create Portfolio' : 'Update Portfolio'}
                        </Button>
                    </ButtonGroup>
                </form>
            </FormProvider>
        </div>
    );
}