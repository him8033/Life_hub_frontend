'use client';

import { useRouter } from 'next/navigation';
import MasterSkillForm from '@/components/portfolio/admin/MasterSkillForm';
import { useCreateMasterSkillMutation } from '@/services/api/portfolioApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import styles from '@/styles/common/CommonForm.module.css';
import { FiCode } from 'react-icons/fi';

export default function CreateMasterSkillPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [createMasterSkill, { isLoading }] = useCreateMasterSkillMutation();
    let formRef = null;

    const handleSubmit = async (formData) => {
        if (isLoading) return;
        try {
            // formData is already FormData object
            const res = await createMasterSkill(formData).unwrap();
            showSnackbar(res.message || 'Master skill created successfully!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.MASTERSKILL.LIST);
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
                        <FiCode className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Create Master Skill</h1>
                    </div>
                </div>
            </div>
            <div className={styles.pageContent}>
                <MasterSkillForm
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isLoading}
                    mode="create"
                />
            </div>
        </div>
    );
}