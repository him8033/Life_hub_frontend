// src/components/portfolio/theme/TestTheme.jsx

'use client';

import styles from '@/styles/portfolio/theme/TestTheme.module.css';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiGithub, FiLinkedin, FiTwitter, FiCalendar, FiExternalLink, FiAward, FiCode, FiBriefcase, FiBook, FiFolder, FiStar, FiHeart, FiShield } from 'react-icons/fi';

export default function TestTheme({ data }) {
    const { portfolio, basic_info, social_links, skills, experiences, educations, projects, certificates, achievements, languages, strengths, hobbies } = data;

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
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Hero Section */}
                <header className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.name}>{basic_info?.first_name} {basic_info?.last_name}</h1>
                        <p className={styles.title}>{portfolio?.hero_title || portfolio?.target_role || 'Developer'}</p>
                        <p className={styles.subtitle}>{portfolio?.hero_subtitle || portfolio?.description || ''}</p>
                        <div className={styles.contact}>
                            {basic_info?.email && <span><FiMail size={14} /> {basic_info.email}</span>}
                            {basic_info?.phone && <span><FiPhone size={14} /> {basic_info.phone}</span>}
                            {basic_info?.full_address && <span><FiMapPin size={14} /> {basic_info.full_address}</span>}
                            {website && <span><FiGlobe size={14} /> {website.url}</span>}
                            {github && <span><FiGithub size={14} /> {github.url}</span>}
                            {linkedin && <span><FiLinkedin size={14} /> {linkedin.url}</span>}
                            {twitter && <span><FiTwitter size={14} /> {twitter.url}</span>}
                        </div>
                    </div>
                    {basic_info?.image && (
                        <div className={styles.avatarWrapper}>
                            <img src={basic_info.image} alt={`${basic_info.first_name} ${basic_info.last_name}`} className={styles.avatar} />
                        </div>
                    )}
                </header>

                {/* Summary */}
                {basic_info?.summary && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>About Me</h2>
                        <p className={styles.summary}>{basic_info.summary}</p>
                    </section>
                )}

                {/* Skills */}
                {skills?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}><FiCode /> Skills</h2>
                        <div className={styles.skillsGrid}>
                            {skills.map((skill) => (
                                <div key={skill.profileskill_id} className={styles.skillCard}>
                                    {skill.image && <img src={skill.image} alt={skill.name} className={styles.skillIcon} />}
                                    <span className={styles.skillName}>{skill.name}</span>
                                    <span className={styles.skillLevel}>{skill.level}/5</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experiences?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}><FiBriefcase /> Experience</h2>
                        {experiences.map((exp) => (
                            <div key={exp.profileexperience_id} className={styles.expItem}>
                                <div className={styles.expHeader}>
                                    <div>
                                        <h3 className={styles.expRole}>{exp.role}</h3>
                                        <p className={styles.expCompany}>{exp.company_name} · {exp.employment_type}</p>
                                    </div>
                                    <span className={styles.expDate}>
                                        <FiCalendar size={12} /> {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                    </span>
                                </div>
                                {exp.description && <p className={styles.expDesc}>{exp.description}</p>}
                                {exp.company_logo && <img src={exp.company_logo} alt={exp.company_name} className={styles.companyLogo} />}
                            </div>
                        ))}
                    </section>
                )}

                {/* Projects */}
                {projects?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}><FiFolder /> Projects</h2>
                        <div className={styles.projectsGrid}>
                            {projects.map((project) => (
                                <div key={project.profileproject_id} className={styles.projectCard}>
                                    {project.thumbnail && (
                                        <img src={project.thumbnail} alt={project.project_name} className={styles.projectThumb} />
                                    )}
                                    <div className={styles.projectContent}>
                                        <h3 className={styles.projectName}>{project.project_name}</h3>
                                        <p className={styles.projectDesc}>{project.short_description}</p>
                                        {project.skills?.length > 0 && (
                                            <div className={styles.techTags}>
                                                {project.skills.map((skill, idx) => (
                                                    <span key={idx} className={styles.techTag}>{skill.name}</span>
                                                ))}
                                            </div>
                                        )}
                                        <div className={styles.projectLinks}>
                                            {project.code_url && <a href={project.code_url} target="_blank" rel="noopener noreferrer"><FiGithub size={12} /> Code</a>}
                                            {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer"><FiExternalLink size={12} /> Live</a>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {educations?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}><FiBook /> Education</h2>
                        {educations.map((edu) => (
                            <div key={edu.profileeducation_id} className={styles.eduItem}>
                                <div className={styles.expHeader}>
                                    <div>
                                        <h3 className={styles.eduDegree}>{edu.degree_name}</h3>
                                        <p className={styles.eduSchool}>{edu.institution_name}</p>
                                    </div>
                                    <span className={styles.expDate}>
                                        <FiCalendar size={12} /> {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                                    </span>
                                </div>
                                {edu.score && <p className={styles.eduScore}>Score: {edu.score}</p>}
                                {edu.description && <p className={styles.eduDesc}>{edu.description}</p>}
                            </div>
                        ))}
                    </section>
                )}

                {/* Certificates */}
                {certificates?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}><FiAward /> Certifications</h2>
                        <div className={styles.certGrid}>
                            {certificates.map((cert) => (
                                <div key={cert.profilecertificate_id} className={styles.certItem}>
                                    {cert.image && <img src={cert.image} alt={cert.title} className={styles.certImage} />}
                                    <div>
                                        <h4>{cert.title}</h4>
                                        <p>{cert.issued_by} · {formatDate(cert.issued_date)}</p>
                                        {cert.certificate_url && (
                                            <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">Verify ↗</a>
                                        )}
                                    </div>
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
                        <h2 className={styles.sectionTitle}><FiStar /> Achievements</h2>
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

                {/* Strengths */}
                {strengths?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}><FiShield /> Strengths</h2>
                        <ul className={styles.strengthList}>
                            {strengths.map((strength) => (
                                <li key={strength.profilestrength_id}>
                                    <strong>{strength.title}</strong>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Hobbies */}
                {hobbies?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}><FiHeart /> Hobbies</h2>
                        <div className={styles.hobbyList}>
                            {hobbies.map((hobby) => (
                                <span key={hobby.profilehobby_id} className={styles.hobbyItem}>
                                    {hobby.hobby_name}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}