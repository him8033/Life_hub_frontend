'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiFolder, FiFileText, FiGithub, FiExternalLink, FiImage, FiTrash2,
    FiX, FiCheck, FiPlus, FiCode, FiStar, FiCamera, FiEdit2,
    FiArrowUp, FiArrowDown, FiMove
} from 'react-icons/fi';
import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import FormSelect from '@/components/common/forms/FormSelect';
import SquareImageUpload from '@/components/common/SquareImageUpload';
import Button from '@/components/common/buttons/Button';
import Loader from '@/components/common/Loader';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useCreateProfileProjectMutation, useUpdateProfileProjectMutation,
    useGetProjectSkillsQuery, useAddProjectSkillMutation, useRemoveProjectSkillMutation,
    useGetProjectImagesQuery, useUploadProjectImageMutation,
    useUpdateProjectImageMutation, useDeleteProjectImageMutation,
    useReorderProjectImagesMutation,
} from '@/services/api/portfolioApi';
import { useGetPublicMasterSkillsQuery } from '@/services/api/portfolioApi';
import { projectSchema } from '@/lib/validations/portfolio/sections/projectSchema';
import styles from '@/styles/portfolio/sections/ProjectsSection.module.css';

const ProjectFormModal = ({ snapshotId, project, onClose, onSuccess }) => {
    const { showSnackbar } = useSnackbar();
    const isEdit = !!project;
    const projectId = project?.profileproject_id;

    // Thumbnail
    const [thumbFile, setThumbFile] = useState(null);
    const [thumbPreview, setThumbPreview] = useState('');
    const [removeThumb, setRemoveThumb] = useState(false);

    // Gallery
    const [galleryFile, setGalleryFile] = useState(null);
    const [galleryPreview, setGalleryPreview] = useState('');
    const [galleryCaption, setGalleryCaption] = useState('');
    const [editingImage, setEditingImage] = useState(null);

    const [createProject, { isLoading: isCreating }] = useCreateProfileProjectMutation();
    const [updateProject, { isLoading: isUpdating }] = useUpdateProfileProjectMutation();
    const isSubmitting = isCreating || isUpdating;

    // Skills
    const { data: projectSkillsData } = useGetProjectSkillsQuery(projectId, { skip: !projectId });
    const { data: masterSkillsData } = useGetPublicMasterSkillsQuery();
    const [addProjectSkill] = useAddProjectSkillMutation();
    const [removeProjectSkill] = useRemoveProjectSkillMutation();

    // Images
    const { data: projectImagesData, refetch: refetchImages } = useGetProjectImagesQuery(projectId, { skip: !projectId });
    const [uploadProjectImage, { isLoading: isUploadingImage }] = useUploadProjectImageMutation();
    const [updateProjectImage] = useUpdateProjectImageMutation();
    const [deleteProjectImage] = useDeleteProjectImageMutation();
    const [reorderImages] = useReorderProjectImagesMutation();

    const projectSkills = projectSkillsData?.data || [];
    const masterSkills = masterSkillsData?.data || [];
    const projectImages = projectImagesData?.data || [];

    const addedSkillIds = new Set(projectSkills.map(s => s.skill_value));
    const availableSkills = masterSkills.filter(s => !addedSkillIds.has(s.masterskill_id));
    const [selectedSkillId, setSelectedSkillId] = useState('');

    const methods = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: { project_name: '', short_description: '', full_description: '', code_url: '', live_url: '', is_live: 'false', is_featured: 'false', priority: 0 },
    });
    const { reset, handleSubmit, setValue } = methods;

    useEffect(() => {
        if (project) {
            setValue('project_name', project.project_name);
            setValue('short_description', project.short_description);
            setValue('full_description', project.full_description || '');
            setValue('code_url', project.code_url || '');
            setValue('live_url', project.live_url || '');
            setValue('is_live', String(project.is_live ?? false));
            setValue('is_featured', String(project.is_featured ?? false));
            setValue('priority', project.priority || 0);
            if (project.thumbnail_url) setThumbPreview(project.thumbnail_url);
        }
    }, [project, setValue]);

    const handleSubmitForm = async (formData) => {
        try {
            const fd = new FormData();
            fd.append('project_name', formData.project_name);
            fd.append('short_description', formData.short_description);
            fd.append('full_description', formData.full_description ?? '');
            fd.append('code_url', formData.code_url ?? '');
            fd.append('live_url', formData.live_url ?? '');
            fd.append('is_live', formData.is_live === 'true');
            fd.append('is_featured', formData.is_featured === 'true');
            if (formData.priority) fd.append('priority', formData.priority);
            if (removeThumb) fd.append('remove_thumbnail', 'true');
            else if (thumbFile) fd.append('thumbnail', thumbFile, thumbFile.name);

            if (isEdit) {
                await updateProject({ projectId, data: fd }).unwrap();
                showSnackbar('Project updated', 'success', 3000);
            } else {
                await createProject({ snapshotId, data: fd }).unwrap();
                showSnackbar('Project created', 'success', 3000);
            }
            onSuccess();
        } catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    // Skills
    const handleAddSkill = async () => {
        if (!selectedSkillId || !projectId) return;
        try { await addProjectSkill({ projectId, data: { skill_id: selectedSkillId } }).unwrap(); showSnackbar('Skill added', 'success', 3000); setSelectedSkillId(''); }
        catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    const handleRemoveSkill = async (skillId, skillName) => {
        try { await removeProjectSkill({ projectId, skillId }).unwrap(); showSnackbar(`"${skillName}" removed`, 'success', 3000); }
        catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    // Gallery Images
    const handleUploadGalleryImage = async () => {
        if (!galleryFile || !projectId) return;
        try {
            const fd = new FormData();
            fd.append('image', galleryFile, galleryFile.name);
            if (galleryCaption) fd.append('caption', galleryCaption);
            await uploadProjectImage({ projectId, data: fd }).unwrap();
            showSnackbar('Image uploaded', 'success', 3000);
            setGalleryFile(null); setGalleryPreview(''); setGalleryCaption('');
            refetchImages();
        } catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    const handleDeleteImage = async (imageId) => {
        try {
            await deleteProjectImage(imageId).unwrap();
            showSnackbar('Image deleted', 'success', 3000);
            refetchImages();
        }
        catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    // UPDATE Image - Set as primary or update caption
    const handleSetPrimary = async (imageId) => {
        try {
            await updateProjectImage({ imageId, data: { is_primary: true } }).unwrap();
            showSnackbar('Primary image updated', 'success', 3000);
            refetchImages();
        } catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    const handleUpdateCaption = async (imageId, currentCaption) => {
        const newCaption = prompt('Enter new caption:', currentCaption || '');
        if (newCaption === null) return; // Cancelled
        try {
            await updateProjectImage({ imageId, data: { caption: newCaption } }).unwrap();
            showSnackbar('Caption updated', 'success', 3000);
            refetchImages();
        } catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    // REORDER Images
    const handleMoveImage = async (index, direction) => {
        const list = [...projectImages];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= list.length) return;
        [list[index], list[targetIndex]] = [list[targetIndex], list[index]];

        try {
            await reorderImages({
                projectId,
                data: { order: list.map(img => img.projectimage_id) },
            }).unwrap();
            refetchImages();
        } catch (error) { showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000); }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>{isEdit ? 'Edit Project' : 'Add Project'}</h3>
                    <button onClick={onClose} className={styles.closeBtn}><FiX /></button>
                </div>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(handleSubmitForm)}>
                        <div className={styles.modalBody}>
                            {/* Basic Info Fields */}
                            <FormInput name="project_name" label="Project Name *" placeholder="e.g., E-Commerce App" icon={<FiFolder />} required disabled={isSubmitting} />
                            <FormTextarea name="short_description" label="Short Description *" placeholder="Brief overview..." rows={2} required disabled={isSubmitting} />
                            <FormTextarea name="full_description" label="Full Description" placeholder="Detailed description..." rows={3} disabled={isSubmitting} />
                            <div className={styles.formRow}>
                                <FormInput name="code_url" label="Code URL" placeholder="https://github.com/..." icon={<FiGithub />} disabled={isSubmitting} />
                                <FormInput name="live_url" label="Live URL" placeholder="https://..." icon={<FiExternalLink />} disabled={isSubmitting} />
                            </div>
                            <div className={styles.formRow}>
                                <FormSelect name="is_live" label="Is Live?" options={[{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }]} disabled={isSubmitting} />
                                <FormSelect name="is_featured" label="Featured?" options={[{ value: 'false', label: 'No' }, { value: 'true', label: 'Yes' }]} disabled={isSubmitting} />
                            </div>

                            {/* Thumbnail */}
                            <div>
                                <label className={styles.thumbLabel}><FiImage /> Thumbnail</label>
                                {isEdit && thumbPreview && !thumbFile && !removeThumb && (
                                    <div className={styles.existingThumb}>
                                        <img src={thumbPreview} alt="" className={styles.thumbPreview} />
                                        <button type="button" onClick={() => { setThumbFile(null); setThumbPreview(''); setRemoveThumb(true); }} className={styles.removeThumbBtn}><FiTrash2 size={12} /> Remove</button>
                                    </div>
                                )}
                                {(!isEdit || !thumbPreview || thumbFile || removeThumb) && (
                                    <SquareImageUpload onImageSelect={(f, url) => { setThumbFile(f); setThumbPreview(url); setRemoveThumb(false); }} onRemove={() => { setThumbFile(null); setThumbPreview(''); }} previewUrl={thumbPreview} disabled={isSubmitting} maxSizeMB={5} label="Upload Thumbnail" size="small" enableCrop aspectRatio={16 / 9} />
                                )}
                            </div>

                            {/* Gallery Section - Only in Edit Mode */}
                            {isEdit && (
                                <div className={styles.gallerySection}>
                                    <div className={styles.skillsSectionHeader}><FiCamera /> Project Gallery ({projectImages.length})</div>

                                    {/* Existing Images with Full Controls */}
                                    <div className={styles.galleryGrid}>
                                        {projectImages.map((img, index) => (
                                            <div key={img.projectimage_id} className={styles.galleryItem}>
                                                <img src={img.image_url} alt={img.caption || ''} className={styles.galleryImg} />

                                                {/* Caption overlay */}
                                                <div className={styles.galleryOverlay}>
                                                    {img.caption && <span className={styles.galleryCaption}>{img.caption}</span>}
                                                    <div className={styles.galleryActions}>
                                                        {!img.is_primary && (
                                                            <button type="button" onClick={() => handleSetPrimary(img.projectimage_id)} title="Set as primary" className={styles.galleryActionBtn}><FiStar size={10} /></button>
                                                        )}
                                                        <button type="button" onClick={() => handleUpdateCaption(img.projectimage_id, img.caption)} title="Edit caption" className={styles.galleryActionBtn}><FiEdit2 size={10} /></button>
                                                        <button type="button" onClick={() => handleDeleteImage(img.projectimage_id)} title="Delete" className={`${styles.galleryActionBtn} ${styles.deleteAction}`}><FiTrash2 size={10} /></button>
                                                    </div>
                                                    {img.is_primary && (
                                                        <span className={styles.primaryBadge}><FiStar size={8} /> Primary</span>
                                                    )}
                                                </div>

                                                {/* Reorder Arrows */}
                                                <div className={styles.reorderControls}>
                                                    <button type="button" onClick={() => handleMoveImage(index, -1)} disabled={index === 0} className={styles.reorderBtn} title="Move up"><FiArrowUp size={8} /></button>
                                                    <button type="button" onClick={() => handleMoveImage(index, 1)} disabled={index === projectImages.length - 1} className={styles.reorderBtn} title="Move down"><FiArrowDown size={8} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Upload New Image */}
                                    <div className={styles.uploadGalleryRow}>
                                        <div className={styles.uploadGalleryLeft}>
                                            <SquareImageUpload onImageSelect={(f, url) => { setGalleryFile(f); setGalleryPreview(url); }} onRemove={() => { setGalleryFile(null); setGalleryPreview(''); }} previewUrl={galleryPreview} disabled={isUploadingImage} maxSizeMB={5} label="Add Image" size="small" enableCrop aspectRatio={16 / 9} />
                                        </div>
                                        <div className={styles.uploadGalleryRight}>
                                            <input type="text" value={galleryCaption} onChange={(e) => setGalleryCaption(e.target.value)} placeholder="Image caption (optional)" className={styles.captionInput} disabled={isUploadingImage} />
                                            <Button type="button" variant="primary" size="sm" onClick={handleUploadGalleryImage} isLoading={isUploadingImage} loadingText="Uploading..." disabled={!galleryFile} icon={<FiPlus />}>Upload</Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Skills Section */}
                            {isEdit && (
                                <div className={styles.skillsSection}>
                                    <div className={styles.skillsSectionHeader}><FiCode /> Project Skills</div>
                                    <div className={styles.projectSkillTags}>
                                        {projectSkills.map(ps => (
                                            <span key={ps.id} className={styles.skillTag}>
                                                {ps.skill_icon || '💻'} {ps.skill_name}
                                                <button type="button" onClick={() => handleRemoveSkill(ps.skill_value, ps.skill_name)} className={styles.removeSkillBtn}><FiX size={10} /></button>
                                            </span>
                                        ))}
                                        {projectSkills.length === 0 && <span className={styles.noSkills}>No skills added</span>}
                                    </div>
                                    {availableSkills.length > 0 && (
                                        <div className={styles.addSkillRow}>
                                            <select value={selectedSkillId} onChange={e => setSelectedSkillId(e.target.value)} className={styles.skillSelect}>
                                                <option value="">Select a skill...</option>
                                                {availableSkills.map(s => <option key={s.masterskill_id} value={s.masterskill_id}>{s.icon || ''} {s.name}</option>)}
                                            </select>
                                            <Button type="button" variant="outline" size="sm" onClick={handleAddSkill} disabled={!selectedSkillId} icon={<FiPlus />}>Add</Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting} loadingText="Saving..." icon={<FiCheck />}>{isEdit ? 'Update' : 'Create'}</Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default ProjectFormModal;