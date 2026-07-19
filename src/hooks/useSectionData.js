// src/hooks/useSectionData.js

import { useState, useCallback } from 'react';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';

export const useSectionData = ({
    fetchQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    reorderMutation,
    snapshotId,
    onDataChange,
}) => {
    const { showSnackbar } = useSnackbar();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, isLoading, refetch } = fetchQuery(snapshotId, { skip: !snapshotId });
    const [createItem] = createMutation ? createMutation() : [null];
    const [updateItem] = updateMutation ? updateMutation() : [null];
    const [deleteItem] = deleteMutation ? deleteMutation() : [null];
    const [reorderItems] = reorderMutation ? reorderMutation() : [null];

    const items = data?.data || [];

    const handleAdd = useCallback(() => {
        setEditingItem(null);
        setIsModalOpen(true);
    }, []);

    const handleEdit = useCallback((item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingItem(null);
    }, []);

    const handleSave = useCallback(async (formData) => {
        try {
            setIsSubmitting(true);
            let result;
            if (editingItem) {
                result = await updateItem({
                    itemId: editingItem.id,
                    data: formData
                });
            } else {
                result = await createItem({
                    snapshotId,
                    data: formData
                });
            }

            showSnackbar(result.message || 'Saved successfully!', 'success', 3000);
            handleCloseModal();
            refetch();
            if (onDataChange) onDataChange();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save'), 'error', 5000);
        } finally {
            setIsSubmitting(false);
        }
    }, [editingItem, createItem, updateItem, snapshotId, refetch, onDataChange, showSnackbar, handleCloseModal]);

    const handleDelete = useCallback(async (item) => {
        try {
            await deleteItem(item.id).unwrap();
            showSnackbar('Deleted successfully!', 'success', 3000);
            refetch();
            if (onDataChange) onDataChange();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete'), 'error', 5000);
        }
    }, [deleteItem, refetch, onDataChange, showSnackbar]);

    const handleReorder = useCallback(async (items) => {
        try {
            await reorderItems({ snapshotId, data: items });
            refetch();
            if (onDataChange) onDataChange();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    }, [reorderItems, snapshotId, refetch, onDataChange, showSnackbar]);

    return {
        items,
        isLoading,
        refetch,
        isModalOpen,
        editingItem,
        isSubmitting,
        handleAdd,
        handleEdit,
        handleDelete,
        handleSave,
        handleCloseModal,
        handleReorder,
    };
};