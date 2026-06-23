'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiHeart, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
    FiArrowUp, FiArrowDown, FiMusic, FiBook, FiCamera,
    FiCoffee, FiTarget
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import Button from '@/components/common/buttons/Button';
import Loader from '@/components/common/Loader';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useGetHobbiesQuery,
    useCreateHobbyMutation,
    useUpdateHobbyMutation,
    useDeleteHobbyMutation,
    useReorderHobbiesMutation,
} from '@/services/api/portfolioApi';
import { hobbySchema } from '@/lib/validations/portfolio/sections/hobbySchema';
import styles from '@/styles/portfolio/sections/HobbiesSection.module.css';

// Random icons for visual variety
const hobbyIcons = [FiMusic, FiBook, FiCamera, FiCoffee, FiTarget, FiHeart];

const getHobbyIcon = (index) => {
    const IconComponent = hobbyIcons[index % hobbyIcons.length];
    return <IconComponent size={16} />;
};

const HobbiesSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // API
    const { data, isLoading, refetch } = useGetHobbiesQuery(snapshotId, { skip: !snapshotId });
    const [createHobby, { isLoading: isCreating }] = useCreateHobbyMutation();
    const [updateHobby, { isLoading: isUpdating }] = useUpdateHobbyMutation();
    const [deleteHobby, { isLoading: isDeleting }] = useDeleteHobbyMutation();
    const [reorderHobbies] = useReorderHobbiesMutation();

    const hobbies = data?.data || [];
    const isSubmitting = isCreating || isUpdating;

    const methods = useForm({
        resolver: zodResolver(hobbySchema),
        defaultValues: {
            hobby_name: '',
        },
    });

    const { reset, handleSubmit, setValue } = methods;

    const handleFormSubmit = async (formData) => {
        try {
            if (editingId) {
                await updateHobby({ hobbyId: editingId, data: formData }).unwrap();
                showSnackbar('Hobby updated', 'success', 3000);
            } else {
                await createHobby({ snapshotId, data: formData }).unwrap();
                showSnackbar('Hobby added', 'success', 3000);
            }
            reset();
            setEditingId(null);
            setShowForm(false);
            refetch();
            
            // NEW: Notify parent to refresh preview
            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save hobby'), 'error', 5000);
        }
    };

    const handleEdit = (hobby) => {
        setValue('hobby_name', hobby.hobby_name);
        setEditingId(hobby.profilehobby_id);
        setShowForm(true);
    };

    const handleDelete = async (hobbyId, hobbyName) => {
        const ok = await confirm({
            title: 'Delete Hobby',
            message: `Are you sure you want to delete "${hobbyName}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        });
        if (!ok) return;
        try {
            await deleteHobby(hobbyId).unwrap();
            showSnackbar('Hobby deleted', 'success', 3000);
            refetch();
            
            // NEW: Notify parent to refresh preview
            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete'), 'error', 5000);
        }
    };

    const handleMove = async (index, direction) => {
        const newItems = [...hobbies];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        try {
            await reorderHobbies({
                snapshotId,
                data: { order: newItems.map(item => item.profilehobby_id) },
            }).unwrap();
            refetch();
            
            // NEW: Notify parent to refresh preview
            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    const handleCancel = () => {
        reset();
        setEditingId(null);
        setShowForm(false);
    };

    if (isLoading) return <Loader text="Loading hobbies..." />;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Hobbies & Interests</h3>
                    <p className={styles.subtitle}>
                        Add your personal interests and activities
                    </p>
                </div>
                {!showForm && (
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowForm(true)}
                        icon={<FiPlus />}
                    >
                        Add Hobby
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
                                    name="hobby_name"
                                    label="Hobby Name"
                                    placeholder="e.g., Photography, Reading, Traveling"
                                    icon={<FiHeart />}
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

            {/* Hobbies List - Tag/Pill Style */}
            {hobbies.length > 0 ? (
                <div className={styles.hobbiesGrid}>
                    {hobbies.map((hobby, index) => (
                        <div key={hobby.profilehobby_id} className={styles.hobbyItem}>
                            {/* Order Controls */}
                            <div className={styles.orderControls}>
                                <button
                                    className={styles.orderButton}
                                    onClick={() => handleMove(index, -1)}
                                    disabled={index === 0}
                                    title="Move up"
                                >
                                    <FiArrowUp size={10} />
                                </button>
                                <span className={styles.orderNumber}>{index + 1}</span>
                                <button
                                    className={styles.orderButton}
                                    onClick={() => handleMove(index, 1)}
                                    disabled={index === hobbies.length - 1}
                                    title="Move down"
                                >
                                    <FiArrowDown size={10} />
                                </button>
                            </div>

                            {/* Hobby Content */}
                            <div className={styles.hobbyContent}>
                                <span className={styles.hobbyIcon}>
                                    {getHobbyIcon(index)}
                                </span>
                                <span className={styles.hobbyName}>{hobby.hobby_name}</span>
                            </div>

                            {/* Actions */}
                            <div className={styles.hobbyActions}>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handleEdit(hobby)}
                                    title="Edit"
                                >
                                    <FiEdit2 size={14} />
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(hobby.profilehobby_id, hobby.hobby_name)}
                                    title="Delete"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <FiHeart size={32} />
                    <p>No hobbies added yet</p>
                    {!showForm && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowForm(true)}
                            icon={<FiPlus />}
                        >
                            Add your first hobby
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default HobbiesSection;