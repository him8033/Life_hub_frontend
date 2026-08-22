// ClassicProfessional.jsx - Classic Resume Template
import styles from '@/styles/portfolio/template/ClassicProfessional.module.css';

export default function ClassicProfessional({ data }) {
    const { resume, basic_info, social_links, skills, experiences, educations, projects, strengths, certificates, achievements, hobbies, languages, custom_sections } = data;

    // Format date as DD/MM/YYYY or YYYY
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date + 'T00:00:00');
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Format year only
    const formatYear = (date) => {
        if (!date) return '';
        const d = new Date(date + 'T00:00:00');
        return d.getFullYear();
    };

    // Helper to check if content has meaningful text
    const hasContent = (html) => {
        if (!html) return false;
        const cleaned = html.replace(/<p>\s*<\/p>/g, '').trim();
        return cleaned.length > 0;
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header - Curriculum Vitae */}
                <header className={styles.header}>
                    <h1 className={styles.title}>CURRICULUM VITAE</h1>
                </header>

                {/* Contact Information */}
                <section className={styles.contactSection}>
                    <div className={styles.contactBlock}>
                        <p className={styles.contactName}>
                            <strong>{basic_info?.first_name || ''} {basic_info?.last_name || ''}</strong>
                        </p>
                        {basic_info?.full_address && (
                            <p className={styles.contactDetail}>
                                <strong>Address:</strong> {basic_info.full_address}
                            </p>
                        )}
                        {basic_info?.email && (
                            <p className={styles.contactDetail}>
                                <strong>Email:</strong> {basic_info.email}
                            </p>
                        )}
                        {basic_info?.phone && (
                            <p className={styles.contactDetail}>
                                <strong>Mobile:</strong> {basic_info.phone}
                            </p>
                        )}
                    </div>
                </section>

                <hr className={styles.divider} />

                {/* Objective */}
                {basic_info?.summary && hasContent(basic_info.summary) && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>OBJECTIVE</h2>
                        <div className={styles.sectionContent} dangerouslySetInnerHTML={{ __html: basic_info.summary }} />
                    </section>
                )}

                {/* Academic Qualification */}
                {educations?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>ACADEMIC QUALIFICATION</h2>
                        <div className={styles.sectionContent}>
                            {educations.map((edu) => (
                                <div key={edu.profileeducation_id} className={styles.eduItem}>
                                    <p className={styles.eduText}>
                                        <strong>{edu.degree_name}</strong> from {edu.institution_name} ({formatYear(edu.end_date)})
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Technical Qualification - using skills */}
                {skills?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>TECHNICAL QUALIFICATION</h2>
                        <div className={styles.sectionContent}>
                            <p className={styles.techText}>
                                {skills.map((skill, index) => (
                                    <span key={skill.profileskill_id}>
                                        {index > 0 && ', '}{skill.name}
                                    </span>
                                ))}
                            </p>
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experiences?.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>EXPERIENCE</h2>
                        <div className={styles.sectionContent}>
                            {experiences.map((exp) => (
                                <div key={exp.profileexperience_id} className={styles.expItem}>
                                    <p className={styles.expText}>
                                        <strong>{formatDate(exp.start_date)} – {exp.is_current ? 'Present' : formatDate(exp.end_date)}</strong> WORKING IN {exp.company_name?.toUpperCase()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Personal Information */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>PERSONAL INFORMATION</h2>
                    <div className={styles.sectionContent}>
                        {basic_info?.date_of_birth && (
                            <p className={styles.personalDetail}>
                                <strong>Date of birth:</strong> {basic_info.date_of_birth}
                            </p>
                        )}
                        {hobbies?.length > 0 && (
                            <p className={styles.personalDetail}>
                                <strong>Hobbies:</strong> {hobbies.map(h => h.hobby_name).join(', ')}
                            </p>
                        )}
                        {strengths?.length > 0 && (
                            <p className={styles.personalDetail}>
                                <strong>Strength:</strong> {strengths.map(s => s.title).join(', ')}
                            </p>
                        )}
                        {languages?.length > 0 && (
                            <p className={styles.personalDetail}>
                                <strong>Languages Known:</strong> {languages.map(l => l.language).join(', ')}
                            </p>
                        )}
                        {basic_info?.gender && (
                            <p className={styles.personalDetail}>
                                <strong>Gender:</strong> {basic_info.gender}
                            </p>
                        )}
                        {basic_info?.marital_status && (
                            <p className={styles.personalDetail}>
                                <strong>Marital Status:</strong> {basic_info.marital_status}
                            </p>
                        )}
                        {basic_info?.nationality && (
                            <p className={styles.personalDetail}>
                                <strong>Nationality:</strong> {basic_info.nationality}
                            </p>
                        )}
                    </div>
                </section>

                {/* Signature Block */}
                <div className={styles.signatureBlock}>
                    <div className={styles.signatureLeft}>
                        <p className={styles.signatureLine}>Place:</p>
                        <p className={styles.signatureLine}>Date:</p>
                    </div>
                    <div className={styles.signatureRight}>
                        <p className={styles.signatureName}>{basic_info?.first_name || ''} {basic_info?.last_name || ''}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}