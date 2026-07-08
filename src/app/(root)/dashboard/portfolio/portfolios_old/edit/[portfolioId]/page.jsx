'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import PortfolioForm from '@/components/portfolio/PortfolioForm';
import { useGetPortfolioProjectQuery, useUpdatePortfolioProjectMutation } from '@/services/api/portfolioApi';
import styles from '@/styles/common/CommonForm.module.css';
import { FiGlobe } from 'react-icons/fi';

export default function EditPortfolioPage() {
    const router = useRouter(); const { showSnackbar } = useSnackbar();
    const params = useParams(); const portfolioId = params.portfolioId;

    const { data, isLoading, error, refetch } = useGetPortfolioProjectQuery(portfolioId, { skip: !portfolioId });
    const [updatePortfolio, { isLoading: isSubmitting }] = useUpdatePortfolioProjectMutation();
    const portfolio = data?.data;

    const handleSubmit = async (formData) => {
        try { await updatePortfolio({ portfolioId, data: formData }).unwrap(); showSnackbar('Portfolio updated!', 'success', 5000); router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.LIST); }
        catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    if (isLoading) return <Loader text="Loading..." />;
    if (error?.status === 404) return <NotFoundState title="Not Found" backLabel="Back" backTo={ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.LIST} fullPage />;
    if (error) return <ErrorState message={error?.data?.message} onRetry={refetch} retryMsg="Retry" />;
    if (!portfolio) return <NotFoundState title="Not Found" backLabel="Back" backTo={ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.LIST} fullPage />;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}><div className={styles.headerContent}><div className={styles.pageTitleWrapper}><FiGlobe className={styles.pageIcon} /><h1 className={styles.pageTitle}>Edit Portfolio: {portfolio.title}</h1></div></div></div>
            <div className={styles.pageContent}><PortfolioForm initialData={portfolio} onSubmit={handleSubmit} isSubmitting={isSubmitting} mode="edit" /></div>
        </div>
    );
}