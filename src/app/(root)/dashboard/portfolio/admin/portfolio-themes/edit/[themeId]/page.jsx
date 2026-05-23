'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from '@/styles/common/CommonForm.module.css';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import PortfolioThemeForm from '@/components/portfolio/admin/PortfolioThemeForm';
import { useGetPortfolioThemeQuery, useUpdatePortfolioThemeMutation } from '@/services/api/portfolioApi';
import { FaPalette } from 'react-icons/fa';

export default function EditPortfolioThemePage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const themeId = params.themeId;
    let formRef = null;

    const { data, error, isLoading, refetch } = useGetPortfolioThemeQuery(themeId, { skip: !themeId });
    const theme = data?.data || null;
    const [updatePortfolioTheme, { isLoading: isSubmitting }] = useUpdatePortfolioThemeMutation();

    const handleSubmit = async (formData) => {
        if (isSubmitting) return;
        try {
            const res = await updatePortfolioTheme({ themeId, data: formData }).unwrap();
            showSnackbar(res.message || 'Theme updated successfully!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIOTHEME.LIST);
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

    if (isLoading) return <Loader text="Loading theme..." />;

    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Theme Not Found"
                message="The theme you're looking for doesn't exist."
                backLabel="Back to Themes"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIOTHEME.LIST}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load theme"}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    if (!theme) {
        return (
            <NotFoundState
                title="Theme Not Found"
                message="The theme you're looking for doesn't exist."
                backLabel="Back to Themes"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIOTHEME.LIST}
                fullPage={true}
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FaPalette className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Edit Theme: {theme.name}</h1>
                    </div>
                </div>
            </div>
            <div className={styles.pageContent}>
                <PortfolioThemeForm
                    initialData={theme}
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isSubmitting}
                    mode="edit"
                />
            </div>
        </div>
    );
}