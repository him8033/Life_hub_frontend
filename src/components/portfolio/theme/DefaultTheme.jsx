// src/components/portfolio/theme/DefaultTheme.jsx

'use client';

import styles from '@/styles/portfolio/theme/DefaultTheme.module.css';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiGithub, FiLinkedin, FiExternalLink } from 'react-icons/fi';

export default function DefaultTheme({ data }) {
    const { portfolio, basic_info, skills, experiences, projects } = data;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>{portfolio?.title || 'Portfolio'}</h1>
                <p className={styles.subtitle}>{basic_info?.title || 'Full Stack Developer'}</p>

                {basic_info && (
                    <div className={styles.info}>
                        <p><strong>{basic_info.first_name} {basic_info.last_name}</strong></p>
                        {basic_info.summary && <p>{basic_info.summary}</p>}
                        <div className={styles.contact}>
                            {basic_info.email && <span><FiMail size={14} /> {basic_info.email}</span>}
                            {basic_info.phone && <span><FiPhone size={14} /> {basic_info.phone}</span>}
                            {basic_info.full_address && <span><FiMapPin size={14} /> {basic_info.full_address}</span>}
                            {basic_info.website && <span><FiGlobe size={14} /> {basic_info.website}</span>}
                        </div>
                    </div>
                )}

                {/* About Section */}
                {basic_info?.summary && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>About</h2>
                        <div className={styles.sectionContent} dangerouslySetInnerHTML={{ __html: basic_info.summary }} />
                    </div>
                )}

                {/* Skills Section */}
                {skills?.length > 0 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Skills</h2>
                        <div className={styles.sectionContent}>
                            {skills.map((skill) => (
                                <span key={skill.profileskill_id} className={styles.skillTag}>
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Experience Section */}
                {experiences?.length > 0 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Experience</h2>
                        <div className={styles.sectionContent}>
                            {experiences.map((exp) => (
                                <div key={exp.profileexperience_id} className={styles.card}>
                                    <h3 className={styles.cardTitle}>{exp.role}</h3>
                                    <p className={styles.cardSubtitle}>{exp.company_name}</p>
                                    {exp.description && (
                                        <div className={styles.cardDescription} dangerouslySetInnerHTML={{ __html: exp.description }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Section */}
                {projects?.length > 0 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Projects</h2>
                        <div className={styles.sectionContent}>
                            {projects.map((project) => (
                                <div key={project.profileproject_id} className={styles.card}>
                                    <h3 className={styles.cardTitle}>{project.project_name}</h3>
                                    {project.short_description && (
                                        <div className={styles.cardDescription} dangerouslySetInnerHTML={{ __html: project.short_description }} />
                                    )}
                                    <div className={styles.contact}>
                                        {project.live_url && (
                                            <span><FiExternalLink size={12} /> <a href={project.live_url} target="_blank" rel="noopener" style={{ color: '#86efac', textDecoration: 'none' }}>Live Demo</a></span>
                                        )}
                                        {project.code_url && (
                                            <span><FiGithub size={12} /> <a href={project.code_url} target="_blank" rel="noopener" style={{ color: '#86efac', textDecoration: 'none' }}>Code</a></span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <p className={styles.fallback}>Default Portfolio Theme</p>
            </div>
        </div>
    );
}