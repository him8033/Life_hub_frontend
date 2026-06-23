'use client';

import React, { useState } from 'react';
import { FiFolder, FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiGithub, FiImage, FiStar } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import Loader from '@/components/common/Loader';
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

    const handleDelete = async (projectId, name) => {
        const ok = await confirm({ title: 'Delete Project', message: `Delete "${name}"?`, confirmText: 'Delete', cancelText: 'Cancel', type: 'danger' });
        if (!ok) return;
        try {
            await deleteProject(projectId).unwrap();
            showSnackbar('Project deleted', 'success', 3000);
            refetch();

            // NEW: Notify parent to refresh preview
            if (onDataChange) {
                onDataChange();
            }
        }
        catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000);
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingProject(null);
        refetch();

        // NEW: Notify parent to refresh preview
        if (onDataChange) {
            onDataChange();
        }
    };

    if (isLoading) return <Loader text="Loading projects..." />;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div><h3 className={styles.title}>Projects</h3><p className={styles.subtitle}>{projects.length} projects</p></div>
                <Button variant="primary" size="sm" onClick={() => { setEditingProject(null); setShowForm(true); }} icon={<FiPlus />}>Add Project</Button>
            </div>

            {projects.length > 0 ? (
                <div className={styles.grid}>
                    {projects.map((project) => (
                        <div key={project.profileproject_id} className={`${styles.card} ${project.is_featured ? styles.featured : ''}`}>
                            <div className={styles.thumbnail}>
                                {project.thumbnail_url ? (
                                    <img src={project.thumbnail_url} alt={project.project_name} className={styles.thumbImg} />
                                ) : (
                                    <div className={styles.thumbPlaceholder}><FiImage size={32} /></div>
                                )}
                                {project.is_featured && <span className={styles.featuredBadge}><FiStar size={10} /> Featured</span>}
                            </div>
                            <div className={styles.cardBody}>
                                <h4 className={styles.projectName}>{project.project_name}</h4>
                                <p className={styles.projectDesc}>{project.short_description}</p>
                                <div className={styles.links}>
                                    {project.code_url && <a href={project.code_url} target="_blank" rel="noopener" className={styles.link}><FiGithub size={14} /> Code</a>}
                                    {project.live_url && <a href={project.live_url} target="_blank" rel="noopener" className={styles.link}><FiExternalLink size={14} /> Live</a>}
                                </div>
                                <div className={styles.cardActions}>
                                    <Button variant="outline" size="sm" icon={<FiEdit2 />} onClick={() => handleEdit(project)}>Edit</Button>
                                    <Button variant="outline" size="sm" icon={<FiTrash2 />} onClick={() => handleDelete(project.profileproject_id, project.project_name)}>Delete</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}><FiFolder size={32} /><p>No projects added yet</p></div>
            )}

            {showForm && (
                <ProjectFormModal
                    snapshotId={snapshotId}
                    project={editingProject}
                    onClose={() => { setShowForm(false); setEditingProject(null); }}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default ProjectsSection;