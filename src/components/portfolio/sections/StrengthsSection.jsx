// src/components/portfolio/sections/StrengthsSection.jsx

'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiShield, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
    FiArrowUp, FiArrowDown, FiInfo
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { SectionModal } from './common/SectionModal';
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

// Array of colors for strength icons
const STRENGTH_COLORS = [
    '#667eea', // primary
    '#764ba2', // secondary purple
    '#f59e0b', // warning
    '#10b981', // success
    '#ef4444', // error
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
];

const StrengthsSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showModal, setShowModal] = useState(false);
    const [editingStrength, setEditingStrength] = useState(null);

    const { data, isLoading, refetch } = useGetStrengthsQuery(snapshotId, { skip: !snapshotId });
    const [createStrength, { isLoading: isCreating }] = useCreateStrengthMutation();
    const [updateStrength, { isLoading: isUpdating }] = useUpdateStrengthMutation();
    const [deleteStrength] = useDeleteStrengthMutation();
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

    const getStrengthColor = (index) => {
        return STRENGTH_COLORS[index % STRENGTH_COLORS.length];
    };

    const handleAdd = () => {
        setEditingStrength(null);
        reset({ title: '' });
        setShowModal(true);
    };

    const handleEdit = (strength) => {
        setEditingStrength(strength);
        reset({ title: strength.title });
        setShowModal(true);
    };

    const handleCancel = () => {
        reset();
        setEditingStrength(null);
        setShowModal(false);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingStrength) {
                await updateStrength({
                    strengthId: editingStrength.profilestrength_id,
                    data: formData
                }).unwrap();
                showSnackbar('Strength updated successfully', 'success', 3000);
            } else {
                await createStrength({ snapshotId, data: formData }).unwrap();
                showSnackbar('Strength added successfully', 'success', 3000);
            }
            handleCancel();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save strength'), 'error', 5000);
        }
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

            if (onDataChange) {
                onDataChange();
            }
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

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    // Handle Enter key press in form - prevent default submission
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Trigger form submission through the modal's save button
            handleSubmit(handleFormSubmit)();
        }
    };

    if (isLoading) return null;

    return (
        <>
            <SectionLayout
                title="Strengths"
                subtitle={`${strengths.length} strength${strengths.length !== 1 ? 's' : ''}`}
                icon={FiShield}
                isLoading={isLoading}
                isSaving={isSubmitting}
                hasData={strengths.length > 0}
                onSave={handleAdd}
                saveButtonText="Add Strength"
            >
                {strengths.length > 0 ? (
                    <div className={styles.strengthsGrid}>
                        {strengths.map((strength, index) => (
                            <div key={strength.profilestrength_id} className={styles.strengthCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.strengthInfo}>
                                        <div
                                            className={styles.strengthIcon}
                                            style={{ backgroundColor: getStrengthColor(index) }}
                                        >
                                            <FiShield size={20} />
                                        </div>
                                        <div className={styles.strengthContent}>
                                            <span className={styles.strengthTitle}>{strength.title}</span>
                                        </div>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleEdit(strength)}
                                            title="Edit strength"
                                            disabled={isSubmitting}
                                        >
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => handleDelete(strength.profilestrength_id, strength.title)}
                                            title="Delete strength"
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
                                            disabled={index === strengths.length - 1 || isSubmitting}
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
                            <FiShield size={48} />
                        </div>
                        <h3 className={styles.emptyTitle}>No strengths added yet</h3>
                        <p className={styles.emptyDescription}>
                            Add your key personal strengths and professional traits
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                            className={styles.emptyButton}
                        >
                            Add Strength
                        </Button>
                    </div>
                )}
            </SectionLayout>

            {/* Modal for Add/Edit */}
            {showModal && (
                <SectionModal
                    opened={true}
                    onClose={handleCancel}
                    title={editingStrength ? 'Edit Strength' : 'Add Strength'}
                    subtitle={editingStrength ? `Update "${editingStrength.title}"` : 'Add a new personal strength'}
                    onSave={handleSubmit(handleFormSubmit)}
                    isSaving={isSubmitting}
                    saveText={editingStrength ? 'Update' : 'Add'}
                    size="md"
                >
                    <FormProvider {...methods}>
                        <form className={styles.modalForm} onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Strength Details</h3>
                                        <p className={styles.sectionDescription}>
                                            Enter a key strength or professional trait
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <FormInput
                                        name="title"
                                        label="Strength"
                                        placeholder="e.g., Problem Solving, Leadership, Communication"
                                        icon={<FiShield size={16} />}
                                        required
                                        autoFocus
                                        disabled={isSubmitting}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <p className={styles.modalHint}>
                                        Be specific and focus on strengths that are relevant to your professional profile.
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

export default StrengthsSection;