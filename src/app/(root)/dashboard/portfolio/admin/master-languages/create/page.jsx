'use client';

import { useRouter } from 'next/navigation';
import MasterLanguageForm from '@/components/portfolio/admin/MasterLanguageForm';
import { useCreateMasterLanguageMutation } from '@/services/api/portfolioApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import styles from '@/styles/common/CommonForm.module.css';
import { FiFlag } from 'react-icons/fi';

export default function CreateMasterLanguagePage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [createMasterLanguage, { isLoading }] = useCreateMasterLanguageMutation();
    let formRef = null;

    const handleSubmit = async (formData) => {
        if (isLoading) return;
        try {
            const res = await createMasterLanguage(formData).unwrap();
            showSnackbar(res.message || 'Language created successfully!', 'success', 5000);
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

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FiFlag className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Create Language</h1>
                    </div>
                </div>
            </div>
            <div className={styles.pageContent}>
                <MasterLanguageForm
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isLoading}
                    mode="create"
                />
            </div>
        </div>
    );
}