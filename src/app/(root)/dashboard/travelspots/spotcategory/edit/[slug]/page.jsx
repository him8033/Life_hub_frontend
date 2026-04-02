'use client';

import { useRouter, useParams } from 'next/navigation';
import styles from '@/styles/common/CommonForm.module.css';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import SpotCategoryForm from '@/components/travelspots/spotcategory/SpotCategoryForm';
import { useGetSpotCategoryBySlugQuery, useUpdateSpotCategoryMutation } from '@/services/api/spotcategoryApi';
import { MdOutlineCategory } from 'react-icons/md';

export default function EditTravelSpotPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const slug = params.slug;
    let formRef = null;

    const { data, error, isLoading, refetch } = useGetSpotCategoryBySlugQuery(slug, { skip: !slug, });
    const spotCategory = data?.data || null;

    const [updateSpotCategory, { isLoading: isSubmitting }] = useUpdateSpotCategoryMutation();

    const handleSubmit = async (formData) => {
        if (isSubmitting) return;
        try {
            const res = await updateSpotCategory({
                slug,
                data: formData,
            }).unwrap();
            showSnackbar(res.message, 'success', 5000);
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

    if (isLoading) {
        return (
            <Loader text="Loading spot category Data..." />
        );
    };


    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Spot Category Not Found"
                message="The spot category you're looking for doesn't exist or is no longer available."
                backLabel="Back to Spot Categories"
                backTo={ROUTES.DASHBOARD.TRAVELSPOT.SPOTCATEGORY.LIST}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load spot category details. Please try again."}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <MdOutlineCategory className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Edit Spot Category: ({spotCategory.name})</h1>
                    </div>
                    {/* <p className={styles.pageDescription}>
                        Editing: {spotCategory.name}
                    </p> */}
                </div>
            </div>

            {/* Form Content */}
            <div className={styles.pageContent}>
                <SpotCategoryForm
                    initialData={spotCategory}
                    onSubmit={handleSubmit}
                    onBackendError={(form) => (formRef = form)}
                    isSubmitting={isSubmitting}
                    mode="edit"
                />
            </div>
        </div >
    );
}