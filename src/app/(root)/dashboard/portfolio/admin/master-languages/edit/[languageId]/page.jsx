'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from '@/styles/common/CommonForm.module.css';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import MasterLanguageForm from '@/components/portfolio/admin/MasterLanguageForm';
import { useGetMasterLanguageQuery, useUpdateMasterLanguageMutation } from '@/services/api/portfolioApi';
import { FiFlag } from 'react-icons/fi';

export default function EditMasterLanguagePage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const languageId = params.languageId;
    let formRef = null;

    const { data, error, isLoading, refetch } = useGetMasterLanguageQuery(languageId, { skip: !languageId });
    const language = data?.data || null;
    const [updateMasterLanguage, { isLoading: isSubmitting }] = useUpdateMasterLanguageMutation();

    const handleSubmit = async (formData) => {
        if (isSubmitting) return;
        try {
            const res = await updateMasterLanguage({ languageId, data: formData }).unwrap();
            showSnackbar(res.message || 'Language updated successfully!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.MASTERLANGUAGE.LIST);
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

    if (isLoading) return <Loader text="Loading language..." />;

    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Language Not Found"
                message="The language you're looking for doesn't exist."
                backLabel="Back to Languages"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.MASTERLANGUAGE.LIST}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load language"}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    if (!language) {
        return (
            <NotFoundState
                title="Language Not Found"
                message="The language you're looking for doesn't exist."
                backLabel="Back to Languages"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.MASTERLANGUAGE.LIST}
                fullPage={true}
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FiFlag className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Edit Language: {language.name}</h1>
                    </div>
                </div>
            </div>
            <div className={styles.pageContent}>
                <MasterLanguageForm
                    initialData={language}
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isSubmitting}
                    mode="edit"
                />
            </div>
        </div>
    );
}