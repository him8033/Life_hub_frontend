'use client';

import Button from '@/components/common/buttons/Button';
import { FiEdit2, FiTrash2, FiCheck, FiStar, FiImage } from 'react-icons/fi';
import styles from '@/styles/portfolio/admin/ResumeTemplateCard.module.css';

export default function ResumeTemplateCard({
    template,
    onEdit,
    onDelete,
    onToggleStatus,
    isLoading = false
}) {
    return (
        <div className={`${styles.card} ${!template.is_active ? styles.inactive : ''}`}>
            {/* Preview Image */}
            <div className={styles.imageWrapper}>
                {template.preview_image_url ? (
                    <img
                        src={template.preview_image_url}
                        alt={template.name}
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
                    {template.is_ats_friendly && (
                        <span className={styles.atsBadge} title="ATS Friendly">
                            <FiCheck size={12} /> ATS
                        </span>
                    )}
                    {template.is_premium && (
                        <span className={styles.premiumBadge} title="Premium">
                            <FiStar size={12} /> Premium
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <h3 className={styles.name}>{template.name}</h3>

                <div className={styles.meta}>
                    <span className={`${styles.statusBadge} ${template.is_active ? styles.active : styles.inactiveBadge}`}>
                        {template.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <div className={styles.actions}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => !isLoading && onToggleStatus(template.template_id, template.is_active, template.name)}
                        disabled={isLoading}
                        className={styles.actionButton}
                    >
                        {template.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<FiEdit2 />}
                        onClick={() => !isLoading && onEdit(template.template_id)}
                        disabled={isLoading}
                        className={styles.iconButton}
                        title="Edit"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<FiTrash2 />}
                        onClick={() => !isLoading && onDelete(template.template_id, template.name)}
                        disabled={isLoading}
                        className={styles.iconButton}
                        title="Delete"
                    />
                </div>
            </div>
        </div>
    );
}