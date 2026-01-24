'use client';

import React, { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TravelSpotFormStep1 from './TravelSpotFormStep1';
import TravelSpotFormStep2 from './TravelSpotFormStep2';
import TravelSpotFormStep3 from './TravelSpotFormStep3';
import TravelSpotFormStep4 from './TravelSpotFormStep4';
import { travelspotSchema } from '@/lib/validations/travelspotSchema';
import ButtonLoading from '@/components/Application/ButtonLoading';
import styles from '@/styles/travelspots/TravelSpotForm.module.css';
import { FiCheckCircle } from 'react-icons/fi';

// Import shadcn Form wrapper
import { Form as ShadcnForm } from '@/components/ui/form';

export default function TravelSpotMultiStepForm({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    mode = 'create'
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const form = useForm({
        resolver: zodResolver(travelspotSchema),
        defaultValues: {
            name: '',
            slug: '',
            short_description: '',
            long_description: '',
            full_address: '',
            city: 'Delhi',
            latitude: '',
            longitude: '',
            categories: [],
            entry_fee: '',
            opening_time: '',
            closing_time: '',
            best_time_to_visit: '',
        },
    });

    const { handleSubmit, trigger, formState: { errors, isValid } } = form;

    // Update form with initial data for edit mode
    React.useEffect(() => {
        if (mode === 'edit' && initialData?.slug) {
            form.reset({
                name: initialData.name || '',
                slug: initialData.slug || '',
                short_description: initialData.short_description || '',
                long_description: initialData.long_description || '',
                full_address: initialData.full_address || '',
                city: initialData.city || 'Delhi',
                latitude: initialData.latitude ? String(initialData.latitude) : '',
                longitude: initialData.longitude ? String(initialData.longitude) : '',
                categories: initialData.category_details
                    ? initialData.category_details.map(cat => cat.spotcategory_id)
                    : [],
                entry_fee: initialData.entry_fee || '',
                opening_time: initialData.opening_time
                    ? initialData.opening_time.slice(0, 5)
                    : '',
                closing_time: initialData.closing_time
                    ? initialData.closing_time.slice(0, 5)
                    : '',
                best_time_to_visit: initialData.best_time_to_visit || '',
            });
        }
    }, [mode, initialData, form]);

    const steps = [
        { number: 1, title: 'Basic Info', icon: '📝' },
        { number: 2, title: 'Description & Address', icon: '📍' },
        { number: 3, title: 'Pricing & Timing', icon: '⏰' },
        { number: 4, title: 'Location & Media', icon: '📷' },
    ];

    const handleNext = async () => {
        // Validate current step fields
        let isValidStep = false;

        if (currentStep === 1) {
            isValidStep = await trigger(['name', 'slug', 'categories', 'city']);
        } else if (currentStep === 2) {
            isValidStep = await trigger(['short_description', 'long_description', 'full_address']);
        } else if (currentStep === 3) {
            isValidStep = await trigger(['entry_fee', 'opening_time', 'closing_time', 'best_time_to_visit']);
        } else if (currentStep === 4) {
            isValidStep = await trigger(['latitude', 'longitude']);
        }

        if (isValidStep && currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleFormSubmit = async (data) => {
        onSubmit(data);
    };

    return (
        <div className={styles.multiStepForm}>
            {/* Progress Steps */}
            <div className={styles.stepsContainer}>
                {steps.map((step) => (
                    <div key={step.number} className={styles.stepWrapper}>
                        <div className={`${styles.stepCircle} ${currentStep >= step.number ? styles.activeStep : ''}`}>
                            {currentStep > step.number ? (
                                <FiCheckCircle className={styles.stepIcon} />
                            ) : (
                                <span className={styles.stepNumber}>{step.number}</span>
                            )}
                        </div>
                        <div className={`${styles.stepTitle} ${currentStep >= step.number ? styles.activeStepTitle : ''}`}>
                            <span className={styles.stepIconEmoji}>{step.icon}</span>
                            {step.title}
                        </div>
                        {step.number < totalSteps && (
                            <div className={styles.stepConnector}></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Wrap the entire form content with ShadcnForm */}
            <ShadcnForm {...form}>
                <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.formContainer}>
                    <div className={styles.formStepContent}>
                        {currentStep === 1 && (
                            <TravelSpotFormStep1
                                form={form}
                                mode={mode}
                                isSubmitting={isSubmitting}
                            />
                        )}

                        {currentStep === 2 && (
                            <TravelSpotFormStep2
                                form={form}
                                isSubmitting={isSubmitting}
                            />
                        )}

                        {currentStep === 3 && (
                            <TravelSpotFormStep3
                                form={form}
                                isSubmitting={isSubmitting}
                            />
                        )}

                        {currentStep === 4 && (
                            <TravelSpotFormStep4
                                form={form}
                                initialData={initialData}
                                mode={mode}
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className={styles.formNavigation}>
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className={styles.secondaryButton}
                                disabled={isSubmitting}
                            >
                                ← Previous
                            </button>
                        )}

                        <div className={styles.navigationRight}>
                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className={styles.nextButton}
                                    disabled={isSubmitting}
                                >
                                    Next Step →
                                </button>
                            ) : (
                                <ButtonLoading
                                    type="submit"
                                    text={mode === 'create' ? 'Create Travel Spot' : 'Update Travel Spot'}
                                    isLoading={isSubmitting}
                                    className={styles.primaryButton}
                                />
                            )}
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className={styles.stepIndicator}>
                        Step {currentStep} of {totalSteps}
                    </div>
                </form>
            </ShadcnForm>
        </div>
    );
}