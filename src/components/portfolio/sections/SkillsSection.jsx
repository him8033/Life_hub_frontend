// src/components/portfolio/sections/SkillsSection.jsx

'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiCode, FiPlus, FiTrash2, FiStar, FiClock,
    FiInfo, FiAward, FiArrowUp, FiArrowDown, FiEdit2
} from 'react-icons/fi';

import FormSelect from '@/components/common/forms/FormSelect';
import FormSearchSelect from '@/components/common/forms/FormSearchSelect';
import FormInput from '@/components/common/forms/FormInput';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { SectionModal } from './common/SectionModal';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useGetProfileSkillsQuery,
    useCreateProfileSkillMutation,
    useUpdateProfileSkillMutation,
    useDeleteProfileSkillMutation,
    useReorderProfileSkillsMutation,
} from '@/services/api/portfolioApi';
import { useLazyGetPublicMasterSkillsQuery } from '@/services/api/portfolioApi';
import { profileSkillSchema } from '@/lib/validations/portfolio/sections/profileSkillSchema';
import styles from '@/styles/portfolio/sections/SkillsSection.module.css';

const SkillsSection = ({
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
    const [showModal, setShowModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [allSkills, setAllSkills] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkill, setSelectedSkill] = useState(null);
    const isFetchingRef = useRef(false);

    const { data, isLoading, refetch } = useGetProfileSkillsQuery(snapshotId, { skip: !snapshotId });
    const [searchMasterSkills] = useLazyGetPublicMasterSkillsQuery();
    const [createSkill, { isLoading: isCreating }] = useCreateProfileSkillMutation();
    const [updateSkill, { isLoading: isUpdating }] = useUpdateProfileSkillMutation();
    const [deleteSkill] = useDeleteProfileSkillMutation();
    const [reorderSkills] = useReorderProfileSkillsMutation();

    const profileSkills = data?.data || [];
    const isSubmitting = isCreating || isUpdating;

    // Memoize added skill IDs
    const addedSkillIds = useMemo(() => {
        return new Set(profileSkills.map(s => s.skill_value));
    }, [profileSkills]);

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

    const loadMoreSkills = useCallback(async () => {
        if (!hasMore || isFetchingRef.current) return;

        const nextPage = page + 1;
        try {
            isFetchingRef.current = true;

            const response = await searchMasterSkills({
                search: searchTerm.trim() || undefined,
                page: nextPage,
                page_size: 20,
            }).unwrap();

            const newSkills = response?.data?.results || [];
            const filteredSkills = newSkills.filter(
                skill => !addedSkillIds.has(skill.masterskill_id)
            );

            setAllSkills(prev => [...prev, ...filteredSkills]);
            setHasMore(!!response?.data?.next);
            setPage(nextPage);
        } catch (error) {
            console.error("Failed to load more skills:", error);
        } finally {
            isFetchingRef.current = false;
        }
    }, [searchMasterSkills, addedSkillIds, hasMore, page, searchTerm]);

    const methods = useForm({
        resolver: zodResolver(profileSkillSchema),
        defaultValues: {
            skill_id: '',
            level: 3,
            years_of_experience: 0,
            is_featured: false,
        },
    });

    const { reset, handleSubmit, watch, setValue, getValues } = methods;
    const selectedLevel = watch('level');
    const selectedSkillId = watch('skill_id');

    // Update selected skill when ID changes
    useEffect(() => {
        if (selectedSkillId && selectedSkill && selectedSkill.masterskill_id !== selectedSkillId) {
            const found = allSkills.find(s => s.masterskill_id === selectedSkillId);
            if (found) {
                setSelectedSkill(found);
            }
        }
    }, [selectedSkillId, selectedSkill, allSkills]);

    const handleAdd = () => {
        setEditingSkill(null);
        setSelectedSkill(null);
        reset({
            skill_id: '',
            level: 3,
            years_of_experience: 0,
            is_featured: false,
        });
        setSearchTerm('');
        setAllSkills([]);
        setPage(1);
        setHasMore(true);
        setShowModal(true);
    };

    const handleEdit = (skill) => {
        setEditingSkill(skill);
        setSelectedSkill(null);
        reset({
            skill_id: skill.skill_value,
            level: skill.level,
            years_of_experience: parseFloat(skill.years_of_experience) || 0,
            is_featured: skill.is_featured || false,
        });
        setShowModal(true);
    };

    const handleCancel = () => {
        reset();
        setEditingSkill(null);
        setSelectedSkill(null);
        setShowModal(false);
        setSearchTerm('');
        setAllSkills([]);
        setPage(1);
        setHasMore(true);
    };

    const handleSkillSelect = useCallback((value, item) => {
        if (item) {
            setSelectedSkill(item);
        } else {
            setSelectedSkill(null);
        }
    }, []);

    const handleAddSkill = async (formData) => {
        try {
            const payload = {
                skill_id: formData.skill_id,
                level: Number(formData.level),
                years_of_experience: Number(formData.years_of_experience) || 0,
                is_featured: Boolean(formData.is_featured),
            };

            if (editingSkill) {
                await updateSkill({
                    skillId: editingSkill.profileskill_id,
                    data: payload
                }).unwrap();
                showSnackbar('Skill updated successfully', 'success', 3000);
            } else {
                await createSkill({ snapshotId, data: payload }).unwrap();
                showSnackbar('Skill added successfully', 'success', 3000);
            }
            handleCancel();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save skill'), 'error', 5000);
        }
    };

    const handleRemove = async (skillId, skillName) => {
        try {
            await deleteSkill(skillId).unwrap();
            showSnackbar(`"${skillName}" removed`, 'success', 3000);
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to remove skill'), 'error', 5000);
        }
    };

    const handleToggleFeatured = async (skillId, current) => {
        try {
            await updateSkill({
                skillId,
                data: { is_featured: !current }
            }).unwrap();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to update skill'), 'error', 5000);
        }
    };

    const handleMove = async (index, direction) => {
        const newList = [...profileSkills];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newList.length) return;
        [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];

        try {
            await reorderSkills({
                snapshotId,
                data: { order: newList.map(s => s.profileskill_id) },
            }).unwrap();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to reorder skills'), 'error', 5000);
        }
    };

    const getLevelLabel = (level) => {
        const labels = { 1: 'Beginner', 2: 'Elementary', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert' };
        return labels[level] || 'Intermediate';
    };

    const buildOptions = useCallback(() => {
        if (!selectedSkillId) {
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

        if (selectedSkillId) {
            const found = allSkills.find(s => s.masterskill_id === selectedSkillId);
            if (found) {
                setSelectedSkill(found);
                return [{
                    masterskill_id: found.masterskill_id,
                    name: found.name,
                    icon: found.icon || '💻',
                    category_name: found.category_name,
                    ...found
                }];
            }
        }

        return [];
    }, [selectedSkill, selectedSkillId, allSkills]);

    if (isLoading) return null;

    return (
        <>
            <SectionLayout
                title="Skills"
                subtitle={`${profileSkills.length} skill${profileSkills.length !== 1 ? 's' : ''}`}
                icon={FiCode}
                isLoading={isLoading}
                isSaving={isSubmitting}
                hasData={profileSkills.length > 0}
                onSave={handleAdd}
                saveButtonText="Add Skill"
                onPrevious={onPrevious}
                onNext={onNext}
                showPrevious={showPrevious}
                showNext={showNext}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                previousSectionName={previousSectionName}
                nextSectionName={nextSectionName}
            >
                {profileSkills.length > 0 ? (
                    <div className={styles.skillsContainer}>
                        {Object.entries(
                            profileSkills.reduce((acc, skill) => {
                                const cat = skill.category_name || 'Other';
                                if (!acc[cat]) acc[cat] = [];
                                acc[cat].push(skill);
                                return acc;
                            }, {})
                        ).map(([category, skills]) => (
                            <div key={category} className={styles.categorySection}>
                                <div className={styles.categoryHeader}>
                                    <h4 className={styles.categoryTitle}>{category}</h4>
                                    <span className={styles.categoryCount}>{skills.length}</span>
                                </div>
                                <div className={styles.skillsGrid}>
                                    {skills.map((skill, index) => (
                                        <div key={skill.profileskill_id} className={`${styles.skillCard} ${skill.is_featured ? styles.featured : ''}`}>
                                            <div className={styles.cardHeader}>
                                                <div className={styles.skillInfo}>
                                                    <div className={styles.skillIconWrapper}>
                                                        {skill.image_url ? (
                                                            <img src={skill.image_url} alt="" className={styles.skillImage} />
                                                        ) : (
                                                            <span className={styles.skillIcon}>{skill.skill_icon || '💻'}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className={styles.skillName}>
                                                            {skill.skill_name}
                                                            {skill.is_featured && (
                                                                <span className={styles.featuredBadge}>
                                                                    <FiStar size={10} /> Featured
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className={styles.skillMeta}>
                                                            <span className={styles.skillLevel}>
                                                                {getLevelLabel(skill.level)}
                                                            </span>
                                                            {skill.years_of_experience > 0 && (
                                                                <span className={styles.skillExperience}>
                                                                    <FiClock size={12} />
                                                                    {skill.years_of_experience} yrs
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.cardActions}>
                                                    <button
                                                        className={`${styles.actionBtn} ${styles.editBtn}`}
                                                        onClick={() => handleEdit(skill)}
                                                        title="Edit skill"
                                                        disabled={isSubmitting}
                                                    >
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                    <button
                                                        className={`${styles.actionBtn} ${!skill.is_featured ? styles.featureBtn : ''}`}
                                                        onClick={() => handleToggleFeatured(skill.profileskill_id, skill.is_featured)}
                                                        title={skill.is_featured ? 'Unfeature' : 'Feature'}
                                                        disabled={isSubmitting}
                                                    >
                                                        <FiStar size={14} className={skill.is_featured ? styles.starActive : ''} />
                                                    </button>
                                                    <button
                                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                        onClick={() => handleRemove(skill.profileskill_id, skill.skill_name)}
                                                        title="Remove skill"
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
                                                        disabled={index === skills.length - 1 || isSubmitting}
                                                        title="Move down"
                                                    >
                                                        <FiArrowDown size={12} />
                                                    </button>
                                                </div>
                                                <div className={styles.levelBar}>
                                                    {[1, 2, 3, 4, 5].map(lvl => (
                                                        <div
                                                            key={lvl}
                                                            className={`${styles.levelDot} ${lvl <= skill.level ? styles.active : ''}`}
                                                            title={`Level ${lvl}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <FiCode size={48} />
                        </div>
                        <h3 className={styles.emptyTitle}>No skills added yet</h3>
                        <p className={styles.emptyDescription}>
                            Add your professional skills and expertise
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleAdd}
                            icon={<FiPlus />}
                            className={styles.emptyButton}
                        >
                            Add Skill
                        </Button>
                    </div>
                )}
            </SectionLayout>

            {/* Modal for Add/Edit */}
            {showModal && (
                <SectionModal
                    opened={true}
                    onClose={handleCancel}
                    title={editingSkill ? 'Edit Skill' : 'Add Skill'}
                    subtitle={editingSkill ? `Update proficiency for "${editingSkill.skill_name}"` : 'Add a new skill'}
                    onSave={handleSubmit(handleAddSkill)}
                    isSaving={isSubmitting}
                    saveText={editingSkill ? 'Update' : 'Add'}
                    size="lg"
                >
                    <FormProvider {...methods}>
                        <form className={styles.modalForm}>
                            {/* Skill Selection Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiInfo className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>
                                            {editingSkill ? 'Skill' : 'Skill Selection'}
                                        </h3>
                                        <p className={styles.sectionDescription}>
                                            {editingSkill
                                                ? 'The skill name cannot be changed'
                                                : 'Search for skills from the available list'}
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    {editingSkill ? (
                                        <FormSelect
                                            name="skill_id"
                                            label="Selected Skill *"
                                            options={[
                                                {
                                                    value: editingSkill.skill_value,
                                                    label: `${editingSkill.skill_icon || '💻'} ${editingSkill.skill_name}`
                                                }
                                            ]}
                                            placeholder="Skill cannot be changed"
                                            disabled={true}
                                        />
                                    ) : (
                                        <div style={{ position: 'relative', zIndex: 9999 }}>
                                            <FormSearchSelect
                                                name="skill_id"
                                                label="Search and Select Skill *"
                                                placeholder="Search skills by name..."
                                                fetchOptions={fetchSkills}
                                                options={buildOptions()}
                                                valueKey="masterskill_id"
                                                labelKey="name"
                                                // iconKey="icon"
                                                categoryKey="category_name"
                                                showCategory={true}
                                                required={true}
                                                disabled={isSubmitting}
                                                minSearchLength={2}
                                                debounce={300}
                                                size="md"
                                                emptyMessage="No skills found"
                                                onChange={handleSkillSelect}
                                            />
                                        </div>
                                    )}
                                    {editingSkill && (
                                        <p className={styles.editNotice}>
                                            <FiInfo size={14} />
                                            Skill name cannot be changed. To change the skill, please remove and add a new one.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Proficiency Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiAward className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Proficiency</h3>
                                        <p className={styles.sectionDescription}>
                                            Set your experience level
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <div className={styles.formRow}>
                                        <FormSelect
                                            name="level"
                                            label="Proficiency Level (1-5)"
                                            options={[
                                                { value: '1', label: '1 - Beginner' },
                                                { value: '2', label: '2 - Elementary' },
                                                { value: '3', label: '3 - Intermediate' },
                                                { value: '4', label: '4 - Advanced' },
                                                { value: '5', label: '5 - Expert' },
                                            ]}
                                            disabled={isSubmitting}
                                        />
                                        <FormInput
                                            name="years_of_experience"
                                            label="Years of Experience"
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="50"
                                            placeholder="e.g., 2.5"
                                            icon={<FiClock size={16} />}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className={styles.levelPreview}>
                                        <label className={styles.previewLabel}>Preview</label>
                                        <div className={styles.levelBarPreview}>
                                            {[1, 2, 3, 4, 5].map(lvl => (
                                                <div
                                                    key={lvl}
                                                    className={`${styles.levelDot} ${lvl <= selectedLevel ? styles.active : ''}`}
                                                    title={`Level ${lvl}`}
                                                />
                                            ))}
                                        </div>
                                        <span className={styles.levelText}>{getLevelLabel(selectedLevel)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Section */}
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <FiStar className={styles.sectionIcon} />
                                    <div>
                                        <h3 className={styles.sectionTitle}>Featured Skill</h3>
                                        <p className={styles.sectionDescription}>
                                            Highlight this skill as a featured skill
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.sectionContent}>
                                    <FormSelect
                                        name="is_featured"
                                        label="Featured Skill?"
                                        options={[
                                            { value: 'false', label: 'No' },
                                            { value: 'true', label: 'Yes - Show as featured' },
                                        ]}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </SectionModal>
            )}
        </>
    );
};

export default SkillsSection;