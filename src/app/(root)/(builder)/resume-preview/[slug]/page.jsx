'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetPublicResumeQuery, useGetPublicResumeTemplatesQuery, useGetTemplateSectionsQuery } from '@/services/api/portfolioApi';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import { getTemplate, getTemplateName } from '@/components/portfolio/template/TemplateRegistry';
import { FiArrowLeft, FiPrinter, FiLayout, FiZoomIn, FiZoomOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from '@/styles/portfolio/resume/ResumePreview.module.css';

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

export default function ResumePreviewPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;

    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showSwitcher, setShowSwitcher] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageHeights, setPageHeights] = useState([]);
    const contentRef = useRef(null);
    const pageRefs = useRef({});

    const { data, isLoading, error } = useGetPublicResumeQuery(slug, { skip: !slug });
    const { data: templatesData } = useGetPublicResumeTemplatesQuery();

    const resumeData = data?.data;
    const apiTemplates = templatesData?.data || [];

    // Get current template ID (from selected preview or actual resume)
    const currentTemplateKey = selectedTemplate || resumeData?.resume?.resume_template_key ||
        resumeData?.template?.key || 'modern_ats';

    const currentTemplateId = selectedTemplate
        ? apiTemplates.find(t => (t.key || t.name?.toLowerCase().replace(/\s+/g, '_')) === selectedTemplate)?.template_id
        : resumeData?.template?.template_id || resumeData?.resume?.resume_template_id;

    // Fetch sections config for the current template
    const { data: sectionsData } = useGetTemplateSectionsQuery(currentTemplateId, { skip: !currentTemplateId });
    const templateSections = sectionsData?.data || [];

    // Build visible sections set using key mapping
    const hasTemplateConfig = templateSections.length > 0;
    const visibleSectionKeys = new Set(
        templateSections
            .filter(ts => ts.is_visible)
            .map(ts => API_KEY_TO_SECTION_ID[ts.section?.key])
            .filter(Boolean)
    );

    const isEmbedded = typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).get('embed') === 'true';

    // Calculate page breaks based on content
    const calculatePages = useCallback(() => {
        if (!contentRef.current) return;

        const container = contentRef.current;
        const children = Array.from(container.children);
        const pageHeight = 1123; // A4 height in pixels
        let currentPageHeight = 0;
        const pages = [];
        let currentPageElements = [];

        children.forEach((child) => {
            const childHeight = child.offsetHeight || child.scrollHeight;

            // Check if adding this child would exceed page height
            if (currentPageHeight + childHeight > pageHeight && currentPageElements.length > 0) {
                pages.push([...currentPageElements]);
                currentPageElements = [];
                currentPageHeight = 0;
            }

            currentPageElements.push(child);
            currentPageHeight += childHeight;
        });

        // Add remaining elements
        if (currentPageElements.length > 0) {
            pages.push([...currentPageElements]);
        }

        setTotalPages(Math.max(1, pages.length));
        setPageHeights(pages.map(page => page.reduce((sum, el) => sum + (el.offsetHeight || el.scrollHeight), 0)));

        // Reset to first page if current page exceeds total
        if (currentPage > pages.length) {
            setCurrentPage(1);
        }
    }, [resumeData, selectedTemplate]);

    // Recalculate pages when content changes
    useEffect(() => {
        // Wait for DOM to update
        const timer = setTimeout(() => {
            calculatePages();
        }, 100);

        return () => clearTimeout(timer);
    }, [calculatePages]);

    // Handle zoom
    const zoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 200));
    const zoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));
    const zoomReset = () => setZoomLevel(100);

    // Navigation
    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    if (isLoading) return <Loader text="Loading resume..." />;
    if (error?.status === 404) return <NotFoundState title="Resume Not Found" message="This resume doesn't exist or is private." fullPage />;
    if (error) return <ErrorState message="Failed to load resume" />;
    if (!resumeData) return <NotFoundState title="Resume Not Found" fullPage />;

    // Get template component
    const templateKey = selectedTemplate || resumeData.resume?.resume_template_key ||
        resumeData.template?.key || 'modern_ats';

    const currentTemplateName = apiTemplates.find(t =>
        (t.key || t.name?.toLowerCase().replace(/\s+/g, '_')) === templateKey
    )?.name || getTemplateName(templateKey);

    const TemplateComponent = getTemplate(templateKey);

    const handlePrint = () => window.print();

    const handleTemplateChange = (key) => {
        setSelectedTemplate(key);
        setShowSwitcher(false);
    };

    const handleResetTemplate = () => {
        setSelectedTemplate(null);
        setShowSwitcher(false);
    };

    // Filter resume data to only include visible sections
    const filteredResumeData = {
        ...resumeData,
        basic_info: (!hasTemplateConfig || visibleSectionKeys.has('basic-info')) ? resumeData.basic_info : null,
        social_links: (!hasTemplateConfig || visibleSectionKeys.has('social-links')) ? resumeData.social_links : [],
        skills: (!hasTemplateConfig || visibleSectionKeys.has('skills')) ? resumeData.skills : [],
        experiences: (!hasTemplateConfig || visibleSectionKeys.has('experience')) ? resumeData.experiences : [],
        educations: (!hasTemplateConfig || visibleSectionKeys.has('education')) ? resumeData.educations : [],
        projects: (!hasTemplateConfig || visibleSectionKeys.has('projects')) ? resumeData.projects : [],
        certificates: (!hasTemplateConfig || visibleSectionKeys.has('certificates')) ? resumeData.certificates : [],
        achievements: (!hasTemplateConfig || visibleSectionKeys.has('achievements')) ? resumeData.achievements : [],
        languages: (!hasTemplateConfig || visibleSectionKeys.has('languages')) ? resumeData.languages : [],
        hobbies: (!hasTemplateConfig || visibleSectionKeys.has('hobbies')) ? resumeData.hobbies : [],
        strengths: (!hasTemplateConfig || visibleSectionKeys.has('strengths')) ? resumeData.strengths : [],
        custom_sections: (!hasTemplateConfig || visibleSectionKeys.has('custom-sections')) ? resumeData.custom_sections : [],
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
                            {resumeData.resume?.title || 'Resume'}
                        </span>
                        {/* Template Switcher */}
                        {apiTemplates.length > 0 && (
                            <div className={styles.templateSwitcher}>
                                <button
                                    className={`${styles.templateBadge} ${selectedTemplate ? styles.changed : ''}`}
                                    onClick={() => setShowSwitcher(!showSwitcher)}
                                >
                                    <FiLayout size={11} /> {currentTemplateName}
                                    {selectedTemplate && ' (Preview)'}
                                </button>
                                {showSwitcher && (
                                    <div className={styles.templateDropdown}>
                                        <div className={styles.dropdownHeader}>Switch Template</div>
                                        {apiTemplates.map((tpl) => {
                                            const key = tpl.key || tpl.name?.toLowerCase().replace(/\s+/g, '_');
                                            return (
                                                <button
                                                    key={tpl.template_id}
                                                    className={`${styles.dropdownItem} ${templateKey === key && !selectedTemplate ? styles.active : ''}`}
                                                    onClick={() => handleTemplateChange(key)}
                                                >
                                                    {tpl.name}
                                                    {tpl.is_ats_friendly && ' (ATS)'}
                                                    {tpl.is_premium && ' ⭐'}
                                                    {tpl.template_id === resumeData.template?.template_id && ' ✓'}
                                                </button>
                                            );
                                        })}
                                        {selectedTemplate && (
                                            <>
                                                <div className={styles.dropdownDivider} />
                                                <button className={styles.dropdownItem} onClick={handleResetTemplate}>
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
                        {/* Zoom Controls */}
                        <div className={styles.zoomControls}>
                            <button onClick={zoomOut} className={styles.zoomBtn} title="Zoom Out">
                                <FiZoomOut size={14} />
                            </button>
                            <span className={styles.zoomLevel}>{zoomLevel}%</span>
                            <button onClick={zoomIn} className={styles.zoomBtn} title="Zoom In">
                                <FiZoomIn size={14} />
                            </button>
                            <button onClick={zoomReset} className={styles.zoomResetBtn}>
                                Reset
                            </button>
                        </div>
                        <span className={styles.pageCount}>
                            Page {currentPage} of {totalPages}
                        </span>
                        {selectedTemplate && <span className={styles.previewBadge}>Preview Mode</span>}
                        <button className={styles.topBarBtn} onClick={handlePrint}>
                            <FiPrinter size={16} /> Print
                        </button>
                    </div>
                </div>
            )}

            {/* A4 Page Container with Pagination */}
            <div className={`${styles.previewContent} ${isEmbedded ? styles.embedded : ''}`}>
                <div
                    className={styles.a4PageContainer}
                    style={{
                        transform: `scale(${zoomLevel / 100})`,
                        transformOrigin: 'top center',
                    }}
                >
                    {/* Page Navigation */}
                    {totalPages > 1 && (
                        <div className={styles.pageNavigation}>
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={styles.navBtn}
                            >
                                <FiChevronLeft size={16} /> Previous
                            </button>
                            <span className={styles.pageIndicator}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className={styles.navBtn}
                            >
                                Next <FiChevronRight size={16} />
                            </button>
                        </div>
                    )}

                    {/* A4 Page */}
                    <div className={styles.a4Page}>
                        <div ref={contentRef} className={styles.a4Content}>
                            <TemplateComponent data={filteredResumeData} />
                        </div>
                    </div>

                    {/* Page number indicator at bottom */}
                    <div className={styles.pageNumberIndicator}>
                        {totalPages > 1 ? (
                            <span>Page {currentPage} of {totalPages}</span>
                        ) : (
                            <span>1 page</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Embedded mode indicator */}
            {isEmbedded && (
                <div className={styles.embeddedBadge}>
                    {currentTemplateName} Template
                </div>
            )}
        </div>
    );
}