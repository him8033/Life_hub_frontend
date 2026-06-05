'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiFlag, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
    FiArrowUp, FiArrowDown
} from 'react-icons/fi';

import FormSelect from '@/components/common/forms/FormSelect';
import Button from '@/components/common/buttons/Button';
import Loader from '@/components/common/Loader';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useGetProfileLanguagesQuery,
    useCreateProfileLanguageMutation,
    useUpdateProfileLanguageMutation,
    useDeleteProfileLanguageMutation,
    useReorderProfileLanguagesMutation,
} from '@/services/api/portfolioApi';
import { useGetPublicMasterLanguagesQuery } from '@/services/api/portfolioApi';
import { profileLanguageSchema } from '@/lib/validations/portfolio/profileLanguageSchema';
import styles from '@/styles/portfolio/sections/LanguagesSection.module.css';

const proficiencyOptions = [
    { value: 'basic', label: 'Basic' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'professional', label: 'Professional' },
    { value: 'native', label: 'Native' },
];

const proficiencyColors = {
    basic: '#94a3b8',
    conversational: '#60a5fa',
    professional: '#34d399',
    native: '#f59e0b',
};

const LanguagesSection = ({ snapshotId }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // API
    const { data, isLoading, refetch } = useGetProfileLanguagesQuery(snapshotId, { skip: !snapshotId });
    const { data: masterLanguagesData } = useGetPublicMasterLanguagesQuery();
    const [createLanguage, { isLoading: isCreating }] = useCreateProfileLanguageMutation();
    const [updateLanguage, { isLoading: isUpdating }] = useUpdateProfileLanguageMutation();
    const [deleteLanguage, { isLoading: isDeleting }] = useDeleteProfileLanguageMutation();
    const [reorderLanguages] = useReorderProfileLanguagesMutation();

    const languages = data?.data || [];
    const masterLanguages = masterLanguagesData?.data || [];
    const isSubmitting = isCreating || isUpdating;

    // Filter out already added languages
    const addedLanguageIds = languages.map(l => l.language_id);
    const availableLanguages = masterLanguages
        .filter(lang => !addedLanguageIds.includes(lang.masterlanguage_id) || editingId === languages.find(l => l.language_id === lang.masterlanguage_id)?.profilelanguage_id)
        .map(lang => ({
            value: lang.masterlanguage_id,
            label: `${lang.name} ${lang.icon || ''}`,
        }));

    const methods = useForm({
        resolver: zodResolver(profileLanguageSchema),
        defaultValues: {
            language_id: '',
            proficiency: '',
        },
    });

    const { reset, handleSubmit, setValue } = methods;

    const handleFormSubmit = async (formData) => {
        try {
            if (editingId) {
                await updateLanguage({ mappingId: editingId, data: formData }).unwrap();
                showSnackbar('Language updated', 'success', 3000);
            } else {
                await createLanguage({ snapshotId, data: formData }).unwrap();
                showSnackbar('Language added', 'success', 3000);
            }
            reset();
            setEditingId(null);
            setShowForm(false);
            refetch();
        } catch (error) {
            const errorMsg = extractErrorMessage(error, 'Failed to save language');
            showSnackbar(errorMsg, 'error', 5000);
        }
    };

    const handleEdit = (language) => {
        setValue('language_id', language.language_id);
        setValue('proficiency', language.proficiency);
        setEditingId(language.profilelanguage_id);
        setShowForm(true);
    };

    const handleDelete = async (mappingId, languageName) => {
        const ok = await confirm({
            title: 'Remove Language',
            message: `Are you sure you want to remove "${languageName}"?`,
            confirmText: 'Remove',
            cancelText: 'Cancel',
            type: 'danger',
        });
        if (!ok) return;
        try {
            await deleteLanguage(mappingId).unwrap();
            showSnackbar('Language removed', 'success', 3000);
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to remove'), 'error', 5000);
        }
    };

    const handleMove = async (index, direction) => {
        const newItems = [...languages];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        try {
            await reorderLanguages({
                snapshotId,
                data: { order: newItems.map(item => item.profilelanguage_id) },
            }).unwrap();
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    const handleCancel = () => {
        reset();
        setEditingId(null);
        setShowForm(false);
    };

    const getProficiencyColor = (proficiency) => {
        return proficiencyColors[proficiency] || '#94a3b8';
    };

    if (isLoading) return <Loader text="Loading languages..." />;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Languages</h3>
                    <p className={styles.subtitle}>
                        Add languages you know with proficiency levels
                    </p>
                </div>
                {!showForm && (
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setShowForm(true)}
                        icon={<FiPlus />}
                        disabled={availableLanguages.length === 0}
                    >
                        Add Language
                    </Button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className={styles.formCard}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <div className={styles.formGrid}>
                                <FormSelect
                                    name="language_id"
                                    label="Language"
                                    options={availableLanguages}
                                    placeholder="Select language"
                                    required
                                    disabled={isSubmitting || (!editingId && availableLanguages.length === 0)}
                                />
                                <FormSelect
                                    name="proficiency"
                                    label="Proficiency"
                                    options={proficiencyOptions}
                                    placeholder="Select level"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
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

            {/* Languages List */}
            {languages.length > 0 ? (
                <div className={styles.languagesList}>
                    {languages.map((language, index) => (
                        <div key={language.profilelanguage_id} className={styles.languageItem}>
                            {/* Order Controls */}
                            <div className={styles.orderControls}>
                                <button
                                    className={styles.orderButton}
                                    onClick={() => handleMove(index, -1)}
                                    disabled={index === 0}
                                    title="Move up"
                                >
                                    <FiArrowUp size={10} />
                                </button>
                                <span className={styles.orderNumber}>{index + 1}</span>
                                <button
                                    className={styles.orderButton}
                                    onClick={() => handleMove(index, 1)}
                                    disabled={index === languages.length - 1}
                                    title="Move down"
                                >
                                    <FiArrowDown size={10} />
                                </button>
                            </div>

                            {/* Language Flag Icon */}
                            <div className={styles.languageIcon}>
                                <FiFlag />
                            </div>

                            {/* Language Info */}
                            <div className={styles.languageInfo}>
                                <div className={styles.languageName}>
                                    {language.language_name}
                                    {language.language_code && (
                                        <span className={styles.languageCode}>
                                            {language.language_code}
                                        </span>
                                    )}
                                </div>
                                <div
                                    className={styles.proficiencyBadge}
                                    style={{
                                        backgroundColor: `${getProficiencyColor(language.proficiency)}20`,
                                        color: getProficiencyColor(language.proficiency),
                                        borderColor: `${getProficiencyColor(language.proficiency)}40`
                                    }}
                                >
                                    {language.proficiency}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className={styles.languageActions}>
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handleEdit(language)}
                                    title="Edit"
                                >
                                    <FiEdit2 size={14} />
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleDelete(language.profilelanguage_id, language.language_name)}
                                    title="Delete"
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <FiFlag size={32} />
                    <p>No languages added yet</p>
                    {!showForm && masterLanguages.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowForm(true)}
                            icon={<FiPlus />}
                        >
                            Add your first language
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default LanguagesSection;