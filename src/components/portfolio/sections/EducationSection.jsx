'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiBook, FiPlus, FiEdit2, FiTrash2, FiArrowUp, FiArrowDown,
    FiX, FiCheck, FiCalendar, FiMapPin, FiAward
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import FormSelect from '@/components/common/forms/FormSelect';
import Button from '@/components/common/buttons/Button';
import Loader from '@/components/common/Loader';
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
import { educationSchema } from '@/lib/validations/portfolio/educationSchema';
import styles from '@/styles/portfolio/sections/EducationSection.module.css';

const EducationSection = ({ snapshotId }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, isLoading, refetch } = useGetProfileEducationQuery(snapshotId, { skip: !snapshotId });
    const [createEducation, { isLoading: isCreating }] = useCreateProfileEducationMutation();
    const [updateEducation, { isLoading: isUpdating }] = useUpdateProfileEducationMutation();
    const [deleteEducation, { isLoading: isDeleting }] = useDeleteProfileEducationMutation();
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

    const { reset, handleSubmit, setValue, watch } = methods;
    const isCurrent = watch('is_current');

    const handleFormSubmit = async (formData) => {
        try {
            const payload = {
                ...formData,
                is_current: formData.is_current === 'true',
                end_date: formData.is_current === 'true' ? null : formData.end_date || null,
            };

            if (editingId) {
                await updateEducation({ eduId: editingId, data: payload }).unwrap();
                showSnackbar('Education updated', 'success', 3000);
            } else {
                await createEducation({ snapshotId, data: payload }).unwrap();
                showSnackbar('Education added', 'success', 3000);
            }
            reset();
            setEditingId(null);
            setShowForm(false);
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save education'), 'error', 5000);
        }
    };

    const handleEdit = (edu) => {
        setValue('degree_name', edu.degree_name);
        setValue('institution_name', edu.institution_name);
        setValue('start_date', edu.start_date);
        setValue('end_date', edu.end_date || '');
        setValue('is_current', String(edu.is_current ?? false));
        setValue('score', edu.score || '');
        setValue('description', edu.description || '');
        setValue('full_address', edu.full_address || '');
        setEditingId(edu.profileeducation_id);
        setShowForm(true);
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
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    const handleCancel = () => {
        reset();
        setEditingId(null);
        setShowForm(false);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    if (isLoading) return <Loader text="Loading education..." />;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Education</h3>
                    <p className={styles.subtitle}>Add your academic qualifications</p>
                </div>
                {!showForm && (
                    <Button variant="primary" size="sm" onClick={() => setShowForm(true)} icon={<FiPlus />}>
                        Add Education
                    </Button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className={styles.formCard}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <div className={styles.formRow}>
                                <FormInput name="degree_name" label="Degree *" placeholder="e.g., Bachelor of Technology" icon={<FiBook />} required disabled={isSubmitting} />
                                <FormInput name="institution_name" label="Institution *" placeholder="e.g., IIT Delhi" icon={<FiAward />} required disabled={isSubmitting} />
                            </div>
                            <div className={styles.formRow}>
                                <FormInput name="start_date" label="Start Date *" type="date" icon={<FiCalendar />} required disabled={isSubmitting} />
                                {isCurrent !== 'true' && (
                                    <FormInput name="end_date" label="End Date" type="date" icon={<FiCalendar />} disabled={isSubmitting} />
                                )}
                            </div>
                            <div className={styles.formRow}>
                                <FormSelect name="is_current" label="Currently Studying?" options={[
                                    { value: 'false', label: 'No' },
                                    { value: 'true', label: 'Yes' },
                                ]} disabled={isSubmitting} />
                                <FormInput name="score" label="Score / Grade" placeholder="e.g., 8.5 CGPA, 85%" disabled={isSubmitting} />
                            </div>
                            <FormTextarea name="description" label="Description" placeholder="Additional details..." rows={2} disabled={isSubmitting} />
                            <FormInput name="full_address" label="Address" placeholder="City, State, Country" icon={<FiMapPin />} disabled={isSubmitting} />

                            <div className={styles.formActions}>
                                <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={isSubmitting} icon={<FiX />}>Cancel</Button>
                                <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} loadingText="Saving..." icon={<FiCheck />}>
                                    {editingId ? 'Update' : 'Add'}
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            )}

            {/* Education List */}
            {educations.length > 0 ? (
                <div className={styles.list}>
                    {educations.map((edu, index) => (
                        <div key={edu.profileeducation_id} className={styles.item}>
                            <div className={styles.orderControls}>
                                <button className={styles.orderButton} onClick={() => handleMove(index, -1)} disabled={index === 0}><FiArrowUp size={10} /></button>
                                <span className={styles.orderNumber}>{index + 1}</span>
                                <button className={styles.orderButton} onClick={() => handleMove(index, 1)} disabled={index === educations.length - 1}><FiArrowDown size={10} /></button>
                            </div>

                            <div className={styles.icon}>
                                <FiBook />
                            </div>

                            <div className={styles.info}>
                                <h4 className={styles.degree}>{edu.degree_name}</h4>
                                <p className={styles.institution}>{edu.institution_name}</p>
                                <div className={styles.meta}>
                                    <span className={styles.date}>
                                        <FiCalendar size={12} />
                                        {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                                    </span>
                                    {edu.score && <span className={styles.score}>{edu.score}</span>}
                                    {edu.is_current && <span className={styles.currentBadge}>Current</span>}
                                </div>
                                {edu.description && <p className={styles.description}>{edu.description}</p>}
                            </div>

                            <div className={styles.actions}>
                                <button className={styles.actionButton} onClick={() => handleEdit(edu)} title="Edit"><FiEdit2 size={14} /></button>
                                <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(edu.profileeducation_id, edu.degree_name)} title="Delete"><FiTrash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <FiBook size={32} />
                    <p>No education added yet</p>
                    {!showForm && (
                        <Button variant="outline" size="sm" onClick={() => setShowForm(true)} icon={<FiPlus />}>Add Education</Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default EducationSection;