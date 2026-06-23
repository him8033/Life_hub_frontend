import styles from '@/styles/portfolio/template/Corporate.module.css';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiGithub, FiLinkedin, FiCalendar } from 'react-icons/fi';

export default function Corporate({ data }) {
    const { resume, basic_info, social_links, skills, experiences, educations, projects, certificates, languages, achievements } = data;

    const getSocial = (platform) => social_links?.find(l => l.platform_name?.toLowerCase() === platform);
    const website = getSocial('website');
    const github = getSocial('github');
    const linkedin = getSocial('linkedin');

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    return (
        <div className={styles.page} style={{ '--primary': resume.primary_color, fontFamily: resume.font_family }}>
            <div className={styles.container}>
                {/* Top Bar */}
                <div className={styles.topBar} style={{ background: resume.primary_color }}>
                    <div className={styles.topBarInner}>
                        <h1>{basic_info?.first_name} {basic_info?.last_name}</h1>
                        <p>{resume.title}</p>
                    </div>
                </div>

                <div className={styles.columns}>
                    {/* Left Column */}
                    <div className={styles.left}>
                        <div className={styles.contactCard}>
                            {basic_info?.image && <img src={basic_info.image} alt="" className={styles.avatar} />}
                            <div className={styles.contactInfo}>
                                {basic_info?.email && <span><FiMail size={14} /> {basic_info.email}</span>}
                                {basic_info?.phone && <span><FiPhone size={14} /> {basic_info.phone}</span>}
                                {basic_info?.full_address && <span><FiMapPin size={14} /> {basic_info.full_address}</span>}
                                {website && <span><FiGlobe size={14} /> {website.url}</span>}
                                {github && <span><FiGithub size={14} /> {github.url}</span>}
                                {linkedin && <span><FiLinkedin size={14} /> {linkedin.url}</span>}
                            </div>
                        </div>

                        {skills?.length > 0 && (
                            <div className={styles.sideSection}>
                                <h3>Core Competencies</h3>
                                <div className={styles.skillList}>
                                    {skills.map((skill) => (
                                        <span key={skill.profileskill_id} className={styles.skillChip}>{skill.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {languages?.length > 0 && (
                            <div className={styles.sideSection}>
                                <h3>Languages</h3>
                                {languages.map((lang) => (
                                    <p key={lang.profilelanguage_id}>{lang.language} — <em>{lang.proficiency}</em></p>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className={styles.right}>
                        {basic_info?.summary && (
                            <section className={styles.section}>
                                <h2>Professional Summary</h2>
                                <p>{basic_info.summary}</p>
                            </section>
                        )}

                        {experiences?.length > 0 && (
                            <section className={styles.section}>
                                <h2>Professional Experience</h2>
                                {experiences.map((exp) => (
                                    <div key={exp.profileexperience_id} className={styles.expItem}>
                                        <h3>{exp.role} — {exp.company_name}</h3>
                                        <span className={styles.meta}>
                                            <FiCalendar size={11} /> {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)} · {exp.employment_type}
                                        </span>
                                        {exp.description && <p>{exp.description}</p>}
                                    </div>
                                ))}
                            </section>
                        )}

                        {educations?.length > 0 && (
                            <section className={styles.section}>
                                <h2>Education</h2>
                                {educations.map((edu) => (
                                    <div key={edu.profileeducation_id} className={styles.eduItem}>
                                        <h3>{edu.degree_name}</h3>
                                        <span className={styles.meta}>{edu.institution_name} · {formatDate(edu.start_date)} — {edu.is_current ? 'Present' : formatDate(edu.end_date)}</span>
                                        {edu.score && <p>Score: {edu.score}</p>}
                                    </div>
                                ))}
                            </section>
                        )}

                        {certificates?.length > 0 && (
                            <section className={styles.section}>
                                <h2>Certifications</h2>
                                {certificates.map((cert) => (
                                    <div key={cert.profilecertificate_id} className={styles.certItem}>
                                        <h4>{cert.title}</h4>
                                        <span className={styles.meta}>{cert.issued_by} · {formatDate(cert.issued_date)}</span>
                                    </div>
                                ))}
                            </section>
                        )}

                        {achievements?.length > 0 && (
                            <section className={styles.section}>
                                <h2>Achievements</h2>
                                <ul>
                                    {achievements.map((ach) => (
                                        <li key={ach.profileachievement_id}>{ach.title}</li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}