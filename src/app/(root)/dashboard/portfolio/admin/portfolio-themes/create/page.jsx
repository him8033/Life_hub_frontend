'use client';

import { useRouter } from 'next/navigation';
import PortfolioThemeForm from '@/components/portfolio/admin/PortfolioThemeForm';
import { useCreatePortfolioThemeMutation } from '@/services/api/portfolioApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import styles from '@/styles/common/CommonForm.module.css';
import { FaPalette } from 'react-icons/fa';

export default function CreatePortfolioThemePage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [createPortfolioTheme, { isLoading }] = useCreatePortfolioThemeMutation();
    let formRef = null;

    const handleSubmit = async (formData) => {
        if (isLoading) return;
        try {
            const res = await createPortfolioTheme(formData).unwrap();
            showSnackbar(res.message || 'Theme created successfully!', 'success', 5000);
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

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FaPalette className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Create Portfolio Theme</h1>
                    </div>
                </div>
            </div>
            <div className={styles.pageContent}>
                <PortfolioThemeForm
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isLoading}
                    mode="create"
                />
            </div>
        </div>
    );
}