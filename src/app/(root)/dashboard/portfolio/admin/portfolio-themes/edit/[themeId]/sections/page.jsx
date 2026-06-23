'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import { FiArrowLeft, FiEye, FiEyeOff, FiLock, FiUnlock, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import {
    useGetPortfolioThemeQuery,
    useGetThemeSectionsQuery,
    useUpdateThemeSectionMutation,
} from '@/services/api/portfolioApi';
import styles from '@/styles/portfolio/admin/TemplateSections.module.css';

export default function ThemeSectionsPage() {
    const router = useRouter();
    const params = useParams();
    const { showSnackbar } = useSnackbar();
    const themeId = params.themeId;

    const { data: themeData, isLoading: themeLoading, error: themeError } = useGetPortfolioThemeQuery(themeId, { skip: !themeId });
    const { data: sectionsData, isLoading: sectionsLoading, refetch } = useGetThemeSectionsQuery(themeId, { skip: !themeId });
    const [updateSection, { isLoading: isUpdating }] = useUpdateThemeSectionMutation();

    const theme = themeData?.data;
    const sections = sectionsData?.data || [];

    const handleToggleVisibility = async (sectionId, currentVisibility) => {
        try {
            await updateSection({ themeId, sectionId, data: { is_visible: !currentVisibility } }).unwrap();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to update'), 'error', 3000);
        }
    };

    const handleToggleRequired = async (sectionId, currentRequired) => {
        try {
            await updateSection({ themeId, sectionId, data: { is_required: !currentRequired } }).unwrap();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to update'), 'error', 3000);
        }
    };

    const handleMoveUp = async (sectionId, currentPosition) => {
        const sorted = [...sections].sort((a, b) => a.position - b.position);
        const index = sorted.findIndex(s => s.portfoliothemesection_id === sectionId);
        if (index <= 0) return;
        const prev = sorted[index - 1];
        try {
            await updateSection({ themeId, sectionId, data: { position: prev.position } }).unwrap();
            await updateSection({ themeId, sectionId: prev.portfoliothemesection_id, data: { position: currentPosition } }).unwrap();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 3000);
        }
    };

    const handleMoveDown = async (sectionId, currentPosition) => {
        const sorted = [...sections].sort((a, b) => a.position - b.position);
        const index = sorted.findIndex(s => s.portfoliothemesection_id === sectionId);
        if (index < 0 || index >= sorted.length - 1) return;
        const next = sorted[index + 1];
        try {
            await updateSection({ themeId, sectionId, data: { position: next.position } }).unwrap();
            await updateSection({ themeId, sectionId: next.portfoliothemesection_id, data: { position: currentPosition } }).unwrap();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 3000);
        }
    };

    if (themeLoading || sectionsLoading) return <Loader text="Loading sections..." />;
    if (themeError?.status === 404) return <NotFoundState title="Theme Not Found" backLabel="Back" backTo={ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIOTHEME.LIST} fullPage />;
    if (themeError) return <ErrorState message="Failed to load theme" onRetry={refetch} retryMsg="Retry" />;

    const sortedSections = [...sections].sort((a, b) => a.position - b.position);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <FiArrowLeft size={16} /> Back
                </button>
                <div>
                    <h1 className={styles.title}>Section Settings</h1>
                    <p className={styles.subtitle}>
                        Theme: {theme?.name} — Configure visibility and order of sections
                    </p>
                </div>
            </div>

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
                            <div key={section.portfoliothemesection_id} className={styles.item}>
                                <div className={styles.colSection}>
                                    <span className={styles.sectionName}>{section.section?.name || 'Unknown'}</span>
                                    <span className={styles.sectionKey}>{section.section?.key || '—'}</span>
                                </div>
                                <div className={styles.colVisible}>
                                    <button
                                        className={`${styles.toggleBtn} ${section.is_visible ? styles.active : styles.inactive}`}
                                        onClick={() => handleToggleVisibility(section.portfoliothemesection_id, section.is_visible)}
                                        disabled={isUpdating}
                                    >
                                        {section.is_visible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                                        <span>{section.is_visible ? 'Visible' : 'Hidden'}</span>
                                    </button>
                                </div>
                                <div className={styles.colRequired}>
                                    <button
                                        className={`${styles.toggleBtn} ${section.is_required ? styles.required : styles.optional}`}
                                        onClick={() => handleToggleRequired(section.portfoliothemesection_id, section.is_required)}
                                        disabled={isUpdating}
                                    >
                                        {section.is_required ? <FiLock size={14} /> : <FiUnlock size={14} />}
                                        <span>{section.is_required ? 'Required' : 'Optional'}</span>
                                    </button>
                                </div>
                                <div className={styles.colPosition}>
                                    <button className={styles.moveBtn} onClick={() => handleMoveUp(section.portfoliothemesection_id, section.position)} disabled={index === 0 || isUpdating}><FiArrowUp size={12} /></button>
                                    <span className={styles.positionNumber}>{index + 1}</span>
                                    <button className={styles.moveBtn} onClick={() => handleMoveDown(section.portfoliothemesection_id, section.position)} disabled={index === sortedSections.length - 1 || isUpdating}><FiArrowDown size={12} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.empty}><p>No sections found.</p></div>
                )}
            </div>
        </div>
    );
}