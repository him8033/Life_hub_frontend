'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import Button from '@/components/common/buttons/Button';
import { FiArrowLeft, FiSave, FiEye, FiEyeOff, FiLock, FiUnlock, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import {
    useGetResumeTemplateQuery,
    useGetTemplateSectionsQuery,
    useUpdateTemplateSectionMutation,
} from '@/services/api/portfolioApi';
import styles from '@/styles/portfolio/admin/TemplateSections.module.css';

export default function TemplateSectionsPage() {
    const router = useRouter();
    const params = useParams();
    const { showSnackbar } = useSnackbar();
    const templateId = params.templateId;

    const { data: templateData, isLoading: templateLoading, error: templateError } = useGetResumeTemplateQuery(templateId, { skip: !templateId });
    const { data: sectionsData, isLoading: sectionsLoading, refetch } = useGetTemplateSectionsQuery(templateId, { skip: !templateId });
    const [updateSection, { isLoading: isUpdating }] = useUpdateTemplateSectionMutation();

    const template = templateData?.data;
    const sections = sectionsData?.data || [];

    const handleToggleVisibility = async (sectionId, currentVisibility) => {
        try {
            await updateSection({
                templateId,
                sectionId,
                data: { is_visible: !currentVisibility },
            }).unwrap();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to update'), 'error', 3000);
        }
    };

    const handleToggleRequired = async (sectionId, currentRequired) => {
        try {
            await updateSection({
                templateId,
                sectionId,
                data: { is_required: !currentRequired },
            }).unwrap();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to update'), 'error', 3000);
        }
    };

    const handleMoveUp = async (sectionId, currentPosition) => {
        const sortedSections = [...sections].sort((a, b) => a.position - b.position);
        const index = sortedSections.findIndex(s => s.resumetemplatesection_id === sectionId);
        if (index <= 0) return;

        const prevSection = sortedSections[index - 1];
        try {
            // Swap positions
            await updateSection({
                templateId,
                sectionId,
                data: { position: prevSection.position },
            }).unwrap();
            await updateSection({
                templateId,
                sectionId: prevSection.resumetemplatesection_id,
                data: { position: currentPosition },
            }).unwrap();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 3000);
        }
    };

    const handleMoveDown = async (sectionId, currentPosition) => {
        const sortedSections = [...sections].sort((a, b) => a.position - b.position);
        const index = sortedSections.findIndex(s => s.resumetemplatesection_id === sectionId);
        if (index < 0 || index >= sortedSections.length - 1) return;

        const nextSection = sortedSections[index + 1];
        try {
            await updateSection({
                templateId,
                sectionId,
                data: { position: nextSection.position },
            }).unwrap();
            await updateSection({
                templateId,
                sectionId: nextSection.resumetemplatesection_id,
                data: { position: currentPosition },
            }).unwrap();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 3000);
        }
    };

    if (templateLoading || sectionsLoading) return <Loader text="Loading sections..." />;

    if (templateError?.status === 404) {
        return <NotFoundState title="Template Not Found" backLabel="Back" backTo={ROUTES.DASHBOARD.PORTFOLIO.RESUMETEMPLATE.LIST} fullPage />;
    }

    if (templateError) {
        return <ErrorState message="Failed to load template" onRetry={refetch} retryMsg="Retry" />;
    }

    const sortedSections = [...sections].sort((a, b) => a.position - b.position);

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <div className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <FiArrowLeft size={16} /> Back
                </button>
                <div>
                    <h1 className={styles.title}>Section Settings</h1>
                    <p className={styles.subtitle}>
                        Template: {template?.name} — Configure visibility and order of sections
                    </p>
                </div>
            </div>

            {/* Sections List */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <span className={styles.colSection}>Section</span>
                    <span className={styles.colVisible}>Visible</span>
                    <span className={styles.colRequired}>Required</span>
                    <span className={styles.colPosition}>Position</span>
                </div>

                {sortedSections.length > 0 ? (
                    <div className={styles.list}>
                        {sortedSections.map((section, index) => (
                            <div key={section.resumetemplatesection_id} className={styles.item}>
                                <div className={styles.colSection}>
                                    <span className={styles.sectionName}>
                                        {section.section?.name || 'Unknown Section'}
                                    </span>
                                    <span className={styles.sectionKey}>
                                        {section.section?.key || '—'}
                                    </span>
                                </div>

                                <div className={styles.colVisible}>
                                    <button
                                        className={`${styles.toggleBtn} ${section.is_visible ? styles.active : styles.inactive}`}
                                        onClick={() => handleToggleVisibility(section.resumetemplatesection_id, section.is_visible)}
                                        disabled={isUpdating}
                                        title={section.is_visible ? 'Visible - Click to hide' : 'Hidden - Click to show'}
                                    >
                                        {section.is_visible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                                        <span>{section.is_visible ? 'Visible' : 'Hidden'}</span>
                                    </button>
                                </div>

                                <div className={styles.colRequired}>
                                    <button
                                        className={`${styles.toggleBtn} ${section.is_required ? styles.required : styles.optional}`}
                                        onClick={() => handleToggleRequired(section.resumetemplatesection_id, section.is_required)}
                                        disabled={isUpdating}
                                        title={section.is_required ? 'Required - Click to make optional' : 'Optional - Click to make required'}
                                    >
                                        {section.is_required ? <FiLock size={14} /> : <FiUnlock size={14} />}
                                        <span>{section.is_required ? 'Required' : 'Optional'}</span>
                                    </button>
                                </div>

                                <div className={styles.colPosition}>
                                    <button
                                        className={styles.moveBtn}
                                        onClick={() => handleMoveUp(section.resumetemplatesection_id, section.position)}
                                        disabled={index === 0 || isUpdating}
                                        title="Move up"
                                    >
                                        <FiArrowUp size={12} />
                                    </button>
                                    <span className={styles.positionNumber}>{index + 1}</span>
                                    <button
                                        className={styles.moveBtn}
                                        onClick={() => handleMoveDown(section.resumetemplatesection_id, section.position)}
                                        disabled={index === sortedSections.length - 1 || isUpdating}
                                        title="Move down"
                                    >
                                        <FiArrowDown size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <p>No sections found for this template.</p>
                    </div>
                )}
            </div>
        </div>
    );
}