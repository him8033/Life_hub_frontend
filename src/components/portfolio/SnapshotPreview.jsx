'use client';

import { FiUser, FiMail, FiPhone, FiMapPin, FiGlobe } from 'react-icons/fi';
import Loader from '@/components/common/Loader';
import { useGetBasicInfoQuery } from '@/services/api/portfolioApi';
import styles from '@/styles/portfolio/SnapshotPreview.module.css';

export default function SnapshotPreview({ snapshotId }) {
    const { data, isLoading } = useGetBasicInfoQuery(snapshotId, { skip: !snapshotId });
    const basicInfo = data?.data;

    if (isLoading) return <Loader text="Loading preview..." />;

    if (!basicInfo) {
        return (
            <div className={styles.emptyPreview}>
                <FiUser size={32} />
                <p>No data yet</p>
                <span>Fill in your Basic Info to see the preview</span>
            </div>
        );
    }

    return (
        <div className={styles.preview}>
            {/* Profile Image */}
            <div className={styles.previewImageSection}>
                {basicInfo.image_url ? (
                    <img src={basicInfo.image_url} alt="Profile" className={styles.previewImage} />
                ) : (
                    <div className={styles.previewImagePlaceholder}>
                        <FiUser size={40} />
                    </div>
                )}
            </div>

            {/* Name & Role */}
            <div className={styles.previewHeader}>
                <h3 className={styles.previewName}>
                    {basicInfo.first_name} {basicInfo.last_name}
                </h3>
                <p className={styles.previewRole}>Professional Title</p>
            </div>

            {/* Contact Info */}
            <div className={styles.previewContact}>
                {basicInfo.email && (
                    <div className={styles.previewContactItem}>
                        <FiMail size={14} />
                        <span>{basicInfo.email}</span>
                    </div>
                )}
                {basicInfo.phone && (
                    <div className={styles.previewContactItem}>
                        <FiPhone size={14} />
                        <span>{basicInfo.phone}</span>
                    </div>
                )}
                {basicInfo.full_address && (
                    <div className={styles.previewContactItem}>
                        <FiMapPin size={14} />
                        <span>{basicInfo.full_address}</span>
                    </div>
                )}
                {basicInfo.website && (
                    <div className={styles.previewContactItem}>
                        <FiGlobe size={14} />
                        <span>{basicInfo.website}</span>
                    </div>
                )}
            </div>

            {/* Summary */}
            {basicInfo.summary && (
                <div className={styles.previewSection}>
                    <h4 className={styles.previewSectionTitle}>Professional Summary</h4>
                    <p className={styles.previewSummary}>{basicInfo.summary}</p>
                </div>
            )}

            {/* Placeholder sections */}
            <div className={styles.previewSection}>
                <h4 className={styles.previewSectionTitle}>Skills</h4>
                <div className={styles.previewPlaceholder}>
                    <span className={styles.previewTag}>Add skills</span>
                    <span className={styles.previewTag}>in the</span>
                    <span className={styles.previewTag}>Skills tab</span>
                </div>
            </div>

            <div className={styles.previewSection}>
                <h4 className={styles.previewSectionTitle}>Experience</h4>
                <div className={styles.previewPlaceholder}>
                    <p className={styles.previewPlaceholderText}>Add your work experience in the Experience tab</p>
                </div>
            </div>

            <div className={styles.previewSection}>
                <h4 className={styles.previewSectionTitle}>Education</h4>
                <div className={styles.previewPlaceholder}>
                    <p className={styles.previewPlaceholderText}>Add your education in the Education tab</p>
                </div>
            </div>
        </div>
    );
}