'use client';

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiTag, FiHash, FiStar } from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormSelect from '@/components/common/forms/FormSelect';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';
import useSlugGenerator from '@/hooks/useSlugGenerator';
import { skillCategorySchema } from '@/lib/validations/skillCategorySchema';
import styles from '@/styles/portfolio/admin/SkillCategoryForm.module.css';

const SkillCategoryForm = ({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    mode = 'create'
}) => {
    const { slug, generateFrom, updateManually, reset: resetSlug } = useSlugGenerator(initialData.slug);

    const methods = useForm({
        resolver: zodResolver(skillCategorySchema),
        defaultValues: {
            name: initialData?.name || '',
            slug: initialData?.slug || '',
            icon: initialData?.icon || '',
            position: initialData?.position || 0,
        },
    });

    const { setValue, reset } = methods;

    /* Sync slug hook → form */
    useEffect(() => {
        setValue('slug', slug);
    }, [slug, setValue]);

    /* Edit mode prefill */
    useEffect(() => {
        if (mode === 'edit' && initialData?.slug) {
            resetSlug(initialData.slug);
            reset({
                name: initialData.name || '',
                slug: initialData.slug || '',
                icon: initialData.icon || '',
                position: initialData.position || 0,
            });
        }
    }, [mode, initialData, reset, resetSlug]);

    useEffect(() => {
        if (onBackendError) {
            onBackendError(methods);
        }
    }, [methods, onBackendError]);

    return (
        <div className={styles.formContainer}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <FormInput
                        name="name"
                        label="Category Name"
                        placeholder="e.g., Frontend, Backend, DevOps"
                        icon={<FiTag />}
                        required
                        autoFocus={mode === 'create'}
                        disabled={isSubmitting}
                        description="Enter a descriptive name for the skill category"
                        className={styles.formItem}
                        onChange={(e) => {
                            generateFrom(e.target.value);
                        }}
                    />

                    <FormInput
                        name="slug"
                        label="Slug"
                        placeholder="e.g., frontend, backend, devops"
                        icon={<FiHash />}
                        required
                        disabled={isSubmitting}
                        description="Auto-generated from name. You can also edit manually."
                        className={styles.formItem}
                        onChange={(e) => {
                            updateManually(e.target.value);
                        }}
                    />

                    <FormInput
                        name="icon"
                        label="Icon"
                        placeholder="e.g., 🖥️, ⚙️, 🚀 (emoji or icon name)"
                        icon={<FiStar />}
                        disabled={isSubmitting}
                        description="Optional: Add an emoji or icon identifier"
                        className={styles.formItem}
                    />

                    <FormInput
                        name="position"
                        label="Display Order"
                        type="number"
                        placeholder="0"
                        disabled={isSubmitting}
                        description="Lower numbers appear first. Default is 0"
                        className={styles.formItem}
                    />

                    <ButtonGroup align="end" className={styles.formActions}>
                        <Button
                            variant="secondary"
                            onClick={() => reset()}
                            disabled={isSubmitting}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting}
                            loadingText={mode === 'create' ? 'Creating...' : 'Updating...'}
                        >
                            {mode === 'create' ? 'Create Category' : 'Update Category'}
                        </Button>
                    </ButtonGroup>
                </form>
            </FormProvider>
        </div>
    );
};

export default SkillCategoryForm;