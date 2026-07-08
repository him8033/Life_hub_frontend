// src/components/portfolio/theme/PortfolioTheme.jsx

'use client';

import { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import styles from '@/styles/portfolio/theme/PortfolioTheme.module.css';
import {
    FiMail, FiPhone, FiMapPin, FiGlobe, FiGithub, FiLinkedin,
    FiTwitter, FiCalendar, FiExternalLink, FiAward, FiCode,
    FiBriefcase, FiBook, FiFolder, FiStar, FiHeart, FiShield,
    FiDownload, FiMenu, FiX, FiArrowRight
} from 'react-icons/fi';
import { FaGithub as FaGithubIcon, FaLinkedin as FaLinkedinIcon, FaInstagram, FaEnvelope } from 'react-icons/fa';

export default function PortfolioTheme({ data, showNavigation = true }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const { portfolio, basic_info, social_links, skills, experiences, educations, projects, certificates, achievements, languages, strengths, hobbies } = data;

    // Helper to get social links
    const getSocial = (platform) => social_links?.find(l => l.platform_name?.toLowerCase() === platform);
    const website = getSocial('website');
    const github = getSocial('github');
    const linkedin = getSocial('linkedin');
    const twitter = getSocial('twitter');

    // Format date
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    // Navigation links
    const navLinks = [
        { id: 'about', label: 'About' },
        { id: 'projects', label: 'Projects' },
        { id: 'skills', label: 'Skills' },
        { id: 'experience', label: 'Experience' },
    ];

    // Check if data exists for sections
    const hasProjects = projects && projects.length > 0;
    const hasSkills = skills && skills.length > 0;
    const hasExperience = experiences && experiences.length > 0;

    // Get stack/roles from various sources
    const getStack = () => {
        const roles = [];
        if (portfolio?.hero_title) roles.push(portfolio.hero_title);
        if (portfolio?.target_role) roles.push(portfolio.target_role);
        if (basic_info?.summary) {
            const summary = basic_info.summary;
            // Extract key roles from summary
            const roleMatches = summary.match(/(Full Stack Developer|Software Engineer|Backend Developer|Frontend Developer|DevOps|Freelancer)/gi);
            if (roleMatches) roles.push(...roleMatches);
        }
        // If no roles found, use defaults
        if (roles.length === 0) {
            roles.push('Full Stack Developer', 'Software Engineer');
        }
        return [...new Set(roles)]; // Remove duplicates
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

    const socialIcons = [
        { link: github?.url || 'https://github.com', icon: FaGithubIcon, title: 'GitHub' },
        { link: linkedin?.url || 'https://linkedin.com', icon: FaLinkedinIcon, title: 'LinkedIn' },
        { link: twitter?.url || 'https://twitter.com', icon: FiTwitter, title: 'Twitter' },
        { link: website?.url || '#', icon: FiGlobe, title: 'Website' },
    ];

    return (
        <div className={styles.page}>
            {/* Header */}
            {showNavigation && (
                <header className={styles.header}>
                    <div className={styles.headerContainer}>
                        <div className={styles.logo}>
                            <span className={styles.logoIcon}>H</span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className={styles.desktopNav}>
                            {navLinks.map((link, index) => (
                                <a key={link.id} href={`#${link.id}`} className={styles.navLink}>
                                    <span className={styles.navNumber}>0{index + 1}.</span> {link.label}
                                </a>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className={styles.menuBtn}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <nav className={styles.mobileNav}>
                            {navLinks.map((link, index) => (
                                <a
                                    key={link.id}
                                    href={`#${link.id}`}
                                    className={styles.mobileNavLink}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className={styles.navNumber}>0{index + 1}.</span> {link.label}
                                </a>
                            ))}
                        </nav>
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
                            <p className={styles.bio}>
                                {basic_info?.summary || portfolio?.hero_subtitle || ''}
                            </p>
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
                                                <span className={styles.liveBadgeSmall}>● Live</span>
                                            )}
                                        </div>
                                        <div className={styles.projectTech}>
                                            {project.skills?.slice(0, 3).map((skill, idx) => (
                                                <span key={idx} className={styles.techBadge}>{skill.name}</span>
                                            ))}
                                        </div>
                                        <p className={styles.projectDesc}>
                                            {project.short_description}
                                        </p>
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
                                                {skill.image && (
                                                    <img src={skill.image} alt={skill.name} className={styles.skillIcon} />
                                                )}
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
                            {experiences.map((exp) => (
                                <div key={exp.profileexperience_id} className={styles.timelineItem}>
                                    <div className={styles.timelineBullet}>
                                        <FiBriefcase size={16} />
                                    </div>
                                    <div className={styles.timelineContent}>
                                        <div className={styles.expHeader}>
                                            <div className={styles.expHeaderLeft}>
                                                {exp.company_logo && (
                                                    <img src={exp.company_logo} alt={exp.company_name} className={styles.companyLogo} />
                                                )}
                                                <div>
                                                    <h3 className={styles.expRole}>{exp.role}</h3>
                                                    <p className={styles.expCompany}>
                                                        {exp.company_name} • {exp.employment_type}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={styles.expDate}>
                                                <FiCalendar size={12} /> {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <p className={styles.expDesc}>{exp.description}</p>
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
                        {selectedProject.thumbnail && (
                            <img src={selectedProject.thumbnail} alt={selectedProject.project_name} className={styles.modalImage} />
                        )}
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>{selectedProject.project_name}</h2>
                            {selectedProject.is_live && (
                                <span className={styles.liveBadge}>● Live</span>
                            )}
                        </div>
                        <div className={styles.modalTech}>
                            {selectedProject.skills?.map((skill, idx) => (
                                <span key={idx} className={styles.techBadge}>{skill.name}</span>
                            ))}
                        </div>
                        <p className={styles.modalDesc}>{selectedProject.full_description || selectedProject.short_description}</p>
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

            {/* Floating Social Icons - Desktop */}
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
                            <Icon size={20} />
                        </a>
                    );
                })}
                <div className={styles.socialLine} />
            </div>

            {/* Floating Email - Desktop */}
            {basic_info?.email && (
                <div className={styles.emailFloating}>
                    <a href={`mailto:${basic_info.email}`} className={styles.emailLink}>
                        {basic_info.email}
                    </a>
                    <div className={styles.emailLine} />
                </div>
            )}

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