'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetPublicPortfolioQuery, useGetPublicPortfolioThemesQuery, useGetThemeSectionsQuery } from '@/services/api/portfolioApi';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import { getPortfolioTheme, getThemeName } from '@/components/portfolio/theme/ThemeRegistry';
import { FiArrowLeft, FiPrinter, FiLayout } from 'react-icons/fi';
import styles from '@/styles/portfolio/portfolio/PortfolioPreview.module.css';
import { extractErrorMessage } from '@/utils/errorHandler';

// KEY MAPPING: API section keys → Frontend section IDs (same as resume)
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

export default function PortfolioPreviewPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;

    const [selectedTheme, setSelectedTheme] = useState(null);
    const [showSwitcher, setShowSwitcher] = useState(false);

    const { data, isLoading, error, refetch } = useGetPublicPortfolioQuery(slug, { skip: !slug });
    const { data: themesData } = useGetPublicPortfolioThemesQuery();

    const portfolioData = data?.data;
    const apiThemes = themesData?.data || [];

    // Get current theme ID (from selected preview or actual portfolio)
    const currentThemeKey = selectedTheme || portfolioData?.portfolio?.portfolio_theme_key ||
        portfolioData?.theme?.key || 'test_theme';

    const currentThemeId = selectedTheme
        ? apiThemes.find(t => (t.key || t.name?.toLowerCase().replace(/\s+/g, '_')) === selectedTheme)?.theme_id
        : portfolioData?.theme?.theme_id || portfolioData?.portfolio?.portfolio_theme_id;

    // Fetch sections config for the current theme
    const { data: sectionsData } = useGetThemeSectionsQuery(currentThemeId, { skip: !currentThemeId });
    const themeSections = sectionsData?.data || [];

    // Build visible sections set using key mapping
    const hasThemeConfig = themeSections.length > 0;
    const visibleSectionKeys = new Set(
        themeSections
            .filter(ts => ts.is_visible)
            .map(ts => API_KEY_TO_SECTION_ID[ts.section?.key])
            .filter(Boolean)
    );

    const isEmbedded = typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('embed') === 'true';

    if (isLoading) {
        return <Loader text="Loading portfolio..." />;
    }

    if (error?.status === 404) {
        return <NotFoundState
            title="Portfolio Not Found"
            message="This portfolio doesn't exist or is private."
            fullPage
        />
    };

    if (error) {
        return <ErrorState
            message={extractErrorMessage(error, 'Failed to load portfolio')}
            onRetry={refetch}
            retryMsg="Retry"
        />;
    }

    if (!portfolioData) {
        return <NotFoundState
            title="Portfolio Not Found"
            fullPage
        />;
    }

    // Get theme component
    const themeKey = selectedTheme || portfolioData.portfolio?.portfolio_theme_key ||
        portfolioData.theme?.key || 'test_theme';

    const currentThemeName = apiThemes.find(t =>
        (t.key || t.name?.toLowerCase().replace(/\s+/g, '_')) === themeKey
    )?.name || getThemeName(themeKey);

    const ThemeComponent = getPortfolioTheme(themeKey);

    const handlePrint = () => window.print();

    const handleThemeChange = (key) => {
        setSelectedTheme(key);
        setShowSwitcher(false);
    };

    const handleResetTheme = () => {
        setSelectedTheme(null);
        setShowSwitcher(false);
    };

    // Filter portfolio data to only include visible sections
    const filteredPortfolioData = {
        ...portfolioData,
        basic_info: (!hasThemeConfig || visibleSectionKeys.has('basic-info')) ? portfolioData.basic_info : null,
        social_links: (!hasThemeConfig || visibleSectionKeys.has('social-links')) ? portfolioData.social_links : [],
        skills: (!hasThemeConfig || visibleSectionKeys.has('skills')) ? portfolioData.skills : [],
        experiences: (!hasThemeConfig || visibleSectionKeys.has('experience')) ? portfolioData.experiences : [],
        educations: (!hasThemeConfig || visibleSectionKeys.has('education')) ? portfolioData.educations : [],
        projects: (!hasThemeConfig || visibleSectionKeys.has('projects')) ? portfolioData.projects : [],
        certificates: (!hasThemeConfig || visibleSectionKeys.has('certificates')) ? portfolioData.certificates : [],
        achievements: (!hasThemeConfig || visibleSectionKeys.has('achievements')) ? portfolioData.achievements : [],
        languages: (!hasThemeConfig || visibleSectionKeys.has('languages')) ? portfolioData.languages : [],
        hobbies: (!hasThemeConfig || visibleSectionKeys.has('hobbies')) ? portfolioData.hobbies : [],
        strengths: (!hasThemeConfig || visibleSectionKeys.has('strengths')) ? portfolioData.strengths : [],
        custom_sections: (!hasThemeConfig || visibleSectionKeys.has('custom-sections')) ? portfolioData.custom_sections : [],
    };

    return (
        <div className={styles.previewWrapper}>
            {/* Top Bar - Hidden in embedded mode */}
            {!isEmbedded && (
                <div className={styles.topBar}>
                    <button onClick={() => router.back()} className={styles.backBtn}>
                        <FiArrowLeft size={16} /> Back
                    </button>
                    <div className={styles.topBarInfo}>
                        <span className={styles.topBarTitle}>
                            {portfolioData.portfolio?.title || 'Portfolio'}
                        </span>
                        {/* Theme Switcher */}
                        {apiThemes.length > 0 && (
                            <div className={styles.themeSwitcher}>
                                <button
                                    className={`${styles.themeBadge} ${selectedTheme ? styles.changed : ''}`}
                                    onClick={() => setShowSwitcher(!showSwitcher)}
                                >
                                    <FiLayout size={11} /> {currentThemeName}
                                    {selectedTheme && ' (Preview)'}
                                </button>
                                {showSwitcher && (
                                    <div className={styles.themeDropdown}>
                                        <div className={styles.dropdownHeader}>Switch Theme</div>
                                        {apiThemes.map((tpl) => {
                                            const key = tpl.key || tpl.name?.toLowerCase().replace(/\s+/g, '_');
                                            return (
                                                <button
                                                    key={tpl.theme_id}
                                                    className={`${styles.dropdownItem} ${themeKey === key && !selectedTheme ? styles.active : ''}`}
                                                    onClick={() => handleThemeChange(key)}
                                                >
                                                    {tpl.name}
                                                    {tpl.is_premium && ' ⭐'}
                                                    {tpl.theme_id === portfolioData.theme?.theme_id && ' ✓'}
                                                </button>
                                            );
                                        })}
                                        {selectedTheme && (
                                            <>
                                                <div className={styles.dropdownDivider} />
                                                <button className={styles.dropdownItem} onClick={handleResetTheme}>
                                                    ↺ Reset to Saved
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={styles.topBarActions}>
                        {selectedTheme && <span className={styles.previewBadge}>Preview Mode</span>}
                        <button className={styles.topBarBtn} onClick={handlePrint}>
                            <FiPrinter size={16} /> Print
                        </button>
                    </div>
                </div>
            )}

            {/* Theme Content with filtered data */}
            <div className={`${styles.previewContent} ${isEmbedded ? styles.embedded : ''}`}>
                <ThemeComponent
                    data={filteredPortfolioData}
                    showNavigation={isEmbedded ? false : true}
                />
            </div>

            {/* Embedded mode indicator */}
            {isEmbedded && (
                <div className={styles.embeddedBadge}>
                    {currentThemeName} Theme
                </div>
            )}
        </div>
    );
}