'use client';

import { FiGlobe, FiEdit2, FiTrash2, FiCopy, FiExternalLink, FiCalendar, FiBarChart2, FiImage } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import { formatDateTime } from '@/utils/date.utils';
import styles from '@/styles/portfolio/portfolio/PortfolioCard.module.css';

const themeOptions = {
    developer_dark: 'Developer Dark',
    designer_creative: 'Designer Creative',
    minimal_light: 'Minimal Light',
    agency_bold: 'Agency Bold',
};

export default function PortfolioCard({ portfolio, onEdit, onDelete, onDuplicate, isLoading }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                    <FiGlobe />
                </div>
                <div className={styles.headerInfo}>
                    <h3 className={styles.title}>{portfolio.title}</h3>
                    <p className={styles.snapshotName}>
                        📸 {portfolio.profile_snapshot_title || 'Unknown Snapshot'}
                    </p>
                </div>
                {portfolio.is_public && portfolio.slug && (
                    <a href={`/portfolio/${portfolio.slug}`} target="_blank" rel="noopener" className={styles.viewBtn} title="View Public Page">
                        <FiExternalLink />
                    </a>
                )}
            </div>

            <div className={styles.cardBody}>
                <div className={styles.configGrid}>
                    <div className={styles.configItem}>
                        <span className={styles.configLabel}>Theme</span>
                        <span className={styles.configValue}>{themeOptions[portfolio.theme_key] || portfolio.theme_key}</span>
                    </div>
                    <div className={styles.configItem}>
                        <span className={styles.configLabel}>Views</span>
                        <span className={styles.configValue}>
                            <FiBarChart2 size={12} /> {portfolio.view_count || 0}
                        </span>
                    </div>
                    {portfolio.hero_title && (
                        <div className={styles.configItem}>
                            <span className={styles.configLabel}>Hero Title</span>
                            <span className={styles.configValue}>{portfolio.hero_title}</span>
                        </div>
                    )}
                    {portfolio.custom_domain && (
                        <div className={styles.configItem}>
                            <span className={styles.configLabel}>Domain</span>
                            <span className={styles.configValue}>{portfolio.custom_domain}</span>
                        </div>
                    )}
                </div>

                {portfolio.seo_title && (
                    <div className={styles.seoInfo}>
                        <span className={styles.seoLabel}>SEO Title:</span> {portfolio.seo_title}
                    </div>
                )}

                <div className={styles.meta}>
                    <span className={`${styles.status} ${portfolio.is_public ? styles.public : styles.private}`}>
                        {portfolio.is_public ? '🌐 Public' : '🔒 Private'}
                    </span>
                    <span className={styles.date}>
                        <FiCalendar size={12} /> {formatDateTime(portfolio.updated_at)}
                    </span>
                </div>
            </div>

            <div className={styles.cardFooter}>
                <Button variant="outline" size="sm" icon={<FiEdit2 />} onClick={() => onEdit(portfolio.portfolio_id)} disabled={isLoading}>Edit</Button>
                <Button variant="outline" size="sm" icon={<FiCopy />} onClick={() => onDuplicate(portfolio.portfolio_id, portfolio.title)} disabled={isLoading}>Duplicate</Button>
                <Button variant="outline" size="sm" icon={<FiTrash2 />} onClick={() => onDelete(portfolio.portfolio_id, portfolio.title)} disabled={isLoading}>Delete</Button>
            </div>
        </div>
    );
}