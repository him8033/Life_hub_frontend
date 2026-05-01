'use client';

import styles from '@/styles/dashboard/profile/SocialLinkItem.module.css';
import { FiStar, FiEdit3, FiTrash2, FiArrowUp, FiArrowDown, FiLink } from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaGlobe } from 'react-icons/fa';

const platformIcons = {
    linkedin: FaLinkedin,
    github: FaGithub,
    twitter: FaTwitter,
    facebook: FaFacebook,
    instagram: FaInstagram,
    youtube: FaYoutube,
    website: FaGlobe,
};

const SocialLinkItem = ({
    link,
    index,
    totalItems,
    onMoveUp,
    onMoveDown,
    onSetPrimary,
    onEdit,
    onDelete,
    isLoading = false,
}) => {
    const getPlatformIcon = (platformName) => {
        const key = platformName?.toLowerCase();
        const Icon = platformIcons[key] || FiLink;
        return <Icon />;
    };

    return (
        <div className={`${styles.socialLinkItem} ${isLoading ? styles.loading : ''}`}>
            <div className={styles.socialLinkOrder}>
                <button
                    className={styles.orderButton}
                    onClick={onMoveUp}
                    disabled={index === 0 || isLoading}
                    title="Move up"
                >
                    <FiArrowUp size={12} />
                </button>
                <span className={styles.orderNumber}>{link.position || index + 1}</span>
                <button
                    className={styles.orderButton}
                    onClick={onMoveDown}
                    disabled={index === totalItems - 1 || isLoading}
                    title="Move down"
                >
                    <FiArrowDown size={12} />
                </button>
            </div>

            <div className={styles.socialLinkIcon}>
                {getPlatformIcon(link.platform_name)}
            </div>

            <div className={styles.socialLinkInfo}>
                <h4 className={styles.socialLinkName}>
                    {link.platform_name}
                    {link.is_primary && (
                        <FiStar className={styles.primaryStar} title="Primary link" />
                    )}
                </h4>
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLinkUrl}
                >
                    {link.url}
                </a>
            </div>

            <div className={styles.socialLinkActions}>
                {!link.is_primary && (
                    <button
                        className={styles.actionButton}
                        onClick={onSetPrimary}
                        disabled={isLoading}
                        title="Set as primary"
                    >
                        <FiStar />
                    </button>
                )}
                <button
                    className={styles.actionButton}
                    onClick={onEdit}
                    disabled={isLoading}
                    title="Edit"
                >
                    <FiEdit3 />
                </button>
                <button
                    className={`${styles.actionButton} ${styles.deleteAction}`}
                    onClick={onDelete}
                    disabled={isLoading}
                    title="Delete"
                >
                    <FiTrash2 />
                </button>
            </div>
        </div>
    );
};

export default SocialLinkItem;