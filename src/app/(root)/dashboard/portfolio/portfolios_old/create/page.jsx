'use client';

import { useRouter } from 'next/navigation';
import PortfolioForm from '@/components/portfolio/PortfolioForm';
import { useCreatePortfolioProjectMutation } from '@/services/api/portfolioApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import styles from '@/styles/common/CommonForm.module.css';
import { FiGlobe } from 'react-icons/fi';

export default function CreatePortfolioPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [createPortfolio, { isLoading }] = useCreatePortfolioProjectMutation();

    const handleSubmit = async (formData) => {
        try { await createPortfolio(formData).unwrap(); showSnackbar('Portfolio created!', 'success', 5000); router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.LIST); }
        catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}><div className={styles.headerContent}><div className={styles.pageTitleWrapper}><FiGlobe className={styles.pageIcon} /><h1 className={styles.pageTitle}>Create Portfolio</h1></div></div></div>
            <div className={styles.pageContent}><PortfolioForm onSubmit={handleSubmit} isSubmitting={isLoading} mode="create" /></div>
        </div>
    );
}