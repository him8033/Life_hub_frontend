'use client';

import { FiFileText, FiEdit2, FiTrash2, FiCopy, FiDownload, FiCalendar, FiLayout, FiEye, FiSettings } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import { formatDateTime } from '@/utils/date.utils';
import styles from '@/styles/portfolio/resume/ResumeCard.module.css';

const fontOptions = {
    Poppins: 'Poppins', Inter: 'Inter', Roboto: 'Roboto', Montserrat: 'Montserrat',
    'Open Sans': 'Open Sans', Lato: 'Lato',
};

const layoutOptions = {
    single_column: 'Single Column', two_column: 'Two Column', sidebar: 'Sidebar',
};

export default function ResumeCard({
    resume,
    onEdit,
    onEditSettings,
    onDelete,
    onDuplicate,
    onGeneratePDF,
    onPreview,
    isLoading
}) {
    const handleCardClick = () => {
        onEdit(resume.resume_id);
    };

    return (
        <div className={styles.card} onClick={handleCardClick}>
            <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                    <FiFileText />
                </div>
                <div className={styles.headerInfo}>
                    <h3 className={styles.title}>{resume.title}</h3>
                    <p className={styles.snapshotName}>
                        📸 {resume.profile_snapshot_title || 'Unknown Snapshot'}
                    </p>
                </div>
                {/* Top Right Actions */}
                <div className={styles.headerActions} onClick={e => e.stopPropagation()}>
                    {resume.is_public && onPreview && (
                        <button
                            className={styles.iconBtn}
                            onClick={() => onPreview(resume.slug)}
                            title="Preview Resume"
                        >
                            <FiEye size={16} />
                        </button>
                    )}
                    {resume.pdf_url && (
                        <a
                            href={resume.pdf_url}
                            target="_blank"
                            rel="noopener"
                            className={styles.iconBtn}
                            title="Download PDF"
                            onClick={e => e.stopPropagation()}
                        >
                            <FiDownload size={16} />
                        </a>
                    )}
                    <button
                        className={styles.iconBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditSettings(resume.resume_id);
                        }}
                        title="Settings"
                    >
                        <FiSettings size={16} />
                    </button>
                </div>
            </div>

            <div className={styles.cardBody}>
                <div className={styles.configGrid}>
                    <div className={styles.configItem}>
                        <span className={styles.configLabel}>Template</span>
                        <span className={styles.configValue}>
                            <FiLayout size={12} /> {resume.resume_template_name || 'Default'}
                        </span>
                    </div>
                    <div className={styles.configItem}>
                        <span className={styles.configLabel}>Font</span>
                        <span className={styles.configValue}>{fontOptions[resume.font_family] || resume.font_family}</span>
                    </div>
                    <div className={styles.configItem}>
                        <span className={styles.configLabel}>Layout</span>
                        <span className={styles.configValue}>{layoutOptions[resume.layout] || resume.layout}</span>
                    </div>
                    <div className={styles.configItem}>
                        <span className={styles.configLabel}>Color</span>
                        <span className={styles.configColor}>
                            <span className={styles.colorDot} style={{ backgroundColor: resume.primary_color }} />
                            {resume.primary_color}
                        </span>
                    </div>
                </div>

                <div className={styles.meta}>
                    <span className={`${styles.status} ${resume.is_public ? styles.public : styles.private}`}>
                        {resume.is_public ? '🌐 Public' : '🔒 Private'}
                    </span>
                    <span className={styles.date}>
                        <FiCalendar size={12} /> {formatDateTime(resume.updated_at)}
                    </span>
                    {resume.is_pdf_generated && <span className={styles.pdfBadge}>📄 PDF Ready</span>}
                </div>
            </div>

            <div className={styles.cardFooter} onClick={e => e.stopPropagation()}>
                <Button variant="outline" size="sm" icon={<FiEdit2 />} onClick={() => onEdit(resume.resume_id)} disabled={isLoading}>
                    Edit Content
                </Button>
                <Button variant="outline" size="sm" icon={<FiCopy />} onClick={() => onDuplicate(resume.resume_id, resume.title)} disabled={isLoading}>
                    Duplicate
                </Button>
                <Button variant="outline" size="sm" icon={<FiDownload />} onClick={() => onGeneratePDF(resume.resume_id)} disabled={isLoading}>
                    {resume.is_pdf_generated ? 'Regen PDF' : 'Export PDF'}
                </Button>
                <Button variant="outline" size="sm" icon={<FiTrash2 />} onClick={() => onDelete(resume.resume_id, resume.title)} disabled={isLoading}>
                    Delete
                </Button>
            </div>
        </div>
    );
}