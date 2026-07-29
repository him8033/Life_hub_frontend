// src/components/portfolio/sections/EducationSection.jsx

'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiBook, FiPlus, FiEdit2, FiTrash2, FiArrowUp, FiArrowDown,
    FiCalendar, FiMapPin, FiAward, FiInfo, FiLink, FiX, FiCheck
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import FormSelect from '@/components/common/forms/FormSelect';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { SectionModal } from './common/SectionModal';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useGetProfileEducationQuery,
    useCreateProfileEducationMutation,
    useUpdateProfileEducationMutation,
    useDeleteProfileEducationMutation,
    useReorderProfileEducationMutation,
} from '@/services/api/portfolioApi';
import { educationSchema } from '@/lib/validations/portfolio/sections/educationSchema';
import styles from '@/styles/portfolio/sections/EducationSection.module.css';

const EducationSection = ({
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
    const [editingEducation, setEditingEducation] = useState(null);

    const { data, isLoading, refetch } = useGetProfileEducationQuery(snapshotId, { skip: !snapshotId });
    const [createEducation, { isLoading: isCreating }] = useCreateProfileEducationMutation();
    const [updateEducation, { isLoading: isUpdating }] = useUpdateProfileEducationMutation();
    const [deleteEducation] = useDeleteProfileEducationMutation();
    const [reorderEducation] = useReorderProfileEducationMutation();

    const educations = data?.data || [];
    const isSubmitting = isCreating || isUpdating;

    const methods = useForm({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            degree_name: '',
            institution_name: '',
            start_date: '',
            end_date: '',
            is_current: 'false',
            score: '',
            description: '',
            full_address: '',
        },
    });

    const { reset, handleSubmit, watch } = methods;
    const isCurrent = watch('is_current');

    const handleAdd = () => {
        setEditingEducation(null);
        reset({
            degree_name: '',
            institution_name: '',
            start_date: '',
            end_date: '',
            is_current: 'false',
            score: '',
            description: '',
            full_address: '',
        });
        setShowModal(true);
    };

    const handleCancel = () => {
        reset();
        setEditingEducation(null);
        setShowModal(false);
    };

    const handleFormSubmit = async (formData) => {
        try {
            const payload = {
                ...formData,
                is_current: formData.is_current === 'true',
                end_date: formData.is_current === 'true' ? null : formData.end_date || null,
            };

            if (editingEducation) {
                await updateEducation({
                    eduId: editingEducation.profileeducation_id,
                    data: payload
                }).unwrap();
                showSnackbar('Education updated successfully', 'success', 3000);
            } else {
                await createEducation({ snapshotId, data: payload }).unwrap();
                showSnackbar('Education added successfully', 'success', 3000);
            }
            handleCancel();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save education'), 'error', 5000);
        }
    };

    const handleEdit = (edu) => {
        setEditingEducation(edu);
        reset({
            degree_name: edu.degree_name,
            institution_name: edu.institution_name,
            start_date: edu.start_date,
            end_date: edu.end_date || '',
            is_current: String(edu.is_current ?? false),
            score: edu.score || '',
            description: edu.description || '',
            full_address: edu.full_address || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (eduId, degreeName) => {
        const ok = await confirm({
            title: 'Delete Education',
            message: `Are you sure you want to delete "${degreeName}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        });
        if (!ok) return;
        try {
            await deleteEducation(eduId).unwrap();
            showSnackbar('Education deleted', 'success', 3000);
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete'), 'error', 5000);
        }
    };

    const handleMove = async (index, direction) => {
        const newList = [...educations];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newList.length) return;
        [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];

        try {
            await reorderEducation({
                snapshotId,
                data: { order: newList.map(e => e.profileeducation_id) },
            }).unwrap();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    if (isLoading) return null;

    return (
        <>
            <SectionLayout
                title="Education"
                subtitle={`${educations.length} education${educations.length !== 1 ? 's' : ''}`}
                icon={FiBook}
                isLoading={isLoading}
                isSaving={isSubmitting}
                hasData={educations.length > 0}
                onSave={handleAdd}
                saveButtonText="Add Education"
                onPrevious={onPrevious}
                onNext={onNext}
                showPrevious={showPrevious}
                showNext={showNext}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                previousSectionName={previousSectionName}
                nextSectionName={nextSectionName}
            >
                {educations.length > 0 ? (
                    <div className={styles.educationContainer}>
                        {educations.map((edu, index) => (
                            <div key={edu.profileeducation_id} className={styles.educationCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.educationInfo}>
                                        <h3 className={styles.educationTitle}>{edu.degree_name}</h3>
                                        {edu.is_current && (
                                            <span className={styles.currentBadge}>Current</span>
                                        )}
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleEdit(edu)}
                                            title="Edit education"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => handleDelete(edu.profileeducation_id, edu.degree_name)}
                                            title="Delete education"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    <div className={styles.iconWrapper}>
                                        <FiBook size={32} />
                                    </div>

                                    <div className={styles.content}>
                                        <p className={styles.institutionName}>{edu.institution_name}</p>

                                        <div className={styles.meta}>
                                            <span className={styles.dateRange}>
                                                <FiCalendar size={14} />
                                                {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                                            </span>
                                            {edu.score && (
                                                <span className={styles.scoreBadge}>
                                                    <FiAward size={12} />
                                                    {edu.score}
                                                </span>
                                            )}
                                            {edu.full_address && (
                                                <span className={styles.location}>
                                                    <FiMapPin size={14} />
                                                    {edu.full_address}
                                                </span>
                                            )}
                                        </div>

                                        {edu.description && (
                                            <p className={styles.description}>{edu.description}</p>
                                        )}
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
                                            disabled={index === educations.length - 1 || isSubmitting}
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
                            <FiBook size={48} />
                        </div>
                        <h3 className={styles.emptyTitle}>No education added yet</h3>
                        <p className={styles.emptyDescription}>
                            Add your academic qualifications to showcase your educational background
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                            className={styles.emptyButton}
                        >
                            Add Education
                        </Button>
                    </div>
                )}
            </SectionLayout>

            {/* Modal for Add/Edit */}
            {showModal && (
                <SectionModal
                    opened={true}
                    onClose={handleCancel}
                    title={editingEducation ? 'Edit Education' : 'Add Education'}
                    subtitle={editingEducation ? `Update "${editingEducation.degree_name}"` : 'Add your academic qualification'}
                    onSave={handleSubmit(handleFormSubmit)}
                    isSaving={isSubmitting}
                    saveText={editingEducation ? 'Update' : 'Add'}
                    size="lg"
                >
                    <FormProvider {...methods}>
                        <form className={styles.modalForm}>
                            {/* Degree & Institution Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Degree & Institution</h3>
                                        <p className={styles.sectionDescription}>
                                            Basic information about your education
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.formRow}>
                                        <FormInput
                                            name="degree_name"
                                            label="Degree *"
                                            placeholder="e.g., Bachelor of Technology"
                                            icon={<FiBook size={16} />}
                                            required
                                            disabled={isSubmitting}
                                        />
                                        <FormInput
                                            name="institution_name"
                                            label="Institution *"
                                            placeholder="e.g., IIT Delhi"
                                            icon={<FiAward size={16} />}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Duration & Details Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiLink className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Duration & Details</h3>
                                        <p className={styles.sectionDescription}>
                                            Dates, score and location
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.formRow}>
                                        <FormInput
                                            name="start_date"
                                            label="Start Date *"
                                            type="date"
                                            icon={<FiCalendar size={16} />}
                                            required
                                            disabled={isSubmitting}
                                        />
                                        {isCurrent !== 'true' && (
                                            <FormInput
                                                name="end_date"
                                                label="End Date"
                                                type="date"
                                                icon={<FiCalendar size={16} />}
                                                disabled={isSubmitting}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.formRow}>
                                        <FormSelect
                                            name="is_current"
                                            label="Currently Studying?"
                                            options={[
                                                { value: 'false', label: 'No' },
                                                { value: 'true', label: 'Yes' },
                                            ]}
                                            disabled={isSubmitting}
                                        />
                                        <FormInput
                                            name="score"
                                            label="Score / Grade"
                                            placeholder="e.g., 8.5 CGPA, 85%"
                                            icon={<FiAward size={16} />}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <FormInput
                                        name="full_address"
                                        label="Location"
                                        placeholder="City, State, Country"
                                        icon={<FiMapPin size={16} />}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Description</h3>
                                        <p className={styles.sectionDescription}>
                                            Additional details about your education
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <FormTextarea
                                        name="description"
                                        label="Description"
                                        placeholder="Additional details about your education..."
                                        rows={3}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </SectionModal>
            )}
        </>
    );
};

export default EducationSection;