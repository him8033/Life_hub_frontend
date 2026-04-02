'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiDollarSign,
    FiClock,
    FiCalendar,
    FiChevronRight,
    FiChevronLeft,
    FiFileText,
    FiAlertCircle
} from 'react-icons/fi';

// Custom Form Components
import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import TimePicker from '@/components/common/forms/TimePicker';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';

// Validation Schema
import { practicalInfoSchema } from '@/lib/validations/travelspotSchema';

// Styles
import styles from '@/styles/travelspots/steps/CommonStepStyles.module.css';
import StepActions from './StepActions';
import StepHeader from './StepHeader';
import FormSection from './FormSection';

const Step3PricingTiming = ({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    onCancel,
    onBack,
    mode = 'create'
}) => {
    // Get default values
    const getDefaultValues = () => {
        if (mode === 'edit' && initialData) {
            return {
                entry_fee: initialData.entry_fee || '',
                opening_time: initialData.opening_time || '',
                closing_time: initialData.closing_time || '',
                best_time_to_visit: initialData.best_time_to_visit || '',
                long_description: initialData.long_description || '',
            };
        }

        return {
            entry_fee: '',
            opening_time: '',
            closing_time: '',
            best_time_to_visit: '',
            long_description: '',
        };
    };

    // Initialize form
    const methods = useForm({
        resolver: zodResolver(practicalInfoSchema),
        defaultValues: getDefaultValues(),
    });

    const {
        setValue,
        watch,
        reset,
        formState: { errors, isValid },
    } = methods;

    // Watch form values
    const openingTime = watch('opening_time');
    const closingTime = watch('closing_time');
    const bestTimeToVisit = watch('best_time_to_visit');
    const longDescription = watch('long_description');
    const entryFee = watch('entry_fee');

    // Time validation state
    const [timeError, setTimeError] = useState('');

    // Validate time range
    useEffect(() => {
        if (openingTime && closingTime) {
            if (openingTime >= closingTime) {
                setTimeError('Closing time must be after opening time');
            } else {
                setTimeError('');
            }
        } else {
            setTimeError('');
        }
    }, [openingTime, closingTime]);

    // Handle time field change
    const handleTimeChange = (field, value) => {
        setValue(field, value, { shouldValidate: true });
    };

    // Format time for display (12-hour format)
    const formatTimeForDisplay = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    // Convert empty strings for submission
    const prepareDataForSubmission = (data) => {
        const preparedData = { ...data };

        if (preparedData.opening_time === '') {
            preparedData.opening_time = null;
        }

        if (preparedData.closing_time === '') {
            preparedData.closing_time = null;
        }

        if (preparedData.entry_fee === '') {
            preparedData.entry_fee = null;
        }

        return preparedData;
    };

    // Handle form submission
    const handleFormSubmit = (data) => {
        if (timeError) {
            return;
        }
        const preparedData = prepareDataForSubmission(data);
        onSubmit(preparedData);
    };

    // Handle backend errors
    useEffect(() => {
        if (onBackendError) {
            onBackendError(methods);
        }
    }, [methods, onBackendError]);

    // Handle back button
    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    return (
        <div className={styles.stepContainer}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleFormSubmit)} className={styles.form}>
                    {/* Step Header */}
                    <StepHeader
                        title="Pricing, Timing & Description"
                        description="Add practical information about entry fees, visiting hours, and provide a detailed description of the travel spot."
                    />

                    {/* Pricing Section */}
                    <FormSection
                        icon={FiDollarSign}
                        title="Entry Fee"
                        subtitle="Information about entry fees and pricing"
                    >
                        <div className={styles.formGroup}>
                            <FormInput
                                name="entry_fee"
                                label="Entry Fee (₹)"
                                type="number"
                                step="any"
                                placeholder="e.g., 50, 100.50, 0 for free"
                                size="md"
                                disabled={isSubmitting}
                                description="Amount in Indian Rupees. Enter 0 for free entry"
                            />
                            {entryFee === '0' && (
                                <div className={styles.infoMessage}>
                                    <FiAlertCircle className={styles.infoIcon} />
                                    <span>Free entry selected</span>
                                </div>
                            )}
                        </div>
                    </FormSection>

                    {/* Timing Section */}
                    <FormSection
                        icon={FiClock}
                        title="Visiting Hours"
                        subtitle="Opening and closing times for visitors"
                    >
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <TimePicker
                                    label="Opening Time"
                                    value={openingTime}
                                    onChange={(value) => handleTimeChange('opening_time', value)}
                                    placeholder="Select opening time"
                                    size="md"
                                    disabled={isSubmitting}
                                    description="Time when the spot opens for visitors"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <TimePicker
                                    label="Closing Time"
                                    value={closingTime}
                                    onChange={(value) => handleTimeChange('closing_time', value)}
                                    placeholder="Select closing time"
                                    size="md"
                                    disabled={isSubmitting}
                                    description="Time when the spot closes for visitors"
                                />
                            </div>
                        </div>

                        {/* Time validation error message */}
                        {timeError && (
                            <div className={styles.errorMessage}>
                                <FiAlertCircle className={styles.errorIcon} />
                                {timeError}
                            </div>
                        )}

                        {/* Display selected times */}
                        {openingTime && closingTime && !timeError && (
                            <div className={styles.timePreview}>
                                <div className={styles.timePreviewContent}>
                                    <span className={styles.timePreviewLabel}>Visiting Hours:</span>
                                    <span className={styles.timePreviewValue}>
                                        {formatTimeForDisplay(openingTime)} - {formatTimeForDisplay(closingTime)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </FormSection>

                    {/* Best Time to Visit Section */}
                    <FormSection
                        icon={FiCalendar}
                        title="Best Time to Visit"
                        subtitle="Recommend the ideal season or time for visiting"
                    >
                        <div className={styles.formGroup}>
                            <FormInput
                                name="best_time_to_visit"
                                label="Recommended Season/Time"
                                placeholder="e.g., October to March, Early morning, Weekdays"
                                size="md"
                                maxLength={100}
                                disabled={isSubmitting}
                                description="Suggest the best season, time of day, or days to visit for the best experience"
                            />

                            {/* Character Count */}
                            <div className={styles.charCount}>
                                <span className={styles.charCountText}>
                                    {bestTimeToVisit?.length || 0}/100 characters
                                </span>
                            </div>
                        </div>
                    </FormSection>

                    {/* Long Description Section */}
                    <FormSection
                        icon={FiFileText}
                        title="Detailed Description"
                        subtitle="Provide a comprehensive description of the travel spot"
                    >
                        <div className={styles.formGroup}>
                            <FormTextarea
                                name="long_description"
                                label="Detailed Description"
                                placeholder="Describe the travel spot in detail. Include information about the history, architecture, natural features, activities available, and what makes it special..."
                                rows={6}
                                maxLength={2000}
                                size="md"
                                disabled={isSubmitting}
                                description="Write a comprehensive description that covers history, features, activities, and unique aspects of the location."
                            />

                            {/* Character Count */}
                            <div className={styles.charCount}>
                                <span className={styles.charCountText}>
                                    {longDescription?.length || 0}/2000 characters
                                </span>
                            </div>
                        </div>
                    </FormSection>

                    {/* Form Actions */}
                    <StepActions
                        onBack={handleBack}
                        onNext={methods.handleSubmit(handleFormSubmit)}
                        isSubmitting={isSubmitting}
                        isValid={isValid && !timeError}
                        backText="Back to Location"
                        nextText="Save & Continue"
                        showBack={true}
                        showCancel={false}
                        showNext={true}
                        align="between"
                    />
                </form>
            </FormProvider>
        </div>
    );
};

export default Step3PricingTiming;