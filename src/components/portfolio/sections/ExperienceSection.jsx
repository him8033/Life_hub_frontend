'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiBriefcase, FiPlus, FiEdit2, FiTrash2, FiArrowUp, FiArrowDown, FiX, FiCheck, FiCalendar, FiMapPin, FiImage, FiTrash } from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import FormSelect from '@/components/common/forms/FormSelect';
import SquareImageUpload from '@/components/common/SquareImageUpload';
import Button from '@/components/common/buttons/Button';
import Loader from '@/components/common/Loader';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useGetProfileExperienceQuery,
    useCreateProfileExperienceMutation,
    useUpdateProfileExperienceMutation,
    useDeleteProfileExperienceMutation,
    useReorderProfileExperienceMutation,
} from '@/services/api/portfolioApi';
import { experienceSchema } from '@/lib/validations/portfolio/sections/experienceSchema';
import styles from '@/styles/portfolio/sections/ExperienceSection.module.css';

const employmentTypes = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Self-employed', label: 'Self-employed' },
];

const ExperienceSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [removeLogo, setRemoveLogo] = useState(false);

    const { data, isLoading, refetch } = useGetProfileExperienceQuery(snapshotId, { skip: !snapshotId });
    const [createExperience, { isLoading: isCreating }] = useCreateProfileExperienceMutation();
    const [updateExperience, { isLoading: isUpdating }] = useUpdateProfileExperienceMutation();
    const [deleteExperience] = useDeleteProfileExperienceMutation();
    const [reorderExperience] = useReorderProfileExperienceMutation();

    const experiences = data?.data || [];
    const isSubmitting = isCreating || isUpdating;

    const methods = useForm({
        resolver: zodResolver(experienceSchema),
        defaultValues: { company_name: '', role: '', employment_type: '', start_date: '', end_date: '', is_current: 'false', description: '', full_address: '' },
    });

    const { reset, handleSubmit, setValue, watch } = methods;
    const isCurrent = watch('is_current');

    const handleLogoSelect = (file, url) => { setLogoFile(file); setLogoPreview(url); setRemoveLogo(false); };
    const handleLogoRemove = () => { setLogoFile(null); setLogoPreview(''); setRemoveLogo(false); };
    const handleRemoveExistingLogo = () => { setLogoFile(null); setLogoPreview(''); setRemoveLogo(true); };

    const handleFormSubmit = async (formData) => {
        try {
            const payload = new FormData();
            payload.append('company_name', formData.company_name);
            payload.append('role', formData.role);
            payload.append('employment_type', formData.employment_type);
            payload.append('start_date', formData.start_date);
            payload.append('is_current', formData.is_current === 'true');
            if (formData.end_date && formData.is_current !== 'true') payload.append('end_date', formData.end_date);
            if (formData.description) payload.append('description', formData.description);
            if (formData.full_address) payload.append('full_address', formData.full_address);

            if (removeLogo) {
                payload.append('remove_company_logo', 'true');
            } else if (logoFile) {
                payload.append('company_logo', logoFile, logoFile.name);
            }

            if (editingId) {
                await updateExperience({ expId: editingId, data: payload }).unwrap();
                showSnackbar('Experience updated', 'success', 3000);
            } else {
                await createExperience({ snapshotId, data: payload }).unwrap();
                showSnackbar('Experience added', 'success', 3000);
            }
            reset();
            setEditingId(null);
            setShowForm(false);
            setLogoFile(null);
            setLogoPreview('');
            setRemoveLogo(false);
            refetch();

            // NEW: Notify parent to refresh preview
            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save experience'), 'error', 5000);
        }
    };

    const handleEdit = (exp) => {
        setValue('company_name', exp.company_name);
        setValue('role', exp.role);
        setValue('employment_type', exp.employment_type);
        setValue('start_date', exp.start_date);
        setValue('end_date', exp.end_date || '');
        setValue('is_current', String(exp.is_current ?? false));
        setValue('description', exp.description || '');
        setValue('full_address', exp.full_address || '');
        if (exp.company_logo_url) setLogoPreview(exp.company_logo_url);
        setEditingId(exp.profileexperience_id);
        setShowForm(true);
    };

    const handleDelete = async (expId, role) => {
        const ok = await confirm({
            title: 'Delete Experience',
            message: `Delete "${role}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });
        if (!ok) return;
        try {
            await deleteExperience(expId).unwrap();
            showSnackbar('Experience deleted', 'success', 3000);
            refetch();

            // NEW: Notify parent to refresh preview
            if (onDataChange) {
                onDataChange();
            }
        }
        catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete'), 'error', 5000);
        }
    };

    const handleMove = async (index, direction) => {
        const newList = [...experiences];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newList.length) return;
        [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
        try {
            await reorderExperience({
                snapshotId, data: {
                    order: newList.map(e => e.profileexperience_id)
                }
            }).unwrap();
            refetch();

            // NEW: Notify parent to refresh preview
            if (onDataChange) {
                onDataChange();
            }
        }
        catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    const handleCancel = () => {
        reset();
        setEditingId(null);
        setShowForm(false);
        setLogoFile(null);
        setLogoPreview('');
        setRemoveLogo(false);
    };
    
    const formatDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';

    if (isLoading) return <Loader text="Loading experience..." />;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div><h3 className={styles.title}>Experience</h3><p className={styles.subtitle}>Add your work history</p></div>
                {!showForm && <Button variant="primary" size="sm" onClick={() => setShowForm(true)} icon={<FiPlus />}>Add Experience</Button>}
            </div>

            {showForm && (
                <div className={styles.formCard}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <div className={styles.formRow}>
                                <FormInput name="company_name" label="Company *" placeholder="Company name" icon={<FiBriefcase />} required disabled={isSubmitting} />
                                <FormInput name="role" label="Role *" placeholder="e.g., Senior Developer" icon={<FiBriefcase />} required disabled={isSubmitting} />
                            </div>
                            <div className={styles.formRow}>
                                <FormSelect name="employment_type" label="Employment Type *" options={employmentTypes} placeholder="Select type" required disabled={isSubmitting} />
                                <div>
                                    <FormInput name="start_date" label="Start Date *" type="date" icon={<FiCalendar />} required disabled={isSubmitting} />
                                    {isCurrent !== 'true' && <FormInput name="end_date" label="End Date" type="date" icon={<FiCalendar />} disabled={isSubmitting} />}
                                </div>
                            </div>
                            <FormSelect name="is_current" label="Current Job?" options={[{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }]} disabled={isSubmitting} />
                            <FormTextarea name="description" label="Description" placeholder="Job responsibilities..." rows={3} disabled={isSubmitting} />
                            <FormInput name="full_address" label="Location" placeholder="City, Country" icon={<FiMapPin />} disabled={isSubmitting} />

                            <div className={styles.formItem}>
                                <label className={styles.logoLabel}><FiImage /> Company Logo</label>
                                {editingId && logoPreview && !logoFile && !removeLogo && (
                                    <div className={styles.existingLogo}>
                                        <img src={logoPreview} alt="Logo" className={styles.logoPreview} />
                                        <button type="button" className={styles.removeLogoButton} onClick={handleRemoveExistingLogo} disabled={isSubmitting}><FiTrash /> Remove</button>
                                    </div>
                                )}
                                {(!logoPreview || logoFile || removeLogo) && (
                                    <SquareImageUpload onImageSelect={handleLogoSelect} onRemove={handleLogoRemove} previewUrl={logoFile ? logoPreview : ''} disabled={isSubmitting} maxSizeMB={2} label="Upload Logo" size="small" enableCrop aspectRatio={1} showCropControls />
                                )}
                            </div>

                            <div className={styles.formActions}>
                                <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={isSubmitting} icon={<FiX />}>Cancel</Button>
                                <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} loadingText="Saving..." icon={<FiCheck />}>{editingId ? 'Update' : 'Add'}</Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            )}

            {experiences.length > 0 ? (
                <div className={styles.list}>
                    {experiences.map((exp, index) => (
                        <div key={exp.profileexperience_id} className={styles.item}>
                            <div className={styles.orderControls}>
                                <button className={styles.orderButton} onClick={() => handleMove(index, -1)} disabled={index === 0}><FiArrowUp size={10} /></button>
                                <span className={styles.orderNumber}>{index + 1}</span>
                                <button className={styles.orderButton} onClick={() => handleMove(index, 1)} disabled={index === experiences.length - 1}><FiArrowDown size={10} /></button>
                            </div>
                            <div className={styles.logo}>
                                {exp.company_logo_url ? <img src={exp.company_logo_url} alt={exp.company_name} /> : <FiBriefcase />}
                            </div>
                            <div className={styles.info}>
                                <h4 className={styles.role}>{exp.role}</h4>
                                <p className={styles.company}>{exp.company_name} · {exp.employment_type}</p>
                                <div className={styles.meta}>
                                    <span className={styles.date}><FiCalendar size={12} /> {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span>
                                    {exp.is_current && <span className={styles.currentBadge}>Current</span>}
                                </div>
                                {exp.description && <p className={styles.description}>{exp.description}</p>}
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.actionButton} onClick={() => handleEdit(exp)} title="Edit"><FiEdit2 size={14} /></button>
                                <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(exp.profileexperience_id, exp.role)} title="Delete"><FiTrash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}><FiBriefcase size={32} /><p>No experience added yet</p></div>
            )}
        </div>
    );
};

export default ExperienceSection;