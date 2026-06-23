'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useGetResumeProjectQuery, useGetTemplateSectionsQuery } from '@/services/api/portfolioApi';
import Loader from '@/components/common/Loader';
import { FiEye, FiDownload, FiArrowLeft, FiChevronDown, FiSettings, FiRefreshCw } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routes/routes.constants';
import { PROFILE_SECTIONS, SECTION_ICONS } from '@/config/portfolioSections';
import styles from '@/styles/portfolio/resume/ResumeBuilder.module.css';

// All section imports
import BasicInfoSection from '@/components/portfolio/sections/BasicInfoSection';
import SocialLinksSection from '@/components/portfolio/sections/SocialLinksSection';
import EducationSection from '@/components/portfolio/sections/EducationSection';
import ExperienceSection from '@/components/portfolio/sections/ExperienceSection';
import SkillsSection from '@/components/portfolio/sections/SkillsSection';
import ProjectsSection from '@/components/portfolio/sections/ProjectsSection';
import CertificatesSection from '@/components/portfolio/sections/CertificateSection';
import AchievementsSection from '@/components/portfolio/sections/AchievementsSection';
import LanguagesSection from '@/components/portfolio/sections/LanguagesSection';
import HobbiesSection from '@/components/portfolio/sections/HobbiesSection';
import StrengthsSection from '@/components/portfolio/sections/StrengthsSection';
import CustomSectionsSection from '@/components/portfolio/sections/CustomSectionsSection';

const SECTION_COMPONENTS = {
    'basic-info': BasicInfoSection,
    'social-links': SocialLinksSection,
    'education': EducationSection,
    'experience': ExperienceSection,
    'skills': SkillsSection,
    'projects': ProjectsSection,
    'certificates': CertificatesSection,
    'achievements': AchievementsSection,
    'languages': LanguagesSection,
    'hobbies': HobbiesSection,
    'strengths': StrengthsSection,
    'custom-sections': CustomSectionsSection,
};

// 🔑 KEY MAPPING: API section keys → Frontend section IDs
const API_KEY_TO_SECTION_ID = {
    'basic_info': 'basic-info',
    'social_link': 'social-links',
    'education': 'education',
    'experience': 'experience',
    'skill': 'skills',
    'project': 'projects',
    'certificate': 'certificates',
    'achievement': 'achievements',
    'language': 'languages',
    'hobby': 'hobbies',
    'strength': 'strengths',
    'custom_section': 'custom-sections',
};

