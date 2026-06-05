'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import Button from '@/components/common/buttons/Button';
import { useGetSnapshotQuery, useDeleteSnapshotMutation, useDuplicateSnapshotMutation } from '@/services/api/portfolioApi';
import { formatDateTime } from '@/utils/date.utils';
import { PROFILE_SECTIONS, SECTION_ICONS, getEnabledSections, getNextSection, getPreviousSection } from '@/config/portfolioSections';
import styles from '@/styles/portfolio/SnapshotDetail.module.css';
import {
    FiArrowLeft, FiEdit2, FiTrash2, FiCopy, FiFolder,
    FiTarget, FiGlobe, FiLock, FiCalendar, FiLayers,
    FiFileText, FiPlus, FiChevronLeft, FiChevronRight,
    FiExternalLink
} from 'react-icons/fi';
import BasicInfoSection from '@/components/portfolio/sections/BasicInfoSection';
import SocialLinksSection from '@/components/profile/SocialLinksSection';
import AchievementsSection from '@/components/portfolio/sections/AchievementsSection';
import HobbiesSection from '@/components/portfolio/sections/HobbiesSection';
import StrengthsSection from '@/components/portfolio/sections/StrengthsSection';
import LanguagesSection from '@/components/portfolio/sections/LanguagesSection';
import EducationSection from '@/components/portfolio/sections/EducationSection';
import ExperienceSection from '@/components/portfolio/sections/ExperienceSection';
import CertificateSection from '@/components/portfolio/sections/CertificateSection';
import SkillsSection from '@/components/portfolio/sections/SkillsSection';
import ProjectsSection from '@/components/portfolio/sections/ProjectsSection';
import CustomSectionsSection from '@/components/portfolio/sections/CustomSectionsSection';

