import styles from '@/styles/portfolio/template/ModernATS.module.css';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiGithub, FiTwitter, FiLinkedin, FiCalendar, FiExternalLink } from 'react-icons/fi';

export default function ModernATS({ data }) {
    const { resume, basic_info, social_links, skills, experiences, educations, projects, certificates, achievements, languages } = data;

    const getSocial = (platform) => social_links?.find(l => l.platform_name?.toLowerCase() === platform);
    const website = getSocial('website');
    const github = getSocial('github');
    const linkedin = getSocial('linkedin');
    const twitter = getSocial('twitter');

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    return (
        <div className={styles.page} style={{ '--primary': resume.primary_color, fontFamily: resume.font_family }}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <h1 className={styles.name}>{basic_info?.first_name} {basic_info?.last_name}</h1>
                    <p className={styles.title}>{resume.title}</p>
                    <div className={styles.contact}>
                        {basic_info?.email && <span><FiMail size={14} /> {basic_info.email}</span>}
                        {basic_info?.phone && <span><FiPhone size={14} /> {basic_info.phone}</span>}
                        {basic_info?.full_address && <span><FiMapPin size={14} /> {basic_info.full_address}</span>}
                        {website && <span><FiGlobe size={14} /> {website.url}</span>}
                        {github && <span><FiGithub size={14} /> {github.url}</span>}
                        {linkedin && <span><FiLinkedin size={14} /> {linkedin.url}</span>}
                    </div>
                </header>

                {/* Summary */}
                {basic_info?.summary && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Professional Summary</h2>
                        <p className={styles.summary}>{basic_info.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experiences?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Work Experience</h2>
                        {experiences.map((exp) => (
                            <div key={exp.profileexperience_id} className={styles.expItem}>
                                <div className={styles.expHeader}>
                                    <h3 className={styles.expRole}>{exp.role}</h3>
                                    <span className={styles.expDate}>
                                        <FiCalendar size={12} /> {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                    </span>
                                </div>
                                <p className={styles.expCompany}>{exp.company_name} · {exp.employment_type}</p>
                                {exp.description && <p className={styles.expDesc}>{exp.description}</p>}
                            </div>
                        ))}
                    </section>
                )}

                {/* Education */}
                {educations?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Education</h2>
                        {educations.map((edu) => (
                            <div key={edu.profileeducation_id} className={styles.eduItem}>
                                <div className={styles.expHeader}>
                                    <h3 className={styles.eduDegree}>{edu.degree_name}</h3>
                                    <span className={styles.expDate}>
                                        <FiCalendar size={12} /> {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                                    </span>
                                </div>
                                <p className={styles.eduSchool}>{edu.institution_name}</p>
                                {edu.score && <p className={styles.eduScore}>Score: {edu.score}</p>}
                            </div>
                        ))}
                    </section>
                )}

                {/* Projects */}
                {projects?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Projects</h2>
                        {projects.map((project) => (
                            <div key={project.profileproject_id} className={styles.projectItem}>
                                <h3 className={styles.projectName}>{project.project_name}</h3>
                                <p className={styles.projectDesc}>{project.short_description}</p>
                                {project.skills?.length > 0 && (
                                    <div className={styles.techTags}>
                                        {project.skills.map(skill => (
                                            <span key={skill.slug} className={styles.techTag}>{skill.name}</span>
                                        ))}
                                    </div>
                                )}
                                <div className={styles.projectLinks}>
                                    {project.code_url && <a href={project.code_url} target="_blank" rel="noopener"><FiGithub size={12} /> Code</a>}
                                    {project.live_url && <a href={project.live_url} target="_blank" rel="noopener"><FiExternalLink size={12} /> Live Demo</a>}
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills */}
                {skills?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Technical Skills</h2>
                        <div className={styles.skillsGrid}>
                            {skills.map((skill) => (
                                <div key={skill.profileskill_id} className={styles.skillItem}>
                                    {skill.image && <img src={skill.image} alt="" className={styles.skillIcon} />}
                                    <span className={styles.skillName}>{skill.name}</span>
                                    <div className={styles.skillDots}>
                                        {[1, 2, 3, 4, 5].map(lvl => (
                                            <span key={lvl} className={`${styles.dot} ${lvl <= skill.level ? styles.active : ''}`} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certificates */}
                {certificates?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Certifications</h2>
                        <div className={styles.certGrid}>
                            {certificates.map((cert) => (
                                <div key={cert.profilecertificate_id} className={styles.certItem}>
                                    <h4>{cert.title}</h4>
                                    <p>{cert.issued_by} · {formatDate(cert.issued_date)}</p>
                                    {cert.certificate_url && (
                                        <a href={cert.certificate_url} target="_blank" rel="noopener">Verify ↗</a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages */}
                {languages?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Languages</h2>
                        <div className={styles.langList}>
                            {languages.map((lang) => (
                                <span key={lang.profilelanguage_id} className={styles.langItem}>
                                    {lang.language} — {lang.proficiency}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Achievements */}
                {achievements?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Achievements</h2>
                        <ul className={styles.achieveList}>
                            {achievements.map((ach) => (
                                <li key={ach.profileachievement_id}>
                                    <strong>{ach.title}</strong>
                                    {ach.description && <p>{ach.description}</p>}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
}