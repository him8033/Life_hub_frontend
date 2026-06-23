'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from '@/styles/common/CommonForm.module.css';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import ResumeSettingsForm from '@/components/portfolio/ResumeSettingsForm';
import { useGetResumeProjectQuery, useUpdateResumeProjectMutation } from '@/services/api/portfolioApi';
import { FiFileText } from 'react-icons/fi';

export default function EditResumePage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const resumeId = params.resumeId;
    let formRef = null;

    const { data, error, isLoading, refetch } = useGetResumeProjectQuery(resumeId, { skip: !resumeId });
    const resume = data?.data || null;

    const [updateResume, { isLoading: isSubmitting }] = useUpdateResumeProjectMutation();

    const handleSubmit = async (formData) => {
        if (isSubmitting) return;
        try {
            const res = await updateResume({
                resumeId,
                data: formData,
            }).unwrap();
            showSnackbar(res.message || 'Resume settings updated!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.LIST);
        } catch (error) {
            const backendErrors = error?.data?.errors;

            if (backendErrors?.field_errors && formRef) {
                Object.entries(backendErrors.field_errors).forEach(
                    ([field, messages]) => {
                        formRef.setError(field, {
                            type: 'server',
                            message: messages[0],
                        });
                    }
                );
            }

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            }
        }
    };

    if (isLoading) {
        return <Loader text="Loading resume data..." />;
    }

    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Resume Not Found"
                message="The resume you're looking for doesn't exist or is no longer available."
                backLabel="Back to Resumes"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.RESUME.LIST}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load resume details. Please try again."}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FiFileText className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Edit Resume: {resume.title}</h1>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className={styles.pageContent}>
                <ResumeSettingsForm
                    initialData={resume}
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isSubmitting}
                    mode="edit"
                />
            </div>
        </div>
    );
}