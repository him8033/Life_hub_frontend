'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TravelSpotForm from '@/components/travelspots/TravelSpotForm';
import listingStyles from '@/styles/common/Listing.module.css';
import { useGetTravelSpotBySlugQuery, useUpdateTravelSpotMutation } from '@/services/api/travelspotApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';

export default function EditTravelSpotPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const slug = params.slug;

    const { data, error, isLoading } = useGetTravelSpotBySlugQuery(slug, { skip: !slug, });
    const travelSpot = data?.data || null;

    const [updateTravelSpot, { isLoading: isSubmitting }] = useUpdateTravelSpotMutation();

    const handleSubmit = async (formData) => {
        if (isSubmitting) return;
        try {
            const res = await updateTravelSpot({
                slug,
                data: formData,
            }).unwrap();
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

    if (isLoading) {
        return (
            <Loader text="Loading travel spot Data..." />
        );
    };


    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Travel Spot Not Found"
                message="The travel spot you're looking for doesn't exist or is no longer available."
                backLabel="Back to Travel Spots"
                backTo={ROUTES.TRAVELSPOT.LISTING}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load travel spot details. Please try again."}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    return (
        <div className={listingStyles.listingContainer}>
            <div className={listingStyles.listingHeader}>
                <div>
                    <button
                        onClick={() => router.back()}
                        style={{
                            color: '#4b5563',
                            marginBottom: '8px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        ← Back
                    </button>
                    <h1 className={listingStyles.listingTitle}>Edit Travel Spot</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Editing: {travelSpot.name}
                    </p>
                </div>
            </div>

            <div style={{ padding: '24px' }}>
                <TravelSpotForm
                    initialData={travelSpot}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    mode="edit"
                />
            </div>
        </div>
    );
}