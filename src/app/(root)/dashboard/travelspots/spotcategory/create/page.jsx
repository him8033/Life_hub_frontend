'use client';

import { useRouter } from 'next/navigation';
import SpotCategoryForm from '@/components/travelspots/spotcategory/SpotCategoryForm';
import { useCreateSpotCategoryMutation } from '@/services/api/spotcategoryApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import styles from '@/styles/common/CommonForm.module.css';
import { MdOutlineCategory } from 'react-icons/md';
import { FiArrowLeft } from 'react-icons/fi';

export default function CreateSpotCategoryPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [createSpotCategory, { isLoading }] = useCreateSpotCategoryMutation();
    let formRef = null;

    const handleSubmit = async (formData) => {
        if (isLoading) return;
        try {
            const res = await createSpotCategory(formData).unwrap();
            showSnackbar(res.message || 'Spot Category created successfully!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.TRAVELSPOT.SPOTCATEGORY.LIST);
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
                        <MdOutlineCategory className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Create Spot Category</h1>
                    </div>
                    {/* <p className={styles.pageDescription}>
                        Create a new category to organize your travel spots
                    </p> */}
                </div>
            </div>

            {/* Page Content */}
            <div className={styles.pageContent}>
                <SpotCategoryForm
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isLoading}
                    mode="create"
                />
            </div>
        </div>
    );
}