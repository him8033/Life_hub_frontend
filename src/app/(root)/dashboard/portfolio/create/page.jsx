'use client';

import { useRouter } from 'next/navigation';
import SnapshotForm from '@/components/portfolio/SnapshotForm';
import { useCreateSnapshotMutation } from '@/services/api/portfolioApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import styles from '@/styles/common/CommonForm.module.css';
import { FiFolder } from 'react-icons/fi';

export default function CreateSnapshotPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [createSnapshot, { isLoading }] = useCreateSnapshotMutation();
    let formRef = null;

    const handleSubmit = async (formData) => {
        if (isLoading) return;
        try {
            const res = await createSnapshot(formData).unwrap();
            showSnackbar(res.message || 'Snapshot created successfully!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.LIST);
        } catch (error) {
            const backendErrors = error?.data?.errors;

            // Field-Level Errors
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

    return (
        <div className={styles.pageContainer}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FiFolder className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Create Snapshot</h1>
                    </div>
                </div>
            </div>

            {/* Page Content */}
            <div className={styles.pageContent}>
                <SnapshotForm
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isLoading}
                    mode="create"
                />
            </div>
        </div>
    );
}