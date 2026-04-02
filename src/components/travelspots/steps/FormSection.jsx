'use client';

import { FiEdit2, FiEdit3 } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import styles from '@/styles/travelspots/steps/FormSection.module.css';
import { EditIcon } from 'lucide-react';

const FormSection = ({
    icon: Icon,
    title,
    subtitle,
    children,
    className = '',
    showEdit = false,
    editText = 'Edit',
    editVariant = 'ghost',
    editSize = 'sm',
    onEdit,
    editIcon = FiEdit2,
    editPosition = 'right', // 'left', 'right'
    editDisabled = false,
}) => {
    return (
        <div className={`${styles.formSection} ${className}`}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleWrapper}>
                    <h2 className={styles.sectionTitle}>
                        {Icon && <Icon className={styles.sectionIcon} />}
                        {title}
                    </h2>
                    {showEdit && onEdit && (
                        <Button
                            variant={editVariant}
                            size={editSize}
                            onClick={onEdit}
                            disabled={editDisabled}
                            iconPosition={editPosition === 'left' ? 'left' : 'right'}
                            className={styles.editButton}
                        >
                            {editText}
                        </Button>
                    )}
                </div>
                {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
            </div>
            <div className={styles.sectionContent}>
                {children}
            </div>
        </div>
    );
};

export default FormSection;