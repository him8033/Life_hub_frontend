// ModernATS.jsx
import styles from '@/styles/portfolio/template/ModernATS.module.css';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiGithub, FiLinkedin } from 'react-icons/fi';

export default function ModernATS({ data }) {
    const { resume, basic_info, social_links, skills, experiences, educations, projects, strengths } = data;

    const getSocial = (platform) => social_links?.find(l => l.platform_name?.toLowerCase() === platform);
    const website = getSocial('website');
    const github = getSocial('github');
    const linkedin = getSocial('linkedin');

    // Clean URL - remove http:// or https://
    const cleanUrl = (url) => {
        if (!url) return '';
        return url.replace(/^https?:\/\//, '');
    };

    // Format date as MM/YYYY
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date + 'T00:00:00');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${month}/${year}`;
    };

    // Group skills by category
    const groupSkillsByCategory = () => {
        const grouped = {};
        skills?.forEach(skill => {
            const category = skill.category || 'Other';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(skill.name);
        });
        return grouped;
    };

    const groupedSkills = groupSkillsByCategory();

    return (
        <div className={styles.page} style={{ '--primary': resume?.primary_color || '#D97706' }}>
            <div className={styles.container}>
                {/* Header - Name centered */}
                <header className={styles.header}>
                    <h1 className={styles.name}>
                        {basic_info?.first_name || ''} {basic_info?.last_name || ''}
                    </h1>

                    {/* Contact - Line 2: Phone | Email | Address */}
                    <div className={styles.contactLine}>
                        {basic_info?.phone && <span>{basic_info.phone}</span>}
                        {basic_info?.email && <span>{basic_info.email}</span>}
                        {basic_info?.full_address && <span>{basic_info.full_address}</span>}
                    </div>

                    {/* Social Links - Line 3: LinkedIn | GitHub | Website */}
                    <div className={styles.socialLine}>
                        {linkedin && <span>{cleanUrl(linkedin.url)}</span>}
                        {github && <span>{cleanUrl(github.url)}</span>}
                        {website && <span>{cleanUrl(website.url)}</span>}
                    </div>
                </header>

                {/* Summary */}
                {basic_info?.summary && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>SUMMARY</h2>
                        <p className={styles.summary}>{basic_info.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experiences?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
                        {experiences.map((exp) => (
                            <div key={exp.profileexperience_id} className={styles.expItem}>
                                <h3 className={styles.expRole}>{exp.role}</h3>
                                <div className={styles.expCompanyLine}>
                                    <span className={styles.expCompany}>
                                        {exp.company_name} {exp.location && `| ${exp.location}`}
                                    </span>
                                    <span className={styles.expDate}>
                                        {formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                    </span>
                                </div>
                                {exp.description && (
                                    <div className={styles.expDescWrapper}>
                                        {exp.description.split('\n').map((line, idx) => (
                                            line.trim() && <p key={idx} className={styles.expDesc}>- {line.trim()}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Production Project Experience */}
                {projects?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>PRODUCTION PROJECT EXPERIENCE</h2>
                        {projects.map((project) => (
                            <div key={project.profileproject_id} className={styles.projectItem}>
                                <h3 className={styles.projectName}>{project.project_name}</h3>
                                {/* {project.short_description && (
                                    <p className={styles.projectDesc}>{project.short_description}</p>
                                )} */}
                                {project.full_description && (
                                    <div className={styles.projectDescWrapper}>
                                        {project.full_description.split('\n').map((line, idx) => (
                                            line.trim() && <p key={idx} className={styles.projectDesc}>- {line.trim()}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills - Categorized */}
                {skills?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>SKILLS</h2>
                        <div className={styles.skillsContainer}>
                            {Object.entries(groupedSkills).map(([category, skillNames]) => (
                                <div key={category} className={styles.skillCategory}>
                                    <span className={styles.skillCategoryName}>{category}:</span>
                                    <span className={styles.skillList}>
                                        {skillNames.join(', ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {educations?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>EDUCATION</h2>
                        {educations.map((edu) => (
                            <div key={edu.profileeducation_id} className={styles.eduItem}>
                                <div className={styles.eduHeader}>
                                    <h3 className={styles.eduDegree}>{edu.degree_name}</h3>
                                    <span className={styles.eduMeta}>
                                        {edu.score && <span className={styles.eduScore}>Score: {edu.score}</span>}
                                        {edu.start_date && (
                                            <span className={styles.eduDateText}>
                                                {formatDate(edu.start_date)} – {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <p className={styles.eduInstitution}>
                                    {edu.institution_name} {edu.location && `| ${edu.location}`}
                                </p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Strengths - 2 per row */}
                {strengths?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>STRENGTHS</h2>
                        <div className={styles.strengthGrid}>
                            {strengths.map((strength) => (
                                <div key={strength.profilestrength_id} className={styles.strengthItem}>
                                    <span className={styles.strengthBullet}>-</span>
                                    <span>{strength.title}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}