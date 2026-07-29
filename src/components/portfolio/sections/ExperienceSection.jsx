// src/components/portfolio/sections/ExperienceSection.jsx

'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiBriefcase, FiPlus, FiEdit2, FiTrash2,
    FiCalendar, FiMapPin, FiImage, FiX, FiCheck,
    FiArrowUp, FiArrowDown, FiInfo, FiLink
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import FormSelect from '@/components/common/forms/FormSelect';
import SquareImageUpload from '@/components/common/SquareImageUpload';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { SectionModal } from './common/SectionModal';
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

const ExperienceSection = ({
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
    const [editingExperience, setEditingExperience] = useState(null);
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
        defaultValues: {
            company_name: '',
            role: '',
            employment_type: '',
            start_date: '',
            end_date: '',
            is_current: 'false',
            description: '',
            full_address: ''
        },
    });

    const { reset, handleSubmit, watch } = methods;
    const isCurrent = watch('is_current');

    const handleLogoSelect = (file, url) => {
        setLogoFile(file);
        setLogoPreview(url);
        setRemoveLogo(false);
    };

    const handleLogoRemove = () => {
        setLogoFile(null);
        setLogoPreview('');
        setRemoveLogo(false);
    };

    const handleRemoveExistingLogo = () => {
        setLogoFile(null);
        setLogoPreview('');
        setRemoveLogo(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            const payload = new FormData();
            payload.append('company_name', formData.company_name);
            payload.append('role', formData.role);
            payload.append('employment_type', formData.employment_type);
            payload.append('start_date', formData.start_date);
            payload.append('is_current', formData.is_current === 'true');
            if (formData.end_date && formData.is_current !== 'true') {
                payload.append('end_date', formData.end_date);
            }
            if (formData.description) payload.append('description', formData.description);
            if (formData.full_address) payload.append('full_address', formData.full_address);

            if (removeLogo) {
                payload.append('remove_company_logo', 'true');
            } else if (logoFile) {
                payload.append('company_logo', logoFile, logoFile.name);
            }

            if (editingExperience) {
                await updateExperience({
                    expId: editingExperience.profileexperience_id,
                    data: payload
                }).unwrap();
                showSnackbar('Experience updated successfully', 'success', 3000);
            } else {
                await createExperience({ snapshotId, data: payload }).unwrap();
                showSnackbar('Experience added successfully', 'success', 3000);
            }
            handleCancel();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save experience'), 'error', 5000);
        }
    };

    const handleAdd = () => {
        setEditingExperience(null);
        reset({
            company_name: '',
            role: '',
            employment_type: '',
            start_date: '',
            end_date: '',
            is_current: 'false',
            description: '',
            full_address: ''
        });
        setLogoFile(null);
        setLogoPreview('');
        setRemoveLogo(false);
        setShowModal(true);
    };

    const handleEdit = (exp) => {
        setEditingExperience(exp);
        reset({
            company_name: exp.company_name,
            role: exp.role,
            employment_type: exp.employment_type,
            start_date: exp.start_date,
            end_date: exp.end_date || '',
            is_current: String(exp.is_current ?? false),
            description: exp.description || '',
            full_address: exp.full_address || '',
        });
        if (exp.company_logo_url) {
            setLogoPreview(exp.company_logo_url);
        }
        setLogoFile(null);
        setRemoveLogo(false);
        setShowModal(true);
    };

    const handleCancel = () => {
        reset();
        setEditingExperience(null);
        setLogoFile(null);
        setLogoPreview('');
        setRemoveLogo(false);
        setShowModal(false);
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

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
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
                snapshotId,
                data: { order: newList.map(e => e.profileexperience_id) }
            }).unwrap();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    const formatDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';

    if (isLoading) return null;

    return (
        <>
            <SectionLayout
                title="Experience"
                subtitle={`${experiences.length} experience${experiences.length !== 1 ? 's' : ''}`}
                icon={FiBriefcase}
                isLoading={isLoading}
                isSaving={isSubmitting}
                hasData={experiences.length > 0}
                onSave={handleAdd}
                saveButtonText="Add Experience"
                onPrevious={onPrevious}
                onNext={onNext}
                showPrevious={showPrevious}
                showNext={showNext}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                previousSectionName={previousSectionName}
                nextSectionName={nextSectionName}
            >
                {experiences.length > 0 ? (
                    <div className={styles.experienceContainer}>
                        {experiences.map((exp, index) => (
                            <div key={exp.profileexperience_id} className={styles.experienceCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.experienceInfo}>
                                        <h3 className={styles.experienceTitle}>{exp.role}</h3>
                                        {exp.is_current && (
                                            <span className={styles.currentBadge}>Current</span>
                                        )}
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleEdit(exp)}
                                            title="Edit experience"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => handleDelete(exp.profileexperience_id, exp.role)}
                                            title="Delete experience"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    {exp.company_logo_url ? (
                                        <div className={styles.logoWrapper}>
                                            <img
                                                src={exp.company_logo_url}
                                                alt={exp.company_name}
                                                className={styles.logo}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.logoPlaceholder}>
                                            <FiBriefcase size={32} />
                                            <span>{exp.company_name?.charAt(0) || '?'}</span>
                                        </div>
                                    )}

                                    <div className={styles.content}>
                                        <p className={styles.companyName}>{exp.company_name}</p>
                                        <p className={styles.employmentType}>{exp.employment_type}</p>

                                        <div className={styles.meta}>
                                            <span className={styles.dateRange}>
                                                <FiCalendar size={14} />
                                                {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                            </span>
                                            {exp.full_address && (
                                                <span className={styles.location}>
                                                    <FiMapPin size={14} />
                                                    {exp.full_address}
                                                </span>
                                            )}
                                        </div>

                                        {exp.description && (
                                            <p className={styles.description}>{exp.description}</p>
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
                                            disabled={index === experiences.length - 1 || isSubmitting}
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
                            <FiBriefcase size={48} />
                        </div>
                        <h3 className={styles.emptyTitle}>No experience added yet</h3>
                        <p className={styles.emptyDescription}>
                            Add your work history to showcase your professional journey
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                            className={styles.emptyButton}
                        >
                            Add Experience
                        </Button>
                    </div>
                )}
            </SectionLayout>

            {/* Modal for Add/Edit - Improved Design */}
            {showModal && (
                <SectionModal
                    opened={true}
                    onClose={handleCancel}
                    title={editingExperience ? 'Edit Experience' : 'Add Experience'}
                    subtitle={editingExperience ? `Update "${editingExperience.role}"` : 'Add your work experience'}
                    onSave={handleSubmit(handleFormSubmit)}
                    isSaving={isSubmitting}
                    saveText={editingExperience ? 'Update' : 'Add'}
                    size="lg"
                >
                    <FormProvider {...methods}>
                        <form className={styles.modalForm}>
                            {/* Company & Role Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Company & Role</h3>
                                        <p className={styles.sectionDescription}>
                                            Basic information about your position
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.formRow}>
                                        <FormInput
                                            name="company_name"
                                            label="Company *"
                                            placeholder="Company name"
                                            icon={<FiBriefcase size={16} />}
                                            required
                                            disabled={isSubmitting}
                                        />
                                        <FormInput
                                            name="role"
                                            label="Role *"
                                            placeholder="e.g., Senior Developer"
                                            icon={<FiBriefcase size={16} />}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Employment Details Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiLink className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Employment Details</h3>
                                        <p className={styles.sectionDescription}>
                                            Type, dates and location
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.formRow}>
                                        <FormSelect
                                            name="employment_type"
                                            label="Employment Type *"
                                            options={employmentTypes}
                                            placeholder="Select type"
                                            required
                                            disabled={isSubmitting}
                                        />
                                        <FormSelect
                                            name="is_current"
                                            label="Current Job?"
                                            options={[
                                                { value: 'false', label: 'No' },
                                                { value: 'true', label: 'Yes' }
                                            ]}
                                            disabled={isSubmitting}
                                        />
                                    </div>
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
                                    <FormInput
                                        name="full_address"
                                        label="Location"
                                        placeholder="City, Country"
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
                                            Your responsibilities and achievements
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <FormTextarea
                                        name="description"
                                        label="Description"
                                        placeholder="Describe your responsibilities and achievements..."
                                        rows={3}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Company Logo Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiImage className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Company Logo</h3>
                                        <p className={styles.sectionDescription}>
                                            Upload your company logo
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    {editingExperience && logoPreview && !logoFile && !removeLogo ? (
                                        <div className={styles.existingLogo}>
                                            <img src={logoPreview} alt="Logo" className={styles.logoPreview} />
                                            <button
                                                type="button"
                                                className={styles.removeLogoBtn}
                                                onClick={handleRemoveExistingLogo}
                                                disabled={isSubmitting}
                                            >
                                                <FiX size={12} /> Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <SquareImageUpload
                                            onImageSelect={handleLogoSelect}
                                            onRemove={handleLogoRemove}
                                            previewUrl={logoFile ? logoPreview : ''}
                                            disabled={isSubmitting}
                                            maxSizeMB={2}
                                            label="Upload Logo"
                                            size="small"
                                            enableCrop
                                            aspectRatio={1}
                                            showCropControls
                                        />
                                    )}
                                    <p className={styles.logoHint}>
                                        Square image recommended (e.g., 100×100px)
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

export default ExperienceSection;