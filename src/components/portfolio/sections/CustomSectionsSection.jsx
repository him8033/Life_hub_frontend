// src/components/portfolio/sections/CustomSectionsSection.jsx

'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiGrid, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
    FiChevronDown, FiChevronUp, FiArrowUp, FiArrowDown
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
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

const CustomSectionsSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
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
    const { reset, handleSubmit, setValue } = methods;

    const handleAdd = () => {
        setEditingId(null);
        reset({
            title: '',
            content: '',
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        reset();
        setEditingId(null);
        setShowForm(false);
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

            if (editingId) {
                await updateSection({ sectionId: editingId, data: payload }).unwrap();
                showSnackbar('Section updated', 'success', 3000);
            } else {
                await createSection({ snapshotId, data: payload }).unwrap();
                showSnackbar('Section added', 'success', 3000);
            }
            handleCancel();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000);
        }
    };

    const handleEdit = (section) => {
        setValue('title', section.title);
        setValue('content', typeof section.content === 'string' ? section.content : JSON.stringify(section.content, null, 2));
        setEditingId(section.profilecustomsection_id);
        setShowForm(true);
    };

    const handleDelete = async (sectionId, title) => {
        const ok = await confirm({
            title: 'Delete Section',
            message: `Delete "${title}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });

        if (!ok) return;

        try {
            await deleteSection(sectionId).unwrap();
            showSnackbar('Deleted', 'success', 3000);
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000);
        }
    };

    const handleMove = async (index, direction) => {
        const list = [...sections];
        const ti = index + direction;
        if (ti < 0 || ti >= list.length) return;

        [list[index], list[ti]] = [list[ti], list[index]];
        try {
            await reorderSections({
                snapshotId,
                data: { order: list.map(s => s.profilecustomsection_id) }
            }).unwrap();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000);
        }
    };

    const toggleExpand = (id) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    if (isLoading) return null;

    return (
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
            {/* Form */}
            {showForm && (
                <div className={styles.formCard}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <FormInput
                                name="title"
                                label="Section Title *"
                                placeholder="e.g., Publications, Research"
                                icon={<FiGrid />}
                                required
                                disabled={isSubmitting}
                            />
                            <FormTextarea
                                name="content"
                                label="Content (JSON or Text) *"
                                placeholder='Enter content as JSON: {"key": "value"} or plain text'
                                rows={6}
                                required
                                disabled={isSubmitting}
                                description="You can enter JSON data or plain text. JSON will be stored as structured data."
                            />
                            <div className={styles.formActions}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    icon={<FiX />}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    isLoading={isSubmitting}
                                    loadingText="Saving..."
                                    icon={<FiCheck />}
                                >
                                    {editingId ? 'Update' : 'Add'}
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            )}

            {/* Sections List */}
            {sections.length > 0 ? (
                <div className={styles.list}>
                    {sections.map((section, index) => (
                        <div key={section.profilecustomsection_id} className={styles.item}>
                            <div className={styles.itemHeader} onClick={() => toggleExpand(section.profilecustomsection_id)}>
                                <div className={styles.itemTitle}>
                                    <span className={styles.position}>{index + 1}.</span>
                                    <FiGrid size={16} />
                                    <span>{section.title}</span>
                                </div>
                                <div className={styles.itemActions}>
                                    <button
                                        className={styles.moveBtn}
                                        onClick={(e) => { e.stopPropagation(); handleMove(index, -1); }}
                                        disabled={index === 0 || isSubmitting}
                                    >
                                        <FiArrowUp size={14} />
                                    </button>
                                    <button
                                        className={styles.moveBtn}
                                        onClick={(e) => { e.stopPropagation(); handleMove(index, 1); }}
                                        disabled={index === sections.length - 1 || isSubmitting}
                                    >
                                        <FiArrowDown size={14} />
                                    </button>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={(e) => { e.stopPropagation(); handleEdit(section); }}
                                        disabled={isSubmitting}
                                    >
                                        <FiEdit2 size={14} />
                                    </button>
                                    <button
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                        onClick={(e) => { e.stopPropagation(); handleDelete(section.profilecustomsection_id, section.title); }}
                                        disabled={isSubmitting}
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                    {expandedSections.has(section.profilecustomsection_id) ?
                                        <FiChevronUp size={14} /> :
                                        <FiChevronDown size={14} />
                                    }
                                </div>
                            </div>
                            {expandedSections.has(section.profilecustomsection_id) && (
                                <div className={styles.itemContent}>
                                    <pre className={styles.contentJson}>
                                        {JSON.stringify(section.content, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                !showForm && (
                    <div className={styles.emptyState}>
                        <FiGrid size={32} />
                        <p>No custom sections added</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                        >
                            Add your first section
                        </Button>
                    </div>
                )
            )}
        </SectionLayout>
    );
};

export default CustomSectionsSection;