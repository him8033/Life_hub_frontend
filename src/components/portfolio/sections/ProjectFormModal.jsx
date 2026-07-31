// src/components/portfolio/sections/ProjectFormModal.jsx

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiFolder, FiGithub, FiExternalLink, FiImage, FiTrash2,
    FiX, FiPlus, FiCode, FiStar, FiCamera, FiEdit2,
    FiArrowUp, FiArrowDown, FiInfo, FiLink, FiCheckCircle
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import FormSelect from '@/components/common/forms/FormSelect';
import FormSearchSelect from '@/components/common/forms/FormSearchSelect';
import SquareImageUpload from '@/components/common/SquareImageUpload';
import Button from '@/components/common/buttons/Button';
import { SectionModal } from './common/SectionModal';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useCreateProfileProjectMutation, useUpdateProfileProjectMutation,
    useGetProjectSkillsQuery, useAddProjectSkillMutation, useRemoveProjectSkillMutation,
    useGetProjectImagesQuery, useUploadProjectImageMutation,
    useUpdateProjectImageMutation, useDeleteProjectImageMutation,
    useReorderProjectImagesMutation,
} from '@/services/api/portfolioApi';
import { useLazyGetPublicMasterSkillsQuery } from '@/services/api/portfolioApi';
import { projectSchema } from '@/lib/validations/portfolio/sections/projectSchema';
import styles from '@/styles/portfolio/sections/ProjectFormModal.module.css';

