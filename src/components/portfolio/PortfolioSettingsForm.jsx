'use client';

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiGlobe, FiFolder, FiLayout, FiSearch, FiLink, FiHome } from 'react-icons/fi';

// Reusable Components
import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import FormTextarea from '@/components/common/forms/FormTextarea';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';

// API Hooks
import { useGetSnapshotsQuery, useGetPublicPortfolioThemesQuery } from '@/services/api/portfolioApi';

// Schema
import { portfolioProjectSchema } from '@/lib/validations/portfolio/portfolioProjectSchema';

// Styles
import styles from '@/styles/portfolio/portfolio/PortfolioSettingsForm.module.css';

const PortfolioSettingsForm = ({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    mode = 'create',
    onCancel,
}) => {
    const { data: snapshotsData } = useGetSnapshotsQuery({ page_size: 100 });
    const snapshots = snapshotsData?.data?.results || snapshotsData?.data || [];

    const { data: themesData } = useGetPublicPortfolioThemesQuery();
    const themes = themesData?.data || [];

    const isEdit = mode === 'edit';

    // Initialize form
    const methods = useForm({
        resolver: zodResolver(portfolioProjectSchema),
        defaultValues: {
            title: initialData?.title || '',
            snapshot_id: initialData?.profile_snapshot_id || initialData?.profile_snapshot || '',
            theme_id: initialData?.portfolio_theme_id || initialData?.theme_id || '',
            custom_domain: initialData?.custom_domain || '',
            seo_title: initialData?.seo_title || '',
            seo_description: initialData?.seo_description || '',
            hero_title: initialData?.hero_title || '',
            hero_subtitle: initialData?.hero_subtitle || '',
            is_public: String(initialData?.is_public ?? false),
        },
    });

    const {
        watch,
        reset,
        setValue,
    } = methods;

    const selectedTheme = watch('theme_id');

    /* Edit mode prefill */
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            reset({
                title: initialData.title || '',
                snapshot_id: initialData.profile_snapshot_id || initialData.profile_snapshot || '',
                theme_id: initialData.portfolio_theme_id || initialData.theme_id || '',
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

    const getThemeOptions = () => {
        if (themes.length > 0) {
            return themes.map(t => ({
                value: t.theme_id,
                label: `${t.name}${t.is_premium ? ' ⭐ Premium' : ''}`,
            }));
        }
        // return [
        //     { value: 'thm_default_1', label: 'Default Theme' },
        //     { value: 'thm_default_2', label: 'Minimal Theme' },
        // ];
    };

    const selectedThemeData = themes.find(t => t.theme_id === selectedTheme);

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

                    {/* Portfolio Details */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiGlobe /> Portfolio Details</h3>
                        <FormInput
                            name="title"
                            label="Portfolio Title *"
                            placeholder="e.g., My Developer Portfolio"
                            icon={<FiGlobe />}
                            required
                            autoFocus={mode === 'create'}
                            disabled={isSubmitting}
                            description="Give your portfolio a descriptive name"
                        />
                    </div>

                    {/* Theme & Presentation */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiLayout /> Theme & Presentation</h3>

                        <div className={styles.formGroup}>
                            <FormSelect
                                name="theme_id"
                                label="Portfolio Theme *"
                                options={getThemeOptions()}
                                placeholder="Select a theme..."
                                required
                                disabled={isSubmitting}
                                description="Choose the design theme for your portfolio"
                            />
                            {selectedThemeData?.preview_image_url && (
                                <div className={styles.themePreview}>
                                    <img
                                        src={selectedThemeData.preview_image_url}
                                        alt={selectedThemeData.name}
                                        className={styles.previewImg}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiHome /> Hero Section</h3>
                        <p className={styles.sectionDesc}>Customize the hero section of your portfolio</p>
                        <FormInput
                            name="hero_title"
                            label="Hero Title"
                            placeholder="e.g., Hi, I'm John Doe"
                            icon={<FiHome />}
                            disabled={isSubmitting}
                            description="The main headline of your portfolio"
                        />
                        <FormTextarea
                            name="hero_subtitle"
                            label="Hero Subtitle"
                            placeholder="A passionate developer..."
                            rows={2}
                            disabled={isSubmitting}
                            description="A brief description that appears below the title"
                        />
                    </div>

                    {/* SEO Settings */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiSearch /> SEO Settings</h3>
                        <p className={styles.sectionDesc}>Optimize your portfolio for search engines</p>
                        <FormInput
                            name="seo_title"
                            label="SEO Title"
                            placeholder="e.g., John Doe - Developer Portfolio"
                            icon={<FiSearch />}
                            disabled={isSubmitting}
                            description="Title that appears in search engine results"
                        />
                        <FormTextarea
                            name="seo_description"
                            label="SEO Description"
                            placeholder="Meta description for search engines..."
                            rows={2}
                            disabled={isSubmitting}
                            description="Brief description that appears in search results"
                        />
                    </div>

                    {/* Advanced Settings */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}><FiLink /> Advanced Settings</h3>
                        <FormInput
                            name="custom_domain"
                            label="Custom Domain"
                            placeholder="e.g., johndoe.dev"
                            icon={<FiLink />}
                            disabled={isSubmitting}
                            description="Custom domain for your portfolio (optional)"
                        />
                        <div className={styles.visibilityField}>
                            <FormSelect
                                name="is_public"
                                label="Visibility"
                                options={[
                                    { value: 'false', label: '🔒 Private - Only you can access' },
                                    { value: 'true', label: '🌐 Public - Anyone with link can view' },
                                ]}
                                disabled={isSubmitting}
                                description="Control who can view this portfolio"
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
                            {isEdit ? 'Save Changes' : 'Create Portfolio'}
                        </Button>
                    </ButtonGroup>
                </form>
            </FormProvider>
        </div>
    );
};

export default PortfolioSettingsForm;