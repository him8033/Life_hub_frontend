'use client';

import { useRouter } from 'next/navigation';
import Step1BasicInfo from '@/components/travelspots/steps/Step1BasicInfo';
import { useCreateBasicInfoMutation } from '@/services/api/travelspotApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import styles from '@/styles/common/CommonForm.module.css';
import { FiMapPin } from 'react-icons/fi';
import { IoLocationOutline } from 'react-icons/io5';

export default function CreateTravelSpotPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [createBasicInfo, { isLoading }] = useCreateBasicInfoMutation();
    let formRef = null;

    const handleSubmit = async (formData) => {
        if (isLoading) return;
        try {
            const res = await createBasicInfo(formData).unwrap();
            showSnackbar(res.message || 'Travel spot created successfully!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.TRAVELSPOT.EDIT(formData.slug));
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
            } else if (!backendErrors?.field_errors) {
                showSnackbar('Failed to create travel spot', 'error', 3000);
            }
        }
    };

    const handleCancel = () => {
        router.push(ROUTES.DASHBOARD.TRAVELSPOT.LIST);
    };

    return (
        <div className={styles.pageContainer}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FiMapPin className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Create Travel Spot</h1>
                    </div>
                    {/* <p className={styles.pageDescription}>
                        Create a new travel spot to showcase amazing destinations
                    </p> */}
                </div>
            </div>

            {/* Page Content */}
            <div className={styles.pageContent}>
                <Step1BasicInfo
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isLoading}
                    onCancel={handleCancel}
                    mode="create"
                />
            </div>
        </div>
    );
}