export default function ResumeBuilder({ resumeId, onBack, onPreview, onGeneratePDF }) {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);
    const [initialized, setInitialized] = useState(false);
    const iframeRef = useRef(null);

    const { data, isLoading, refetch } = useGetResumeProjectQuery(resumeId, { skip: !resumeId });
    const resume = data?.data;

    const templateId = resume?.resume_template_id || resume?.template_id;

    const { data: templateSectionsData, isLoading: sectionsLoading } = useGetTemplateSectionsQuery(templateId, { skip: !templateId });
    const templateSections = templateSectionsData?.data || [];

    const snapshotId = resume?.profile_snapshot_id || resume?.profile_snapshot;

    // Build visible sections based on template config with key mapping
    const visibleSections = PROFILE_SECTIONS.filter(section => {
        const templateSection = templateSections.find(ts => {
            const mappedKey = API_KEY_TO_SECTION_ID[ts.section?.key];
            return mappedKey === section.id || ts.section?.key === section.id || ts.section?.name === section.title;
        });
        return templateSection ? templateSection.is_visible : true;
    }).sort((a, b) => {
        const aSection = templateSections.find(ts => {
            const mappedKey = API_KEY_TO_SECTION_ID[ts.section?.key];
            return mappedKey === a.id || ts.section?.key === a.id;
        });
        const bSection = templateSections.find(ts => {
            const mappedKey = API_KEY_TO_SECTION_ID[ts.section?.key];
            return mappedKey === b.id || ts.section?.key === b.id;
        });
        const aPos = aSection?.position ?? a.order;
        const bPos = bSection?.position ?? b.order;
        return aPos - bPos;
    });

    // Use state for active section, initialize to empty
    const [activeSection, setActiveSection] = useState('');

    // Set active section once template sections are loaded
    useEffect(() => {
        if (templateSectionsData && !initialized) {
            const firstVisible = visibleSections.length > 0 ? visibleSections[0].id : '';
            if (firstVisible) {
                setActiveSection(firstVisible);
            }
            setInitialized(true);
        }
    }, [templateSectionsData, visibleSections, initialized]);

    // If still loading sections, wait
    const isReady = initialized || (!sectionsLoading && templateSections.length === 0);
    const noVisibleSections = isReady && visibleSections.length === 0;

    const currentTemplateSection = templateSections.find(ts => {
        const mappedKey = API_KEY_TO_SECTION_ID[ts.section?.key];
        return mappedKey === activeSection || ts.section?.key === activeSection;
    });
    const isRequired = currentTemplateSection?.is_required ??
        PROFILE_SECTIONS.find(s => s.id === activeSection)?.required ?? false;

    const ActiveComponent = SECTION_COMPONENTS[activeSection];

    const refreshPreview = useCallback(() => {
        setPreviewKey(prev => prev + 1);
        refetch();
    }, [refetch]);

    const handleSectionUpdate = useCallback(() => {
        setTimeout(() => refreshPreview(), 500);
    }, [refreshPreview]);

    const getSectionIcon = (iconName) => {
        const IconComponent = SECTION_ICONS[iconName];
        return IconComponent ? <IconComponent size={14} /> : null;
    };

    // Handle section change - only allow visible sections
    const handleSectionChange = (sectionId) => {
        if (visibleSections.find(s => s.id === sectionId)) {
            setActiveSection(sectionId);
        }
    };

    if (isLoading) return <Loader text="Loading resume builder..." />;

    return (
        <div className={styles.builder}>
            {/* Compact Top Bar */}
            <div className={styles.topBar}>
                <button onClick={onBack} className={styles.backBtn} title="Back to Resumes">
                    <FiArrowLeft size={16} />
                </button>
                <span className={styles.resumeTitle}>{resume?.title || 'Resume'}</span>
                <div className={styles.topActions}>
                    <button className={styles.iconBtn} onClick={refreshPreview} title="Refresh Preview">
                        <FiRefreshCw size={16} />
                    </button>
                    <button
                        className={styles.iconBtn}
                        onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.EDIT(resumeId))}
                        title="Resume Settings"
                    >
                        <FiSettings size={16} />
                    </button>
                    {resume?.is_public && (
                        <button className={styles.iconBtn} onClick={() => onPreview(resume.slug)} title="Preview">
                            <FiEye size={16} />
                        </button>
                    )}
                    <button className={styles.iconBtn} onClick={() => onGeneratePDF(resumeId)} title="Export PDF">
                        <FiDownload size={16} />
                    </button>
                </div>
            </div>

            <div className={styles.builderBody}>
                {/* Left Panel */}
                <div className={styles.leftPanel}>
                    {/* Mobile Dropdown */}
                    <div className={styles.mobileNav}>
                        <button className={styles.mobileNavBtn} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {PROFILE_SECTIONS.find(s => s.id === activeSection)?.title || 'Select Section'}
                            <FiChevronDown size={14} />
                        </button>
                        {mobileMenuOpen && visibleSections.length > 0 && (
                            <div className={styles.mobileDropdown}>
                                {visibleSections.map((section) => {
                                    const tmplSection = templateSections.find(ts => {
                                        const mappedKey = API_KEY_TO_SECTION_ID[ts.section?.key];
                                        return mappedKey === section.id;
                                    });
                                    const required = tmplSection?.is_required ?? section.required;

                                    return (
                                        <button
                                            key={section.id}
                                            className={`${styles.mobileDropdownItem} ${activeSection === section.id ? styles.active : ''}`}
                                            onClick={() => { handleSectionChange(section.id); setMobileMenuOpen(false); }}
                                        >
                                            {getSectionIcon(section.icon)}
                                            <span>{section.title}</span>
                                            {required && <span className={styles.required}>*</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Desktop Tabs - Only Visible Sections */}
                    <div className={styles.desktopNav}>
                        {isReady && visibleSections.map((section) => {
                            const tmplSection = templateSections.find(ts => {
                                const mappedKey = API_KEY_TO_SECTION_ID[ts.section?.key];
                                return mappedKey === section.id;
                            });
                            const required = tmplSection?.is_required ?? section.required;

                            return (
                                <button
                                    key={section.id}
                                    className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                                    onClick={() => handleSectionChange(section.id)}
                                    title={section.description}
                                >
                                    {getSectionIcon(section.icon)}
                                    <span className={styles.navLabel}>
                                        {required && <span className={styles.required}>*</span>}
                                        {section.title}
                                    </span>
                                </button>
                            );
                        })}
                        {noVisibleSections && (
                            <span className={styles.noSections}>No sections configured</span>
                        )}
                        {!isReady && (
                            <span className={styles.noSections}>Loading sections...</span>
                        )}
                    </div>

                    {/* Section Content */}
                    <div className={styles.sectionContent}>
                        {!isReady ? (
                            <div className={styles.comingSoon}>
                                <Loader text="Loading sections..." />
                            </div>
                        ) : noVisibleSections ? (
                            <div className={styles.comingSoon}>
                                <div className={styles.comingSoonIcon}>📋</div>
                                <h3>No Sections Configured</h3>
                                <p>No sections are currently visible for this template.</p>
                                <p className={styles.hint}>
                                    Go to template settings to configure which sections to show.
                                </p>
                            </div>
                        ) : ActiveComponent && snapshotId ? (
                            <ActiveComponent
                                snapshotId={snapshotId}
                                onDataChange={handleSectionUpdate}
                            />
                        ) : activeSection ? (
                            <div className={styles.comingSoon}>
                                <p>🚧 This section is not available</p>
                            </div>
                        ) : (
                            <div className={styles.comingSoon}>
                                <p>Select a section to get started</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Live Preview */}
                <div className={styles.rightPanel}>
                    <div className={styles.previewLabel}>
                        Live Preview
                        <button className={styles.refreshPreviewBtn} onClick={refreshPreview} title="Refresh Preview">
                            <FiRefreshCw size={10} />
                        </button>
                    </div>
                    <div className={styles.previewFrame}>
                        {resume?.is_public && resume?.slug ? (
                            <iframe
                                key={previewKey}
                                ref={iframeRef}
                                src={`/resume-preview/${resume.slug}?embed=true`}
                                className={styles.previewIframe}
                                title="Resume Preview"
                            />
                        ) : (
                            <div className={styles.previewPlaceholder}>
                                <p>Make your resume public to see the live preview</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}