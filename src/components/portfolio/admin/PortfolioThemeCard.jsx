'use client';

import Button from '@/components/common/buttons/Button';
import { FiEdit2, FiTrash2, FiStar, FiImage } from 'react-icons/fi';
import styles from '@/styles/portfolio/admin/ResumeTemplateCard.module.css';

export default function PortfolioThemeCard({
    theme,
    onEdit,
    onDelete,
    onToggleStatus,
    isLoading = false
}) {
    return (
        <div className={`${styles.card} ${!theme.is_active ? styles.inactive : ''}`}>
            {/* Preview Image */}
            <div className={styles.imageWrapper}>
                {theme.preview_image_url ? (
                    <img
                        src={theme.preview_image_url}
                        alt={theme.name}
                        className={styles.previewImage}
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        <FiImage size={32} />
                        <span>No Preview</span>
                    </div>
                )}

                {/* Badges */}
                <div className={styles.badges}>
                    {theme.is_premium && (
                        <span className={styles.premiumBadge} title="Premium">
                            <FiStar size={12} /> Premium
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <h3 className={styles.name}>{theme.name}</h3>

                <div className={styles.meta}>
                    <span className={`${styles.statusBadge} ${theme.is_active ? styles.active : styles.inactiveBadge}`}>
                        {theme.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <div className={styles.actions}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => !isLoading && onToggleStatus(theme.theme_id, theme.is_active, theme.name)}
                        disabled={isLoading}
                        className={styles.actionButton}
                    >
                        {theme.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<FiEdit2 />}
                        onClick={() => !isLoading && onEdit(theme.theme_id)}
                        disabled={isLoading}
                        className={styles.iconButton}
                        title="Edit"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<FiTrash2 />}
                        onClick={() => !isLoading && onDelete(theme.theme_id, theme.name)}
                        disabled={isLoading}
                        className={styles.iconButton}
                        title="Delete"
                    />
                </div>
            </div>
        </div>
    );
}