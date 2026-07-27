// src/components/portfolio/sections/SocialLinksSection.jsx

'use client';

import React, { useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiLink, FiPlus, FiEdit2, FiTrash2, FiStar,
    FiArrowUp, FiArrowDown,
    FiLinkedin, FiGithub, FiTwitter, FiGlobe, FiInstagram, FiFacebook, FiYoutube
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { SectionModal } from './common/SectionModal';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useGetProfileSocialLinksQuery,
    useCreateProfileSocialLinkMutation,
    useUpdateProfileSocialLinkMutation,
    useDeleteProfileSocialLinkMutation,
    useReorderProfileSocialLinksMutation,
} from '@/services/api/portfolioApi';
import { socialLinkSchema } from '@/lib/validations/portfolio/sections/socialLinkSchema';
import styles from '@/styles/portfolio/sections/SocialLinksSection.module.css';

const PLATFORM_OPTIONS = [
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'GitHub', label: 'GitHub' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Website', label: 'Website' },
    { value: 'Other', label: 'Other (Custom)' },
];

const platformIcons = {
    LinkedIn: FiLinkedin,
    GitHub: FiGithub,
    Twitter: FiTwitter,
    Facebook: FiFacebook,
    Instagram: FiInstagram,
    YouTube: FiYoutube,
    Website: FiGlobe,
    Other: FiLink,
};

const platformColors = {
    LinkedIn: '#0A66C2',
    GitHub: '#333333',
    Twitter: '#1DA1F2',
    Facebook: '#1877F2',
    Instagram: '#E4405F',
    YouTube: '#FF0000',
    Website: '#667eea',
    Other: '#6b7280',
};

const SocialLinksSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showModal, setShowModal] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const [customPlatformName, setCustomPlatformName] = useState('');

    const { data, isLoading, refetch } = useGetProfileSocialLinksQuery(snapshotId, { skip: !snapshotId });
    const [createProfileLink, { isLoading: isCreating }] = useCreateProfileSocialLinkMutation();
    const [updateProfileLink, { isLoading: isUpdating }] = useUpdateProfileSocialLinkMutation();
    const [deleteProfileLink] = useDeleteProfileSocialLinkMutation();
    const [reorderProfileLinks] = useReorderProfileSocialLinksMutation();

    const socialLinks = data?.data || [];
    const isSubmitting = isCreating || isUpdating;

    // Get existing platform names (excluding the current one when editing)
    const existingPlatforms = useMemo(() => {
        if (editingLink) {
            return socialLinks
                .filter(link => link.profilesociallink_id !== editingLink.profilesociallink_id)
                .map(link => link.platform_name);
        }
        return socialLinks.map(link => link.platform_name);
    }, [socialLinks, editingLink]);

    // Filter available platforms (exclude already added ones, but keep "Other" always available)
    const availablePlatforms = useMemo(() => {
        return PLATFORM_OPTIONS.filter(
            platform => platform.value === 'Other' || !existingPlatforms.includes(platform.value)
        );
    }, [existingPlatforms]);

    const methods = useForm({
        resolver: zodResolver(socialLinkSchema),
        defaultValues: {
            platform_name: '',
            url: '',
        },
    });

    const { reset, handleSubmit, watch, setValue } = methods;
    const selectedPlatform = watch('platform_name');

    // Check if "Other" is selected
    const isOtherSelected = selectedPlatform === 'Other';

    // When editing, check if the platform is custom
    React.useEffect(() => {
        if (editingLink) {
            const isCustom = !PLATFORM_OPTIONS.some(p => p.value === editingLink.platform_name);
            if (isCustom) {
                setValue('platform_name', 'Other');
                setCustomPlatformName(editingLink.platform_name);
            } else {
                setValue('platform_name', editingLink.platform_name);
                setCustomPlatformName('');
            }
        }
    }, [editingLink, setValue]);

    // Reset custom platform name when switching away from "Other"
    React.useEffect(() => {
        if (!isOtherSelected) {
            setCustomPlatformName('');
        }
    }, [isOtherSelected]);

    const handleAdd = () => {
        setEditingLink(null);
        setCustomPlatformName('');
        reset({
            platform_name: '',
            url: '',
        });
        setShowModal(true);
    };

    const handleEdit = (link) => {
        setEditingLink(link);
        setShowModal(true);
    };

    const handleCancel = () => {
        reset();
        setEditingLink(null);
        setCustomPlatformName('');
        setShowModal(false);
    };

    const handleFormSubmit = async (formData) => {
        try {
            let platformName = formData.platform_name;
            
            // If "Other" is selected, use the custom platform name
            if (platformName === 'Other') {
                if (!customPlatformName || !customPlatformName.trim()) {
                    showSnackbar('Please enter a custom platform name', 'error', 3000);
                    return;
                }
                platformName = customPlatformName.trim();
            }

            const payload = {
                platform_name: platformName,
                url: formData.url,
                is_primary: false,
                is_active: true,
            };

            if (editingLink) {
                await updateProfileLink({ 
                    linkId: editingLink.profilesociallink_id, 
                    data: payload 
                }).unwrap();
                showSnackbar('Social link updated successfully', 'success', 3000);
            } else {
                await createProfileLink({ snapshotId, data: payload }).unwrap();
                showSnackbar('Social link added successfully', 'success', 3000);
            }
            handleCancel();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save social link'), 'error', 5000);
        }
    };

    const handleDelete = async (linkId, platformName) => {
        const ok = await confirm({
            title: 'Delete Social Link',
            message: `Are you sure you want to delete the "${platformName}" link?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        });
        if (!ok) return;
        try {
            await deleteProfileLink(linkId).unwrap();
            showSnackbar('Social link deleted', 'success', 3000);
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete'), 'error', 5000);
        }
    };

    const handleSetPrimary = async (linkId) => {
        try {
            await updateProfileLink({ linkId, data: { is_primary: true } }).unwrap();
            showSnackbar('Primary link updated', 'success', 3000);
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to update'), 'error', 5000);
        }
    };

    const handleMove = async (index, direction) => {
        const newLinks = [...socialLinks];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newLinks.length) return;
        [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];

        try {
            await reorderProfileLinks({
                snapshotId,
                data: { order: newLinks.map(l => l.profilesociallink_id) },
            }).unwrap();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    const getPlatformIcon = (platformName) => {
        const IconComponent = platformIcons[platformName] || FiLink;
        return <IconComponent size={18} />;
    };

    const getPlatformColor = (platformName) => {
        return platformColors[platformName] || platformColors.Other;
    };

    // Check if a platform is a standard one
    const isStandardPlatform = (platformName) => {
        return PLATFORM_OPTIONS.some(p => p.value === platformName);
    };

    if (isLoading) return null;

    return (
        <>
            <SectionLayout
                title="Social Links"
                subtitle={`${socialLinks.length} link${socialLinks.length !== 1 ? 's' : ''}`}
                icon={FiLink}
                isLoading={isLoading}
                isSaving={isSubmitting}
                hasData={socialLinks.length > 0}
                onSave={handleAdd}
                saveButtonText="Add Link"
            >
                {socialLinks.length > 0 ? (
                    <div className={styles.linksGrid}>
                        {socialLinks.map((link, index) => (
                            <div key={link.profilesociallink_id} className={styles.linkCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.platformInfo}>
                                        <div 
                                            className={styles.platformIcon}
                                            style={{ backgroundColor: getPlatformColor(link.platform_name) }}
                                        >
                                            {getPlatformIcon(link.platform_name)}
                                        </div>
                                        <div className={styles.linkInfo}>
                                            <div className={styles.linkName}>
                                                {link.platform_name}
                                                {!isStandardPlatform(link.platform_name) && (
                                                    <span className={styles.customBadge}>Custom</span>
                                                )}
                                                {link.is_primary && (
                                                    <span className={styles.primaryBadge}>
                                                        <FiStar size={10} /> Primary
                                                    </span>
                                                )}
                                            </div>
                                            <a 
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className={styles.linkUrl}
                                                title={link.url}
                                            >
                                                {link.url}
                                            </a>
                                        </div>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleEdit(link)}
                                            title="Edit link"
                                        >
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => handleDelete(link.profilesociallink_id, link.platform_name)}
                                            title="Delete link"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className={styles.cardBody}>
                                    <div className={styles.orderControls}>
                                        <button
                                            className={styles.orderBtn}
                                            onClick={() => handleMove(index, -1)}
                                            disabled={index === 0 || isSubmitting}
                                            title="Move up"
                                        >
                                            <FiArrowUp size={12} />
                                        </button>
                                        <span className={styles.orderNumber}>{index + 1}</span>
                                        <button
                                            className={styles.orderBtn}
                                            onClick={() => handleMove(index, 1)}
                                            disabled={index === socialLinks.length - 1 || isSubmitting}
                                            title="Move down"
                                        >
                                            <FiArrowDown size={12} />
                                        </button>
                                    </div>
                                    {!link.is_primary && (
                                        <button
                                            className={styles.primaryBtn}
                                            onClick={() => handleSetPrimary(link.profilesociallink_id)}
                                            disabled={isSubmitting}
                                            title="Set as primary"
                                        >
                                            <FiStar size={14} />
                                            Set as Primary
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <FiLink size={48} />
                        </div>
                        <h3 className={styles.emptyTitle}>No social links added yet</h3>
                        <p className={styles.emptyDescription}>
                            Connect your social profiles and professional networks
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                            className={styles.emptyButton}
                        >
                            Add Link
                        </Button>
                    </div>
                )}
            </SectionLayout>

            {/* Modal for Add/Edit */}
            {showModal && (
                <SectionModal
                    opened={true}
                    onClose={handleCancel}
                    title={editingLink ? 'Edit Social Link' : 'Add Social Link'}
                    subtitle={editingLink ? `Update "${editingLink.platform_name}"` : 'Connect your social profile'}
                    onSave={handleSubmit(handleFormSubmit)}
                    isSaving={isSubmitting}
                    saveText={editingLink ? 'Update' : 'Add'}
                    size="md"
                >
                    <FormProvider {...methods}>
                        <form className={styles.modalForm}>
                            <FormSelect
                                name="platform_name"
                                label="Platform *"
                                options={availablePlatforms}
                                placeholder={availablePlatforms.length > 0 ? 'Select a platform' : 'No platforms available'}
                                required
                                disabled={isSubmitting || availablePlatforms.length === 0}
                            />
                            
                            {isOtherSelected && (
                                <div className={styles.customPlatformInput}>
                                    <FormInput
                                        name="custom_platform_name"
                                        label="Custom Platform Name *"
                                        placeholder="Enter custom platform name (e.g., Dev.to, Hashnode)"
                                        value={customPlatformName}
                                        onChange={(e) => setCustomPlatformName(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    <p className={styles.customPlatformHint}>
                                        This name will be displayed on your profile
                                    </p>
                                </div>
                            )}
                            
                            <FormInput
                                name="url"
                                label="URL *"
                                placeholder="https://linkedin.com/in/username"
                                icon={<FiLink size={16} />}
                                required
                                disabled={isSubmitting}
                            />
                            
                            <p className={styles.modalHint}>
                                Enter the full URL to your profile (e.g., https://linkedin.com/in/username)
                            </p>
                            
                            {availablePlatforms.length === 0 && !editingLink && !isOtherSelected && (
                                <p className={styles.noPlatformsMessage}>
                                    All standard platforms have been added. Select "Other" to add a custom platform.
                                </p>
                            )}
                        </form>
                    </FormProvider>
                </SectionModal>
            )}
        </>
    );
};

export default SocialLinksSection;