// src/components/portfolio/ResumeBuilder.jsx

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routes/routes.constants';
import { useGetResumeProjectQuery, useGetTemplateSectionsQuery } from '@/services/api/portfolioApi';
import { PROFILE_SECTIONS, SECTION_ICONS } from '@/config/portfolioSections';
import { useResizablePanel } from '@/hooks/useResizablePanel';
import { usePreviewSettings } from '@/hooks/usePreviewSettings';
import PreviewBuilder from '@/components/common/preview/PreviewBuilder';
import Loader from '@/components/common/Loader';

// Section components (same as portfolio)
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
    const [activeSection, setActiveSection] = useState('basic-info');
    const [initialized, setInitialized] = useState(false);
    const refreshKeyRef = useRef(0);
    const saveTimeoutRef = useRef(null);

    // Fetch resume data
    const { data, isLoading, refetch } = useGetResumeProjectQuery(resumeId, { skip: !resumeId });
    const resume = data?.data;

    // Fetch template sections
    const templateId = resume?.resume_template_id || resume?.template_id;
    const { data: templateSectionsData, isLoading: sectionsLoading } = useGetTemplateSectionsQuery(templateId, { skip: !templateId });
    const templateSections = templateSectionsData?.data || [];

    const snapshotId = resume?.profile_snapshot_id || resume?.profile_snapshot;

    // Build visible sections based on template config (same logic as portfolio)
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

    // Get current section index
    const currentIndex = visibleSections.findIndex(s => s.id === activeSection);

    // Get previous and next section names
    const prevSection = currentIndex > 0 ? visibleSections[currentIndex - 1] : null;
    const nextSection = currentIndex < visibleSections.length - 1 ? visibleSections[currentIndex + 1] : null;

    // Navigation handlers
    const handlePrevious = useCallback(() => {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
            setActiveSection(visibleSections[prevIndex].id);
        }
    }, [currentIndex, visibleSections]);

    const handleNext = useCallback(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < visibleSections.length) {
            setActiveSection(visibleSections[nextIndex].id);
        }
    }, [currentIndex, visibleSections]);

    // Set initial active section
    useEffect(() => {
        if (templateSectionsData && !initialized && visibleSections.length > 0) {
            setActiveSection(visibleSections[0].id);
            setInitialized(true);
        }
    }, [templateSectionsData, visibleSections, initialized]);

    // Refresh preview when data changes
    const refreshPreview = useCallback(() => {
        refetch();
    }, [refetch]);

    // Force refresh preview
    const forceRefreshPreview = useCallback(() => {
        refreshKeyRef.current += 1;
        refetch();
    }, [refetch]);

    // Handle section data updates - with immediate refresh
    const handleSectionUpdate = useCallback(() => {
        // Clear any pending timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        // Refetch data immediately
        refetch();

        // Debounce the force refresh to prevent multiple rapid refreshes
        saveTimeoutRef.current = setTimeout(() => {
            forceRefreshPreview();
            saveTimeoutRef.current = null;
        }, 300);
    }, [refetch, forceRefreshPreview]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    // Get section icon
    const getSectionIcon = (iconName) => {
        const IconComponent = SECTION_ICONS[iconName];
        return IconComponent ? <IconComponent size={14} /> : null;
    };

    // Check if section is required
    const getRequired = (sectionId) => {
        const ts = templateSections.find(t => {
            const mappedKey = API_KEY_TO_SECTION_ID[t.section?.key];
            return mappedKey === sectionId;
        });
        return ts?.is_required ?? PROFILE_SECTIONS.find(s => s.id === sectionId)?.required ?? false;
    };

    // Render section content with navigation props
    const renderSection = (sectionId) => {
        const Comp = SECTION_COMPONENTS[sectionId];
        if (!Comp || !snapshotId) return null;

        const index = visibleSections.findIndex(s => s.id === sectionId);
        const isFirst = index === 0;
        const isLast = index === visibleSections.length - 1;

        // Get previous and next section names for this specific section
        const prev = index > 0 ? visibleSections[index - 1] : null;
        const next = index < visibleSections.length - 1 ? visibleSections[index + 1] : null;

        return (
            <Comp
                snapshotId={snapshotId}
                onDataChange={handleSectionUpdate}
                onPrevious={handlePrevious}
                onNext={handleNext}
                showPrevious={index > 0}
                showNext={index < visibleSections.length - 1}
                isFirstStep={isFirst}
                isLastStep={isLast}
                previousSectionName={prev?.title || ''}
                nextSectionName={next?.title || ''}
            />
        );
    };

    // Check if preview is available
    const canPreview = resume?.is_public && !!resume?.slug;
    const previewUrl = canPreview ? `/resume-preview/${resume.slug}?embed=true&t=${refreshKeyRef.current}` : null;

    if (isLoading) return <Loader text="Loading resume builder..." />;

    return (
        <PreviewBuilder
            title={resume?.title}
            previewUrl={previewUrl}
            canPreview={canPreview}
            canPrint={canPreview}
            sections={visibleSections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            renderSection={renderSection}
            getSectionIcon={getSectionIcon}
            getRequired={getRequired}
            onBack={onBack}
            onSettings={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.EDIT(resumeId))}
            onPreview={canPreview ? () => onPreview(resume.slug) : null}
            onExport={() => onGeneratePDF(resumeId)}
            defaultLayout={50}
            defaultSize="a4"
            defaultZoom={100}
            viewMode="document"
            refreshTrigger={refreshKeyRef.current}
        />
    );
}