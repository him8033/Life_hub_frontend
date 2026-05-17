'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from '@/styles/common/CommonForm.module.css';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import MasterSkillForm from '@/components/portfolio/admin/MasterSkillForm';
import { useGetMasterSkillQuery, useUpdateMasterSkillMutation } from '@/services/api/portfolioApi';
import { FiCode } from 'react-icons/fi';

export default function EditMasterSkillPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const skillId = params.skillId;
    let formRef = null;

    const { data, error, isLoading, refetch } = useGetMasterSkillQuery(skillId, { skip: !skillId });
    const skill = data?.data || null;
    const [updateMasterSkill, { isLoading: isSubmitting }] = useUpdateMasterSkillMutation();

    const handleSubmit = async (formData) => {
        if (isSubmitting) return;
        try {
            // formData is already FormData object
            const res = await updateMasterSkill({ skillId, data: formData }).unwrap();
            showSnackbar(res.message || 'Master skill updated successfully!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.MASTERSKILL.LIST);
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

    if (isLoading) return <Loader text="Loading master skill..." />;

    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Master Skill Not Found"
                message="The master skill you're looking for doesn't exist."
                backLabel="Back to Master Skills"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.MASTERSKILL.LIST}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load master skill"}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    if (!skill) {
        return (
            <NotFoundState
                title="Master Skill Not Found"
                message="The master skill you're looking for doesn't exist."
                backLabel="Back to Master Skills"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.MASTERSKILL.LIST}
                fullPage={true}
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FiCode className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Edit Master Skill: {skill.name}</h1>
                    </div>
                </div>
            </div>
            <div className={styles.pageContent}>
                <MasterSkillForm
                    initialData={skill}
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isSubmitting}
                    mode="edit"
                />
            </div>
        </div>
    );
}