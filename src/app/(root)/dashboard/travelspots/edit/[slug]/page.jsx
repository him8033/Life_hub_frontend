'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import styles from '@/styles/common/CommonForm.module.css';
import { FiMapPin, FiEdit2 } from 'react-icons/fi';

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

    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    const [formData, setFormData] = useState({});

    // Fetch travel spot data
    const { data, error, isLoading, refetch } = useGetTravelSpotBySlugQuery(slug, { skip: !slug });
    const travelSpot = data?.data || null;

    // Mutation hooks for each step
    const [updateBasicInfo, { isLoading: isUpdatingBasicInfo }] = useUpdateBasicInfoMutation();
    const [updateLocation, { isLoading: isUpdatingLocation }] = useUpdateLocationStepMutation();
    const [updateDetails, { isLoading: isUpdatingDetails }] = useUpdateDetailsStepMutation();
    const [finalSubmit, { isLoading: isFinalSubmit }] = useSubmitTravelSpotMutation();

    // Initialize completed steps based on completion_status
    useEffect(() => {
        if (travelSpot?.completion_status) {
            const newCompletedSteps = new Set();
            
            switch (travelSpot.completion_status) {
                case 'basic_info':
                    newCompletedSteps.add(1);
                    break;
                case 'location':
                    newCompletedSteps.add(1);
                    newCompletedSteps.add(2);
                    break;
                case 'details':
                    newCompletedSteps.add(1);
                    newCompletedSteps.add(2);
                    newCompletedSteps.add(3);
                    break;
                case 'images':
                    newCompletedSteps.add(1);
                    newCompletedSteps.add(2);
                    newCompletedSteps.add(3);
                    newCompletedSteps.add(4);
                    break;
                case 'complete':
                    newCompletedSteps.add(1);
                    newCompletedSteps.add(2);
                    newCompletedSteps.add(3);
                    newCompletedSteps.add(4);
                    newCompletedSteps.add(5);
                    break;
                default:
                    break;
            }
            
            setCompletedSteps(newCompletedSteps);
            
            const getInitialStep = () => {
                if (!travelSpot.completion_status) return 1;
                switch (travelSpot.completion_status) {
                    case 'basic_info': return 2;
                    case 'location': return 3;
                    case 'details': return 4;
                    case 'images': return 5;
                    case 'complete': return 5;
                    default: return 1;
                }
            };
            
            setCurrentStep(getInitialStep());
        }
    }, [travelSpot]);

    // Mark a step as completed
    const markStepCompleted = (step) => {
        setCompletedSteps(prev => new Set([...prev, step]));
    };

    // Handle step 1 submission (Basic Info)
    const handleStep1Submit = async (data) => {
        if (isUpdatingBasicInfo) return;
        try {
            const res = await updateBasicInfo({
                travelspot_id: travelSpot.travelspot_id,
                data: data
            }).unwrap();

            showSnackbar(res.message || 'Basic information updated successfully!', 'success', 5000);
            setFormData(prev => ({ ...prev, ...data }));
            markStepCompleted(1);
            setCurrentStep(2);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;

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

            showSnackbar(res.message || 'Location information updated successfully!', 'success', 5000);
            setFormData(prev => ({ ...prev, ...data }));
            markStepCompleted(2);
            setCurrentStep(3);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;

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

            showSnackbar(res.message || 'Details updated successfully!', 'success', 5000);
            setFormData(prev => ({ ...prev, ...data }));
            markStepCompleted(3);
            setCurrentStep(4);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;

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
                showSnackbar('Failed to update details', 'error', 3000);
            }
        }
    };

    // Handle step 4 completion (Images)
    const handleStep4Complete = () => {
        markStepCompleted(4);
        setCurrentStep(5);
    };

    // Handle final submission
    const handleFinalSubmit = async () => {
        try {
            const res = await finalSubmit(travelSpot.travelspot_id).unwrap();

            showSnackbar(res.message || 'Travel spot updated successfully!', 'success', 5000);
            markStepCompleted(5);
            router.push(ROUTES.DASHBOARD.TRAVELSPOT.LIST);
        } catch (error) {
            const backendErrors = error?.data?.errors;

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
                showSnackbar('Failed to update travel spot', 'error', 3000);
            }
        }
    };

    // Navigate to step - FIXED: Only allow navigation if current step is completed
    const goToStep = (step) => {
        if (step >= 1 && step <= 5) {
            // Can navigate to:
            // 1. Completed steps (already finished)
            // 2. The next step ONLY IF current step is completed
            if (completedSteps.has(step)) {
                setCurrentStep(step);
            } else if (step === currentStep + 1 && completedSteps.has(currentStep)) {
                setCurrentStep(step);
            }
        }
    };

    // Check if user can navigate to a step - FIXED
    const canGoToStep = (step) => {
        // Can navigate to:
        // 1. Completed steps (already finished)
        // 2. The next step ONLY IF current step is completed
        if (completedSteps.has(step)) return true;
        if (step === currentStep + 1 && completedSteps.has(currentStep)) return true;
        return false;
    };

    // Get current step title
    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return 'Edit Basic Information';
            case 2: return 'Edit Location';
            case 3: return 'Edit Details';
            case 4: return 'Manage Images';
            case 5: return 'Review & Submit';
            default: return 'Edit Travel Spot';
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className={styles.pageContainer}>
                <Loader text="Loading travel spot data..." />
            </div>
        );
    }

    // Not found state
    if (error?.status === 404 || !travelSpot) {
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

    return (
        <div className={styles.pageContainer}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FiEdit2 className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>{getStepTitle()}: ({travelSpot.name})</h1>
                    </div>
                </div>
            </div>

            {/* Progress Stepper */}
            <div className={styles.stepperContainer}>
                <ProgressStepper
                    currentStep={currentStep}
                    steps={[
                        { id: 1, title: 'Basic Info', description: 'Name & description' },
                        { id: 2, title: 'Location', description: 'Address & coordinates' },
                        { id: 3, title: 'Details', description: 'Pricing & timing' },
                        { id: 4, title: 'Images', description: 'Spot images' },
                        { id: 5, title: 'Review', description: 'Confirm changes' },
                    ]}
                    onStepClick={goToStep}
                    canNavigateToStep={canGoToStep}
                    completedSteps={completedSteps}
                    size="md"
                />
            </div>

            {/* Page Content */}
            <div className={styles.pageContent}>
                {currentStep === 1 && (
                    <Step1BasicInfo
                        initialData={{
                            travelspot_id: travelSpot.travelspot_id,
                            name: travelSpot.name,
                            slug: travelSpot.slug,
                            short_description: travelSpot.short_description,
                            categories: travelSpot.category_details?.map(cat => cat.spotcategory_id) || [],
                        }}
                        onSubmit={handleStep1Submit}
                        onBackendError={(form) => (formRef = form)}
                        isSubmitting={isUpdatingBasicInfo}
                        onCancel={() => router.push(ROUTES.DASHBOARD.TRAVELSPOT.LIST)}
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
                        onCancel={() => router.push(ROUTES.DASHBOARD.TRAVELSPOT.LIST)}
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
                        onCancel={() => router.push(ROUTES.DASHBOARD.TRAVELSPOT.LIST)}
                        onBack={() => setCurrentStep(2)}
                        mode="edit"
                    />
                )}

                {currentStep === 4 && (
                    <Step4ImageManagement
                        travelSpot={travelSpot}
                        onBack={() => setCurrentStep(3)}
                        onNext={handleStep4Complete}
                    />
                )}

                {currentStep === 5 && (
                    <Step5ReviewSubmit
                        travelSpot={travelSpot}
                        onSubmit={handleFinalSubmit}
                        isSubmitting={isFinalSubmit}
                        onCancel={() => router.push(ROUTES.DASHBOARD.TRAVELSPOT.LIST)}
                        onEditStep={goToStep}
                    />
                )}
            </div>
        </div>
    );
}