export default function SnapshotViewPage() {
    const params = useParams();
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();
    const snapshotId = params.snapshotId;

    const [activeTab, setActiveTab] = useState('basic-info');

    const { data, isLoading, error, refetch } = useGetSnapshotQuery(snapshotId, { skip: !snapshotId });
    const [deleteSnapshot] = useDeleteSnapshotMutation();
    const [duplicateSnapshot] = useDuplicateSnapshotMutation();

    const snapshot = data?.data;
    const enabledSections = getEnabledSections();
    const currentSection = PROFILE_SECTIONS.find(s => s.id === activeTab);
    const nextSection = getNextSection(activeTab);
    const prevSection = getPreviousSection(activeTab);

    // TODO: Replace with actual API calls when Resume/Portfolio modules are built
    const connectedResumes = []; // Will come from API later
    const connectedPortfolios = []; // Will come from API later

    const handleDelete = async () => {
        const ok = await confirm({
            title: 'Delete Snapshot',
            message: `Are you sure you want to delete "${snapshot?.title}"? All data will be permanently removed.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        });
        if (!ok) return;
        try {
            await deleteSnapshot(snapshotId).unwrap();
            showSnackbar('Snapshot deleted successfully', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST);
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete snapshot'), 'error', 5000);
        }
    };

    const handleDuplicate = async () => {
        try {
            await duplicateSnapshot(snapshotId).unwrap();
            showSnackbar('Snapshot duplicated successfully', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST);
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to duplicate snapshot'), 'error', 5000);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic-info':
                return <BasicInfoSection snapshotId={snapshotId} />;
            case 'social-links':
                return <SocialLinksSection snapshotId={snapshotId} />;
            case 'skills':
                return <SkillsSection snapshotId={snapshotId} />;
            case 'experience':
                return <ExperienceSection snapshotId={snapshotId} />;
            case 'education':
                return <EducationSection snapshotId={snapshotId} />;
            case 'projects':
                return <ProjectsSection snapshotId={snapshotId} />;
            case 'certificates':
                return <CertificateSection snapshotId={snapshotId} />;
            case 'achievements':
                return <AchievementsSection snapshotId={snapshotId} />;
            case 'languages':
                return <LanguagesSection snapshotId={snapshotId} />;
            case 'hobbies':
                return <HobbiesSection snapshotId={snapshotId} />;
            case 'strengths':
                return <StrengthsSection snapshotId={snapshotId} />;
            case 'custom-sections':
                return <CustomSectionsSection snapshotId={snapshotId} />;
            default:
                return null;
        }
    };

    const getSectionIcon = (iconName) => {
        const IconComponent = SECTION_ICONS[iconName];
        return IconComponent ? <IconComponent size={16} /> : <FiFolder size={16} />;
    };

    if (isLoading) return <Loader text="Loading snapshot..." />;

    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Snapshot Not Found"
                message="The snapshot you're looking for doesn't exist."
                backLabel="Back to Snapshots"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load snapshot"}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    if (!snapshot) {
        return (
            <NotFoundState
                title="Snapshot Not Found"
                message="The snapshot you're looking for doesn't exist."
                backLabel="Back to Snapshots"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST}
                fullPage={true}
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Back Button */}
            <button
                onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST)}
                className={styles.backButton}
            >
                <FiArrowLeft /> Back to Snapshots
            </button>

            {/* Snapshot Header */}
            <div className={styles.headerCard}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerIcon}>
                        <FiFolder />
                    </div>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.headerTitle}>{snapshot.title}</h1>
                        <div className={styles.headerMeta}>
                            {snapshot.target_role && (
                                <span className={styles.roleBadge}>
                                    <FiTarget size={12} />
                                    {snapshot.target_role}
                                </span>
                            )}
                            <span className={`${styles.visibilityBadge} ${snapshot.visibility === 'public' ? styles.publicBadge : styles.privateBadge
                                }`}>
                                {snapshot.visibility === 'public' ? <FiGlobe size={12} /> : <FiLock size={12} />}
                                {snapshot.visibility}
                            </span>
                            <span className={styles.versionBadge}>
                                <FiLayers size={12} /> v{snapshot.version}
                            </span>
                            <span className={styles.dateText}>
                                <FiCalendar size={12} />
                                {formatDateTime(snapshot.updated_at)}
                            </span>
                        </div>
                        {snapshot.description && (
                            <p className={styles.headerDescription}>{snapshot.description}</p>
                        )}
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<FiCopy />}
                        onClick={handleDuplicate}
                    >
                        Duplicate
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<FiEdit2 />}
                        onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.EDIT(snapshotId))}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<FiTrash2 />}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            {/* Connected Items Section - Placeholder for future */}
            <div className={styles.connectedSection}>
                <div className={styles.connectedHeader}>
                    <h3 className={styles.connectedTitle}>Linked Projects</h3>
                    <span className={styles.connectedCount}>
                        {connectedResumes.length + connectedPortfolios.length} total
                    </span>
                </div>
                <div className={styles.connectedGrid}>
                    {/* Create Resume */}
                    <button
                        className={styles.createCard}
                        onClick={() => router.push(`${ROUTES.DASHBOARD.PORTFOLIO.RESUME.CREATE}?snapshot=${snapshotId}`)}
                    >
                        <FiFileText className={styles.createIcon} />
                        <div className={styles.createInfo}>
                            <h3>Create Resume</h3>
                            <p>Build a professional resume from this snapshot</p>
                        </div>
                        <FiPlus className={styles.createArrow} />
                    </button>

                    {/* Create Portfolio */}
                    <button
                        className={styles.createCard}
                        onClick={() => router.push(`${ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO_PROJECT.CREATE}?snapshot=${snapshotId}`)}
                    >
                        <FiGlobe className={styles.createIcon} />
                        <div className={styles.createInfo}>
                            <h3>Create Portfolio</h3>
                            <p>Build a portfolio website from this snapshot</p>
                        </div>
                        <FiPlus className={styles.createArrow} />
                    </button>

                    {/* TODO: Connected resumes will be listed here */}
                    {connectedResumes.map(resume => (
                        <div key={resume.resume_id} className={styles.connectedCard}>
                            {/* Resume preview card - implement later */}
                        </div>
                    ))}

                    {/* TODO: Connected portfolios will be listed here */}
                    {connectedPortfolios.map(portfolio => (
                        <div key={portfolio.portfolio_id} className={styles.connectedCard}>
                            {/* Portfolio preview card - implement later */}
                        </div>
                    ))}
                </div>

                {/* Empty state when nothing connected */}
                {connectedResumes.length === 0 && connectedPortfolios.length === 0 && (
                    <div className={styles.connectedEmpty}>
                        <p>No resumes or portfolios linked yet. Create one to get started!</p>
                    </div>
                )}
            </div>

            {/* Profile Sections Container */}
            <div className={styles.sectionsContainer}>
                {/* Tabs Header */}
                <div className={styles.tabsWrapper}>
                    <div className={styles.tabsHeader}>
                        {enabledSections.map((section) => (
                            <button
                                key={section.id}
                                className={`${styles.tab} ${activeTab === section.id ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab(section.id)}
                                title={section.description}
                            >
                                <span className={styles.tabIcon}>
                                    {getSectionIcon(section.icon)}
                                </span>
                                <span className={styles.tabLabel}>
                                    {section.required && <span className={styles.required}>*</span>}
                                    {section.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className={styles.tabContentWrapper}>
                    {/* Section Header */}
                    {currentSection && (
                        <div className={styles.sectionHeader}>
                            <div className={styles.sectionHeaderLeft}>
                                <span className={styles.sectionIcon}>
                                    {getSectionIcon(currentSection.icon)}
                                </span>
                                <div>
                                    <h3 className={styles.sectionTitle}>{currentSection.title}</h3>
                                    <p className={styles.sectionDescription}>{currentSection.description}</p>
                                </div>
                            </div>
                            <div className={styles.sectionNav}>
                                {prevSection && (
                                    <button
                                        className={styles.navButton}
                                        onClick={() => setActiveTab(prevSection.id)}
                                        title={`Previous: ${prevSection.title}`}
                                    >
                                        <FiChevronLeft /> {prevSection.title}
                                    </button>
                                )}
                                {nextSection && (
                                    <button
                                        className={styles.navButton}
                                        onClick={() => setActiveTab(nextSection.id)}
                                        title={`Next: ${nextSection.title}`}
                                    >
                                        {nextSection.title} <FiChevronRight />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className={styles.tabContent}>
                        {renderTabContent()}
                    </div>

                    {/* Bottom Navigation */}
                    {currentSection && (prevSection || nextSection) && (
                        <div className={styles.sectionFooter}>
                            {prevSection && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setActiveTab(prevSection.id)}
                                    icon={<FiChevronLeft />}
                                >
                                    {prevSection.title}
                                </Button>
                            )}
                            {nextSection && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setActiveTab(nextSection.id)}
                                    icon={<FiChevronRight />}
                                    iconPosition="right"
                                >
                                    {nextSection.title}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}