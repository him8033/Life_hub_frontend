'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from '@/styles/common/CommonForm.module.css';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import PortfolioSettingsForm from '@/components/portfolio/PortfolioSettingsForm';
import { useGetPortfolioProjectQuery, useUpdatePortfolioProjectMutation } from '@/services/api/portfolioApi';
import { FiGlobe } from 'react-icons/fi';

export default function EditPortfolioPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const portfolioId = params.portfolioId;
    let formRef = null;

    const { data, error, isLoading, refetch } = useGetPortfolioProjectQuery(portfolioId, { skip: !portfolioId });
    const portfolio = data?.data || null;

    const [updatePortfolio, { isLoading: isSubmitting }] = useUpdatePortfolioProjectMutation();

    const handleSubmit = async (formData) => {
        if (isSubmitting) return;
        try {
            const res = await updatePortfolio({
                portfolioId,
                data: formData,
            }).unwrap();
            showSnackbar(res.message || 'Portfolio settings updated!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.LIST);
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
        return <Loader text="Loading portfolio data..." />;
    }

    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Portfolio Not Found"
                message="The portfolio you're looking for doesn't exist or is no longer available."
                backLabel="Back to Portfolios"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.LIST}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load portfolio details. Please try again."}
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
                        <FiGlobe className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Edit Portfolio: {portfolio.title}</h1>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className={styles.pageContent}>
                <PortfolioSettingsForm
                    initialData={portfolio}
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isSubmitting}
                    mode="edit"
                />
            </div>
        </div>
    );
}