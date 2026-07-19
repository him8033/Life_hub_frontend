// src/components/portfolio/sections/SkillsSection.jsx

'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiCode, FiPlus, FiTrash2, FiStar, FiX, FiClock } from 'react-icons/fi';

import FormSelect from '@/components/common/forms/FormSelect';
import FormInput from '@/components/common/forms/FormInput';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import {
    useGetProfileSkillsQuery,
    useCreateProfileSkillMutation,
    useUpdateProfileSkillMutation,
    useDeleteProfileSkillMutation,
} from '@/services/api/portfolioApi';
import { useGetPublicMasterSkillsQuery } from '@/services/api/portfolioApi';
import { profileSkillSchema } from '@/lib/validations/portfolio/sections/profileSkillSchema';
import styles from '@/styles/portfolio/sections/SkillsSection.module.css';

const SkillsSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const [showForm, setShowForm] = useState(false);

    const { data, isLoading, refetch } = useGetProfileSkillsQuery(snapshotId, { skip: !snapshotId });
    const { data: masterSkillsData } = useGetPublicMasterSkillsQuery();
    const [createSkill, { isLoading: isCreating }] = useCreateProfileSkillMutation();
    const [updateSkill] = useUpdateProfileSkillMutation();
    const [deleteSkill] = useDeleteProfileSkillMutation();

    const profileSkills = data?.data || [];
    const masterSkills = masterSkillsData?.data || [];
    const isSubmitting = isCreating;

    // Filter available skills (not already added)
    const addedSkillIds = new Set(profileSkills.map(s => s.skill));
    const availableSkills = masterSkills.filter(s => !addedSkillIds.has(s.masterskill_id));

    const methods = useForm({
        resolver: zodResolver(profileSkillSchema),
        defaultValues: {
            skill_id: '',
            level: 3,
            years_of_experience: 0,
            is_featured: 'false',
        },
    });

    const { reset, handleSubmit, watch } = methods;
    const selectedSkillId = watch('skill_id');
    const selectedLevel = watch('level');

    const handleAdd = () => {
        reset({
            skill_id: '',
            level: 3,
            years_of_experience: 0,
            is_featured: 'false',
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        reset();
        setShowForm(false);
    };

    const handleAddSkill = async (formData) => {
        try {
            const payload = {
                skill_id: formData.skill_id,
                level: parseInt(formData.level),
                years_of_experience: parseFloat(formData.years_of_experience) || 0,
                is_featured: formData.is_featured === 'true',
            };

            await createSkill({ snapshotId, data: payload }).unwrap();
            showSnackbar('Skill added successfully', 'success', 3000);
            handleCancel();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to add skill'), 'error', 5000);
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
            await updateSkill({ skillId, data: { is_featured: !current } }).unwrap();
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to update skill'), 'error', 5000);
        }
    };

    const getLevelLabel = (level) => {
        const labels = { 1: 'Beginner', 2: 'Elementary', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert' };
        return labels[level] || 'Intermediate';
    };

    if (isLoading) return null;

    return (
        <SectionLayout
            title="Skills"
            subtitle={`${profileSkills.length} skill${profileSkills.length !== 1 ? 's' : ''} added`}
            icon={FiCode}
            isLoading={isLoading}
            isSaving={isSubmitting}
            hasData={profileSkills.length > 0}
            onSave={handleAdd}
            saveButtonText="Add Skill"
        >
            {/* Add Skill Form */}
            {showForm && (
                <div className={styles.formCard}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleAddSkill)}>
                            <div className={styles.formRow}>
                                <FormSelect
                                    name="skill_id"
                                    label="Select Skill *"
                                    options={availableSkills.map(s => ({
                                        value: s.masterskill_id,
                                        label: `${s.icon || ''} ${s.name} (${s.category_name || 'Uncategorized'})`,
                                    }))}
                                    placeholder="Search and select a skill..."
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            {selectedSkillId && (
                                <>
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
                                            icon={<FiClock />}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className={styles.formRow}>
                                        <FormSelect
                                            name="is_featured"
                                            label="Featured Skill?"
                                            options={[
                                                { value: 'false', label: 'No' },
                                                { value: 'true', label: 'Yes - Show as featured' },
                                            ]}
                                            disabled={isSubmitting}
                                        />
                                        <div className={styles.levelPreview}>
                                            <label className={styles.previewLabel}>Preview</label>
                                            <div className={styles.levelBar}>
                                                {[1, 2, 3, 4, 5].map(lvl => (
                                                    <div
                                                        key={lvl}
                                                        className={`${styles.levelDot} ${lvl <= selectedLevel ? styles.active : ''}`}
                                                        title={`Level ${lvl}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className={styles.levelText}>{getLevelLabel(parseInt(selectedLevel))}</span>
                                        </div>
                                    </div>
                                </>
                            )}

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
                                    loadingText="Adding..."
                                    icon={<FiPlus />}
                                    disabled={!selectedSkillId}
                                >
                                    Add Skill
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            )}

            {/* Skills List - Grouped by Category */}
            {profileSkills.length > 0 ? (
                <div className={styles.skillsList}>
                    {Object.entries(
                        profileSkills.reduce((acc, skill) => {
                            const cat = skill.category_name || 'Other';
                            if (!acc[cat]) acc[cat] = [];
                            acc[cat].push(skill);
                            return acc;
                        }, {})
                    ).map(([category, skills]) => (
                        <div key={category} className={styles.categoryGroup}>
                            <h4 className={styles.categoryTitle}>{category} ({skills.length})</h4>
                            <div className={styles.skillsGrid}>
                                {skills.map((skill) => (
                                    <div key={skill.profileskill_id} className={`${styles.skillCard} ${skill.is_featured ? styles.featured : ''}`}>
                                        <div className={styles.skillHeader}>
                                            {skill.image_url ? (
                                                <img src={skill.image_url} alt="" className={styles.skillImg} />
                                            ) : (
                                                <span className={styles.skillIcon}>{skill.skill_icon || '💻'}</span>
                                            )}
                                            <div className={styles.skillInfo}>
                                                <span className={styles.skillName}>{skill.skill_name}</span>
                                                <span className={styles.skillLevel}>
                                                    {getLevelLabel(skill.level)}
                                                    {skill.years_of_experience > 0 && ` · ${skill.years_of_experience} yrs`}
                                                </span>
                                            </div>
                                            <div className={styles.skillActions}>
                                                <button
                                                    className={styles.actionButton}
                                                    onClick={() => handleToggleFeatured(skill.profileskill_id, skill.is_featured)}
                                                    title={skill.is_featured ? 'Unfeature' : 'Feature'}
                                                    disabled={isSubmitting}
                                                >
                                                    <FiStar size={12} className={skill.is_featured ? styles.featuredStar : ''} />
                                                </button>
                                                <button
                                                    className={styles.actionButton}
                                                    onClick={() => handleRemove(skill.profileskill_id, skill.skill_name)}
                                                    title="Remove"
                                                    disabled={isSubmitting}
                                                >
                                                    <FiTrash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.levelBar}>
                                            {[1, 2, 3, 4, 5].map(lvl => (
                                                <div
                                                    key={lvl}
                                                    className={`${styles.levelDot} ${lvl <= skill.level ? styles.active : ''}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !showForm && (
                    <div className={styles.emptyState}>
                        <FiCode size={32} />
                        <p>No skills added yet</p>
                        <Button variant="outline" size="sm" onClick={handleAdd} icon={<FiPlus />}>
                            Add your first skill
                        </Button>
                    </div>
                )
            )}
        </SectionLayout>
    );
};

export default SkillsSection;