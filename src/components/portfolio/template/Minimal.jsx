import styles from '@/styles/portfolio/template/Minimal.module.css';
import RichTextRenderer from '@/components/common/RichTextRenderer';
import { FiMail, FiPhone, FiMapPin, FiCalendar, FiExternalLink, FiGithub } from 'react-icons/fi';

export default function Minimal({ data }) {
    const { resume, basic_info, social_links, skills, experiences, educations, projects } = data;

    const getSocial = (platform) => social_links?.find(l => l.platform_name?.toLowerCase() === platform);
    const github = getSocial('github');

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    // Helper to check if content has meaningful text
    const hasContent = (html) => {
        if (!html) return false;
        const cleaned = html.replace(/<p>\s*<\/p>/g, '').trim();
        return cleaned.length > 0;
    };

    return (
        <div className={styles.page} style={{ '--primary': resume.primary_color, fontFamily: resume.font_family }}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.name}>{basic_info?.first_name} {basic_info?.last_name}</h1>
                    <p className={styles.title}>{resume.title}</p>
                    <div className={styles.contact}>
                        {basic_info?.email && <span><FiMail size={13} /> {basic_info.email}</span>}
                        {basic_info?.phone && <span><FiPhone size={13} /> {basic_info.phone}</span>}
                        {basic_info?.full_address && <span><FiMapPin size={13} /> {basic_info.full_address}</span>}
                        {github && <span><FiGithub size={13} /> {github.url}</span>}
                    </div>
                </header>

                {/* Summary */}
                {basic_info?.summary && hasContent(basic_info.summary) && (
                    <section className={styles.section}>
                        <RichTextRenderer
                            html={basic_info.summary}
                            mode="light"
                            className={styles.summary}
                        />
                    </section>
                )}

                {/* Experience */}
                {experiences?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Experience</h2>
                        <div className={styles.timeline}>
                            {experiences.map((exp) => (
                                <div key={exp.profileexperience_id} className={styles.timelineItem}>
                                    <div className={styles.timelineDot} />
                                    <div className={styles.timelineContent}>
                                        <h3>{exp.role} <span className={styles.at}>at</span> {exp.company_name}</h3>
                                        <span className={styles.date}>
                                            <FiCalendar size={11} /> {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                        </span>
                                        {exp.description && hasContent(exp.description) && (
                                            <RichTextRenderer
                                                html={exp.description}
                                                mode="light"
                                                className={styles.description}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {educations?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Education</h2>
                        {educations.map((edu) => (
                            <div key={edu.profileeducation_id} className={styles.eduItem}>
                                <h3>{edu.degree_name}</h3>
                                <p>{edu.institution_name} · {formatDate(edu.start_date)} — {edu.is_current ? 'Present' : formatDate(edu.end_date)}</p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills */}
                {skills?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Skills</h2>
                        <div className={styles.skillTags}>
                            {skills.map((skill) => (
                                <span key={skill.profileskill_id} className={styles.skillTag}>{skill.name}</span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Projects</h2>
                        {projects.map((project) => {
                            const descHtml = project.short_description || project.full_description;
                            return (
                                <div key={project.profileproject_id} className={styles.projectItem}>
                                    <h3>{project.project_name}</h3>
                                    {descHtml && hasContent(descHtml) && (
                                        <RichTextRenderer
                                            html={descHtml}
                                            mode="light"
                                            className={styles.description}
                                        />
                                    )}
                                    {project.live_url && (
                                        <a href={project.live_url} target="_blank" rel="noopener">
                                            <FiExternalLink size={12} /> View Project
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </section>
                )}
            </div>
        </div>
    );
}