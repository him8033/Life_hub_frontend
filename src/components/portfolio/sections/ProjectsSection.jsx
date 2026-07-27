// src/components/portfolio/sections/ProjectsSection.jsx

'use client';

import React, { useState } from 'react';
import { FiFolder, FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiGithub, FiImage, FiStar, FiCalendar, FiChevronRight } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { useGetProfileProjectsQuery, useDeleteProfileProjectMutation } from '@/services/api/portfolioApi';
import ProjectFormModal from '@/components/portfolio/sections/ProjectFormModal';
import styles from '@/styles/portfolio/sections/ProjectsSection.module.css';

const ProjectsSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const { data, isLoading, refetch } = useGetProfileProjectsQuery(snapshotId, { skip: !snapshotId });
    const [deleteProject] = useDeleteProfileProjectMutation();

    const projects = data?.data || [];
    const isSubmitting = false;

    const handleAdd = () => {
        setEditingProject(null);
        setShowForm(true);
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleDelete = async (projectId, name) => {
        const ok = await confirm({
            title: 'Delete Project',
            message: `Delete "${name}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });
        if (!ok) return;
        try {
            await deleteProject(projectId).unwrap();
            showSnackbar('Project deleted', 'success', 3000);
            refetch();
            if (onDataChange) onDataChange();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000);
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingProject(null);
        refetch();
        if (onDataChange) onDataChange();
    };

    if (isLoading) return null;

    return (
        <>
            <SectionLayout
                title="Projects"
                subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''}`}
                icon={FiFolder}
                isLoading={isLoading}
                isSaving={isSubmitting}
                hasData={projects.length > 0}
                onSave={handleAdd}
                saveButtonText="Add Project"
            >
                {projects.length > 0 ? (
                    <div className={styles.projectsContainer}>
                        {projects.map((project) => (
                            <div key={project.profileproject_id} className={styles.projectCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.projectInfo}>
                                        <h3 className={styles.projectTitle}>{project.project_name}</h3>
                                        {project.is_featured && (
                                            <span className={styles.featuredBadge}>
                                                <FiStar size={12} />
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleEdit(project)}
                                            title="Edit project"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => handleDelete(project.profileproject_id, project.project_name)}
                                            title="Delete project"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.cardBody}>
                                    {project.thumbnail_url ? (
                                        <div className={styles.thumbnailWrapper}>
                                            <img
                                                src={project.thumbnail_url}
                                                alt={project.project_name}
                                                className={styles.thumbnail}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.thumbnailPlaceholder}>
                                            <FiImage size={32} />
                                            <span>No thumbnail</span>
                                        </div>
                                    )}

                                    <div className={styles.content}>
                                        <p className={styles.description}>{project.short_description}</p>

                                        <div className={styles.links}>
                                            {project.code_url && (
                                                <a
                                                    href={project.code_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.link}
                                                >
                                                    <FiGithub size={14} />
                                                    <span>Code</span>
                                                </a>
                                            )}
                                            {project.live_url && (
                                                <a
                                                    href={project.live_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.link}
                                                >
                                                    <FiExternalLink size={14} />
                                                    <span>Live Demo</span>
                                                </a>
                                            )}
                                        </div>

                                        <div className={styles.meta}>
                                            {project.is_live && (
                                                <span className={styles.statusBadge}>
                                                    <span className={styles.statusDot} />
                                                    Live
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <FiFolder size={48} />
                        </div>
                        <h3 className={styles.emptyTitle}>No projects added yet</h3>
                        <p className={styles.emptyDescription}>
                            Showcase your work by adding your first project
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                            className={styles.emptyButton}
                        >
                            Add Project
                        </Button>
                    </div>
                )}
            </SectionLayout>

            {showForm && (
                <ProjectFormModal
                    snapshotId={snapshotId}
                    project={editingProject}
                    onClose={() => { setShowForm(false); setEditingProject(null); }}
                    onSuccess={handleFormSuccess}
                />
            )}
        </>
    );
};

export default ProjectsSection;