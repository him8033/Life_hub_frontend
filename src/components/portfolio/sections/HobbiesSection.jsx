// src/components/portfolio/sections/HobbiesSection.jsx

'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiHeart, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
    FiArrowUp, FiArrowDown, FiInfo, FiMusic, FiBook, FiCamera,
    FiCoffee, FiTarget, FiCode, FiDroplet, FiSun, FiMoon
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { SectionModal } from './common/SectionModal';
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

// Array of colors for hobby icons
const HOBBY_COLORS = [
    '#ec4899', // pink
    '#f59e0b', // warning
    '#10b981', // success
    '#667eea', // primary
    '#ef4444', // error
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#14b8a6', // teal
    '#f97316', // orange
    '#22d3ee', // cyan
];

// Random icons for visual variety
const hobbyIcons = [
    FiMusic, FiBook, FiCamera, FiCoffee, FiTarget,
    FiHeart, FiCode, FiDroplet, FiSun, FiMoon
];

const getHobbyIcon = (index) => {
    const IconComponent = hobbyIcons[index % hobbyIcons.length];
    return <IconComponent size={20} />;
};

const HobbiesSection = ({
    snapshotId,
    onDataChange,
    onPrevious,
    onNext,
    showPrevious = false,
    showNext = false,
    isFirstStep = false,
    isLastStep = false,
    previousSectionName = '',
    nextSectionName = '',
}) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showModal, setShowModal] = useState(false);
    const [editingHobby, setEditingHobby] = useState(null);

    const { data, isLoading, refetch } = useGetHobbiesQuery(snapshotId, { skip: !snapshotId });
    const [createHobby, { isLoading: isCreating }] = useCreateHobbyMutation();
    const [updateHobby, { isLoading: isUpdating }] = useUpdateHobbyMutation();
    const [deleteHobby] = useDeleteHobbyMutation();
    const [reorderHobbies] = useReorderHobbiesMutation();

    const hobbies = data?.data || [];
    const isSubmitting = isCreating || isUpdating;

    const methods = useForm({
        resolver: zodResolver(hobbySchema),
        defaultValues: {
            hobby_name: '',
        },
    });

    const { reset, handleSubmit } = methods;

    const getHobbyColor = (index) => {
        return HOBBY_COLORS[index % HOBBY_COLORS.length];
    };

    const handleAdd = () => {
        setEditingHobby(null);
        reset({ hobby_name: '' });
        setShowModal(true);
    };

    const handleEdit = (hobby) => {
        setEditingHobby(hobby);
        reset({ hobby_name: hobby.hobby_name });
        setShowModal(true);
    };

    const handleCancel = () => {
        reset();
        setEditingHobby(null);
        setShowModal(false);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingHobby) {
                await updateHobby({
                    hobbyId: editingHobby.profilehobby_id,
                    data: formData
                }).unwrap();
                showSnackbar('Hobby updated successfully', 'success', 3000);
            } else {
                await createHobby({ snapshotId, data: formData }).unwrap();
                showSnackbar('Hobby added successfully', 'success', 3000);
            }
            handleCancel();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save hobby'), 'error', 5000);
        }
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

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    // Handle Enter key press in form
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(handleFormSubmit)();
        }
    };

    if (isLoading) return null;

    return (
        <>
            <SectionLayout
                title="Hobbies & Interests"
                subtitle={`${hobbies.length} hobby${hobbies.length !== 1 ? 's' : ''}`}
                icon={FiHeart}
                isLoading={isLoading}
                isSaving={isSubmitting}
                hasData={hobbies.length > 0}
                onSave={handleAdd}
                saveButtonText="Add Hobby"
                onPrevious={onPrevious}
                onNext={onNext}
                showPrevious={showPrevious}
                showNext={showNext}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                previousSectionName={previousSectionName}
                nextSectionName={nextSectionName}
            >
                {hobbies.length > 0 ? (
                    <div className={styles.hobbiesGrid}>
                        {hobbies.map((hobby, index) => (
                            <div key={hobby.profilehobby_id} className={styles.hobbyCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.hobbyInfo}>
                                        <div
                                            className={styles.hobbyIcon}
                                            style={{ backgroundColor: getHobbyColor(index) }}
                                        >
                                            {getHobbyIcon(index)}
                                        </div>
                                        <div className={styles.hobbyContent}>
                                            <span className={styles.hobbyName}>{hobby.hobby_name}</span>
                                        </div>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleEdit(hobby)}
                                            title="Edit hobby"
                                            disabled={isSubmitting}
                                        >
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => handleDelete(hobby.profilehobby_id, hobby.hobby_name)}
                                            title="Delete hobby"
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
                                            disabled={index === hobbies.length - 1 || isSubmitting}
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
                            <FiHeart size={48} />
                        </div>
                        <h3 className={styles.emptyTitle}>No hobbies added yet</h3>
                        <p className={styles.emptyDescription}>
                            Add your personal interests and activities
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                            className={styles.emptyButton}
                        >
                            Add Hobby
                        </Button>
                    </div>
                )}
            </SectionLayout>

            {/* Modal for Add/Edit */}
            {showModal && (
                <SectionModal
                    opened={true}
                    onClose={handleCancel}
                    title={editingHobby ? 'Edit Hobby' : 'Add Hobby'}
                    subtitle={editingHobby ? `Update "${editingHobby.hobby_name}"` : 'Add a new hobby or interest'}
                    onSave={handleSubmit(handleFormSubmit)}
                    isSaving={isSubmitting}
                    saveText={editingHobby ? 'Update' : 'Add'}
                    size="md"
                >
                    <FormProvider {...methods}>
                        <form className={styles.modalForm} onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Hobby Details</h3>
                                        <p className={styles.sectionDescription}>
                                            Enter a hobby or personal interest
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <FormInput
                                        name="hobby_name"
                                        label="Hobby Name *"
                                        placeholder="e.g., Photography, Reading, Traveling"
                                        icon={<FiHeart size={16} />}
                                        required
                                        autoFocus
                                        disabled={isSubmitting}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <p className={styles.modalHint}>
                                        Add hobbies that showcase your personality and interests outside of work.
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

export default HobbiesSection;