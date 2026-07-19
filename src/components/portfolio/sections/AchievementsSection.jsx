// src/components/portfolio/sections/AchievementsSection.jsx

'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiAward, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
    FiArrowUp, FiArrowDown
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useGetAchievementsQuery,
    useCreateAchievementMutation,
    useUpdateAchievementMutation,
    useDeleteAchievementMutation,
    useReorderAchievementsMutation,
} from '@/services/api/portfolioApi';
import { achievementSchema } from '@/lib/validations/portfolio/sections/achievementSchema';
import styles from '@/styles/portfolio/sections/AchievementsSection.module.css';

const AchievementsSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, isLoading, refetch } = useGetAchievementsQuery(snapshotId, { skip: !snapshotId });
    const [createAchievement, { isLoading: isCreating }] = useCreateAchievementMutation();
    const [updateAchievement, { isLoading: isUpdating }] = useUpdateAchievementMutation();
    const [deleteAchievement] = useDeleteAchievementMutation();
    const [reorderAchievements] = useReorderAchievementsMutation();

    const achievements = data?.data || [];
    const isSubmitting = isCreating || isUpdating;

    const methods = useForm({
        resolver: zodResolver(achievementSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    const { reset, handleSubmit, setValue } = methods;

    const handleAdd = () => {
        setEditingId(null);
        reset({
            title: '',
            description: '',
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        reset();
        setEditingId(null);
        setShowForm(false);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingId) {
                await updateAchievement({ achievementId: editingId, data: formData }).unwrap();
                showSnackbar('Achievement updated', 'success', 3000);
            } else {
                await createAchievement({ snapshotId, data: formData }).unwrap();
                showSnackbar('Achievement added', 'success', 3000);
            }
            handleCancel();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save achievement'), 'error', 5000);
        }
    };

    const handleEdit = (achievement) => {
        setValue('title', achievement.title);
        setValue('description', achievement.description || '');
        setEditingId(achievement.profileachievement_id);
        setShowForm(true);
    };

    const handleDelete = async (achievementId, title) => {
        const ok = await confirm({
            title: 'Delete Achievement',
            message: `Are you sure you want to delete "${title}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        });
        if (!ok) return;
        try {
            await deleteAchievement(achievementId).unwrap();
            showSnackbar('Achievement deleted', 'success', 3000);
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete'), 'error', 5000);
        }
    };

    const handleMove = async (index, direction) => {
        const newItems = [...achievements];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        try {
            await reorderAchievements({
                snapshotId,
                data: { order: newItems.map(item => item.profileachievement_id) },
            }).unwrap();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    if (isLoading) return null;

    return (
        <SectionLayout
            title="Achievements"
            subtitle="Add awards, honors, and accomplishments"
            icon={FiAward}
            isLoading={isLoading}
            isSaving={isSubmitting}
            hasData={achievements.length > 0}
            onSave={handleAdd}
            saveButtonText="Add Achievement"
        >
            {/* Form */}
            {showForm && (
                <div className={styles.formCard}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <FormInput
                                name="title"
                                label="Achievement Title"
                                placeholder="e.g., Best Developer Award 2024"
                                icon={<FiAward />}
                                required
                                autoFocus
                                disabled={isSubmitting}
                            />
                            <FormTextarea
                                name="description"
                                label="Description (Optional)"
                                placeholder="Brief description of the achievement..."
                                rows={3}
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

            {/* Achievements List */}
            {achievements.length > 0 ? (
                <div className={styles.list}>
                    {achievements.map((achievement, index) => (
                        <div key={achievement.profileachievement_id} className={styles.item}>
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
                                    disabled={index === achievements.length - 1 || isSubmitting}
                                    title="Move down"
                                >
                                    <FiArrowDown size={10} />
                                </button>
                            </div>

                            <div className={styles.itemIcon}>
                                <FiAward />
                            </div>

                            <div className={styles.itemContent}>
                                <h4 className={styles.itemTitle}>{achievement.title}</h4>
                                {achievement.description && (
                                    <p className={styles.itemDescription}>
                                        {achievement.description}
                                    </p>
                                )}
                            </div>

                            <div className={styles.itemActions}>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handleEdit(achievement)}
                                    disabled={isSubmitting}
                                    title="Edit"
                                >
                                    <FiEdit2 size={14} />
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(achievement.profileachievement_id, achievement.title)}
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
                        <FiAward size={32} />
                        <p>No achievements added yet</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                        >
                            Add your first achievement
                        </Button>
                    </div>
                )
            )}
        </SectionLayout>
    );
};

export default AchievementsSection;