const ProjectFormModal = ({ snapshotId, project, onClose, onSuccess }) => {
    const { showSnackbar } = useSnackbar();
    const isEdit = !!project;
    const projectId = project?.profileproject_id;

    // Project creation state
    const [isProjectCreated, setIsProjectCreated] = useState(false);
    const [createdProjectId, setCreatedProjectId] = useState(null);

    // Toggle states
    const [showGallerySection, setShowGallerySection] = useState(false);
    const [showSkillsSection, setShowSkillsSection] = useState(false);

    // Thumbnail
    const [thumbFile, setThumbFile] = useState(null);
    const [thumbPreview, setThumbPreview] = useState('');
    const [removeThumb, setRemoveThumb] = useState(false);

    // Gallery
    const [galleryFile, setGalleryFile] = useState(null);
    const [galleryPreview, setGalleryPreview] = useState('');
    const [galleryCaption, setGalleryCaption] = useState('');

    // Skills - Search state
    const [selectedSkill, setSelectedSkill] = useState(null);
    const isFetchingRef = useRef(false);

    const [createProject, { isLoading: isCreating }] = useCreateProfileProjectMutation();
    const [updateProject, { isLoading: isUpdating }] = useUpdateProfileProjectMutation();
    const isSubmitting = isCreating || isUpdating;

    // Skills - Fetch data with proper refetch
    const { data: projectSkillsData, refetch: refetchSkills, isLoading: skillsLoading } = useGetProjectSkillsQuery(
        isEdit ? projectId : createdProjectId,
        { skip: !(isEdit ? projectId : createdProjectId) }
    );
    const [searchMasterSkills] = useLazyGetPublicMasterSkillsQuery();

    // Images - Fetch data with proper refetch
    const { data: projectImagesData, refetch: refetchImages, isLoading: imagesLoading } = useGetProjectImagesQuery(
        isEdit ? projectId : createdProjectId,
        { skip: !(isEdit ? projectId : createdProjectId) }
    );

    const [addProjectSkill] = useAddProjectSkillMutation();
    const [removeProjectSkill] = useRemoveProjectSkillMutation();
    const [uploadProjectImage, { isLoading: isUploadingImage }] = useUploadProjectImageMutation();
    const [updateProjectImage] = useUpdateProjectImageMutation();
    const [deleteProjectImage] = useDeleteProjectImageMutation();
    const [reorderImages] = useReorderProjectImagesMutation();

    const projectSkills = projectSkillsData?.data || [];
    const projectImages = projectImagesData?.data || [];

    // Memoize added skill IDs
    const addedSkillIds = useMemo(() => {
        return new Set(projectSkills.map(s => s.skill_value));
    }, [projectSkills]);

    // Fetch skills function
    const fetchSkills = useCallback(async (search) => {
        if (isFetchingRef.current) {
            return [];
        }

        try {
            if (!search || search.trim().length < 2) {
                return [];
            }

            isFetchingRef.current = true;

            const response = await searchMasterSkills({
                search: search.trim(),
                page: 1,
                page_size: 20,
            }).unwrap();

            const results = response?.data?.results || [];

            // Filter out already added skills
            const filteredSkills = results.filter(
                skill => !addedSkillIds.has(skill.masterskill_id)
            );

            return filteredSkills;

        } catch (error) {
            console.error("Failed to search skills:", error);
            return [];
        } finally {
            isFetchingRef.current = false;
        }
    }, [searchMasterSkills, addedSkillIds]);

    // Initialize form with project data
    const methods = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            project_name: '',
            short_description: '',
            full_description: '',
            code_url: '',
            live_url: '',
            is_live: 'false',
            is_featured: 'false',
            priority: 0
        },
    });

    const { reset, handleSubmit, setValue, getValues, watch } = methods;
    const selectedSkillId = watch('skill_id');

    // Reset form when project changes
    useEffect(() => {
        if (project) {
            reset({
                project_name: project.project_name || '',
                short_description: project.short_description || '',
                full_description: project.full_description || '',
                code_url: project.code_url || '',
                live_url: project.live_url || '',
                is_live: String(project.is_live ?? false),
                is_featured: String(project.is_featured ?? false),
                priority: project.priority || 0,
            });
            if (project.thumbnail_url) {
                setThumbPreview(project.thumbnail_url);
            }
            setIsProjectCreated(true);
            setCreatedProjectId(project.profileproject_id);
            setSelectedSkill(null);
        } else {
            reset({
                project_name: '',
                short_description: '',
                full_description: '',
                code_url: '',
                live_url: '',
                is_live: 'false',
                is_featured: 'false',
                priority: 0,
            });
            setThumbPreview('');
            setThumbFile(null);
            setRemoveThumb(false);
            setIsProjectCreated(false);
            setCreatedProjectId(null);
            setShowGallerySection(false);
            setShowSkillsSection(false);
            setGalleryFile(null);
            setGalleryPreview('');
            setGalleryCaption('');
            setSelectedSkill(null);
        }
    }, [project, reset]);

    // Auto-enable sections when data is loaded in edit mode
    useEffect(() => {
        if (isEdit && !imagesLoading && !skillsLoading) {
            if (projectImages.length > 0) {
                setShowGallerySection(true);
            }
            if (projectSkills.length > 0) {
                setShowSkillsSection(true);
            }
        }
    }, [isEdit, projectImages.length, projectSkills.length, imagesLoading, skillsLoading]);

    // Update project ID when created
    useEffect(() => {
        if (createdProjectId && !isEdit) {
            refetchImages();
            refetchSkills();
        }
    }, [createdProjectId, isEdit]);

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
                showSnackbar('Project updated successfully', 'success', 3000);
                onSuccess();
            } else {
                const result = await createProject({ snapshotId, data: fd }).unwrap();
                const newProjectId = result?.data?.profileproject_id || result?.profileproject_id;
                setCreatedProjectId(newProjectId);
                setIsProjectCreated(true);
                showSnackbar('Project created successfully! You can now add gallery images and skills.', 'success', 5000);
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save project'), 'error', 5000);
        }
    };

    // Handle Done button click
    const handleDone = () => {
        onSuccess();
    };

    // Skills - Add skill
    const handleAddSkill = async (value, item) => {
        const currentProjectId = isEdit ? projectId : createdProjectId;
        if (!value || !currentProjectId) return;

        try {
            await addProjectSkill({ projectId: currentProjectId, data: { skill_id: value } }).unwrap();
            showSnackbar('Skill added successfully', 'success', 3000);
            setSelectedSkill(null);
            setValue('skill_id', '');
            refetchSkills();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to add skill'), 'error', 5000);
        }
    };

    const handleRemoveSkill = async (skillId, skillName) => {
        const currentProjectId = isEdit ? projectId : createdProjectId;
        try {
            await removeProjectSkill({ projectId: currentProjectId, skillId }).unwrap();
            showSnackbar(`"${skillName}" removed`, 'success', 3000);
            refetchSkills();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to remove skill'), 'error', 5000);
        }
    };

    const handleSkillSelect = useCallback((value, item) => {
        if (item) {
            setSelectedSkill(item);
        } else {
            setSelectedSkill(null);
        }
    }, []);

    // Gallery Images
    const handleUploadGalleryImage = async () => {
        const currentProjectId = isEdit ? projectId : createdProjectId;
        if (!galleryFile || !currentProjectId) return;
        try {
            const fd = new FormData();
            fd.append('image', galleryFile, galleryFile.name);
            if (galleryCaption) fd.append('caption', galleryCaption);
            await uploadProjectImage({ projectId: currentProjectId, data: fd }).unwrap();
            showSnackbar('Image uploaded successfully', 'success', 3000);
            setGalleryFile(null);
            setGalleryPreview('');
            setGalleryCaption('');
            refetchImages();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to upload image'), 'error', 5000);
        }
    };

    const handleDeleteImage = async (imageId) => {
        try {
            await deleteProjectImage(imageId).unwrap();
            showSnackbar('Image deleted', 'success', 3000);
            refetchImages();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete image'), 'error', 5000);
        }
    };

    const handleSetPrimary = async (imageId) => {
        try {
            await updateProjectImage({ imageId, data: { is_primary: true } }).unwrap();
            showSnackbar('Primary image updated', 'success', 3000);
            refetchImages();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to update primary image'), 'error', 5000);
        }
    };

    const handleUpdateCaption = async (imageId, currentCaption) => {
        const newCaption = prompt('Enter new caption:', currentCaption || '');
        if (newCaption === null) return;
        try {
            await updateProjectImage({ imageId, data: { caption: newCaption } }).unwrap();
            showSnackbar('Caption updated', 'success', 3000);
            refetchImages();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to update caption'), 'error', 5000);
        }
    };

    const handleMoveImage = async (index, direction) => {
        const list = [...projectImages];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= list.length) return;
        [list[index], list[targetIndex]] = [list[targetIndex], list[index]];

        try {
            await reorderImages({
                projectId: isEdit ? projectId : createdProjectId,
                data: { order: list.map(img => img.projectimage_id) },
            }).unwrap();
            refetchImages();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder images'), 'error', 5000);
        }
    };

    // Build options for FormSearchSelect
    const buildOptions = useCallback(() => {
        const currentValue = getValues('skill_id');

        if (!currentValue) {
            return [];
        }

        if (selectedSkill) {
            return [{
                masterskill_id: selectedSkill.masterskill_id,
                name: selectedSkill.name,
                icon: selectedSkill.icon || '💻',
                category_name: selectedSkill.category_name,
                ...selectedSkill
            }];
        }

        return [];
    }, [selectedSkill, getValues]);

    // Toggle handlers
    const handleEditToggle = (type) => {
        if (type === 'gallery') {
            setShowGallerySection(!showGallerySection);
            if (showGallerySection) {
                setGalleryFile(null);
                setGalleryPreview('');
                setGalleryCaption('');
            }
        } else if (type === 'skills') {
            setShowSkillsSection(!showSkillsSection);
        }
    };

    // Determine if sections should be shown
    const showGallery = isEdit ? showGallerySection : (isProjectCreated && showGallerySection);
    const showSkills = isEdit ? showSkillsSection : (isProjectCreated && showSkillsSection);

    // Check if project is ready for additional features
    const isProjectReady = isEdit || isProjectCreated;
    const currentProjectIdValue = isEdit ? projectId : createdProjectId;

    // Check if form fields should be disabled
    const isFormDisabled = !isEdit && isProjectCreated;

    // Check if we should show form sections (hide after creation for new projects)
    const showFormSections = isEdit || !isProjectCreated;

    // Render toggle with content inside
    const renderToggleWithContent = (
        label,
        icon,
        isChecked,
        onToggle,
        count,
        description,
        children,
        isEnabled = true
    ) => (
        <div className={styles.toggleWrapper}>
            <div
                className={`${styles.toggleSection} ${!isEnabled ? styles.toggleDisabled : ''}`}
                onClick={isEnabled ? onToggle : undefined}
                role="button"
                tabIndex={isEnabled ? 0 : -1}
                onKeyDown={(e) => {
                    if (isEnabled && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onToggle();
                    }
                }}
            >
                <div className={styles.toggleContent}>
                    <div className={styles.toggleLeft}>
                        <span className={styles.toggleIcon}>{icon}</span>
                        <div>
                            <span className={styles.toggleLabel}>
                                {label}
                                {count > 0 && <span className={styles.toggleCount}>({count})</span>}
                            </span>
                            <span className={styles.toggleDescription}>
                                {!isEnabled ? 'Create the project first to enable this feature' : description}
                            </span>
                        </div>
                    </div>
                    <div className={styles.toggleSwitch}>
                        <div className={styles.toggleTrack}>
                            <div className={`${styles.toggleThumb} ${isChecked && isEnabled ? styles.toggleThumbChecked : ''}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content shown below the toggle when checked and enabled */}
            {isChecked && isEnabled && (
                <div className={styles.toggleContentArea}>
                    {children}
                </div>
            )}
        </div>
    );

    // Close handler
    const handleClose = () => {
        if (!isEdit && isProjectCreated) {
            onSuccess();
        } else {
            onClose();
        }
    };

    return (
        <SectionModal
            opened={true}
            onClose={handleClose}
            title={
                isEdit
                    ? 'Edit Project'
                    : isProjectCreated
                        ? 'Add Gallery & Skills'
                        : 'Add Project'
            }
            subtitle={
                isEdit
                    ? `Update "${project?.project_name}"`
                    : isProjectCreated
                        ? 'Add gallery images and skills to your project'
                        : 'Create a new project'
            }
            onSave={isEdit ? handleSubmit(handleSubmitForm) : (isProjectCreated ? handleDone : handleSubmit(handleSubmitForm))}
            isSaving={isSubmitting}
            saveText={
                isEdit
                    ? 'Update'
                    : isProjectCreated
                        ? 'Done'
                        : 'Create Project'
            }
            size="lg"
        >
            <FormProvider {...methods}>
                <form className={styles.modalForm}>
                    {/* Show form sections only if in edit mode OR project not created yet */}
                    {showFormSections && (
                        <>
                            {/* Basic Info Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Basic Information</h3>
                                        <p className={styles.sectionDescription}>
                                            Core details about your project
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <FormInput
                                        name="project_name"
                                        label="Project Name *"
                                        placeholder="e.g., E-Commerce App"
                                        icon={<FiFolder />}
                                        required
                                        disabled={isSubmitting || isFormDisabled}
                                    />
                                    <FormTextarea
                                        name="short_description"
                                        label="Short Description *"
                                        placeholder="Brief overview of your project..."
                                        rows={2}
                                        required
                                        disabled={isSubmitting || isFormDisabled}
                                    />
                                    <FormTextarea
                                        name="full_description"
                                        label="Full Description"
                                        placeholder="Detailed description of your project..."
                                        rows={3}
                                        disabled={isSubmitting || isFormDisabled}
                                    />
                                </div>
                            </div>

                            {/* Links & Settings Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiLink className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Links & Settings</h3>
                                        <p className={styles.sectionDescription}>
                                            Project URLs and configuration
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.formRow}>
                                        <FormInput
                                            name="code_url"
                                            label="Code URL"
                                            placeholder="https://github.com/..."
                                            icon={<FiGithub />}
                                            disabled={isSubmitting || isFormDisabled}
                                        />
                                        <FormInput
                                            name="live_url"
                                            label="Live URL"
                                            placeholder="https://..."
                                            icon={<FiExternalLink />}
                                            disabled={isSubmitting || isFormDisabled}
                                        />
                                    </div>
                                    <div className={styles.formRow}>
                                        <FormSelect
                                            name="is_live"
                                            label="Is Live?"
                                            options={[
                                                { value: 'false', label: 'No' },
                                                { value: 'true', label: 'Yes' }
                                            ]}
                                            disabled={isSubmitting || isFormDisabled}
                                        />
                                        <FormSelect
                                            name="is_featured"
                                            label="Featured?"
                                            options={[
                                                { value: 'false', label: 'No' },
                                                { value: 'true', label: 'Yes' }
                                            ]}
                                            disabled={isSubmitting || isFormDisabled}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnail Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiImage className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Thumbnail</h3>
                                        <p className={styles.sectionDescription}>
                                            Main image for your project card
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    {(isEdit || isProjectCreated) && thumbPreview && !thumbFile && !removeThumb ? (
                                        <div className={styles.existingThumb}>
                                            <img src={thumbPreview} alt="" className={styles.thumbPreview} />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setThumbFile(null);
                                                    setThumbPreview('');
                                                    setRemoveThumb(true);
                                                }}
                                                className={styles.removeThumbBtn}
                                                disabled={isSubmitting}
                                            >
                                                <FiTrash2 size={12} /> Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <SquareImageUpload
                                            onImageSelect={(f, url) => {
                                                setThumbFile(f);
                                                setThumbPreview(url);
                                                setRemoveThumb(false);
                                            }}
                                            onRemove={() => {
                                                setThumbFile(null);
                                                setThumbPreview('');
                                            }}
                                            previewUrl={thumbPreview}
                                            disabled={isSubmitting}
                                            maxSizeMB={5}
                                            label={thumbPreview ? 'Change Thumbnail' : 'Upload Thumbnail'}
                                            size="small"
                                            enableCrop
                                            aspectRatio={16 / 9}
                                        />
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Project Creation Status - Show only for new projects after creation */}
                    {!isEdit && isProjectCreated && (
                        <div className={styles.successBanner}>
                            <FiCheckCircle className={styles.successIcon} />
                            <div>
                                <span className={styles.successTitle}>Project Created Successfully!</span>
                                <span className={styles.successDescription}>
                                    You can now add gallery images and skills to your project.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Toggle Sections - Show only when project is ready (edit mode or created) */}
                    {isProjectReady && (
                        <div className={styles.toggleSections}>
                            {/* Skills Toggle with Content - UPDATED with FormSearchSelect */}
                            {renderToggleWithContent(
                                'Project Skills',
                                <FiCode size={16} />,
                                showSkills,
                                () => handleEditToggle('skills'),
                                projectSkills.length,
                                showSkills ? 'Hide skills section' : 'Add technologies and tools used',
                                // Skills Content
                                <div className={styles.toggleInnerContent}>
                                    <div className={styles.projectSkillTags}>
                                        {projectSkills.map(ps => (
                                            <span key={ps.id} className={styles.skillTag}>
                                                {ps.skill_name}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(ps.skill_value, ps.skill_name)}
                                                    className={styles.removeSkillBtn}
                                                    disabled={isSubmitting}
                                                >
                                                    <FiX size={10} />
                                                </button>
                                            </span>
                                        ))}
                                        {projectSkills.length === 0 && (
                                            <span className={styles.noSkills}>No skills added yet</span>
                                        )}
                                    </div>

                                    {/* Searchable Skill Selector */}
                                    <div className={styles.addSkillRow}>
                                        <div className={styles.searchSelectWrapper}>
                                            <FormSearchSelect
                                                name="skill_id"
                                                placeholder="Search skills..."
                                                fetchOptions={fetchSkills}
                                                options={buildOptions()}
                                                valueKey="masterskill_id"
                                                labelKey="name"
                                                // iconKey="icon"
                                                categoryKey="category_name"
                                                showCategory={true}
                                                disabled={isSubmitting || !currentProjectIdValue}
                                                minSearchLength={2}
                                                debounce={300}
                                                size="md"
                                                emptyMessage="No skills found"
                                                onChange={handleSkillSelect}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="primary"
                                            size="md"
                                            onClick={() => {
                                                const value = getValues('skill_id');
                                                if (value) {
                                                    // Find the selected skill from the options
                                                    const skill = selectedSkill || { masterskill_id: value };
                                                    handleAddSkill(value, skill);
                                                }
                                            }}
                                            disabled={!selectedSkillId || isSubmitting || !currentProjectIdValue}
                                            icon={<FiPlus />}
                                            className={styles.addSkillBtn}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>,
                                true
                            )}

                            {/* Gallery Toggle with Content */}
                            {renderToggleWithContent(
                                'Project Gallery',
                                <FiCamera size={16} />,
                                showGallery,
                                () => handleEditToggle('gallery'),
                                projectImages.length,
                                showGallery ? 'Hide gallery section' : 'Add images to showcase your project',
                                // Gallery Content
                                <div className={styles.toggleInnerContent}>
                                    {projectImages.length > 0 && (
                                        <div className={styles.galleryGrid}>
                                            {projectImages.map((img, index) => (
                                                <div key={img.projectimage_id} className={styles.galleryItem}>
                                                    <img src={img.image_url} alt={img.caption || ''} className={styles.galleryImg} />
                                                    <div className={styles.galleryOverlay}>
                                                        {img.caption && (
                                                            <span className={styles.galleryCaption}>{img.caption}</span>
                                                        )}
                                                        <div className={styles.galleryActions}>
                                                            {!img.is_primary && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSetPrimary(img.projectimage_id)}
                                                                    title="Set as primary"
                                                                    className={styles.galleryActionBtn}
                                                                    disabled={isSubmitting}
                                                                >
                                                                    <FiStar size={10} />
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUpdateCaption(img.projectimage_id, img.caption)}
                                                                title="Edit caption"
                                                                className={styles.galleryActionBtn}
                                                                disabled={isSubmitting}
                                                            >
                                                                <FiEdit2 size={10} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteImage(img.projectimage_id)}
                                                                title="Delete"
                                                                className={`${styles.galleryActionBtn} ${styles.deleteAction}`}
                                                                disabled={isSubmitting}
                                                            >
                                                                <FiTrash2 size={10} />
                                                            </button>
                                                        </div>
                                                        {img.is_primary && (
                                                            <span className={styles.primaryBadge}>
                                                                <FiStar size={8} /> Primary
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={styles.reorderControls}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMoveImage(index, -1)}
                                                            disabled={index === 0 || isSubmitting}
                                                            className={styles.reorderBtn}
                                                            title="Move up"
                                                        >
                                                            <FiArrowUp size={8} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMoveImage(index, 1)}
                                                            disabled={index === projectImages.length - 1 || isSubmitting}
                                                            className={styles.reorderBtn}
                                                            title="Move down"
                                                        >
                                                            <FiArrowDown size={8} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className={styles.uploadGalleryRow}>
                                        <div className={styles.uploadGalleryLeft}>
                                            <SquareImageUpload
                                                onImageSelect={(f, url) => {
                                                    setGalleryFile(f);
                                                    setGalleryPreview(url);
                                                }}
                                                onRemove={() => {
                                                    setGalleryFile(null);
                                                    setGalleryPreview('');
                                                }}
                                                previewUrl={galleryPreview}
                                                disabled={isUploadingImage || isSubmitting}
                                                maxSizeMB={5}
                                                label="Add Image"
                                                size="small"
                                                enableCrop
                                                aspectRatio={16 / 9}
                                            />
                                        </div>
                                        <div className={styles.uploadGalleryRight}>
                                            <input
                                                type="text"
                                                value={galleryCaption}
                                                onChange={(e) => setGalleryCaption(e.target.value)}
                                                placeholder="Image caption (optional)"
                                                className={styles.captionInput}
                                                disabled={isUploadingImage || isSubmitting}
                                            />
                                            <Button
                                                type="button"
                                                variant="primary"
                                                size="sm"
                                                onClick={handleUploadGalleryImage}
                                                isLoading={isUploadingImage}
                                                loadingText="Uploading..."
                                                disabled={!galleryFile || isUploadingImage || isSubmitting || !currentProjectIdValue}
                                                icon={<FiPlus />}
                                            >
                                                Upload
                                            </Button>
                                        </div>
                                    </div>
                                </div>,
                                true
                            )}
                        </div>
                    )}
                </form>
            </FormProvider>
        </SectionModal>
    );
};

export default ProjectFormModal;