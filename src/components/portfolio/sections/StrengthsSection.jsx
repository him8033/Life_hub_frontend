'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiShield, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
    FiArrowUp, FiArrowDown
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import Button from '@/components/common/buttons/Button';
import Loader from '@/components/common/Loader';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useGetStrengthsQuery,
    useCreateStrengthMutation,
    useUpdateStrengthMutation,
    useDeleteStrengthMutation,
    useReorderStrengthsMutation,
} from '@/services/api/portfolioApi';
import { strengthSchema } from '@/lib/validations/portfolio/sections/strengthSchema';
import styles from '@/styles/portfolio/sections/StrengthsSection.module.css';

const StrengthsSection = ({ snapshotId }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // API
    const { data, isLoading, refetch } = useGetStrengthsQuery(snapshotId, { skip: !snapshotId });
    const [createStrength, { isLoading: isCreating }] = useCreateStrengthMutation();
    const [updateStrength, { isLoading: isUpdating }] = useUpdateStrengthMutation();
    const [deleteStrength, { isLoading: isDeleting }] = useDeleteStrengthMutation();
    const [reorderStrengths] = useReorderStrengthsMutation();

    const strengths = data?.data || [];
    const isSubmitting = isCreating || isUpdating;

    const methods = useForm({
        resolver: zodResolver(strengthSchema),
        defaultValues: {
            title: '',
        },
    });

    const { reset, handleSubmit, setValue } = methods;

    const handleFormSubmit = async (formData) => {
        try {
            if (editingId) {
                await updateStrength({ strengthId: editingId, data: formData }).unwrap();
                showSnackbar('Strength updated', 'success', 3000);
            } else {
                await createStrength({ snapshotId, data: formData }).unwrap();
                showSnackbar('Strength added', 'success', 3000);
            }
            reset();
            setEditingId(null);
            setShowForm(false);
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save strength'), 'error', 5000);
        }
    };

    const handleEdit = (strength) => {
        setValue('title', strength.title);
        setEditingId(strength.profilestrength_id);
        setShowForm(true);
    };

    const handleDelete = async (strengthId, title) => {
        const ok = await confirm({
            title: 'Delete Strength',
            message: `Are you sure you want to delete "${title}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        });
        if (!ok) return;
        try {
            await deleteStrength(strengthId).unwrap();
            showSnackbar('Strength deleted', 'success', 3000);
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete'), 'error', 5000);
        }
    };

    const handleMove = async (index, direction) => {
        const newItems = [...strengths];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        try {
            await reorderStrengths({
                snapshotId,
                data: { order: newItems.map(item => item.profilestrength_id) },
            }).unwrap();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    const handleCancel = () => {
        reset();
        setEditingId(null);
        setShowForm(false);
    };

    if (isLoading) return <Loader text="Loading strengths..." />;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Strengths</h3>
                    <p className={styles.subtitle}>
                        Highlight your key personal strengths and traits
                    </p>
                </div>
                {!showForm && (
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowForm(true)}
                        icon={<FiPlus />}
                    >
                        Add Strength
                    </Button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className={styles.formCard}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <div className={styles.formRow}>
                                <FormInput
                                    name="title"
                                    label="Strength"
                                    placeholder="e.g., Problem Solving, Leadership, Communication"
                                    icon={<FiShield />}
                                    required
                                    autoFocus
                                    disabled={isSubmitting}
                                    className={styles.formInput}
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
                            </div>
                        </form>
                    </FormProvider>
                </div>
            )}

            {/* Strengths List - Card Grid Style */}
            {strengths.length > 0 ? (
                <div className={styles.strengthsGrid}>
                    {strengths.map((strength, index) => (
                        <div key={strength.profilestrength_id} className={styles.strengthCard}>
                            {/* Order Badge */}
                            <span className={styles.orderBadge}>{index + 1}</span>

                            {/* Shield Icon */}
                            <div className={styles.strengthIcon}>
                                <FiShield size={20} />
                            </div>

                            {/* Content */}
                            <span className={styles.strengthTitle}>{strength.title}</span>

                            {/* Actions */}
                            <div className={styles.strengthActions}>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handleMove(index, -1)}
                                    disabled={index === 0}
                                    title="Move up"
                                >
                                    <FiArrowUp size={12} />
                                </button>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handleMove(index, 1)}
                                    disabled={index === strengths.length - 1}
                                    title="Move down"
                                >
                                    <FiArrowDown size={12} />
                                </button>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handleEdit(strength)}
                                    title="Edit"
                                >
                                    <FiEdit2 size={12} />
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(strength.profilestrength_id, strength.title)}
                                    title="Delete"
                                >
                                    <FiTrash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <FiShield size={32} />
                    <p>No strengths added yet</p>
                    {!showForm && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowForm(true)}
                            icon={<FiPlus />}
                        >
                            Add your first strength
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default StrengthsSection;