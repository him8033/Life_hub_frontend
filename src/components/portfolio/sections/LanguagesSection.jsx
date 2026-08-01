// src/components/portfolio/sections/LanguagesSection.jsx

'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiFlag, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
    FiArrowUp, FiArrowDown, FiInfo
} from 'react-icons/fi';

import FormSelect from '@/components/common/forms/FormSelect';
import FormSearchSelect from '@/components/common/forms/FormSearchSelect';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { SectionModal } from './common/SectionModal';
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
import { useLazyGetPublicMasterLanguagesQuery } from '@/services/api/portfolioApi';
import { profileLanguageSchema } from '@/lib/validations/portfolio/sections/profileLanguageSchema';
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

// Array of colors for language icons
const LANGUAGE_COLORS = [
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

const LanguagesSection = ({
    snapshotId,
    onDataChange,
    onPrevious,
    onNext,
    showPrevious = false,
    showNext = false,
    isFirstStep = false,
    isLastStep = false,
    previousSectionName = '',
    nextSectionName = '',
}) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [showModal, setShowModal] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const isFetchingRef = useRef(false);

    const { data, isLoading, refetch } = useGetProfileLanguagesQuery(snapshotId, { skip: !snapshotId });
    const [searchMasterLanguages] = useLazyGetPublicMasterLanguagesQuery();
    const [createLanguage, { isLoading: isCreating }] = useCreateProfileLanguageMutation();
    const [updateLanguage, { isLoading: isUpdating }] = useUpdateProfileLanguageMutation();
    const [deleteLanguage] = useDeleteProfileLanguageMutation();
    const [reorderLanguages] = useReorderProfileLanguagesMutation();

    const languages = data?.data || [];
    const isSubmitting = isCreating || isUpdating;

    // Get existing language IDs
    const existingLanguageIds = useMemo(() => {
        return new Set(languages.map(l => l.language_value));
    }, [languages]);

    // Fetch languages function
    const fetchLanguages = useCallback(async (search) => {
        if (isFetchingRef.current) {
            return [];
        }

        try {
            if (!search || search.trim().length < 2) {
                return [];
            }

            isFetchingRef.current = true;

            const response = await searchMasterLanguages({
                search: search.trim(),
                page: 1,
                page_size: 20,
            }).unwrap();

            const results = response?.data?.results || [];

            // Filter out already added languages
            const filteredLanguages = results.filter(
                lang => !existingLanguageIds.has(lang.masterlanguage_id)
            );

            return filteredLanguages;

        } catch (error) {
            console.error("Failed to search languages:", error);
            return [];
        } finally {
            isFetchingRef.current = false;
        }
    }, [searchMasterLanguages, existingLanguageIds]);

    const methods = useForm({
        resolver: zodResolver(profileLanguageSchema),
        defaultValues: {
            language_id: '',
            proficiency: '',
        },
    });

    const { reset, handleSubmit, setValue, getValues } = methods;

    const getLanguageColor = (index) => {
        return LANGUAGE_COLORS[index % LANGUAGE_COLORS.length];
    };

    const handleAdd = () => {
        setEditingLanguage(null);
        setSelectedLanguage(null);
        reset({
            language_id: '',
            proficiency: '',
        });
        setShowModal(true);
    };

    const handleEdit = (language) => {
        setEditingLanguage(language);
        setSelectedLanguage(null);
        reset({
            language_id: language.language_value,
            proficiency: language.proficiency,
        });
        setShowModal(true);
    };

    const handleCancel = () => {
        reset();
        setEditingLanguage(null);
        setSelectedLanguage(null);
        setShowModal(false);
    };

    const handleLanguageSelect = useCallback((value, item) => {
        if (item) {
            setSelectedLanguage(item);
        } else {
            setSelectedLanguage(null);
        }
    }, []);

    const handleFormSubmit = async (formData) => {
        try {
            if (editingLanguage) {
                await updateLanguage({
                    mappingId: editingLanguage.profilelanguage_id,
                    data: formData
                }).unwrap();
                showSnackbar('Language updated successfully', 'success', 3000);
            } else {
                await createLanguage({ snapshotId, data: formData }).unwrap();
                showSnackbar('Language added successfully', 'success', 3000);
            }
            handleCancel();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save language'), 'error', 5000);
        }
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
            showSnackbar('Language removed successfully', 'success', 3000);
            refetch();

            if (onDataChange) {
                onDataChange();
            }
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

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder'), 'error', 5000);
        }
    };

    const getProficiencyColor = (proficiency) => {
        return proficiencyColors[proficiency] || '#94a3b8';
    };

    const getProficiencyLabel = (proficiency) => {
        const found = proficiencyOptions.find(p => p.value === proficiency);
        return found ? found.label : proficiency;
    };

    // Build options for FormSearchSelect
    const buildOptions = useCallback(() => {
        const currentValue = getValues('language_id');

        if (!currentValue) {
            return [];
        }

        if (selectedLanguage) {
            return [{
                masterlanguage_id: selectedLanguage.masterlanguage_id,
                name: selectedLanguage.name,
                icon: selectedLanguage.icon || '🌐',
                language_code: selectedLanguage.language_code,
                ...selectedLanguage
            }];
        }

        return [];
    }, [selectedLanguage, getValues]);

    // Handle Enter key press in form
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(handleFormSubmit)();
        }
    };

    if (isLoading) return null;

    return (
        <>
            <SectionLayout
                title="Languages"
                subtitle={`${languages.length} language${languages.length !== 1 ? 's' : ''}`}
                icon={FiFlag}
                isLoading={isLoading}
                isSaving={isSubmitting}
                hasData={languages.length > 0}
                onSave={handleAdd}
                saveButtonText="Add Language"
                isDisabled={false}
                onPrevious={onPrevious}
                onNext={onNext}
                showPrevious={showPrevious}
                showNext={showNext}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                previousSectionName={previousSectionName}
                nextSectionName={nextSectionName}
            >
                {languages.length > 0 ? (
                    <div className={styles.languagesGrid}>
                        {languages.map((language, index) => (
                            <div key={language.profilelanguage_id} className={styles.languageCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.languageInfo}>
                                        <div
                                            className={styles.languageIcon}
                                            style={{ backgroundColor: getLanguageColor(index) }}
                                        >
                                            <FiFlag size={20} />
                                        </div>
                                        <div className={styles.languageContent}>
                                            <span className={styles.languageName}>
                                                {language.language_name}
                                                {language.language_code && (
                                                    <span className={styles.languageCode}>
                                                        {language.language_code}
                                                    </span>
                                                )}
                                            </span>
                                            <div
                                                className={styles.proficiencyBadge}
                                                style={{
                                                    backgroundColor: `${getProficiencyColor(language.proficiency)}20`,
                                                    color: getProficiencyColor(language.proficiency),
                                                    borderColor: `${getProficiencyColor(language.proficiency)}40`
                                                }}
                                            >
                                                {getProficiencyLabel(language.proficiency)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleEdit(language)}
                                            title="Edit language"
                                            disabled={isSubmitting}
                                        >
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => handleDelete(language.profilelanguage_id, language.language_name)}
                                            title="Remove language"
                                            disabled={isSubmitting}
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
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
                                            disabled={index === languages.length - 1 || isSubmitting}
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
                            <FiFlag size={48} />
                        </div>
                        <h3 className={styles.emptyTitle}>No languages added yet</h3>
                        <p className={styles.emptyDescription}>
                            Add languages you know with proficiency levels
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                            className={styles.emptyButton}
                        >
                            Add Language
                        </Button>
                    </div>
                )}
            </SectionLayout>

            {/* Modal for Add/Edit */}
            {showModal && (
                <SectionModal
                    opened={true}
                    onClose={handleCancel}
                    title={editingLanguage ? 'Edit Language' : 'Add Language'}
                    subtitle={editingLanguage ? `Update "${editingLanguage.language_name}"` : 'Add a new language'}
                    onSave={handleSubmit(handleFormSubmit)}
                    isSaving={isSubmitting}
                    saveText={editingLanguage ? 'Update' : 'Add'}
                    size="md"
                >
                    <FormProvider {...methods}>
                        <form className={styles.modalForm} onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Language Details</h3>
                                        <p className={styles.sectionDescription}>
                                            Select a language and set your proficiency level
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    {editingLanguage ? (
                                        <div className={styles.editLanguageDisplay}>
                                            <span className={styles.editLanguageIcon}>
                                                {editingLanguage.language_icon || '🌐'}
                                            </span>
                                            <span className={styles.editLanguageName}>
                                                {editingLanguage.language_name}
                                            </span>
                                            <span className={styles.editLanguageCode}>
                                                {editingLanguage.language_code}
                                            </span>
                                        </div>
                                    ) : (
                                        <div style={{ position: 'relative', zIndex: 9999 }}>
                                            <FormSearchSelect
                                                name="language_id"
                                                label="Select Language *"
                                                placeholder="Search languages by name..."
                                                fetchOptions={fetchLanguages}
                                                options={buildOptions()}
                                                valueKey="masterlanguage_id"
                                                labelKey="name"
                                                iconKey="icon"
                                                categoryKey="language_code"
                                                showCategory={true}
                                                required={true}
                                                disabled={isSubmitting}
                                                minSearchLength={2}
                                                debounce={300}
                                                size="md"
                                                emptyMessage="No languages found"
                                                onChange={handleLanguageSelect}
                                            />
                                        </div>
                                    )}
                                    <FormSelect
                                        name="proficiency"
                                        label="Proficiency Level *"
                                        options={proficiencyOptions}
                                        placeholder="Select your proficiency level..."
                                        required
                                        disabled={isSubmitting}
                                        onKeyDown={handleKeyDown}
                                    />
                                    {editingLanguage && (
                                        <p className={styles.editNotice}>
                                            <FiInfo size={14} />
                                            Language name cannot be changed. To change the language, please remove and add a new one.
                                        </p>
                                    )}
                                    <p className={styles.modalHint}>
                                        Choose the proficiency level that best describes your ability in this language.
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

export default LanguagesSection;