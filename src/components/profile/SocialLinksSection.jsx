'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/common/buttons/Button';
import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useCreateSocialLinkMutation,
    useUpdateSocialLinkMutation,
    useDeleteSocialLinkMutation,
    useSetPrimarySocialLinkMutation,
    useReorderSocialLinksMutation,
} from '@/services/api/authApi';
import { socialLinkSchema } from '@/lib/validations/socialLinkSchema';
import SocialLinkItem from './SocialLinkItem';
import styles from '@/styles/dashboard/profile/SocialLinksSection.module.css';
import { FiPlus, FiX, FiLink } from 'react-icons/fi';

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

const SocialLinksSection = ({ profile, refetch }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showSocialForm, setShowSocialForm] = useState(false);
    const [editingSocialId, setEditingSocialId] = useState(null);

    const [createSocialLink, { isLoading: isCreating }] = useCreateSocialLinkMutation();
    const [updateSocialLink, { isLoading: isUpdating }] = useUpdateSocialLinkMutation();
    const [deleteSocialLink, { isLoading: isDeleting }] = useDeleteSocialLinkMutation();
    const [setPrimarySocialLink, { isLoading: isSettingPrimary }] = useSetPrimarySocialLinkMutation();
    const [reorderSocialLinks, { isLoading: isReordering }] = useReorderSocialLinksMutation();

    const socialLinks = profile?.social_links || [];

    const methods = useForm({
        resolver: zodResolver(socialLinkSchema),
        defaultValues: { platform_name: '', url: '' },
    });

    const {
        handleSubmit,
        reset,
        formState: { errors },
    } = methods;

    const cancelSocialForm = () => {
        reset({ platform_name: '', url: '' });
        setEditingSocialId(null);
        setShowSocialForm(false);
    };

    const handleCreate = async (data) => {
        try {
            const payload = {
                platform_name: data.platform_name,
                url: data.url,
            };
            await createSocialLink(payload).unwrap();
            showSnackbar('Social link added successfully', 'success', 5000);
            cancelSocialForm();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to add social link'), 'error', 5000);
        }
    };

    const handleUpdate = async (data) => {
        try {
            const payload = {
                platform_name: data.platform_name,
                url: data.url,
            };
            await updateSocialLink({ usersociallink_id: editingSocialId, data: payload }).unwrap();
            showSnackbar('Social link updated successfully', 'success', 5000);
            cancelSocialForm();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to update social link'), 'error', 5000);
        }
    };

    const handleDelete = async (id, platformName) => {
        const ok = await confirm({
            title: 'Delete Social Link',
            message: `Are you sure you want to delete the "${platformName}" link?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        });
        if (!ok) return;
        try {
            await deleteSocialLink(id).unwrap();
            showSnackbar('Social link deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete social link'), 'error', 5000);
        }
    };

    const handleSetPrimary = async (id) => {
        try {
            await setPrimarySocialLink(id).unwrap();
            showSnackbar('Primary social link updated', 'success', 5000);
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to set primary social link'), 'error', 5000);
        }
    };

    const handleReorder = async (newLinks) => {
        try {
            const payload = {
                order: newLinks.map((link, index) => ({
                    usersociallink_id: link.usersociallink_id,
                    position: index + 1,
                })),
            };
            await reorderSocialLinks(payload).unwrap();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder social links'), 'error', 5000);
        }
    };

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const newLinks = [...socialLinks];
        [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
        handleReorder(newLinks);
    };

    const handleMoveDown = (index) => {
        if (index === socialLinks.length - 1) return;
        const newLinks = [...socialLinks];
        [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
        handleReorder(newLinks);
    };

    const editSocialLink = (link) => {
        reset({
            platform_name: link.platform_name,
            url: link.url,
        });
        setEditingSocialId(link.usersociallink_id);
        setShowSocialForm(true);
    };

    const isSubmitting = isCreating || isUpdating;

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Social Links</h2>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                        if (showSocialForm) cancelSocialForm();
                        else setShowSocialForm(true);
                    }}
                    icon={showSocialForm ? <FiX /> : <FiPlus />}
                >
                    {showSocialForm ? 'Cancel' : 'Add Link'}
                </Button>
            </div>

            {showSocialForm && (
                <FormProvider {...methods}>
                    <form
                        onSubmit={handleSubmit(editingSocialId ? handleUpdate : handleCreate)}
                        className={styles.socialForm}
                    >
                        <div className={styles.socialFormGrid}>
                            <FormSelect
                                name="platform_name"
                                label="Platform"
                                options={platformOptions}
                                placeholder="Select Platform"
                                disabled={isSubmitting}
                                emptyOption={true}
                                emptyOptionLabel="Select Platform"
                            />
                            <FormInput
                                name="url"
                                label="URL"
                                placeholder="https://..."
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className={styles.socialFormActions}>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={cancelSocialForm}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="sm"
                                isLoading={isSubmitting}
                                loadingText={editingSocialId ? 'Updating...' : 'Adding...'}
                            >
                                {editingSocialId ? 'Update Link' : 'Add Link'}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            )}

            <div className={styles.socialLinksList}>
                {socialLinks.length === 0 ? (
                    <div className={styles.emptySocial}>
                        <FiLink className={styles.emptyIcon} />
                        <p>No social links added yet</p>
                    </div>
                ) : (
                    socialLinks.map((link, index) => (
                        <SocialLinkItem
                            key={link.usersociallink_id}
                            link={link}
                            index={index}
                            totalItems={socialLinks.length}
                            onMoveUp={() => handleMoveUp(index)}
                            onMoveDown={() => handleMoveDown(index)}
                            onSetPrimary={() => handleSetPrimary(link.usersociallink_id)}
                            onEdit={() => editSocialLink(link)}
                            onDelete={() => handleDelete(link.usersociallink_id, link.platform_name)}
                            isLoading={isDeleting || isSettingPrimary || isReordering}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default SocialLinksSection;