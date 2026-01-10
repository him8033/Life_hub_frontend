'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TravelSpotForm from '@/components/travelspots/TravelSpotForm';
import listingStyles from '@/styles/common/Listing.module.css';
import { useCreateTravelSpotMutation } from '@/services/api/travelspotApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';

export default function CreateTravelSpotPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [createTravelSpot, { isLoading }] = useCreateTravelSpotMutation();

    const handleSubmit = async (formData) => {
        if (isLoading) return;
        try {
            const res = await createTravelSpot(formData).unwrap();
            showSnackbar(res.message, 'success', 5000);
            router.push(ROUTES.TRAVELSPOT.LISTING);
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
                <h1 className={listingStyles.listingTitle}>Add New Travel Spot</h1>
            </div>

            <div style={{ padding: '24px' }}>
                <TravelSpotForm
                    onSubmit={handleSubmit}
                    isSubmitting={isLoading}
                    mode="create"
                />
            </div>
        </div>
    );
}