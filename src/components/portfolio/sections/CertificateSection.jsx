// src/components/portfolio/sections/CertificateSection.jsx

'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiAward, FiPlus, FiEdit2, FiTrash2, FiArrowUp, FiArrowDown,
    FiX, FiCheck, FiCalendar, FiImage, FiLink, FiHash, FiInfo
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import SquareImageUpload from '@/components/common/SquareImageUpload';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { SectionModal } from './common/SectionModal';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useGetProfileCertificatesQuery,
    useCreateProfileCertificateMutation,
    useUpdateProfileCertificateMutation,
    useDeleteProfileCertificateMutation,
    useReorderProfileCertificatesMutation,
} from '@/services/api/portfolioApi';
import { certificateSchema } from '@/lib/validations/portfolio/sections/certificateSchema';
import styles from '@/styles/portfolio/sections/CertificateSection.module.css';

const CertificateSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showModal, setShowModal] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState(null);
    const [certFile, setCertFile] = useState(null);
    const [certPreview, setCertPreview] = useState('');
    const [removeImage, setRemoveImage] = useState(false);

    const { data, isLoading, refetch } = useGetProfileCertificatesQuery(snapshotId, { skip: !snapshotId });
    const [createCert, { isLoading: isCreating }] = useCreateProfileCertificateMutation();
    const [updateCert, { isLoading: isUpdating }] = useUpdateProfileCertificateMutation();
    const [deleteCert] = useDeleteProfileCertificateMutation();
    const [reorderCert] = useReorderProfileCertificatesMutation();

    const certificates = data?.data || [];
    const isSubmitting = isCreating || isUpdating;

    const methods = useForm({
        resolver: zodResolver(certificateSchema),
        defaultValues: {
            title: '',
            issued_by: '',
            issued_date: '',
            expiry_date: '',
            credential_id: '',
            certificate_url: '',
            description: ''
        }
    });

    const { reset, handleSubmit } = methods;

    const handleAdd = () => {
        setEditingCertificate(null);
        reset({
            title: '',
            issued_by: '',
            issued_date: '',
            expiry_date: '',
            credential_id: '',
            certificate_url: '',
            description: ''
        });
        setCertFile(null);
        setCertPreview('');
        setRemoveImage(false);
        setShowModal(true);
    };

    const handleCancel = () => {
        reset();
        setEditingCertificate(null);
        setShowModal(false);
        setCertFile(null);
        setCertPreview('');
        setRemoveImage(false);
    };

    const handleImageSelect = (file, previewUrl) => {
        setCertFile(file);
        setCertPreview(previewUrl);
        setRemoveImage(false);
    };

    const handleImageRemove = () => {
        setCertFile(null);
        setCertPreview('');
        setRemoveImage(false);
    };

    const handleRemoveExistingImage = () => {
        setCertFile(null);
        setCertPreview('');
        setRemoveImage(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            const fd = new FormData();
            fd.append('title', formData.title);
            if (formData.issued_by) fd.append('issued_by', formData.issued_by);
            if (formData.issued_date) fd.append('issued_date', formData.issued_date);
            if (formData.expiry_date) fd.append('expiry_date', formData.expiry_date);
            if (formData.credential_id) fd.append('credential_id', formData.credential_id);
            if (formData.certificate_url) fd.append('certificate_url', formData.certificate_url);
            if (formData.description) fd.append('description', formData.description);

            // Image handling
            if (removeImage) {
                fd.append('remove_image', 'true');
            } else if (certFile) {
                fd.append('image', certFile, certFile.name);
            }

            if (editingCertificate) {
                await updateCert({
                    certId: editingCertificate.profilecertificate_id,
                    data: fd
                }).unwrap();
                showSnackbar('Certificate updated successfully', 'success', 3000);
            } else {
                await createCert({ snapshotId, data: fd }).unwrap();
                showSnackbar('Certificate added successfully', 'success', 3000);
            }

            handleCancel();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save certificate'), 'error', 5000);
        }
    };

    const handleEdit = (cert) => {
        setEditingCertificate(cert);
        reset({
            title: cert.title,
            issued_by: cert.issued_by || '',
            issued_date: cert.issued_date || '',
            expiry_date: cert.expiry_date || '',
            credential_id: cert.credential_id || '',
            certificate_url: cert.certificate_url || '',
            description: cert.description || ''
        });
        if (cert.image_url) {
            setCertPreview(cert.image_url);
        }
        setCertFile(null);
        setRemoveImage(false);
        setShowModal(true);
    };

    const handleDelete = async (certId, title) => {
        const ok = await confirm({
            title: 'Delete Certificate',
            message: `Delete "${title}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });
        if (!ok) return;
        try {
            await deleteCert(certId).unwrap();
            showSnackbar('Certificate deleted', 'success', 3000);
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete'), 'error', 5000);
        }
    };

    const handleMove = async (index, direction) => {
        const list = [...certificates];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= list.length) return;

        [list[index], list[targetIndex]] = [list[targetIndex], list[index]];
        try {
            await reorderCert({
                snapshotId,
                data: { order: list.map(c => c.profilecertificate_id) }
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
                title="Certificates"
                subtitle={`${certificates.length} certificate${certificates.length !== 1 ? 's' : ''}`}
                icon={FiAward}
                isLoading={isLoading}
                isSaving={isSubmitting}
                hasData={certificates.length > 0}
                onSave={handleAdd}
                saveButtonText="Add Certificate"
            >
                {certificates.length > 0 ? (
                    <div className={styles.certificateContainer}>
                        {certificates.map((cert, index) => (
                            <div key={cert.profilecertificate_id} className={styles.certificateCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.certificateInfo}>
                                        <h3 className={styles.certificateTitle}>{cert.title}</h3>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleEdit(cert)}
                                            title="Edit certificate"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => handleDelete(cert.profilecertificate_id, cert.title)}
                                            title="Delete certificate"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    {cert.image_url ? (
                                        <div className={styles.imageWrapper}>
                                            <img
                                                src={cert.image_url}
                                                alt={cert.title}
                                                className={styles.certificateImage}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.imagePlaceholder}>
                                            <FiAward size={32} />
                                            <span>No image</span>
                                        </div>
                                    )}

                                    <div className={styles.content}>
                                        <p className={styles.issuedBy}>{cert.issued_by || '—'}</p>

                                        <div className={styles.meta}>
                                            {(cert.issued_date || cert.expiry_date) && (
                                                <span className={styles.dateRange}>
                                                    <FiCalendar size={14} />
                                                    {formatDate(cert.issued_date)}
                                                    {cert.expiry_date ? ` → ${formatDate(cert.expiry_date)}` : ''}
                                                </span>
                                            )}
                                            {cert.credential_id && (
                                                <span className={styles.credentialBadge}>
                                                    <FiHash size={12} />
                                                    {cert.credential_id}
                                                </span>
                                            )}
                                        </div>

                                        {cert.certificate_url && (
                                            <a
                                                href={cert.certificate_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.verifyLink}
                                            >
                                                <FiLink size={14} />
                                                Verify Credential
                                            </a>
                                        )}

                                        {cert.description && (
                                            <p className={styles.description}>{cert.description}</p>
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
                                            disabled={index === certificates.length - 1 || isSubmitting}
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
                        <h3 className={styles.emptyTitle}>No certificates added yet</h3>
                        <p className={styles.emptyDescription}>
                            Showcase your certifications and professional achievements
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                            className={styles.emptyButton}
                        >
                            Add Certificate
                        </Button>
                    </div>
                )}
            </SectionLayout>

            {/* Modal for Add/Edit */}
            {showModal && (
                <SectionModal
                    opened={true}
                    onClose={handleCancel}
                    title={editingCertificate ? 'Edit Certificate' : 'Add Certificate'}
                    subtitle={editingCertificate ? `Update "${editingCertificate.title}"` : 'Add your certification'}
                    onSave={handleSubmit(handleFormSubmit)}
                    isSaving={isSubmitting}
                    saveText={editingCertificate ? 'Update' : 'Add'}
                    size="lg"
                >
                    <FormProvider {...methods}>
                        <form className={styles.modalForm}>
                            {/* Certificate Details Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Certificate Details</h3>
                                        <p className={styles.sectionDescription}>
                                            Basic information about your certification
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.formRow}>
                                        <FormInput
                                            name="title"
                                            label="Certificate Title *"
                                            placeholder="e.g., AWS Solutions Architect"
                                            icon={<FiAward size={16} />}
                                            required
                                            disabled={isSubmitting}
                                        />
                                        <FormInput
                                            name="issued_by"
                                            label="Issued By"
                                            placeholder="e.g., Amazon Web Services"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dates & Credentials Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Dates & Credentials</h3>
                                        <p className={styles.sectionDescription}>
                                            Issue date, expiry date and credential ID
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.formRow}>
                                        <FormInput
                                            name="issued_date"
                                            label="Issue Date"
                                            type="date"
                                            icon={<FiCalendar size={16} />}
                                            disabled={isSubmitting}
                                        />
                                        <FormInput
                                            name="expiry_date"
                                            label="Expiry Date"
                                            type="date"
                                            icon={<FiCalendar size={16} />}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className={styles.formRow}>
                                        <FormInput
                                            name="credential_id"
                                            label="Credential ID"
                                            placeholder="e.g., AWS-12345"
                                            icon={<FiHash size={16} />}
                                            disabled={isSubmitting}
                                        />
                                        <FormInput
                                            name="certificate_url"
                                            label="Verification URL"
                                            placeholder="https://..."
                                            icon={<FiLink size={16} />}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Description</h3>
                                        <p className={styles.sectionDescription}>
                                            Additional details about your certification
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <FormTextarea
                                        name="description"
                                        label="Description"
                                        placeholder="Additional details about your certification..."
                                        rows={3}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Certificate Image Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiImage className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Certificate Image</h3>
                                        <p className={styles.sectionDescription}>
                                            Upload a certificate image or badge
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    {editingCertificate && certPreview && !certFile && !removeImage ? (
                                        <div className={styles.existingImage}>
                                            <img src={certPreview} alt="Certificate" className={styles.imagePreview} />
                                            <button
                                                type="button"
                                                className={styles.removeImageBtn}
                                                onClick={handleRemoveExistingImage}
                                                disabled={isSubmitting}
                                            >
                                                <FiX size={12} /> Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <SquareImageUpload
                                            onImageSelect={handleImageSelect}
                                            onRemove={handleImageRemove}
                                            previewUrl={certFile ? certPreview : ''}
                                            disabled={isSubmitting}
                                            maxSizeMB={3}
                                            label="Upload Certificate Image"
                                            size="small"
                                            enableCrop
                                            aspectRatio={4 / 3}
                                            showCropControls
                                        />
                                    )}
                                    <p className={styles.imageHint}>
                                        Recommended aspect ratio: 4:3 (e.g., 400×300px)
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

export default CertificateSection;