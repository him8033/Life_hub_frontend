// src/components/portfolio/theme/PortfolioTheme.jsx

'use client';

import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Typewriter from 'typewriter-effect';
import styles from '@/styles/portfolio/theme/PortfolioTheme.module.css';
import {
    FiMail, FiPhone, FiMapPin, FiGlobe, FiGithub, FiLinkedin,
    FiTwitter, FiCalendar, FiExternalLink, FiAward, FiCode,
    FiBriefcase, FiBook, FiFolder, FiStar, FiHeart, FiShield,
    FiDownload, FiMenu, FiX, FiArrowRight, FiFacebook, FiYoutube,
    FiAward as FiAwardIcon, FiBookOpen, FiHeart as FiHeartIcon,
    FiUser, FiGrid, FiList, FiPlus, FiMinus, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { TbHexagonLetterH } from 'react-icons/tb';
import RichTextRenderer from '@/components/common/RichTextRenderer';
import { hasContent } from '@/utils/richTextHelper';
import {
    FaGithub as FaGithubIcon,
    FaLinkedin as FaLinkedinIcon,
    FaInstagram,
    FaEnvelope,
    FaFacebook,
    FaYoutube,
    FaTwitter,
    FaGlobe,
    FaCode,
    FaUsers,
    FaShareAlt,
    FaLink
} from 'react-icons/fa';

export default function PortfolioTheme({ data, showNavigation = true }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const [expandedAchievements, setExpandedAchievements] = useState({});
    const [expandedCustomSections, setExpandedCustomSections] = useState({});

    const { portfolio, basic_info, social_links, skills, experiences, educations, projects, certificates, achievements, languages, strengths, hobbies, custom_sections } = data;

    // Carousel functions
    const nextImage = (totalImages) => {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    };

    const prevImage = (totalImages) => {
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    };

    // Reset image index when project changes
    useEffect(() => {
        if (selectedProject) {
            setCurrentImageIndex(0);
        }
    }, [selectedProject]);

    // Auto-scroll carousel
    useEffect(() => {
        if (!selectedProject || !selectedProject.images || selectedProject.images.length <= 1 || !isAutoScrolling) {
            return;
        }

        const interval = setInterval(() => {
            nextImage(selectedProject.images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [selectedProject, currentImageIndex, isAutoScrolling]);

    // Helper to get social icon based on platform name
    const getSocialIcon = (platformName) => {
        const name = platformName?.toLowerCase() || '';

        const iconMap = {
            'github': FaGithubIcon,
            'linkedin': FaLinkedinIcon,
            'twitter': FaTwitter,
            'instagram': FaInstagram,
            'facebook': FaFacebook,
            'youtube': FaYoutube,
            'website': FaGlobe,
            'globe': FaGlobe,
            'code': FaCode,
            'users': FaUsers,
            'share': FaShareAlt,
            'link': FaLink,
        };

        for (const [key, Icon] of Object.entries(iconMap)) {
            if (name.includes(key)) {
                return Icon;
            }
        }

        return FaLink;
    };

    // Get display name for social platform
    const getDisplayName = (platformName) => {
        const name = platformName?.toLowerCase() || '';
        const displayNames = {
            'github': 'GitHub',
            'linkedin': 'LinkedIn',
            'twitter': 'Twitter',
            'instagram': 'Instagram',
            'facebook': 'Facebook',
            'youtube': 'YouTube',
            'website': 'Website',
        };

        for (const [key, display] of Object.entries(displayNames)) {
            if (name.includes(key)) {
                return display;
            }
        }

        return platformName?.charAt(0).toUpperCase() + platformName?.slice(1) || 'Link';
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    // Navigation links - dynamically generated
    const navLinks = [
        { id: 'about', label: 'About' },
        { id: 'projects', label: 'Projects' },
        { id: 'skills', label: 'Skills' },
        { id: 'experience', label: 'Experience' },
    ];

    // Add education if exists
    if (educations && educations.length > 0) {
        navLinks.push({ id: 'education', label: 'Education' });
    }

    // Add certificates if exists
    if (certificates && certificates.length > 0) {
        navLinks.push({ id: 'certificates', label: 'Certificates' });
    }

    // Add achievements if exists
    if (achievements && achievements.length > 0) {
        navLinks.push({ id: 'achievements', label: 'Achievements' });
    }

    // Add languages if exists
    if (languages && languages.length > 0) {
        navLinks.push({ id: 'languages', label: 'Languages' });
    }

    // Add hobbies if exists
    if (hobbies && hobbies.length > 0) {
        navLinks.push({ id: 'hobbies', label: 'Hobbies' });
    }

    // Add strengths if exists
    if (strengths && strengths.length > 0) {
        navLinks.push({ id: 'strengths', label: 'Strengths' });
    }

    // Add custom sections if exists - as one main section
    if (custom_sections && custom_sections.length > 0) {
        navLinks.push({ id: 'custom-sections', label: 'More' });
    }

    // Check if data exists for sections
    const hasProjects = projects && projects.length > 0;
    const hasSkills = skills && skills.length > 0;
    const hasExperience = experiences && experiences.length > 0;
    const hasEducation = educations && educations.length > 0;
    const hasCertificates = certificates && certificates.length > 0;
    const hasAchievements = achievements && achievements.length > 0;
    const hasLanguages = languages && languages.length > 0;
    const hasHobbies = hobbies && hobbies.length > 0;
    const hasStrengths = strengths && strengths.length > 0;
    const hasCustomSections = custom_sections && custom_sections.length > 0;

    // Get stack/roles from various sources
    const getStack = () => {
        const roles = [];
        if (portfolio?.hero_title) roles.push(portfolio.hero_title);
        if (portfolio?.target_role) roles.push(portfolio.target_role);
        if (basic_info?.summary) {
            const summary = basic_info.summary;
            const roleMatches = summary.match(/(Full Stack Developer|Software Engineer|Backend Developer|Frontend Developer|DevOps|Freelancer)/gi);
            if (roleMatches) roles.push(...roleMatches);
        }
        if (roles.length === 0) {
            roles.push('Full Stack Developer', 'Software Engineer');
        }
        return [...new Set(roles)];
    };

    const stack = getStack();

    // Group skills by category
    const getSkillsByCategory = () => {
        const categories = {};
        skills?.forEach(skill => {
            const cat = skill.category || 'Other';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(skill);
        });
        return categories;
    };

    // Get social links with icons - DYNAMIC from data
    const getSocialLinksWithIcons = () => {
        if (!social_links || social_links.length === 0) return [];

        return social_links.map(link => {
            const Icon = getSocialIcon(link.platform_name);
            return {
                ...link,
                icon: Icon,
                displayName: getDisplayName(link.platform_name),
                title: link.platform_name || 'Social Link'
            };
        });
    };

    const socialLinksWithIcons = getSocialLinksWithIcons();

    // Social icons for desktop (left side) - ALL social links
    const socialIcons = socialLinksWithIcons.map(link => ({
        link: link.url,
        icon: link.icon,
        title: link.displayName || link.platform_name
    }));

    // Social icons for mobile (floating) - ALL social links + email
    const mobileSocialIcons = [
        ...socialLinksWithIcons.map(link => ({
            link: link.url,
            icon: link.icon,
            title: link.displayName || link.platform_name
        })),
        {
            link: `mailto:${basic_info?.email || ''}`,
            icon: FiMail,
            title: 'Email'
        }
    ];

    // Toggle achievement expansion
    const toggleAchievement = (id) => {
        setExpandedAchievements(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Toggle custom section expansion
    const toggleCustomSection = (id) => {
        setExpandedCustomSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Format proficiency level
    const getProficiencyLevel = (level) => {
        const levels = {
            'basic': 'Basic',
            'conversational': 'Conversational',
            'professional': 'Professional',
            'native': 'Native',
            'fluent': 'Fluent'
        };
        return levels[level?.toLowerCase()] || level || 'Unknown';
    };

    // Get proficiency color
    const getProficiencyColor = (level) => {
        const colors = {
            'basic': '#8892b0',
            'conversational': '#64FFDA',
            'professional': '#4ae6c4',
            'native': '#2ecc71',
            'fluent': '#2ecc71'
        };
        return colors[level?.toLowerCase()] || '#64FFDA';
    };

    // Helper to render custom section content as fields
    const renderCustomSectionFields = (content) => {
        if (!content || typeof content !== 'object') {
            return <p className={styles.customSectionEmpty}>No content available</p>;
        }

        // If content is an array, render each item
        if (Array.isArray(content)) {
            return (
                <div className={styles.customSectionFieldList}>
                    {content.map((item, index) => (
                        <div key={index} className={styles.customSectionFieldItem}>
                            {typeof item === 'object' ? (
                                <pre className={styles.customSectionFieldValue}>
                                    {JSON.stringify(item, null, 2)}
                                </pre>
                            ) : (
                                <span className={styles.customSectionFieldValue}>{String(item)}</span>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        // If content is an object, render key-value pairs
        return (
            <div className={styles.customSectionFields}>
                {Object.entries(content).map(([key, value]) => {
                    // Skip if value is null or undefined
                    if (value === null || value === undefined) return null;

                    // If value is an object or array, render it as JSON
                    if (typeof value === 'object') {
                        return (
                            <div key={key} className={styles.customSectionField}>
                                <div className={styles.customSectionFieldLabel}>{key}</div>
                                <pre className={styles.customSectionFieldValue}>
                                    {JSON.stringify(value, null, 2)}
                                </pre>
                            </div>
                        );
                    }

                    // Render primitive values
                    return (
                        <div key={key} className={styles.customSectionField}>
                            <div className={styles.customSectionFieldLabel}>{key}</div>
                            <div className={styles.customSectionFieldValue}>{String(value)}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            {showNavigation && (
                <header className={styles.header}>
                    <div className={styles.headerContainer}>
                        <div className={styles.logo}>
                            <div className={styles.logoHexagon}>
                                <span className={styles.logoText}>
                                    {basic_info?.first_name?.charAt(0) || 'P'}
                                </span>
                            </div>
                        </div>

                        <nav className={styles.desktopNav}>
                            {navLinks.map((link, index) => (
                                <a key={link.id} href={`#${link.id}`} className={styles.navLink}>
                                    <span className={styles.navNumber}>0{String(index + 1).padStart(2, '0')}.</span> {link.label}
                                </a>
                            ))}
                        </nav>

                        <button
                            className={styles.menuBtn}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <nav className={styles.mobileNav}>
                            {navLinks.map((link, index) => (
                                <a
                                    key={link.id}
                                    href={`#${link.id}`}
                                    className={styles.mobileNavLink}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className={styles.navNumber}>0{String(index + 1).padStart(2, '0')}.</span> {link.label}
                                </a>
                            ))}
                        </nav>
                    )}

                    {mobileMenuOpen && (
                        <div className={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)} />
                    )}
                </header>
            )}

            {/* About Section */}
            <section id="about" className={styles.aboutSection}>
                <div className={styles.aboutContainer}>
                    <div className={styles.aboutContent}>
                        <div className={styles.aboutText}>
                            <div className={styles.greeting}>Hi, I am</div>
                            <h1 className={styles.name}>
                                {basic_info?.first_name} {basic_info?.last_name}
                            </h1>
                            <div className={styles.role}>
                                I'm a&nbsp;
                                <span className={styles.highlight}>
                                    <Typewriter
                                        options={{
                                            strings: stack,
                                            autoStart: true,
                                            loop: true,
                                            delay: 50,
                                            deleteSpeed: 30,
                                        }}
                                    />
                                </span>
                            </div>
                            <div className={styles.bio}>
                                {hasContent(basic_info?.summary || portfolio?.hero_subtitle) ? (
                                    <RichTextRenderer
                                        html={basic_info?.summary || portfolio?.hero_subtitle}
                                        mode="light"
                                        className={styles.description}
                                    />
                                ) : (
                                    <p>{basic_info?.summary || portfolio?.hero_subtitle || ''}</p>
                                )}
                            </div>
                            <div className={styles.aboutActions}>
                                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                                    Check Resume
                                </button>
                                <a
                                    href="/Resume.pdf"
                                    download={`${basic_info?.first_name}_Resume`}
                                    className={`${styles.btn} ${styles.btnOutline}`}
                                >
                                    <FiDownload size={18} /> Download
                                </a>
                            </div>
                        </div>

                        {basic_info?.image && (
                            <div className={styles.avatarWrapper}>
                                <img
                                    src={basic_info.image}
                                    alt={`${basic_info.first_name} ${basic_info.last_name}`}
                                    className={styles.avatar}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            {hasProjects && (
                <section id="projects" className={styles.projectsSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionNumber}>02.</span> Projects
                        </h2>
                        <div className={styles.projectsGrid}>
                            {projects.map((project) => (
                                <div
                                    key={project.profileproject_id}
                                    className={styles.projectCard}
                                    onClick={() => setSelectedProject(project)}
                                >
                                    {project.thumbnail && (
                                        <img
                                            src={project.thumbnail}
                                            alt={project.project_name}
                                            className={styles.projectThumb}
                                        />
                                    )}
                                    <div className={styles.projectContent}>
                                        <div className={styles.projectHeader}>
                                            <h3 className={styles.projectName}>{project.project_name}</h3>
                                            {project.is_live && (
                                                <span className={styles.liveBadge}>
                                                    <span className={styles.liveDot}></span>
                                                    Live
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.projectTech}>
                                            {project.skills?.slice(0, 3).map((skill, idx) => (
                                                <span key={idx} className={styles.techBadge}>{skill.name}</span>
                                            ))}
                                        </div>
                                        <div className={styles.projectDesc}>
                                            {hasContent(project.short_description) ? (
                                                <RichTextRenderer
                                                    html={project.short_description}
                                                    mode="light"
                                                    className={styles.description}
                                                />
                                            ) : (
                                                <p>{project.short_description}</p>
                                            )}
                                        </div>
                                        <button className={styles.showMoreBtn}>show More...</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {hasSkills && (
                <section id="skills" className={styles.skillsSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionNumber}>03.</span> Skills
                        </h2>
                        <div className={styles.skillsContainer}>
                            {Object.entries(getSkillsByCategory()).map(([category, catSkills]) => (
                                <div key={category} className={styles.skillCategory}>
                                    <h3 className={styles.categoryTitle}>{category}</h3>
                                    <div className={styles.skillBadges}>
                                        {catSkills.map((skill) => (
                                            <div key={skill.profileskill_id} className={styles.skillBadge}>
                                                <span>{skill.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Experience Section */}
            {hasExperience && (
                <section id="experience" className={styles.experienceSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionNumber}>04.</span> Experience
                        </h2>
                        <div className={styles.timeline}>
                            {experiences.map((exp, index) => {
                                const isCurrent = exp.is_current || false;
                                return (
                                    <div
                                        key={exp.profileexperience_id}
                                        className={`${styles.timelineItem} ${isCurrent ? styles.currentJob : ''}`}
                                    >
                                        <div className={styles.timelineBullet}>
                                            <FiBriefcase size={16} />
                                        </div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.expHeader}>
                                                <div className={styles.expHeaderLeft}>
                                                    {exp.company_logo && (
                                                        <img
                                                            src={exp.company_logo}
                                                            alt={exp.company_name}
                                                            className={styles.companyLogo}
                                                        />
                                                    )}
                                                    <div>
                                                        <h3 className={styles.expRole}>
                                                            {exp.role}
                                                            {exp.employment_type && (
                                                                <span className={styles.employmentBadge}>
                                                                    {exp.employment_type}
                                                                </span>
                                                            )}
                                                            {isCurrent && (
                                                                <span className={styles.currentBadge}>
                                                                    <span className={styles.currentDot}></span>
                                                                    Current
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className={styles.expCompany}>
                                                            {exp.company_name} • {formatDate(exp.start_date)} - {isCurrent ? 'Present' : formatDate(exp.end_date)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {exp.description && (
                                                <div className={styles.expDesc}>
                                                    {hasContent(exp.description) ? (
                                                        <RichTextRenderer
                                                            html={exp.description}
                                                            mode="light"
                                                            className={styles.description}
                                                        />
                                                    ) : (
                                                        <p>{exp.description}</p>
                                                    )}
                                                </div>
                                            )}

                                            {exp.skills && exp.skills.length > 0 && (
                                                <div className={styles.expSkills}>
                                                    <span className={styles.expSkillsLabel}>Skills:</span>
                                                    {exp.skills.map((skill, idx) => (
                                                        <span key={idx} className={styles.expSkill}>• {skill}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className={styles.timelineEnd}>
                                <div className={styles.timelineBullet}>
                                    <FiBriefcase size={18} />
                                </div>
                                <div className={styles.endLabel}>End of Experience</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Education Section */}
            {hasEducation && (
                <section id="education" className={styles.educationSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionNumber}>05.</span> Education
                        </h2>
                        <div className={styles.educationTimeline}>
                            {educations.map((edu, index) => {
                                const isCurrent = edu.is_current || false;
                                return (
                                    <div
                                        key={edu.profileeducation_id}
                                        className={`${styles.educationTimelineItem} ${isCurrent ? styles.currentEducation : ''}`}
                                    >
                                        <div className={styles.educationTimelineBullet}>
                                            <FiBookOpen size={16} />
                                        </div>
                                        <div className={styles.educationTimelineContent}>
                                            <div className={styles.educationHeader}>
                                                <div className={styles.educationHeaderLeft}>
                                                    <div>
                                                        <h3 className={styles.educationDegree}>
                                                            {edu.degree_name}
                                                            {edu.score && (
                                                                <span className={styles.educationScoreBadge}>
                                                                    {edu.score}
                                                                </span>
                                                            )}
                                                            {isCurrent && (
                                                                <span className={styles.currentBadge}>
                                                                    <span className={styles.currentDot}></span>
                                                                    Current
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className={styles.educationInstitution}>
                                                            {edu.institution_name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={styles.educationDate}>
                                                    <FiCalendar size={12} />
                                                    {formatDate(edu.start_date)} - {isCurrent ? 'Present' : formatDate(edu.end_date)}
                                                </span>
                                            </div>

                                            {edu.description && hasContent(edu.description) && (
                                                <div className={styles.educationDesc}>
                                                    <RichTextRenderer
                                                        html={edu.description}
                                                        mode="light"
                                                        className={styles.description}
                                                    />
                                                </div>
                                            )}

                                            {edu.full_address && (
                                                <div className={styles.educationLocation}>
                                                    <FiMapPin size={14} />
                                                    <span>{edu.full_address}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className={styles.educationTimelineEnd}>
                                <div className={styles.educationTimelineBullet}>
                                    <FiBookOpen size={18} />
                                </div>
                                <div className={styles.endLabel}>End of Education</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Certificates Section */}
            {hasCertificates && (
                <section id="certificates" className={styles.certificatesSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionNumber}>06.</span> Certificates
                        </h2>
                        <div className={styles.certificatesGrid}>
                            {certificates.map((cert) => (
                                <div
                                    key={cert.profilecertificate_id}
                                    className={styles.certificateCard}
                                    onClick={() => setSelectedCertificate(cert)}
                                >
                                    {cert.image && (
                                        <img
                                            src={cert.image}
                                            alt={cert.title}
                                            className={styles.certificateThumb}
                                        />
                                    )}
                                    <div className={styles.certificateContent}>
                                        <div className={styles.certificateHeader}>
                                            <h3 className={styles.certificateName}>{cert.title}</h3>
                                        </div>
                                        <div className={styles.certificateMeta}>
                                            {cert.issued_by && (
                                                <span className={styles.certificateIssuerBadge}>{cert.issued_by}</span>
                                            )}
                                            {cert.issued_date && (
                                                <span className={styles.certificateDateBadge}>
                                                    <FiCalendar size={12} /> {formatDate(cert.issued_date)}
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.certificateDesc}>
                                            {hasContent(cert.description) ? (
                                                <RichTextRenderer
                                                    html={cert.description}
                                                    mode="light"
                                                    className={styles.description}
                                                />
                                            ) : (
                                                <p>{cert.description || 'Click to view details'}</p>
                                            )}
                                        </div>
                                        <button className={styles.showMoreBtn}>View Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Certificate Modal */}
            {selectedCertificate && (
                <div className={styles.modalOverlay} onClick={() => setSelectedCertificate(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setSelectedCertificate(null)}>
                            <FiX size={24} />
                        </button>

                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>{selectedCertificate.title}</h2>
                        </div>

                        {selectedCertificate.image && (
                            <img
                                src={selectedCertificate.image}
                                alt={selectedCertificate.title}
                                className={styles.modalImage}
                            />
                        )}

                        <div className={styles.certificateModalMeta}>
                            {selectedCertificate.issued_by && (
                                <div className={styles.certificateModalMetaItem}>
                                    <FiAward size={16} />
                                    <span>Issued by: <strong>{selectedCertificate.issued_by}</strong></span>
                                </div>
                            )}
                            {selectedCertificate.issued_date && (
                                <div className={styles.certificateModalMetaItem}>
                                    <FiCalendar size={16} />
                                    <span>Issued: {formatDate(selectedCertificate.issued_date)}</span>
                                </div>
                            )}
                            {selectedCertificate.expiry_date && (
                                <div className={styles.certificateModalMetaItem}>
                                    <FiCalendar size={16} />
                                    <span>Expires: {formatDate(selectedCertificate.expiry_date)}</span>
                                </div>
                            )}
                            {selectedCertificate.credential_id && (
                                <div className={styles.certificateModalMetaItem}>
                                    <FiAward size={16} />
                                    <span>Credential ID: <strong>{selectedCertificate.credential_id}</strong></span>
                                </div>
                            )}
                        </div>

                        {selectedCertificate.description && hasContent(selectedCertificate.description) && (
                            <div className={styles.modalDesc}>
                                <h3 className={styles.modalDescTitle}>Description</h3>
                                <RichTextRenderer
                                    html={selectedCertificate.description}
                                    mode="light"
                                    className={styles.description}
                                />
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            {selectedCertificate.certificate_url && (
                                <a
                                    href={selectedCertificate.certificate_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                >
                                    <FiExternalLink size={16} /> View Certificate
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Achievements Section */}
            {hasAchievements && (
                <section id="achievements" className={styles.achievementsSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionNumber}>07.</span> Achievements
                        </h2>
                        <div className={styles.achievementsList}>
                            {achievements.map((achievement) => (
                                <div key={achievement.profileachievement_id} className={styles.achievementItem}>
                                    <button
                                        className={styles.achievementToggle}
                                        onClick={() => toggleAchievement(achievement.profileachievement_id)}
                                    >
                                        <div className={styles.achievementHeader}>
                                            <FiAwardIcon size={20} className={styles.achievementItemIcon} />
                                            <span className={styles.achievementItemTitle}>{achievement.title}</span>
                                        </div>
                                        {expandedAchievements[achievement.profileachievement_id] ? (
                                            <FiMinus size={20} className={styles.achievementChevron} />
                                        ) : (
                                            <FiPlus size={20} className={styles.achievementChevron} />
                                        )}
                                    </button>
                                    {expandedAchievements[achievement.profileachievement_id] && (
                                        <div className={styles.achievementBody}>
                                            {achievement.description && hasContent(achievement.description) ? (
                                                <RichTextRenderer
                                                    html={achievement.description}
                                                    mode="light"
                                                    className={styles.description}
                                                />
                                            ) : (
                                                <p className={styles.achievementEmpty}>No description available</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Languages Section */}
            {hasLanguages && (
                <section id="languages" className={styles.languagesSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionNumber}>08.</span> Languages
                        </h2>
                        <div className={styles.languagesList}>
                            {languages.map((lang) => (
                                <div key={lang.profilelanguage_id} className={styles.languageItem}>
                                    {/* <span className={styles.languageEmoji}>{lang.icon || '🌐'}</span> */}
                                    <span className={styles.languageName}>{lang.language}</span>
                                    <span
                                        className={styles.languageProficiency}
                                        style={{ color: getProficiencyColor(lang.proficiency) }}
                                    >
                                        {getProficiencyLevel(lang.proficiency)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Strengths Section */}
            {hasStrengths && (
                <section id="strengths" className={styles.strengthsSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionNumber}>09.</span> Strengths
                        </h2>
                        <div className={styles.strengthsList}>
                            {strengths.map((strength) => (
                                <div key={strength.profilestrength_id} className={styles.strengthItem}>
                                    <FiStar size={16} className={styles.strengthItemIcon} />
                                    <span className={styles.strengthItemText}>{strength.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Hobbies Section */}
            {hasHobbies && (
                <section id="hobbies" className={styles.hobbiesSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionNumber}>10.</span> Hobbies
                        </h2>
                        <div className={styles.hobbiesList}>
                            {hobbies.map((hobby) => (
                                <div key={hobby.profilehobby_id} className={styles.hobbyItem}>
                                    <FiHeartIcon size={16} className={styles.hobbyItemIcon} />
                                    <span className={styles.hobbyItemText}>{hobby.hobby_name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Custom Sections - Main Section with Components */}
            {hasCustomSections && (
                <section id="custom-sections" className={styles.customMainSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>
                            <span className={styles.sectionNumber}>11.</span> More
                        </h2>
                        <div className={styles.customMainGrid}>
                            {custom_sections.map((section, index) => (
                                <div
                                    key={section.profilecustomsection_id}
                                    className={styles.customMainCard}
                                >
                                    <button
                                        className={styles.customMainToggle}
                                        onClick={() => toggleCustomSection(section.profilecustomsection_id)}
                                    >
                                        <div className={styles.customMainHeader}>
                                            <span className={styles.customMainIcon}>
                                                <FiFolder size={20} />
                                            </span>
                                            <span className={styles.customMainTitle}>
                                                {section.title || 'Custom Section'}
                                            </span>
                                        </div>
                                        {expandedCustomSections[section.profilecustomsection_id] ? (
                                            <FiChevronUp size={20} className={styles.customMainChevron} />
                                        ) : (
                                            <FiChevronDown size={20} className={styles.customMainChevron} />
                                        )}
                                    </button>
                                    {expandedCustomSections[section.profilecustomsection_id] && (
                                        <div className={styles.customMainBody}>
                                            {renderCustomSectionFields(section.content)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Project Modal */}
            {selectedProject && (
                <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setSelectedProject(null)}>
                            <FiX size={24} />
                        </button>

                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>{selectedProject.project_name}</h2>
                            {selectedProject.is_live && (
                                <span className={styles.modalLiveBadge}>
                                    <span className={styles.liveDot}></span>
                                    Live
                                </span>
                            )}
                        </div>

                        {(selectedProject.images && selectedProject.images.length > 0) || selectedProject.thumbnail ? (
                            <div className={styles.carouselContainer}>
                                {selectedProject.images && selectedProject.images.length > 0 ? (
                                    <div className={styles.carouselWrapper}>
                                        <img
                                            src={selectedProject.images[currentImageIndex]?.image}
                                            alt={`${selectedProject.project_name} - Image ${currentImageIndex + 1}`}
                                            className={styles.carouselImage}
                                        />
                                        {selectedProject.images.length > 1 && (
                                            <>
                                                <button
                                                    className={`${styles.carouselBtn} ${styles.carouselBtnLeft}`}
                                                    onClick={() => {
                                                        setIsAutoScrolling(false);
                                                        prevImage(selectedProject.images.length);
                                                    }}
                                                >
                                                    <FiChevronLeft size={24} />
                                                </button>
                                                <button
                                                    className={`${styles.carouselBtn} ${styles.carouselBtnRight}`}
                                                    onClick={() => {
                                                        setIsAutoScrolling(false);
                                                        nextImage(selectedProject.images.length);
                                                    }}
                                                >
                                                    <FiChevronRight size={24} />
                                                </button>
                                                <div className={styles.carouselDots}>
                                                    {selectedProject.images.map((_, idx) => (
                                                        <button
                                                            key={idx}
                                                            className={`${styles.carouselDot} ${idx === currentImageIndex ? styles.carouselDotActive : ''}`}
                                                            onClick={() => {
                                                                setIsAutoScrolling(false);
                                                                setCurrentImageIndex(idx);
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : selectedProject.thumbnail && (
                                    <img src={selectedProject.thumbnail} alt={selectedProject.project_name} className={styles.modalImage} />
                                )}
                            </div>
                        ) : null}

                        <div className={styles.modalTech}>
                            {selectedProject.skills?.map((skill, idx) => (
                                <span key={idx} className={styles.techBadge}>{skill.name}</span>
                            ))}
                        </div>

                        {selectedProject.short_description && hasContent(selectedProject.short_description) && (
                            <div className={styles.modalShortDesc}>
                                <h3 className={styles.modalDescTitle}>Overview</h3>
                                <RichTextRenderer
                                    html={selectedProject.short_description}
                                    mode="light"
                                    className={styles.description}
                                />
                            </div>
                        )}

                        {selectedProject.full_description && hasContent(selectedProject.full_description) && (
                            <div className={styles.modalDesc}>
                                <h3 className={styles.modalDescTitle}>Details</h3>
                                <RichTextRenderer
                                    html={selectedProject.full_description}
                                    mode="light"
                                    className={styles.description}
                                />
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            {selectedProject.code_url && (
                                <a href={selectedProject.code_url} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.btnOutline}`}>
                                    <FiGithub size={16} /> View Code
                                </a>
                            )}
                            {selectedProject.live_url && selectedProject.is_live && (
                                <a href={selectedProject.live_url} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.btnPrimary}`}>
                                    View Live App
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Social Icons - Desktop (Left Side) */}
            {socialIcons.length > 0 && (
                <div className={styles.socialFloating}>
                    {socialIcons.map((social, index) => {
                        const Icon = social.icon;
                        return (
                            <a
                                key={index}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                title={social.title}
                            >
                                <Icon size={18} />
                            </a>
                        );
                    })}
                    <div className={styles.socialLine} />
                </div>
            )}

            {/* Floating Email - Desktop (Right Side) */}
            {basic_info?.email && (
                <div className={styles.emailFloating}>
                    <a href={`mailto:${basic_info.email}`} className={styles.emailLink}>
                        {basic_info.email}
                    </a>
                    <div className={styles.emailLine} />
                </div>
            )}

            {/* Mobile Floating Social Icons */}
            <div className={styles.mobileSocialFloating}>
                {mobileSocialIcons.map((social, index) => {
                    const Icon = social.icon;
                    return (
                        <a
                            key={index}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.mobileSocialLink}
                            title={social.title}
                        >
                            <Icon size={20} />
                        </a>
                    );
                })}
            </div>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <p className={styles.footerName}>{basic_info?.first_name} {basic_info?.last_name}</p>
                    <p className={styles.footerCopyright}>
                        Copyright © {new Date().getFullYear()} {basic_info?.first_name} {basic_info?.last_name} | All Rights Reserved
                    </p>
                </div>
            </footer>
        </div>
    );
}