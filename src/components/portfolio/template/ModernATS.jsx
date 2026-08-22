// ModernATS.jsx - Updated with RichTextRenderer
import styles from '@/styles/portfolio/template/ModernATS.module.css';
import RichTextRenderer from '@/components/common/RichTextRenderer';

export default function ModernATS({ data }) {
    const { resume, basic_info, social_links, skills, experiences, educations, projects, strengths, certificates, achievements, hobbies, languages, custom_sections } = data;

    // Clean URL - remove http:// or https://
    const cleanUrl = (url) => {
        if (!url) return '';
        return url.replace(/^https?:\/\//, '');
    };

    // Sort social links by position
    const sortedSocialLinks = [...(social_links || [])].sort((a, b) => (a.position || 0) - (b.position || 0));

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

    // Helper to check if content has meaningful text
    const hasContent = (html) => {
        if (!html) return false;
        const cleaned = html.replace(/<p>\s*<\/p>/g, '').trim();
        return cleaned.length > 0;
    };

    return (
        <div className={styles.page} style={{ '--primary': resume?.primary_color || '#D97706' }}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.name}>
                        {basic_info?.first_name || ''} {basic_info?.last_name || ''}
                    </h1>

                    <div className={styles.contactLine}>
                        {basic_info?.phone && <span>{basic_info.phone}</span>}
                        {basic_info?.email && <span>{basic_info.email}</span>}
                        {basic_info?.full_address && <span>{basic_info.full_address}</span>}
                    </div>

                    <div className={styles.socialLine}>
                        {sortedSocialLinks.map((social) => (
                            social.url && (
                                <span key={social.profilesociallink_id}>
                                    {cleanUrl(social.url)}
                                </span>
                            )
                        ))}
                    </div>
                </header>

                {/* Summary - Light mode only */}
                {basic_info?.summary && hasContent(basic_info.summary) && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>SUMMARY</h2>
                        <RichTextRenderer
                            html={basic_info.summary}
                            mode="light"
                            className={styles.summaryContent}
                        />
                    </section>
                )}

                {/* Experience - Light mode only */}
                {experiences?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
                        {experiences.map((exp) => (
                            <div key={exp.profileexperience_id} className={styles.expItem}>
                                <h3 className={styles.expRole}>{exp.role}</h3>
                                <div className={styles.expCompanyLine}>
                                    <span className={styles.expCompany}>
                                        {exp.company_name} {exp.full_address && `| ${exp.full_address}`}
                                    </span>
                                    <span className={styles.expDate}>
                                        {formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                    </span>
                                </div>
                                {exp.description && hasContent(exp.description) && (
                                    <RichTextRenderer
                                        html={exp.description}
                                        mode="light"
                                        className={styles.expDescription}
                                    />
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Projects - Light mode only */}
                {projects?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>PRODUCTION PROJECT EXPERIENCE</h2>
                        {projects.map((project) => {
                            const descHtml = project.short_description || project.full_description;
                            return (
                                <div key={project.profileproject_id} className={styles.projectItem}>
                                    <h3 className={styles.projectName}>{project.project_name}</h3>
                                    {descHtml && hasContent(descHtml) && (
                                        <RichTextRenderer
                                            html={descHtml}
                                            mode="light"
                                            className={styles.projectDescription}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </section>
                )}

                {/* Skills */}
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

                {/* Education - Light mode only */}
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
                                    {edu.institution_name} {edu.full_address && `| ${edu.full_address}`}
                                </p>
                                {edu.description && hasContent(edu.description) && (
                                    <RichTextRenderer
                                        html={edu.description}
                                        mode="light"
                                        className={styles.eduDescription}
                                    />
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Certificates - Light mode only */}
                {certificates?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>CERTIFICATES</h2>
                        {certificates.map((cert) => (
                            <div key={cert.profilecertificate_id} className={styles.certItem}>
                                <div className={styles.certHeader}>
                                    <h3 className={styles.certTitle}>{cert.title}</h3>
                                    <span className={styles.certMeta}>
                                        {cert.issued_by && <span>{cert.issued_by}</span>}
                                        {cert.issued_date && (
                                            <span>{formatDate(cert.issued_date)}</span>
                                        )}
                                    </span>
                                </div>
                                {cert.description && hasContent(cert.description) && (
                                    <RichTextRenderer
                                        html={cert.description}
                                        mode="light"
                                        className={styles.certDescription}
                                    />
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Achievements - Light mode only */}
                {achievements?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>ACHIEVEMENTS</h2>
                        {achievements.map((ach) => (
                            <div key={ach.profileachievement_id} className={styles.achItem}>
                                <h3 className={styles.achTitle}>{ach.title}</h3>
                                {ach.description && hasContent(ach.description) && (
                                    <RichTextRenderer
                                        html={ach.description}
                                        mode="light"
                                        className={styles.achDescription}
                                    />
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* Strengths */}
                {strengths?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>STRENGTHS</h2>
                        <div className={styles.gridContainer}>
                            {strengths.map((strength) => (
                                <div key={strength.profilestrength_id} className={styles.gridItem}>
                                    <span className={styles.bullet}>•</span>
                                    <span>{strength.title}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Hobbies */}
                {hobbies?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>HOBBIES</h2>
                        <div className={styles.gridContainer}>
                            {hobbies.map((hobby) => (
                                <div key={hobby.profilehobby_id} className={styles.gridItem}>
                                    <span className={styles.bullet}>•</span>
                                    <span>{hobby.hobby_name}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages */}
                {languages?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>LANGUAGES</h2>
                        <div className={styles.gridContainer}>
                            {languages.map((lang) => (
                                <div key={lang.profilelanguage_id} className={styles.gridItem}>
                                    <span className={styles.bullet}>•</span>
                                    <span>
                                        <span className={styles.languageName}>{lang.language}</span>
                                        <span className={styles.languageProficiency}> — {lang.proficiency}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Custom Sections */}
                {custom_sections?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>ADDITIONAL INFORMATION</h2>
                        {custom_sections.map((section) => (
                            <div key={section.profilecustomsection_id} className={styles.customSectionItem}>
                                <h3 className={styles.customSectionTitle}>{section.title}</h3>
                                {section.content && (
                                    <div className={styles.customSectionContent}>
                                        {typeof section.content === 'object' ? (
                                            <pre className={styles.jsonContent}>
                                                {JSON.stringify(section.content, null, 2)}
                                            </pre>
                                        ) : (
                                            <span>{String(section.content)}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
}