'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiDollarSign,
    FiClock,
    FiCalendar,
    FiChevronRight,
    FiChevronLeft,
    FiFileText
} from 'react-icons/fi';

// Shadcn Components
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Validation Schema - You'll need to update this schema
import { practicalInfoSchema } from '@/lib/validations/travelspotSchema';

// Styles
import styles from '@/styles/travelspots/steps/Step3PricingTiming.module.css';

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
                opening_time: initialData.opening_time || 'not-specified',
                closing_time: initialData.closing_time || 'not-specified',
                best_time_to_visit: initialData.best_time_to_visit || '',
                long_description: initialData.long_description || '',
            };
        }

        return {
            entry_fee: '',
            opening_time: 'not-specified',
            closing_time: 'not-specified',
            best_time_to_visit: '',
            long_description: '',
        };
    };

    // Initialize form
    const form = useForm({
        resolver: zodResolver(practicalInfoSchema),
        defaultValues: getDefaultValues(),
    });

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = form;

    // Watch form values
    const entryFee = watch('entry_fee');
    const openingTime = watch('opening_time');
    const closingTime = watch('closing_time');
    const bestTimeToVisit = watch('best_time_to_visit');
    const longDescription = watch('long_description');

    // Generate time options
    const generateTimeOptions = () => {
        const times = [];

        // Add "Not specified" option
        times.push({ value: 'not-specified', label: 'Not specified' });

        // Generate times from 00:00 to 23:30 in 30-minute intervals
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const hourStr = hour.toString().padStart(2, '0');
                const minuteStr = minute.toString().padStart(2, '0');
                const time = `${hourStr}:${minuteStr}`;
                const displayTime = formatTimeForDisplay(time);

                times.push({
                    value: time,
                    label: displayTime
                });
            }
        }

        return times;
    };

    // Format time for display (12-hour format)
    const formatTimeForDisplay = (time) => {
        if (time === 'not-specified') return 'Not specified';
        if (!time) return 'Not specified';

        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;

        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    const timeOptions = generateTimeOptions();

    // Convert 'not-specified' to empty string for submission
    const prepareDataForSubmission = (data) => {
        const preparedData = { ...data };

        // Convert 'not-specified' to empty string for time fields
        if (preparedData.opening_time === 'not-specified') {
            preparedData.opening_time = '';
        }

        if (preparedData.closing_time === 'not-specified') {
            preparedData.closing_time = '';
        }

        return preparedData;
    };

    // Handle form submission
    const handleFormSubmit = (data) => {
        const preparedData = prepareDataForSubmission(data);
        onSubmit(preparedData);
    };

    // Handle time field change
    const handleTimeChange = (field, value) => {
        setValue(field, value, { shouldValidate: true });
    };

    // Handle backend errors
    useEffect(() => {
        if (onBackendError) {
            onBackendError(form);
        }
    }, [form, onBackendError]);

    // Handle back button
    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    // Get character count class
    const getCharCountClass = (length, max) => {
        if (length > max) return styles.charCountLimit;
        if (length > max * 0.9) return styles.charCountNearLimit;
        return styles.charCountGood;
    };

    return (
        <div className={styles.stepContainer}>
            {/* Step Header */}
            <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>Pricing, Timing & Description</h1>
                <p className={styles.stepDescription}>
                    Add practical information about entry fees, visiting hours, and provide a detailed description of the travel spot.
                </p>
            </div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
                    {/* Pricing Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <FiDollarSign className={styles.icon} />
                                Entry Fee
                            </h2>
                            <p className={styles.sectionSubtitle}>
                                Information about entry fees and pricing
                            </p>
                        </div>

                        <div className={styles.pricingSection}>
                            <div className={styles.pricingRow}>
                                <div className={styles.formGroup}>
                                    <FormField
                                        control={control}
                                        name="entry_fee"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className={styles.labelContainer}>
                                                    <FormLabel className={styles.label}>
                                                        Entry Fee (₹)
                                                    </FormLabel>
                                                    <FormDescription className={styles.fieldInfo}>
                                                        Amount in Indian Rupees. Enter 0 for free entry
                                                    </FormDescription>
                                                </div>
                                                <div className={styles.feeInputContainer}>
                                                    <span className={styles.currencySymbol}>₹</span>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="e.g., 50, 100.50, 0 for free"
                                                            {...field}
                                                            className={`${styles.input} ${styles.feeInput}`}
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage className={styles.errorMessage} />
                                                <p className={styles.helperText}>
                                                    Enter the entry fee amount. Use 0 for no charge.
                                                </p>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timing Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <FiClock className={styles.icon} />
                                Visiting Hours
                            </h2>
                            <p className={styles.sectionSubtitle}>
                                Opening and closing times for visitors
                            </p>
                        </div>

                        <div className={styles.timingSection}>
                            <div className={styles.timingRow}>
                                <div className={styles.formGroup}>
                                    <FormField
                                        control={control}
                                        name="opening_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className={styles.labelContainer}>
                                                    <FormLabel className={styles.label}>
                                                        Opening Time
                                                    </FormLabel>
                                                </div>
                                                <Select
                                                    value={field.value || "not-specified"}
                                                    onValueChange={(value) => handleTimeChange('opening_time', value)}
                                                    disabled={isSubmitting}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className={styles.select}>
                                                            <SelectValue placeholder="Select opening time">
                                                                {formatTimeForDisplay(field.value)}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className={styles.timeOptions}>
                                                        {timeOptions.map((time) => (
                                                            <SelectItem key={time.value} value={time.value} className={styles.selectItem}>
                                                                {time.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className={styles.errorMessage} />
                                                <p className={styles.helperText}>
                                                    Time when the spot opens for visitors
                                                </p>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <FormField
                                        control={control}
                                        name="closing_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className={styles.labelContainer}>
                                                    <FormLabel className={styles.label}>
                                                        Closing Time
                                                    </FormLabel>
                                                </div>
                                                <Select
                                                    value={field.value || "not-specified"}
                                                    onValueChange={(value) => handleTimeChange('closing_time', value)}
                                                    disabled={isSubmitting}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className={styles.select}>
                                                            <SelectValue placeholder="Select closing time">
                                                                {formatTimeForDisplay(field.value)}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className={styles.timeOptions}>
                                                        {timeOptions.map((time) => (
                                                            <SelectItem key={time.value} value={time.value} className={styles.selectItem}>
                                                                {time.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className={styles.errorMessage} />
                                                <p className={styles.helperText}>
                                                    Time when the spot closes for visitors
                                                </p>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Best Time to Visit Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <FiCalendar className={styles.icon} />
                                Best Time to Visit
                            </h2>
                            <p className={styles.sectionSubtitle}>
                                Recommend the ideal season or time for visiting
                            </p>
                        </div>

                        <div className={styles.seasonSection}>
                            <div className={styles.formGroup}>
                                <FormField
                                    control={control}
                                    name="best_time_to_visit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={styles.label}>
                                                Recommended Season/Time
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., October to March, Early morning, Weekdays"
                                                    {...field}
                                                    className={styles.input}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>

                                            <div className={styles.charCount}>
                                                <span className={styles.charCountText}>
                                                    Brief recommendation for visitors
                                                </span>
                                                <span className={getCharCountClass(bestTimeToVisit?.length || 0, 100)}>
                                                    {bestTimeToVisit?.length || 0}/100
                                                </span>
                                            </div>

                                            <FormMessage className={styles.errorMessage} />
                                            <p className={styles.helperText}>
                                                Suggest the best season, time of day, or days to visit for the best experience
                                            </p>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Long Description Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <FiFileText className={styles.icon} />
                                Detailed Description
                            </h2>
                            <p className={styles.sectionSubtitle}>
                                Provide a comprehensive description of the travel spot
                            </p>
                        </div>

                        <div className={styles.descriptionSection}>
                            <div className={styles.formGroup}>
                                <FormField
                                    control={control}
                                    name="long_description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={styles.label}>
                                                Detailed Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe the travel spot in detail. Include information about the history, architecture, natural features, activities available, and what makes it special..."
                                                    {...field}
                                                    className={styles.textarea}
                                                    disabled={isSubmitting}
                                                    rows={6}
                                                />
                                            </FormControl>

                                            <div className={styles.charCount}>
                                                <span className={styles.charCountText}>
                                                    Detailed description helps visitors understand what to expect
                                                </span>
                                                <span className={getCharCountClass(longDescription?.length || 0, 2000)}>
                                                    {longDescription?.length || 0}/2000
                                                </span>
                                            </div>

                                            <FormMessage className={styles.errorMessage} />
                                            <p className={styles.helperText}>
                                                Write a comprehensive description that covers history, features, activities, and unique aspects of the location.
                                            </p>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={handleBack}
                            className={styles.backButton}
                            disabled={isSubmitting}
                        >
                            <FiChevronLeft className={styles.icon} />
                            Back to Location
                        </button>

                        <button
                            type="submit"
                            className={styles.nextButton}
                            disabled={isSubmitting || !isValid}
                        >
                            {isSubmitting ? (
                                <span className={styles.loadingButton}>
                                    <div className={styles.spinner}></div>
                                    Saving...
                                </span>
                            ) : (
                                <>
                                    Save & Continue
                                    <FiChevronRight className={styles.icon} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Step3PricingTiming;