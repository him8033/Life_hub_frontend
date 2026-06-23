import styles from '@/styles/portfolio/template/Creative.module.css';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiGithub, FiLinkedin, FiExternalLink, FiStar } from 'react-icons/fi';

export default function Creative({ data }) {
    const { resume, basic_info, social_links, skills, experiences, educations, projects, certificates } = data;

    const getSocial = (platform) => social_links?.find(l => l.platform_name?.toLowerCase() === platform);
    const github = getSocial('github');
    const linkedin = getSocial('linkedin');
    const website = getSocial('website');

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    return (
        <div className={styles.page} style={{ '--accent': resume.primary_color, fontFamily: resume.font_family }}>
            <div className={styles.layout}>
                {/* Sidebar */}
                <aside className={styles.sidebar} style={{ background: resume.primary_color }}>
                    {basic_info?.image && (
                        <img src={basic_info.image} alt="" className={styles.avatar} />
                    )}
                    <h1 className={styles.sidebarName}>{basic_info?.first_name} {basic_info?.last_name}</h1>
                    <p className={styles.sidebarRole}>{resume.title}</p>

                    <div className={styles.sidebarContact}>
                        {basic_info?.email && <span><FiMail size={14} /> {basic_info.email}</span>}
                        {basic_info?.phone && <span><FiPhone size={14} /> {basic_info.phone}</span>}
                        {basic_info?.full_address && <span><FiMapPin size={14} /> {basic_info.full_address}</span>}
                    </div>

                    {skills?.length > 0 && (
                        <div className={styles.sidebarSection}>
                            <h3>Skills</h3>
                            {skills.map((skill) => (
                                <div key={skill.profileskill_id} className={styles.sidebarSkill}>
                                    <span>{skill.name}</span>
                                    <div className={styles.skillBar}>
                                        <div className={styles.skillFill} style={{ width: `${(skill.level / 5) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={styles.sidebarLinks}>
                        {website && <a href={website.url} target="_blank" rel="noopener"><FiGlobe size={14} /></a>}
                        {github && <a href={github.url} target="_blank" rel="noopener"><FiGithub size={14} /></a>}
                        {linkedin && <a href={linkedin.url} target="_blank" rel="noopener"><FiLinkedin size={14} /></a>}
                    </div>
                </aside>

                {/* Main Content */}
                <main className={styles.main}>
                    {basic_info?.summary && (
                        <section className={styles.section}>
                            <h2>About Me</h2>
                            <p>{basic_info.summary}</p>
                        </section>
                    )}

                    {experiences?.length > 0 && (
                        <section className={styles.section}>
                            <h2>Experience</h2>
                            {experiences.map((exp) => (
                                <div key={exp.profileexperience_id} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h3>{exp.role}</h3>
                                        <span>{formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span>
                                    </div>
                                    <p className={styles.cardSub}>{exp.company_name}</p>
                                    {exp.description && <p>{exp.description}</p>}
                                </div>
                            ))}
                        </section>
                    )}

                    {projects?.length > 0 && (
                        <section className={styles.section}>
                            <h2>Projects</h2>
                            <div className={styles.projectGrid}>
                                {projects.map((project) => (
                                    <div key={project.profileproject_id} className={styles.projectCard}>
                                        <h3>{project.project_name}</h3>
                                        <p>{project.short_description}</p>
                                        <div className={styles.projectLinks}>
                                            {project.live_url && <a href={project.live_url} target="_blank" rel="noopener"><FiExternalLink /> Live</a>}
                                            {project.code_url && <a href={project.code_url} target="_blank" rel="noopener"><FiGithub /> Code</a>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {educations?.length > 0 && (
                        <section className={styles.section}>
                            <h2>Education</h2>
                            {educations.map((edu) => (
                                <div key={edu.profileeducation_id} className={styles.card}>
                                    <h3>{edu.degree_name}</h3>
                                    <p className={styles.cardSub}>{edu.institution_name}</p>
                                    <span>{formatDate(edu.start_date)} — {edu.is_current ? 'Present' : formatDate(edu.end_date)}</span>
                                </div>
                            ))}
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}