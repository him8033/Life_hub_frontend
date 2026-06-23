'use client';

import { useParams } from 'next/navigation';
import { useGetPublicResumeQuery } from '@/services/api/portfolioApi';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import styles from '@/styles/portfolio/resume/ResumePreview.module.css';
import {
    FiMail, FiPhone, FiMapPin, FiGlobe, FiGithub, FiTwitter, FiLinkedin,
    FiCalendar, FiAward, FiStar, FiExternalLink, FiCode, FiFolder
} from 'react-icons/fi';

export default function PublicResumePage() {
    const params = useParams();
    const slug = params.slug;

    const { data, isLoading, error } = useGetPublicResumeQuery(slug, { skip: !slug });
    const resumeData = data?.data;

    if (isLoading) return <Loader text="Loading resume..." />;
    if (error?.status === 404) return <NotFoundState title="Resume Not Found" message="This resume doesn't exist or is private." fullPage />;
    if (error) return <ErrorState message="Failed to load resume" />;
    if (!resumeData) return <NotFoundState title="Resume Not Found" fullPage />;

    const { resume, basic_info, social_links, skills, experiences, educations, projects, certificates, achievements, languages, hobbies, strengths, custom_sections } = resumeData;

    // Social links by platform
    const getSocialLink = (platform) => social_links?.find(l => l.platform_name?.toLowerCase() === platform);

    const website = getSocialLink('website');
    const github = getSocialLink('github');
    const linkedin = getSocialLink('linkedin');
    const twitter = getSocialLink('twitter');

    return (
        <div className={styles.page} style={{ '--primary-color': resume.primary_color }}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        {basic_info?.image && (
                            <img src={basic_info.image} alt={basic_info.first_name} className={styles.avatar} />
                        )}
                        <div>
                            <h1 className={styles.name}>
                                {basic_info?.first_name} {basic_info?.last_name}
                            </h1>
                            <p className={styles.title}>{resume.title}</p>
                            <div className={styles.contact}>
                                {basic_info?.email && <span><FiMail size={14} /> {basic_info.email}</span>}
                                {basic_info?.phone && <span><FiPhone size={14} /> {basic_info.phone}</span>}
                                {basic_info?.full_address && <span><FiMapPin size={14} /> {basic_info.full_address}</span>}
                            </div>
                            <div className={styles.socialLinks}>
                                {website && <a href={website.url} target="_blank" rel="noopener"><FiGlobe size={14} /> Website</a>}
                                {github && <a href={github.url} target="_blank" rel="noopener"><FiGithub size={14} /> GitHub</a>}
                                {linkedin && <a href={linkedin.url} target="_blank" rel="noopener"><FiLinkedin size={14} /> LinkedIn</a>}
                                {twitter && <a href={twitter.url} target="_blank" rel="noopener"><FiTwitter size={14} /> Twitter</a>}
                            </div>
                        </div>
                    </div>
                </header>

                <div className={styles.body}>
                    {/* Main Column */}
                    <div className={styles.main}>
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
                                <h2 className={styles.sectionTitle}>Experience</h2>
                                <div className={styles.timeline}>
                                    {experiences.map((exp) => (
                                        <div key={exp.profileexperience_id} className={styles.timelineItem}>
                                            <div className={styles.timelineDot} />
                                            <div className={styles.timelineContent}>
                                                <div className={styles.expHeader}>
                                                    {exp.company_logo && <img src={exp.company_logo} alt="" className={styles.companyLogo} />}
                                                    <div>
                                                        <h3 className={styles.expRole}>{exp.role}</h3>
                                                        <p className={styles.expCompany}>{exp.company_name} · {exp.employment_type}</p>
                                                    </div>
                                                </div>
                                                <p className={styles.expDate}>
                                                    <FiCalendar size={12} />
                                                    {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} -
                                                    {exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                                </p>
                                                {exp.description && <p className={styles.expDesc}>{exp.description}</p>}
                                                {exp.full_address && <p className={styles.expLocation}><FiMapPin size={12} /> {exp.full_address}</p>}
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
                                <div className={styles.timeline}>
                                    {educations.map((edu) => (
                                        <div key={edu.profileeducation_id} className={styles.timelineItem}>
                                            <div className={styles.timelineDot} />
                                            <div className={styles.timelineContent}>
                                                <h3 className={styles.eduDegree}>{edu.degree_name}</h3>
                                                <p className={styles.eduSchool}>{edu.institution_name}</p>
                                                <p className={styles.expDate}>
                                                    <FiCalendar size={12} />
                                                    {new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} -
                                                    {edu.is_current ? 'Present' : new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                                </p>
                                                {edu.score && <p className={styles.eduScore}>Score: {edu.score}</p>}
                                                {edu.description && <p className={styles.expDesc}>{edu.description}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        {projects?.length > 0 && (
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>Projects</h2>
                                <div className={styles.projectsGrid}>
                                    {projects.map((project) => (
                                        <div key={project.profileproject_id} className={styles.projectCard}>
                                            {project.thumbnail && (
                                                <img src={project.thumbnail} alt={project.project_name} className={styles.projectThumb} />
                                            )}
                                            <h3 className={styles.projectName}>
                                                <FiFolder size={14} /> {project.project_name}
                                                {project.is_featured && <FiStar size={12} className={styles.featuredIcon} />}
                                            </h3>
                                            <p className={styles.projectDesc}>{project.short_description}</p>
                                            {project.skills?.length > 0 && (
                                                <div className={styles.projectSkills}>
                                                    {project.skills.map(skill => (
                                                        <span key={skill.slug} className={styles.skillTag}>{skill.name}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className={styles.projectLinks}>
                                                {project.code_url && <a href={project.code_url} target="_blank" rel="noopener"><FiGithub size={12} /> Code</a>}
                                                {project.live_url && <a href={project.live_url} target="_blank" rel="noopener"><FiExternalLink size={12} /> Live</a>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        {/* Skills */}
                        {skills?.length > 0 && (
                            <section className={styles.sidebarSection}>
                                <h3 className={styles.sidebarTitle}>Skills</h3>
                                <div className={styles.skillsList}>
                                    {skills.map((skill) => (
                                        <div key={skill.profileskill_id} className={styles.skillItem}>
                                            {skill.image && <img src={skill.image} alt="" className={styles.skillIcon} />}
                                            <span className={styles.skillName}>{skill.name}</span>
                                            <div className={styles.skillLevel}>
                                                {[1, 2, 3, 4, 5].map(lvl => (
                                                    <div key={lvl} className={`${styles.levelDot} ${lvl <= skill.level ? styles.active : ''}`} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certificates */}
                        {certificates?.length > 0 && (
                            <section className={styles.sidebarSection}>
                                <h3 className={styles.sidebarTitle}>Certificates</h3>
                                {certificates.map((cert) => (
                                    <div key={cert.profilecertificate_id} className={styles.certItem}>
                                        <FiAward size={14} />
                                        <div>
                                            <p className={styles.certName}>{cert.title}</p>
                                            <p className={styles.certIssuer}>{cert.issued_by}</p>
                                            {cert.certificate_url && (
                                                <a href={cert.certificate_url} target="_blank" rel="noopener" className={styles.certLink}>Verify ↗</a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Languages */}
                        {languages?.length > 0 && (
                            <section className={styles.sidebarSection}>
                                <h3 className={styles.sidebarTitle}>Languages</h3>
                                <div className={styles.langList}>
                                    {languages.map((lang) => (
                                        <span key={lang.profilelanguage_id} className={styles.langItem}>
                                            {lang.language} <small>({lang.proficiency})</small>
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Achievements */}
                        {achievements?.length > 0 && (
                            <section className={styles.sidebarSection}>
                                <h3 className={styles.sidebarTitle}>Achievements</h3>
                                <ul className={styles.achievementList}>
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
                            <section className={styles.sidebarSection}>
                                <h3 className={styles.sidebarTitle}>Strengths</h3>
                                <div className={styles.tagList}>
                                    {strengths.map((str) => (
                                        <span key={str.profilestrength_id} className={styles.tag}>{str.title}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {hobbies?.length > 0 && (
                            <section className={styles.sidebarSection}>
                                <h3 className={styles.sidebarTitle}>Hobbies</h3>
                                <div className={styles.tagList}>
                                    {hobbies.map((hobby) => (
                                        <span key={hobby.profilehobby_id} className={styles.tag}>{hobby.hobby_name}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}