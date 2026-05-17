'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from '@/styles/common/CommonForm.module.css';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import SkillCategoryForm from '@/components/portfolio/admin/SkillCategoryForm';
import { useGetSkillCategoryQuery, useUpdateSkillCategoryMutation } from '@/services/api/portfolioApi';
import { FiGrid } from 'react-icons/fi';

export default function EditSkillCategoryPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const categoryId = params.categoryId;
    let formRef = null;

    const { data, error, isLoading, refetch } = useGetSkillCategoryQuery(categoryId, { skip: !categoryId });
    const category = data?.data || null;
    const [updateSkillCategory, { isLoading: isSubmitting }] = useUpdateSkillCategoryMutation();

    const handleSubmit = async (formData) => {
        if (isSubmitting) return;
        try {
            const res = await updateSkillCategory({ categoryId, data: formData }).unwrap();
            showSnackbar(res.message || 'Skill category updated successfully!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.SKILLCATEGORY.LIST);
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors?.field_errors && formRef) {
                Object.entries(backendErrors.field_errors).forEach(([field, messages]) => {
                    formRef.setError(field, { type: 'server', message: messages[0] });
                });
            }
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            }
        }
    };

    if (isLoading) return <Loader text="Loading skill category..." />;

    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Skill Category Not Found"
                message="The skill category you're looking for doesn't exist."
                backLabel="Back to Skill Categories"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.SKILLCATEGORY.LIST}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load skill category"}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    if (!category) {
        return (
            <NotFoundState
                title="Skill Category Not Found"
                message="The skill category you're looking for doesn't exist."
                backLabel="Back to Skill Categories"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.SKILLCATEGORY.LIST}
                fullPage={true}
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FiGrid className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Edit Skill Category: {category.name}</h1>
                    </div>
                </div>
            </div>
            <div className={styles.pageContent}>
                <SkillCategoryForm
                    initialData={category}
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isSubmitting}
                    mode="edit"
                />
            </div>
        </div>
    );
}