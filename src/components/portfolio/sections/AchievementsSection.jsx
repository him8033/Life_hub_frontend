// src/components/portfolio/sections/AchievementsSection.jsx

'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiAward, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
    FiArrowUp, FiArrowDown, FiInfo
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { SectionModal } from './common/SectionModal';
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

// Array of colors for achievement icons
const ACHIEVEMENT_COLORS = [
    '#f59e0b', // warning/gold
    '#10b981', // success
    '#667eea', // primary
    '#764ba2', // secondary purple
    '#ef4444', // error
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
];

const AchievementsSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showModal, setShowModal] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState(null);

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

    const { reset, handleSubmit } = methods;

    const getAchievementColor = (index) => {
        return ACHIEVEMENT_COLORS[index % ACHIEVEMENT_COLORS.length];
    };

    const handleAdd = () => {
        setEditingAchievement(null);
        reset({
            title: '',
            description: '',
        });
        setShowModal(true);
    };

    const handleEdit = (achievement) => {
        setEditingAchievement(achievement);
        reset({
            title: achievement.title,
            description: achievement.description || '',
        });
        setShowModal(true);
    };

    const handleCancel = () => {
        reset();
        setEditingAchievement(null);
        setShowModal(false);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingAchievement) {
                await updateAchievement({
                    achievementId: editingAchievement.profileachievement_id,
                    data: formData
                }).unwrap();
                showSnackbar('Achievement updated successfully', 'success', 3000);
            } else {
                await createAchievement({ snapshotId, data: formData }).unwrap();
                showSnackbar('Achievement added successfully', 'success', 3000);
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

    // Handle Enter key press in form
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(handleFormSubmit)();
        }
    };

    if (isLoading) return null;

    return (
        <>
            <SectionLayout
                title="Achievements"
                subtitle={`${achievements.length} achievement${achievements.length !== 1 ? 's' : ''}`}
                icon={FiAward}
                isLoading={isLoading}
                isSaving={isSubmitting}
                hasData={achievements.length > 0}
                onSave={handleAdd}
                saveButtonText="Add Achievement"
            >
                {achievements.length > 0 ? (
                    <div className={styles.achievementsGrid}>
                        {achievements.map((achievement, index) => (
                            <div key={achievement.profileachievement_id} className={styles.achievementCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.achievementInfo}>
                                        <div
                                            className={styles.achievementIcon}
                                            style={{ backgroundColor: getAchievementColor(index) }}
                                        >
                                            <FiAward size={20} />
                                        </div>
                                        <div className={styles.achievementContent}>
                                            <span className={styles.achievementTitle}>{achievement.title}</span>
                                            {achievement.description && (
                                                <span className={styles.achievementDescription}>
                                                    {achievement.description}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleEdit(achievement)}
                                            title="Edit achievement"
                                            disabled={isSubmitting}
                                        >
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => handleDelete(achievement.profileachievement_id, achievement.title)}
                                            title="Delete achievement"
                                            disabled={isSubmitting}
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.cardFooter}>
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
                                            disabled={index === achievements.length - 1 || isSubmitting}
                                            title="Move down"
                                        >
                                            <FiArrowDown size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <FiAward size={48} />
                        </div>
                        <h3 className={styles.emptyTitle}>No achievements added yet</h3>
                        <p className={styles.emptyDescription}>
                            Add your awards, honors, and professional accomplishments
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                            className={styles.emptyButton}
                        >
                            Add Achievement
                        </Button>
                    </div>
                )}
            </SectionLayout>

            {/* Modal for Add/Edit */}
            {showModal && (
                <SectionModal
                    opened={true}
                    onClose={handleCancel}
                    title={editingAchievement ? 'Edit Achievement' : 'Add Achievement'}
                    subtitle={editingAchievement ? `Update "${editingAchievement.title}"` : 'Add a new achievement'}
                    onSave={handleSubmit(handleFormSubmit)}
                    isSaving={isSubmitting}
                    saveText={editingAchievement ? 'Update' : 'Add'}
                    size="md"
                >
                    <FormProvider {...methods}>
                        <form className={styles.modalForm} onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Achievement Details</h3>
                                        <p className={styles.sectionDescription}>
                                            Enter the achievement title and optional description
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <FormInput
                                        name="title"
                                        label="Achievement Title *"
                                        placeholder="e.g., Best Developer Award 2024"
                                        icon={<FiAward size={16} />}
                                        required
                                        autoFocus
                                        disabled={isSubmitting}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <FormTextarea
                                        name="description"
                                        label="Description (Optional)"
                                        placeholder="Brief description of the achievement..."
                                        rows={3}
                                        disabled={isSubmitting}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && e.shiftKey) {
                                                return;
                                            }
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSubmit(handleFormSubmit)();
                                            }
                                        }}
                                    />
                                    <p className={styles.modalHint}>
                                        Be specific and highlight what makes this achievement significant.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </SectionModal>
            )}
        </>
    );
};

export default AchievementsSection;