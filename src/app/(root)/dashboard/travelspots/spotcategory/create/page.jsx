// src/app/(root)/dashboard/travelspots/categories/create/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import SpotCategoryForm from '@/components/travelspots/spotcategory/SpotCategoryForm';
import listingStyles from '@/styles/common/Listing.module.css';
import { useCreateSpotCategoryMutation } from '@/services/api/spotcategoryApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';

export default function CreateSpotCategoryPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [createSpotCategory, { isLoading }] = useCreateSpotCategoryMutation();

    const handleSubmit = async (formData) => {
        if (isLoading) return;
        try {
            const res = await createSpotCategory(formData).unwrap();
            showSnackbar(res.message || 'Spot Category created successfully!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.TRAVELSPOT.SPOTCATEGORY.LIST); // Or categories list if you have one
        } catch (error) {
            const backendErrors = error?.data?.errors;

            // Field-Level Errors
            if (backendErrors?.field_errors) {
                Object.entries(backendErrors.field_errors).forEach(
                    ([field, messages]) => {
                        form.setError(field, {
                            type: "server",
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
        <div className={listingStyles.listingContainer}>
            <div className={listingStyles.listingHeader}>
                <h1 className={listingStyles.listingTitle}>Add New Category</h1>
                <p className={listingStyles.listingSubtitle}>
                    Create a new category to organize your travel spots
                </p>
            </div>

            <div className={listingStyles.listingContent}>
                <SpotCategoryForm
                    onSubmit={handleSubmit}
                    isSubmitting={isLoading}
                    mode="create"
                />
            </div>
        </div>
    );
}