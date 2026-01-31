'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import listingStyles from '@/styles/common/Listing.module.css';
import {
    useGetTravelSpotBySlugQuery,
    useUpdateBasicInfoMutation,
    useUpdateLocationStepMutation,
    useUpdateDetailsStepMutation,
    useSubmitTravelSpotMutation
} from '@/services/api/travelspotApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';

// Step Components
import Step1BasicInfo from '@/components/travelspots/steps/Step1BasicInfo';
import Step2LocationAddress from '@/components/travelspots/steps/Step2LocationAddress';
import Step3PricingTiming from '@/components/travelspots/steps/Step3PricingTiming';
import Step4ImageManagement from '@/components/travelspots/steps/Step4ImageManagement';
import Step5ReviewSubmit from '@/components/travelspots/steps/Step5ReviewSubmit';

// Progress Stepper
import ProgressStepper from '@/components/travelspots/steps/ProgressStepper';

export default function EditTravelSpotPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const slug = params.slug;
    let formRef = null;
    // console.log(slug)

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [updateId, setUpdateId] = useState(null);

    // Fetch travel spot data
    const { data, error, isLoading, refetch } = useGetTravelSpotBySlugQuery(slug, { skip: !slug, });
    const travelSpot = data?.data || null;

    // console.log(travelSpot)

    // Mutation hooks for each step
    const [updateBasicInfo, { isLoading: isUpdatingBasicInfo }] = useUpdateBasicInfoMutation();
    const [updateLocation, { isLoading: isUpdatingLocation }] = useUpdateLocationStepMutation();
    const [updateDetails, { isLoading: isUpdatingDetails }] = useUpdateDetailsStepMutation();
    const [finalSubmit, { isLoading: isFinalSubmit }] = useSubmitTravelSpotMutation();

    // Determine initial step based on completion_status
    const getInitialStep = () => {
        if (!travelSpot) return 1;

        switch (travelSpot.completion_status) {
            case 'basic_info':
                return 2; // move to Location
            case 'location':
                return 3; // move to Details
            case 'details':
                return 4; // move to Images
            case 'images':
                return 5; // move to Review
            case 'complete':
                return 5;
            default:
                return 1;
        }
    };

    useEffect(() => {
        if (travelSpot?.completion_status) {
            setCurrentStep(getInitialStep());
        }
    }, [travelSpot]);

    // Handle step 1 submission (Basic Info)
    const handleStep1Submit = async (data) => {
        if (isUpdatingBasicInfo) return;
        try {
            const res = await updateBasicInfo({
                travelspot_id: travelSpot.travelspot_id,
                data: data
            }).unwrap();

            showSnackbar(res.message, 'success', 5000);
            setFormData(prev => ({ ...prev, ...data }));
            setCurrentStep(2);
            refetch();
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
            } else {
                showSnackbar('Failed to update basic information', 'error', 3000);
            }
        }
    };

    // Handle step 2 submission (Location)
    const handleStep2Submit = async (data) => {
        try {
            const res = await updateLocation({
                travelspot_id: travelSpot.travelspot_id,
                data: data
            }).unwrap();

            showSnackbar(res.message, 'success', 5000);
            setFormData(prev => ({ ...prev, ...data }));
            setCurrentStep(3);
            refetch();
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
            } else {
                showSnackbar('Failed to update location information', 'error', 3000);
            }
        }
    };

    // Handle step 3 submission (Pricing & Timing)
    const handleStep3Submit = async (data) => {
        try {
            const res = await updateDetails({
                travelspot_id: travelSpot.travelspot_id,
                data: data
            }).unwrap();

            showSnackbar(res.message, 'success', 5000);
            setFormData(prev => ({ ...prev, ...data }));
            setCurrentStep(4);
            refetch();
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
            } else {
                showSnackbar('Failed to update pricing & timing', 'error', 3000);
            }
        }
    };

    // Handle step 4 submission (Pricing & Timing)
    const handleStep4Submit = async (data) => {
        console.log(data)
        console.log("image submitted")
        // try {
        //     const res = await updateDetails({
        //         travelspot_id: travelSpot.travelspot_id,
        //         data: data
        //     }).unwrap();

        //     showSnackbar(res.message, 'success', 5000);
        //     setFormData(prev => ({ ...prev, ...data }));
        //     setCurrentStep(4);
        //     refetch();
        // } catch (error) {
        //     const backendErrors = error?.data?.errors;

        //     // Field-Level Errors
        //     if (backendErrors?.field_errors && formRef) {
        //         Object.entries(backendErrors.field_errors).forEach(
        //             ([field, messages]) => {
        //                 formRef.setError(field, {
        //                     type: 'server',
        //                     message: messages[0],
        //                 });
        //             }
        //         );
        //     }

        //     if (backendErrors?.non_field_errors?.length) {
        //         showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
        //     } else {
        //         showSnackbar('Failed to update pricing & timing', 'error', 3000);
        //     }
        // }
    };

    // Handle final submission
    const handleFinalSubmit = async () => {
        try {
            const res = await finalSubmit(travelSpot.travelspot_id).unwrap();

            showSnackbar(res.message, 'success', 5000);
            router.push(ROUTES.DASHBOARD.TRAVELSPOT.LIST);
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
            } else {
                showSnackbar('Failed to complete update', 'error', 3000);
            }
        }
    };

    // Handle cancel
    const handleCancel = () => {
        router.push(ROUTES.DASHBOARD.TRAVELSPOT.LIST);
    };

    // Navigate to step
    const goToStep = (step) => {
        if (step >= 1 && step <= 5) {
            setCurrentStep(step);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <Loader text="Loading travel spot data..." />
        );
    }

    // Not found state
    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Travel Spot Not Found"
                message="The travel spot you're looking for doesn't exist or is no longer available."
                backLabel="Back to Travel Spots"
                backTo={ROUTES.DASHBOARD.TRAVELSPOT.LIST}
                fullPage={true}
            />
        );
    }

    // Error state
    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load travel spot details. Please try again."}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    // Determine current step title
    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return 'Edit Basic Information';
            case 2: return 'Edit Location';
            case 3: return 'Edit Pricing & Timing';
            case 4: return 'Edit Spot Images';
            case 4: return 'Review Changes';
            default: return 'Edit Travel Spot';
        }
    };

    // Check if user can navigate to a step
    const canGoToStep = (step) => {
        if (!travelSpot) return false;

        const status = travelSpot.completion_status;

        const completedSteps = {
            basic_info: 1,
            location: 2,
            details: 3,
            images: 4,
            complete: 5,
        };

        const maxAllowedStep = completedSteps[status] + 1;

        return step <= maxAllowedStep;
    };

    return (
        <div className={listingStyles.listingContainer}>
            {/* Header */}
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
                    <h1 className={listingStyles.listingTitle}>{getStepTitle()}</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Editing: {travelSpot.name}
                    </p>
                </div>
            </div>

            {/* Progress Stepper */}
            <div style={{ padding: '24px', marginBottom: '4px' }}>
                <ProgressStepper
                    currentStep={currentStep}
                    steps={[
                        { id: 1, title: 'Basic Info', description: 'Name & description' },
                        { id: 2, title: 'Location', description: 'Address & coordinates' },
                        { id: 3, title: 'Details', description: 'Pricing & timing' },
                        { id: 4, title: 'Spot Images', description: 'Spot Images' },
                        { id: 5, title: 'Review', description: 'Confirm changes' },
                    ]}
                    onStepClick={goToStep}
                    canNavigateToStep={canGoToStep}
                />
            </div>

            {/* Step Content */}
            <div style={{ padding: '0 24px 24px' }}>
                {currentStep === 1 && (
                    <Step1BasicInfo
                        initialData={{
                            name: travelSpot.name,
                            slug: travelSpot.slug,
                            short_description: travelSpot.short_description,
                            categories: travelSpot.category_details?.map(cat => cat.spotcategory_id) || [],
                        }}
                        onSubmit={handleStep1Submit}
                        onBackendError={(form) => (formRef = form)}
                        isSubmitting={isUpdatingBasicInfo}
                        onCancel={handleCancel}
                        mode="edit"
                    />
                )}

                {currentStep === 2 && (
                    <Step2LocationAddress
                        initialData={{
                            country: travelSpot.country,
                            state: travelSpot.state,
                            district: travelSpot.district,
                            sub_district: travelSpot.sub_district,
                            village: travelSpot.village,
                            pincode: travelSpot.pincode,
                            full_address: travelSpot.full_address,
                            latitude: travelSpot.latitude,
                            longitude: travelSpot.longitude,
                        }}
                        onSubmit={handleStep2Submit}
                        isSubmitting={isUpdatingLocation}
                        onCancel={handleCancel}
                        onBack={() => setCurrentStep(1)}
                        mode="edit"
                    />
                )}

                {currentStep === 3 && (
                    <Step3PricingTiming
                        initialData={{
                            entry_fee: travelSpot.entry_fee,
                            opening_time: travelSpot.opening_time,
                            closing_time: travelSpot.closing_time,
                            best_time_to_visit: travelSpot.best_time_to_visit,
                            long_description: travelSpot.long_description,
                        }}
                        onSubmit={handleStep3Submit}
                        isSubmitting={isUpdatingDetails}
                        onCancel={handleCancel}
                        onBack={() => setCurrentStep(2)}
                        mode="edit"
                    />
                )}

                {currentStep === 4 && (
                    <Step4ImageManagement
                        travelSpot={travelSpot}
                        onSubmit={handleStep4Submit}
                        onCancel={handleCancel}
                        onBack={() => setCurrentStep(3)}
                        onNext={() => setCurrentStep(5)}
                        mode="edit"
                    />
                )}

                {currentStep === 5 && (
                    <Step5ReviewSubmit
                        travelSpot={travelSpot}
                        onSubmit={handleFinalSubmit}
                        isSubmitting={isFinalSubmit}
                        onCancel={handleCancel}
                        onEditStep={goToStep}
                    />
                )}

                {/* {currentStep === 4 && (
                    <Step4ReviewSubmit
                        travelSpot={travelSpot}
                        onSubmit={handleFinalSubmit}
                        isSubmitting={isFinalSubmit}
                        onCancel={handleCancel}
                        onEditStep={goToStep}
                    />
                )} */}
            </div>
        </div>
    );
}