'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import Button from '@/components/common/buttons/Button';
import PortfolioCard from '@/components/portfolio/PortfolioCard';
import { useGetPortfolioProjectsQuery, useDeletePortfolioProjectMutation, useDuplicatePortfolioProjectMutation } from '@/services/api/portfolioApi';
import { FiGlobe, FiPlus } from 'react-icons/fi';
import styles from '@/styles/portfolio/resume/ResumeList.module.css';

export default function PortfoliosPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, isLoading, error, refetch } = useGetPortfolioProjectsQuery();
    const [deletePortfolio] = useDeletePortfolioProjectMutation();
    const [duplicatePortfolio] = useDuplicatePortfolioProjectMutation();

    const portfolios = data?.data || [];

    const handleDelete = async (portfolioId, title) => {
        const ok = await confirm({ title: 'Delete Portfolio', message: `Delete "${title}"?`, confirmText: 'Delete', cancelText: 'Cancel', type: 'danger' });
        if (!ok) return;
        try { setIsDeleting(true); await deletePortfolio(portfolioId).unwrap(); showSnackbar('Portfolio deleted', 'success', 3000); refetch(); }
        catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
        finally { setIsDeleting(false); }
    };

    const handleDuplicate = async (portfolioId, title) => {
        try { await duplicatePortfolio(portfolioId).unwrap(); showSnackbar(`"${title}" duplicated`, 'success', 3000); refetch(); }
        catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    if (isLoading) return <Loader text="Loading portfolios..." />;
    if (error) return <ErrorState message={error?.data?.message || "Failed to load portfolios"} onRetry={refetch} retryMsg="Retry" />;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.pageTitleWrapper}>
                    <FiGlobe className={styles.pageIcon} />
                    <div><h1 className={styles.pageTitle}>My Portfolios</h1><p className={styles.pageSubtitle}>{portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''} created</p></div>
                </div>
                <Button variant="primary" onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.CREATE)} icon={<FiPlus />}>Create Portfolio</Button>
            </div>

            {portfolios.length > 0 ? (
                <div className={styles.grid}>
                    {portfolios.map(p => (
                        <PortfolioCard key={p.portfolio_id} portfolio={p} onEdit={(id) => router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.EDIT(id))} onDelete={handleDelete} onDuplicate={handleDuplicate} isLoading={isDeleting} />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}><FiGlobe size={48} /><h3>No portfolios yet</h3><p>Create your first portfolio from a profile snapshot</p><Button variant="primary" onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.CREATE)} icon={<FiPlus />}>Create Portfolio</Button></div>
            )}
        </div>
    );
}