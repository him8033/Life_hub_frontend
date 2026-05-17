'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from '@/styles/common/CommonForm.module.css';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import SnapshotForm from '@/components/portfolio/SnapshotForm';
import { useGetSnapshotQuery, useUpdateSnapshotMutation } from '@/services/api/portfolioApi';
import { FiFolder } from 'react-icons/fi';

export default function EditSnapshotPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const snapshotId = params.snapshotId;
    let formRef = null;

    const { data, error, isLoading, refetch } = useGetSnapshotQuery(snapshotId, { skip: !snapshotId });
    const snapshot = data?.data || null;

    const [updateSnapshot, { isLoading: isSubmitting }] = useUpdateSnapshotMutation();

    const handleSubmit = async (formData) => {
        if (isSubmitting) return;
        try {
            const res = await updateSnapshot({
                snapshotId,
                data: formData,
            }).unwrap();
            showSnackbar(res.message || 'Snapshot updated successfully!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST);
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

    if (isLoading) {
        return <Loader text="Loading snapshot data..." />;
    }

    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Snapshot Not Found"
                message="The snapshot you're looking for doesn't exist or is no longer available."
                backLabel="Back to Snapshots"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load snapshot details. Please try again."}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    if (!snapshot) {
        return (
            <NotFoundState
                title="Snapshot Not Found"
                message="The snapshot you're looking for doesn't exist."
                backLabel="Back to Snapshots"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST}
                fullPage={true}
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FiFolder className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Edit Snapshot: {snapshot.title}</h1>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className={styles.pageContent}>
                <SnapshotForm
                    initialData={snapshot}
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isSubmitting}
                    mode="edit"
                />
            </div>
        </div>
    );
}