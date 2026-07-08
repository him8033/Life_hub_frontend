'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/routes/routes.constants';
import { useGetPortfolioProjectQuery, useGetThemeSectionsQuery } from '@/services/api/portfolioApi';
import { PROFILE_SECTIONS, SECTION_ICONS } from '@/config/portfolioSections';
import { useResizablePanel } from '@/hooks/useResizablePanel';
import { usePreviewSettings } from '@/hooks/usePreviewSettings';
import PreviewBuilder from '@/components/common/preview/PreviewBuilder';
import Loader from '@/components/common/Loader';

// Section components (same as resume)
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

export default function PortfolioBuilder({ portfolioId, onBack, onPreview }) {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState('basic-info');
    const [initialized, setInitialized] = useState(false);

    // Fetch portfolio data
    const { data, isLoading, refetch } = useGetPortfolioProjectQuery(portfolioId, { skip: !portfolioId });
    const portfolio = data?.data;

    // Fetch theme sections
    const themeId = portfolio?.portfolio_theme_id || portfolio?.theme_id;
    const { data: themeSectionsData, isLoading: sectionsLoading } = useGetThemeSectionsQuery(themeId, { skip: !themeId });
    const themeSections = themeSectionsData?.data || [];

    const snapshotId = portfolio?.profile_snapshot_id || portfolio?.profile_snapshot;

    // Build visible sections based on theme config
    const visibleSections = PROFILE_SECTIONS.filter(section => {
        const themeSection = themeSections.find(ts => {
            const mappedKey = API_KEY_TO_SECTION_ID[ts.section?.key];
            return mappedKey === section.id || ts.section?.key === section.id || ts.section?.name === section.title;
        });
        return themeSection ? themeSection.is_visible : true;
    }).sort((a, b) => {
        const aSection = themeSections.find(ts => {
            const mappedKey = API_KEY_TO_SECTION_ID[ts.section?.key];
            return mappedKey === a.id || ts.section?.key === a.id;
        });
        const bSection = themeSections.find(ts => {
            const mappedKey = API_KEY_TO_SECTION_ID[ts.section?.key];
            return mappedKey === b.id || ts.section?.key === b.id;
        });
        const aPos = aSection?.position ?? a.order;
        const bPos = bSection?.position ?? b.order;
        return aPos - bPos;
    });

    // Set initial active section
    useEffect(() => {
        if (themeSectionsData && !initialized && visibleSections.length > 0) {
            setActiveSection(visibleSections[0].id);
            setInitialized(true);
        }
    }, [themeSectionsData, visibleSections, initialized]);

    // Refresh preview when data changes
    const refreshPreview = useCallback(() => {
        refetch();
    }, [refetch]);

    // Handle section data updates
    const handleSectionUpdate = useCallback(() => {
        setTimeout(() => refreshPreview(), 500);
    }, [refreshPreview]);

    // Get section icon
    const getSectionIcon = (iconName) => {
        const IconComponent = SECTION_ICONS[iconName];
        return IconComponent ? <IconComponent size={14} /> : null;
    };

    // Check if section is required
    const getRequired = (sectionId) => {
        const ts = themeSections.find(t => {
            const mappedKey = API_KEY_TO_SECTION_ID[t.section?.key];
            return mappedKey === sectionId;
        });
        return ts?.is_required ?? PROFILE_SECTIONS.find(s => s.id === sectionId)?.required ?? false;
    };

    // Render section content
    const renderSection = (sectionId) => {
        const Comp = SECTION_COMPONENTS[sectionId];
        if (!Comp || !snapshotId) return null;
        return <Comp snapshotId={snapshotId} onDataChange={handleSectionUpdate} />;
    };

    // Check if preview is available
    const canPreview = portfolio?.is_public && !!portfolio?.slug;
    const previewUrl = canPreview ? `/portfolio-preview/${portfolio.slug}?embed=true` : null;

    if (isLoading) return <Loader text="Loading portfolio builder..." />;

    return (
        <PreviewBuilder
            title={portfolio?.title}
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
            onSettings={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.EDIT(portfolioId))}
            onPreview={canPreview ? () => onPreview(portfolio.slug) : null}
            onExport={null}
            defaultLayout={50}
            defaultSize="desktop" // Default to desktop viewport
            defaultZoom={100}
            viewMode="webpage" // Webpage mode for portfolio
        />
    );
}