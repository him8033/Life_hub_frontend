'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from '@/styles/common/CommonForm.module.css';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import ResumeTemplateForm from '@/components/portfolio/admin/ResumeTemplateForm';
import { useGetResumeTemplateQuery, useUpdateResumeTemplateMutation } from '@/services/api/portfolioApi';
import { FiLayout } from 'react-icons/fi';

export default function EditResumeTemplatePage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const templateId = params.templateId;
    let formRef = null;

    const { data, error, isLoading, refetch } = useGetResumeTemplateQuery(templateId, { skip: !templateId });
    const template = data?.data || null;
    const [updateResumeTemplate, { isLoading: isSubmitting }] = useUpdateResumeTemplateMutation();

    const handleSubmit = async (formData) => {
        if (isSubmitting) return;
        try {
            const res = await updateResumeTemplate({ templateId, data: formData }).unwrap();
            showSnackbar(res.message || 'Template updated successfully!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUMETEMPLATE.LIST);
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

    if (isLoading) return <Loader text="Loading template..." />;

    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Template Not Found"
                message="The template you're looking for doesn't exist."
                backLabel="Back to Templates"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.RESUMETEMPLATE.LIST}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load template"}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    if (!template) {
        return (
            <NotFoundState
                title="Template Not Found"
                message="The template you're looking for doesn't exist."
                backLabel="Back to Templates"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.RESUMETEMPLATE.LIST}
                fullPage={true}
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FiLayout className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Edit Template: {template.name}</h1>
                    </div>
                </div>
            </div>
            <div className={styles.pageContent}>
                <ResumeTemplateForm
                    initialData={template}
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isSubmitting}
                    mode="edit"
                />
            </div>
        </div>
    );
}