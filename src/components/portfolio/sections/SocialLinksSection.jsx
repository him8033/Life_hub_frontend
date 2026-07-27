// src/components/portfolio/sections/SocialLinksSection.jsx

'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiLink, FiPlus, FiEdit2, FiTrash2, FiStar,
    FiArrowUp, FiArrowDown, FiX, FiCheck,
    FiLinkedin, FiGithub, FiTwitter, FiGlobe
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
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

const platformOptions = [
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'GitHub', label: 'GitHub' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Website', label: 'Website' },
    { value: 'Other', label: 'Other' },
];

const platformIcons = {
    LinkedIn: FiLinkedin,
    GitHub: FiGithub,
    Twitter: FiTwitter,
    Website: FiGlobe,
};

const SocialLinksSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, isLoading, refetch } = useGetProfileSocialLinksQuery(snapshotId, { skip: !snapshotId });
    const [createProfileLink, { isLoading: isCreating }] = useCreateProfileSocialLinkMutation();
    const [updateProfileLink, { isLoading: isUpdating }] = useUpdateProfileSocialLinkMutation();
    const [deleteProfileLink] = useDeleteProfileSocialLinkMutation();
    const [reorderProfileLinks] = useReorderProfileSocialLinksMutation();

    const socialLinks = data?.data || [];
    const isSubmitting = isCreating || isUpdating;

    const methods = useForm({
        resolver: zodResolver(socialLinkSchema),
        defaultValues: {
            platform_name: '',
            url: '',
            icon: '',
        },
    });

    const { reset, handleSubmit, setValue } = methods;

    const handleAdd = () => {
        setEditingId(null);
        reset({
            platform_name: '',
            url: '',
            icon: '',
        });
        setShowForm(true);
    };

    const handleEdit = (link) => {
        setValue('platform_name', link.platform_name);
        setValue('url', link.url);
        setValue('icon', link.icon || '');
        setEditingId(link.profilesociallink_id);
        setShowForm(true);
    };

    const handleCancel = () => {
        reset();
        setEditingId(null);
        setShowForm(false);
    };

    const handleFormSubmit = async (formData) => {
        try {
            const payload = {
                platform_name: formData.platform_name,
                url: formData.url,
                icon: formData.icon || '',
                is_primary: false,
                is_active: true,
            };

            if (editingId) {
                await updateProfileLink({ linkId: editingId, data: payload }).unwrap();
                showSnackbar('Social link updated', 'success', 3000);
            } else {
                await createProfileLink({ snapshotId, data: payload }).unwrap();
                showSnackbar('Social link added', 'success', 3000);
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

    if (isLoading) return null;

    return (
        <SectionLayout
            title="Social Links"
            subtitle="Add your professional profiles and social media links"
            icon={FiLink}
            isLoading={isLoading}
            isSaving={isSubmitting}
            hasData={socialLinks.length > 0}
            onSave={handleAdd}
            saveButtonText="Add Link"
        >
            {/* Form */}
            {showForm && (
                <div className={styles.formCard}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <div className={styles.formRow}>
                                <FormSelect
                                    name="platform_name"
                                    label="Platform"
                                    options={platformOptions}
                                    placeholder="Select platform"
                                    required
                                    disabled={isSubmitting}
                                />
                                <FormInput
                                    name="url"
                                    label="URL"
                                    placeholder="https://..."
                                    icon={<FiLink />}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <FormInput
                                name="icon"
                                label="Icon (optional)"
                                placeholder="e.g., fa-github"
                                disabled={isSubmitting}
                            />
                            <div className={styles.formActions}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    icon={<FiX />}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    isLoading={isSubmitting}
                                    loadingText="Saving..."
                                    icon={<FiCheck />}
                                >
                                    {editingId ? 'Update' : 'Add'}
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            )}

            {/* List */}
            {socialLinks.length > 0 ? (
                <div className={styles.linksList}>
                    {socialLinks.map((link, index) => (
                        <div key={link.profilesociallink_id} className={styles.linkItem}>
                            <div className={styles.orderControls}>
                                <button
                                    className={styles.orderButton}
                                    onClick={() => handleMove(index, -1)}
                                    disabled={index === 0 || isSubmitting}
                                    title="Move up"
                                >
                                    <FiArrowUp size={10} />
                                </button>
                                <span className={styles.orderNumber}>{index + 1}</span>
                                <button
                                    className={styles.orderButton}
                                    onClick={() => handleMove(index, 1)}
                                    disabled={index === socialLinks.length - 1 || isSubmitting}
                                    title="Move down"
                                >
                                    <FiArrowDown size={10} />
                                </button>
                            </div>
                            <div className={styles.platformIcon}>{getPlatformIcon(link.platform_name)}</div>
                            <div className={styles.linkInfo}>
                                <div className={styles.linkName}>
                                    {link.platform_name}
                                    {link.is_primary && <span className={styles.primaryBadge}><FiStar size={10} /> Primary</span>}
                                </div>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.linkUrl}>{link.url}</a>
                            </div>
                            <div className={styles.linkActions}>
                                {!link.is_primary && (
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => handleSetPrimary(link.profilesociallink_id)}
                                        disabled={isSubmitting}
                                        title="Set as primary"
                                    >
                                        <FiStar size={14} />
                                    </button>
                                )}
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handleEdit(link)}
                                    disabled={isSubmitting}
                                    title="Edit"
                                >
                                    <FiEdit2 size={14} />
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(link.profilesociallink_id, link.platform_name)}
                                    disabled={isSubmitting}
                                    title="Delete"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !showForm && (
                    <div className={styles.emptyState}>
                        <FiLink size={32} />
                        <p>No social links added yet</p>
                        <Button variant="outline" size="sm" onClick={handleAdd} icon={<FiPlus />}>
                            Add your first link
                        </Button>
                    </div>
                )
            )}
        </SectionLayout>
    );
};

export default SocialLinksSection;