'use client';

import { FiGlobe, FiEdit2, FiTrash2, FiCopy, FiExternalLink, FiCalendar, FiBarChart2, FiLayout, FiEye, FiSettings } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import { formatDateTime } from '@/utils/date.utils';
import styles from '@/styles/portfolio/portfolio/PortfolioCard.module.css';

export default function PortfolioCard({
    portfolio,
    onEdit,
    onEditSettings,
    onDelete,
    onDuplicate,
    onPreview,
    isLoading
}) {
    const handleCardClick = () => {
        onEdit(portfolio.portfolio_id);
    };

    return (
        <div className={styles.card} onClick={handleCardClick}>
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
                {/* Top Right Actions */}
                <div className={styles.headerActions} onClick={e => e.stopPropagation()}>
                    {portfolio.is_public && onPreview && (
                        <button
                            className={styles.iconBtn}
                            onClick={() => onPreview(portfolio.slug)}
                            title="Preview Portfolio"
                        >
                            <FiEye size={16} />
                        </button>
                    )}
                    {portfolio.custom_domain && (
                        <a
                            href={portfolio.custom_domain}
                            target="_blank"
                            rel="noopener"
                            className={styles.iconBtn}
                            title="Visit Portfolio"
                            onClick={e => e.stopPropagation()}
                        >
                            <FiExternalLink size={16} />
                        </a>
                    )}
                    <button
                        className={styles.iconBtn}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditSettings(portfolio.portfolio_id);
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
                        <span className={styles.configLabel}>Theme</span>
                        <span className={styles.configValue}>
                            <FiLayout size={12} /> {portfolio.portfolio_theme_name || 'Default'}
                        </span>
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
                        <span className={styles.seoLabel}>SEO:</span> {portfolio.seo_title}
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

            <div className={styles.cardFooter} onClick={e => e.stopPropagation()}>
                <Button variant="outline" size="sm" icon={<FiEdit2 />} onClick={() => onEdit(portfolio.portfolio_id)} disabled={isLoading}>
                    Edit Content
                </Button>
                <Button variant="outline" size="sm" icon={<FiCopy />} onClick={() => onDuplicate(portfolio.portfolio_id, portfolio.title)} disabled={isLoading}>
                    Duplicate
                </Button>
                <Button variant="outline" size="sm" icon={<FiExternalLink />} onClick={() => window.open(`/portfolio/${portfolio.slug}`, '_blank')} disabled={isLoading || !portfolio.is_public}>
                    View Live
                </Button>
                <Button variant="outline" size="sm" icon={<FiTrash2 />} onClick={() => onDelete(portfolio.portfolio_id, portfolio.title)} disabled={isLoading}>
                    Delete
                </Button>
            </div>
        </div>
    );
}