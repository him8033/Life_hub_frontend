// src/components/portfolio/sections/CustomSectionsSection.jsx

'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiGrid, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
    FiArrowUp, FiArrowDown, FiInfo, FiChevronDown, FiChevronUp
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { SectionModal } from './common/SectionModal';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useGetProfileCustomSectionsQuery,
    useCreateProfileCustomSectionMutation,
    useUpdateProfileCustomSectionMutation,
    useDeleteProfileCustomSectionMutation,
    useReorderProfileCustomSectionsMutation,
} from '@/services/api/portfolioApi';
import { customSectionSchema } from '@/lib/validations/portfolio/sections/customSectionSchema';
import styles from '@/styles/portfolio/sections/CustomSectionsSection.module.css';

// Array of colors for section icons
const SECTION_COLORS = [
    '#667eea', // primary
    '#10b981', // success
    '#f59e0b', // warning
    '#ef4444', // error
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
    '#22d3ee', // cyan
];

const CustomSectionsSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showModal, setShowModal] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [expandedSections, setExpandedSections] = useState(new Set());

    const { data, isLoading, refetch } = useGetProfileCustomSectionsQuery(snapshotId, { skip: !snapshotId });
    const [createSection, { isLoading: isCreating }] = useCreateProfileCustomSectionMutation();
    const [updateSection, { isLoading: isUpdating }] = useUpdateProfileCustomSectionMutation();
    const [deleteSection] = useDeleteProfileCustomSectionMutation();
    const [reorderSections] = useReorderProfileCustomSectionsMutation();

    const sections = data?.data || [];
    const isSubmitting = isCreating || isUpdating;

    const methods = useForm({
        resolver: zodResolver(customSectionSchema),
        defaultValues: {
            title: '',
            content: ''
        },
    });

    const { reset, handleSubmit } = methods;

    const getSectionColor = (index) => {
        return SECTION_COLORS[index % SECTION_COLORS.length];
    };

    const toggleExpand = (id, e) => {
        e.stopPropagation(); // Prevent event from bubbling to cardHeader
        setExpandedSections(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleHeaderClick = (id) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleAdd = () => {
        setEditingSection(null);
        reset({
            title: '',
            content: '',
        });
        setShowModal(true);
    };

    const handleEdit = (section) => {
        setEditingSection(section);
        reset({
            title: section.title,
            content: typeof section.content === 'string' ? section.content : JSON.stringify(section.content, null, 2),
        });
        setShowModal(true);
    };

    const handleCancel = () => {
        reset();
        setEditingSection(null);
        setShowModal(false);
    };

    const handleFormSubmit = async (formData) => {
        try {
            // Parse content as JSON if possible, otherwise store as { text: content }
            let contentObj;
            try {
                contentObj = JSON.parse(formData.content);
            } catch {
                contentObj = { text: formData.content };
            }

            const payload = { title: formData.title, content: contentObj };

            if (editingSection) {
                await updateSection({
                    sectionId: editingSection.profilecustomsection_id,
                    data: payload
                }).unwrap();
                showSnackbar('Section updated successfully', 'success', 3000);
            } else {
                await createSection({ snapshotId, data: payload }).unwrap();
                showSnackbar('Section added successfully', 'success', 3000);
            }
            handleCancel();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save section'), 'error', 5000);
        }
    };

    const handleDelete = async (sectionId, title) => {
        const ok = await confirm({
            title: 'Delete Section',
            message: `Are you sure you want to delete "${title}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });
        if (!ok) return;
        try {
            await deleteSection(sectionId).unwrap();
            showSnackbar('Section deleted successfully', 'success', 3000);
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete'), 'error', 5000);
        }
    };

    const handleMove = async (index, direction) => {
        const newItems = [...sections];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        try {
            await reorderSections({
                snapshotId,
                data: { order: newItems.map(item => item.profilecustomsection_id) },
            }).unwrap();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    const getContentPreview = (content) => {
        if (typeof content === 'string') {
            return content.substring(0, 80) + (content.length > 80 ? '...' : '');
        }
        const text = content.text || JSON.stringify(content);
        return text.substring(0, 80) + (text.length > 80 ? '...' : '');
    };

    if (isLoading) return null;

    return (
        <>
            <SectionLayout
                title="Custom Sections"
                subtitle={`${sections.length} section${sections.length !== 1 ? 's' : ''}`}
                icon={FiGrid}
                isLoading={isLoading}
                isSaving={isSubmitting}
                hasData={sections.length > 0}
                onSave={handleAdd}
                saveButtonText="Add Section"
            >
                {sections.length > 0 ? (
                    <div className={styles.sectionsList}>
                        {sections.map((section, index) => {
                            const isExpanded = expandedSections.has(section.profilecustomsection_id);
                            return (
                                <div key={section.profilecustomsection_id} className={styles.sectionCard}>
                                    <div
                                        className={styles.cardHeader}
                                        onClick={() => handleHeaderClick(section.profilecustomsection_id)}
                                    >
                                        <div className={styles.sectionInfo}>
                                            <div
                                                className={styles.sectionIcon}
                                                style={{ backgroundColor: getSectionColor(index) }}
                                            >
                                                <FiGrid size={18} />
                                            </div>
                                            <div className={styles.sectionContent}>
                                                <span className={styles.sectionTitle}>{section.title}</span>
                                                <span className={styles.sectionPreview}>
                                                    {getContentPreview(section.content)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
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
                                                    disabled={index === sections.length - 1 || isSubmitting}
                                                    title="Move down"
                                                >
                                                    <FiArrowDown size={12} />
                                                </button>
                                            </div>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handleEdit(section)}
                                                title="Edit section"
                                                disabled={isSubmitting}
                                            >
                                                <FiEdit2 size={14} />
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                onClick={() => handleDelete(section.profilecustomsection_id, section.title)}
                                                title="Delete section"
                                                disabled={isSubmitting}
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                            <button
                                                className={styles.expandBtn}
                                                onClick={(e) => toggleExpand(section.profilecustomsection_id, e)}
                                                title={isExpanded ? 'Collapse' : 'Expand'}
                                            >
                                                {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className={styles.cardBody}>
                                            <pre className={styles.contentJson}>
                                                {JSON.stringify(section.content, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <FiGrid size={48} />
                        </div>
                        <h3 className={styles.emptyTitle}>No custom sections added yet</h3>
                        <p className={styles.emptyDescription}>
                            Add custom sections to showcase additional information
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                            className={styles.emptyButton}
                        >
                            Add Section
                        </Button>
                    </div>
                )}
            </SectionLayout>

            {/* Modal for Add/Edit */}
            {showModal && (
                <SectionModal
                    opened={true}
                    onClose={handleCancel}
                    title={editingSection ? 'Edit Custom Section' : 'Add Custom Section'}
                    subtitle={editingSection ? `Update "${editingSection.title}"` : 'Add a new custom section'}
                    onSave={handleSubmit(handleFormSubmit)}
                    isSaving={isSubmitting}
                    saveText={editingSection ? 'Update' : 'Add'}
                    size="lg"
                >
                    <FormProvider {...methods}>
                        <form className={styles.modalForm} onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Section Details</h3>
                                        <p className={styles.sectionDescription}>
                                            Create a custom section with title and content
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <FormInput
                                        name="title"
                                        label="Section Title *"
                                        placeholder="e.g., Publications, Research, Projects"
                                        icon={<FiGrid size={16} />}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    <FormTextarea
                                        name="content"
                                        label="Content *"
                                        placeholder='Enter content as JSON: {"key": "value"} or plain text'
                                        rows={6}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    <p className={styles.modalHint}>
                                        You can enter JSON data or plain text. JSON will be stored as structured data.
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

export default CustomSectionsSection;