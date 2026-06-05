'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiAward, FiPlus, FiEdit2, FiTrash2, FiArrowUp, FiArrowDown, FiX, FiCheck, FiCalendar, FiImage, FiLink, FiHash, FiTrash2 as FiTrash } from 'react-icons/fi';
import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import SquareImageUpload from '@/components/common/SquareImageUpload';
import Button from '@/components/common/buttons/Button';
import Loader from '@/components/common/Loader';
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
import { certificateSchema } from '@/lib/validations/portfolio/certificateSchema';
import styles from '@/styles/portfolio/sections/EducationSection.module.css';

const CertificateSection = ({ snapshotId }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
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

    const methods = useForm({ resolver: zodResolver(certificateSchema), defaultValues: { title: '', issued_by: '', issued_date: '', expiry_date: '', credential_id: '', certificate_url: '', description: '' } });
    const { reset, handleSubmit, setValue } = methods;

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
            if (removeImage) fd.append('remove_image', 'true');
            else if (certFile) fd.append('image', certFile, certFile.name);

            if (editingId) { await updateCert({ certId: editingId, data: fd }).unwrap(); showSnackbar('Certificate updated', 'success', 3000); }
            else { await createCert({ snapshotId, data: fd }).unwrap(); showSnackbar('Certificate added', 'success', 3000); }
            reset(); setEditingId(null); setShowForm(false); setCertFile(null); setCertPreview(''); setRemoveImage(false);
            refetch();
        } catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    const handleEdit = (cert) => {
        setValue('title', cert.title); setValue('issued_by', cert.issued_by || ''); setValue('issued_date', cert.issued_date || '');
        setValue('expiry_date', cert.expiry_date || ''); setValue('credential_id', cert.credential_id || '');
        setValue('certificate_url', cert.certificate_url || ''); setValue('description', cert.description || '');
        if (cert.image_url) setCertPreview(cert.image_url);
        setEditingId(cert.profilecertificate_id); setShowForm(true);
    };

    const handleDelete = async (certId, title) => {
        const ok = await confirm({ title: 'Delete Certificate', message: `Delete "${title}"?`, confirmText: 'Delete', cancelText: 'Cancel', type: 'danger' });
        if (!ok) return;
        try { await deleteCert(certId).unwrap(); showSnackbar('Deleted', 'success', 3000); refetch(); }
        catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    const handleMove = async (index, dir) => {
        const list = [...certificates]; const ti = index + dir;
        if (ti < 0 || ti >= list.length) return;
        [list[index], list[ti]] = [list[ti], list[index]];
        try { await reorderCert({ snapshotId, data: { order: list.map(c => c.profilecertificate_id) } }).unwrap(); refetch(); }
        catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    const handleCancel = () => { reset(); setEditingId(null); setShowForm(false); setCertFile(null); setCertPreview(''); setRemoveImage(false); };
    const formatDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';

    if (isLoading) return <Loader text="Loading..." />;

    return (
        <div className={styles.container}>
            <div className={styles.header}><div><h3 className={styles.title}>Certificates</h3><p className={styles.subtitle}>Add your certifications</p></div>
                {!showForm && <Button variant="primary" size="sm" onClick={() => setShowForm(true)} icon={<FiPlus />}>Add Certificate</Button>}
            </div>

            {showForm && (
                <div className={styles.formCard}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <div className={styles.formRow}>
                                <FormInput name="title" label="Title *" placeholder="e.g., AWS Solutions Architect" icon={<FiAward />} required disabled={isSubmitting} />
                                <FormInput name="issued_by" label="Issued By" placeholder="e.g., Amazon Web Services" disabled={isSubmitting} />
                            </div>
                            <div className={styles.formRow}>
                                <FormInput name="issued_date" label="Issue Date" type="date" icon={<FiCalendar />} disabled={isSubmitting} />
                                <FormInput name="expiry_date" label="Expiry Date" type="date" icon={<FiCalendar />} disabled={isSubmitting} />
                            </div>
                            <div className={styles.formRow}>
                                <FormInput name="credential_id" label="Credential ID" placeholder="e.g., AWS-12345" icon={<FiHash />} disabled={isSubmitting} />
                                <FormInput name="certificate_url" label="Verification URL" placeholder="https://..." icon={<FiLink />} disabled={isSubmitting} />
                            </div>
                            <FormTextarea name="description" label="Description" rows={2} disabled={isSubmitting} />

                            <div style={{ marginTop: 'var(--spacing-4)' }}>
                                <label className={styles.imageLabel}><FiImage /> Certificate Image</label>
                                {editingId && certPreview && !certFile && !removeImage && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
                                        <img src={certPreview} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
                                        <button type="button" onClick={() => { setCertFile(null); setCertPreview(''); setRemoveImage(true); }} style={{ color: 'var(--destructive)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)' }}><FiTrash size={12} /> Remove</button>
                                    </div>
                                )}
                                {(!editingId || !certPreview || certFile || removeImage) && (
                                    <SquareImageUpload onImageSelect={(f, url) => { setCertFile(f); setCertPreview(url); setRemoveImage(false); }} onRemove={() => { setCertFile(null); setCertPreview(''); }} previewUrl={certPreview} disabled={isSubmitting} maxSizeMB={3} label="Upload Certificate" size="small" enableCrop aspectRatio={4 / 3} />
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

            {certificates.length > 0 ? (
                <div className={styles.list}>
                    {certificates.map((cert, i) => (
                        <div key={cert.profilecertificate_id} className={styles.item}>
                            <div className={styles.orderControls}>
                                <button className={styles.orderButton} onClick={() => handleMove(i, -1)} disabled={i === 0}><FiArrowUp size={10} /></button>
                                <span className={styles.orderNumber}>{i + 1}</span>
                                <button className={styles.orderButton} onClick={() => handleMove(i, 1)} disabled={i === certificates.length - 1}><FiArrowDown size={10} /></button>
                            </div>
                            <div className={styles.icon}>{cert.image_url ? <img src={cert.image_url} alt="" className={styles.logoImg} /> : <FiAward />}</div>
                            <div className={styles.info}>
                                <h4 className={styles.degree}>{cert.title}</h4>
                                <p className={styles.institution}>{cert.issued_by || '—'}</p>
                                <div className={styles.meta}>
                                    {(cert.issued_date || cert.expiry_date) && <span className={styles.date}><FiCalendar size={12} />{formatDate(cert.issued_date)} {cert.expiry_date ? `→ ${formatDate(cert.expiry_date)}` : ''}</span>}
                                    {cert.credential_id && <span className={styles.score}>{cert.credential_id}</span>}
                                </div>
                                {cert.certificate_url && <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer" className={styles.linkUrl}>Verify Credential ↗</a>}
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.actionButton} onClick={() => handleEdit(cert)}><FiEdit2 size={14} /></button>
                                <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(cert.profilecertificate_id, cert.title)}><FiTrash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}><FiAward size={32} /><p>No certificates added</p></div>
            )}
        </div>
    );
};

export default CertificateSection;