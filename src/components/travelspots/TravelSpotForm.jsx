'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Import shadcn components
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
import ButtonLoading from '@/components/Application/ButtonLoading';

import styles from '@/styles/travelspots/TravelSpotForm.module.css';
import useSlugGenerator from '@/hooks/useSlugGenerator';
import { travelspotSchema } from '@/lib/validations/travelspotSchema';
import { FiCheck, FiClock, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { useGetPublicSpotCategoriesQuery } from '@/services/api/spotcategoryApi';
import ReactMultiSelect from '@/components/ui/ReactMultiSelect';

export default function TravelSpotForm({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    mode = 'create'
}) {
    // Fetch categories
    const { data: categoriesData, isLoading: isLoadingCategories } = useGetPublicSpotCategoriesQuery();

    // Format categories for multi-select
    const categories = categoriesData?.data?.map(cat => ({
        value: cat.spotcategory_id,
        label: cat.name,
        // count: cat.spotCount || 0,
    })) || [];

    const getDefaultValues = useMemo(() => {
        if (mode === 'edit' && initialData?.slug) {
            return {
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
            };
        }

        // Create mode defaults
        return {
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
        };
    }, [mode, initialData]); // Add all necessary dependencies

    const form = useForm({
        resolver: zodResolver(travelspotSchema),
        defaultValues: getDefaultValues,
    });

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = form;

    // Watch description for character count
    const shortDescription = watch('short_description') || '';
    const longDescription = watch('long_description') || '';

    // Use useSlugGenerator differently for edit mode
    const { slug, generateFrom, updateManually } = useSlugGenerator(
        mode === 'edit' ? initialData.slug || '' : ''
    );

    // Sync slug only in create mode or when manually updated
    useEffect(() => {
        if (mode === 'create') {
            setValue('slug', slug);
        }
    }, [slug, setValue, mode]);

    useEffect(() => {
        if (onBackendError) {
            onBackendError(form);
        }
    }, [form, onBackendError]);

    const isSlugValid = (value) =>
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

    // Indian cities for dropdown
    const indianCities = [
        'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
        'Agra', 'Jaipur', 'Pune', 'Ahmedabad', 'Surat', 'Lucknow',
        'Kanpur', 'Nagpur', 'Patna', 'Indore', 'Thane', 'Bhopal',
        'Visakhapatnam', 'Vadodara', 'Firozabad', 'Ludhiana', 'Rajkot',
        'Siliguri', 'Nashik', 'Faridabad', 'Patiala', 'Meerut'
    ].sort();

    // Time options for opening/closing time
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const hourStr = hour.toString().padStart(2, '0');
            const minuteStr = minute.toString().padStart(2, '0');
            timeOptions.push(`${hourStr}:${minuteStr}`);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                {/* Top Row: Name and Slug */}
                <div className={styles.formSection}>
                    <div className={styles.formRow}>
                        {/* Name Field */}
                        <div className={styles.formGroup}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className={styles.labelContainer}>
                                            <FormLabel className={styles.label}>
                                                Name <span className={styles.required}>*</span>
                                            </FormLabel>
                                            <FormDescription className={styles.fieldInfo}>
                                                Enter travel spot name
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Lotus Temple"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    generateFrom(e.target.value);
                                                }}
                                                className={styles.input}
                                                autoFocus={mode === 'create'}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage className={styles.errorMessage} />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Slug Field */}
                        <div className={styles.formGroup}>
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className={styles.labelContainer}>
                                            <FormLabel className={styles.label}>
                                                Slug
                                            </FormLabel>
                                            <FormDescription className={styles.fieldInfo}>
                                                URL-friendly identifier
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., lotus-temple"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    updateManually(e.target.value);
                                                }}
                                                className={styles.input}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>

                                        {/* Slug Validation */}
                                        {field.value && (
                                            <div className={styles.validationContainer}>
                                                <div className={styles.validationItem}>
                                                    {isSlugValid(field.value) ? (
                                                        <div className={styles.validationValid}>
                                                            <FiCheck /> Valid URL slug format
                                                        </div>
                                                    ) : (
                                                        <div className={styles.validationInvalid}>
                                                            Use lowercase letters, numbers, and hyphens only
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className={styles.helperText}>
                                            This will be used in the URL. Use lowercase letters, numbers, and hyphens.
                                        </div>
                                        <FormMessage className={styles.errorMessage} />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Categories Multi-Select */}
                <div className={styles.formSection}>
                    <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                            <FormItem>
                                <div className={styles.labelContainer}>
                                    <FormLabel className={styles.label}>
                                        Categories
                                    </FormLabel>
                                    <FormDescription className={styles.fieldInfo}>
                                        Select the categories which are related
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <ReactMultiSelect
                                        options={categories}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Select categories..."
                                        disabled={isSubmitting || isLoadingCategories}
                                        searchable={true}
                                        maxHeight={250}
                                        className={styles.multiSelect}
                                    />
                                </FormControl>
                                <FormMessage className={styles.errorMessage} />
                            </FormItem>
                        )}
                    />
                </div>

                {/* City Section */}
                <div className={styles.formSection}>
                    <div className={styles.singleFieldRow}>
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <div className={styles.labelContainer}>
                                        <FormLabel className={styles.label}>
                                            City
                                        </FormLabel>
                                        <FormDescription className={styles.fieldInfo}>
                                            Select the city where this spot is located
                                        </FormDescription>
                                    </div>
                                    <Select
                                        value={field.value || ""}
                                        onValueChange={field.onChange}
                                        disabled={isSubmitting}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={styles.select}>
                                                <SelectValue placeholder="Select a city" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className={styles.selectContent}>
                                            {indianCities.map((city) => (
                                                <SelectItem
                                                    key={city}
                                                    value={city}
                                                    className={styles.selectItem}
                                                >
                                                    {city}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className={styles.errorMessage} />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Separator */}
                <div className={styles.separator} />

                {/* Short Description */}
                <div className={styles.formSection}>
                    <FormField
                        control={form.control}
                        name="short_description"
                        render={({ field }) => (
                            <FormItem>
                                <div className={styles.labelContainer}>
                                    <FormLabel className={styles.sectionLabel}>
                                        Short Description
                                    </FormLabel>
                                    <FormDescription className={styles.fieldInfo}>
                                        Brief description of the travel spot
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter a brief description"
                                        className={styles.textarea}
                                        rows={3}
                                        maxLength={200}
                                        {...field}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <div className={styles.charCount}>
                                    {shortDescription.length}/200 characters
                                </div>
                                <FormMessage className={styles.errorMessage} />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Long Description */}
                <div className={styles.formSection}>
                    <FormField
                        control={form.control}
                        name="long_description"
                        render={({ field }) => (
                            <FormItem>
                                <div className={styles.labelContainer}>
                                    <FormLabel className={styles.sectionLabel}>
                                        Long Description
                                    </FormLabel>
                                    <FormDescription className={styles.fieldInfo}>
                                        Detailed description with highlights, history, etc.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter detailed description about the travel spot..."
                                        className={styles.textarea}
                                        rows={5}
                                        maxLength={5000}
                                        {...field}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <div className={styles.charCount}>
                                    {longDescription.length}/5000 characters
                                </div>
                                <FormMessage className={styles.errorMessage} />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Full Address */}
                <div className={styles.formSection}>
                    <FormField
                        control={form.control}
                        name="full_address"
                        render={({ field }) => (
                            <FormItem>
                                <div className={styles.labelContainer}>
                                    <FormLabel className={styles.sectionLabel}>
                                        Full Address
                                    </FormLabel>
                                    <FormDescription className={styles.fieldInfo}>
                                        Complete address with landmarks
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter complete address"
                                        className={styles.textarea}
                                        rows={3}
                                        {...field}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage className={styles.errorMessage} />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Pricing & Timing Section */}
                <div className={styles.pricingTimingSection}>
                    <div className={styles.labelContainer}>
                        <h3 className={styles.sectionHeading}>
                            <FiDollarSign className={styles.sectionIcon} />
                            Pricing & Timing
                        </h3>
                        <p className={styles.sectionDescription}>
                            Information about entry fee and visiting hours
                        </p>
                    </div>

                    <div className={styles.formRow}>
                        {/* Entry Fee */}
                        <div className={styles.formGroup}>
                            <FormField
                                control={form.control}
                                name="entry_fee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={styles.label}>
                                            <FiDollarSign className={styles.fieldIcon} />
                                            Entry Fee (₹)
                                        </FormLabel>
                                        <div className={styles.inputWithIcon}>
                                            <FiDollarSign className={styles.inputIcon} />
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="e.g., 50, 100.50, or Free"
                                                    {...field}
                                                    className={styles.input}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                        </div>
                                        <p className={styles.helperText}>
                                            Enter amount in rupees or 'Free'
                                        </p>
                                        <FormMessage className={styles.errorMessage} />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Best Time to Visit */}
                        <div className={styles.formGroup}>
                            <FormField
                                control={form.control}
                                name="best_time_to_visit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={styles.label}>
                                            <FiCalendar className={styles.fieldIcon} />
                                            Best Time to Visit
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., October to March, Early morning"
                                                {...field}
                                                className={styles.input}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <p className={styles.helperText}>
                                            Recommended season/time for visiting
                                        </p>
                                        <FormMessage className={styles.errorMessage} />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className={styles.timeFields}>
                        {/* Opening Time */}
                        <div className={styles.timeField}>
                            <FormField
                                control={form.control}
                                name="opening_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={styles.label}>
                                            <FiClock className={styles.fieldIcon} />
                                            Opening Time
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            disabled={isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger className={styles.select}>
                                                    <SelectValue placeholder="Select opening time">
                                                        {field.value || "Select opening time"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={styles.selectContent}>
                                                <SelectItem value="not_specified" className={styles.selectItem}>Not specified</SelectItem>
                                                {timeOptions.map((time) => (
                                                    <SelectItem
                                                        key={`open-${time}`}
                                                        value={time}
                                                        className={styles.selectItem}
                                                    >
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className={styles.errorMessage} />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Closing Time */}
                        <div className={styles.timeField}>
                            <FormField
                                control={form.control}
                                name="closing_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={styles.label}>
                                            <FiClock className={styles.fieldIcon} />
                                            Closing Time
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            disabled={isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger className={styles.select}>
                                                    <SelectValue placeholder="Select closing time">
                                                        {field.value || "Select closing time"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={styles.selectContent}>
                                                <SelectItem value="not_specified" className={styles.selectItem}>Not specified</SelectItem>
                                                {timeOptions.map((time) => (
                                                    <SelectItem
                                                        key={`close-${time}`}
                                                        value={time}
                                                        className={styles.selectItem}
                                                    >
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className={styles.errorMessage} />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Latitude and Longitude */}
                <div className={styles.formSection}>
                    <div className={styles.coordinatesSection}>
                        <div className={styles.labelContainer}>
                            <FormLabel className={styles.sectionLabel}>
                                Location Coordinates
                            </FormLabel>
                            <FormDescription className={styles.fieldInfo}>
                                Geographical coordinates for precise location
                            </FormDescription>
                        </div>

                        <div className={styles.coordinatesRow}>
                            {/* Latitude */}
                            <FormField
                                control={form.control}
                                name="latitude"
                                render={({ field }) => (
                                    <FormItem className={styles.coordinateField}>
                                        <FormLabel className={styles.coordinateLabel}>
                                            Latitude
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="any"
                                                placeholder="e.g., 28.5535"
                                                {...field}
                                                className={styles.input}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage className={styles.errorMessage} />
                                    </FormItem>
                                )}
                            />

                            {/* Longitude */}
                            <FormField
                                control={form.control}
                                name="longitude"
                                render={({ field }) => (
                                    <FormItem className={styles.coordinateField}>
                                        <FormLabel className={styles.coordinateLabel}>
                                            Longitude
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="any"
                                                placeholder="e.g., 77.2588"
                                                {...field}
                                                className={styles.input}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage className={styles.errorMessage} />
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
                        onClick={() => window.history.back()}
                        className={styles.secondaryButton}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>

                    <ButtonLoading
                        type="submit"
                        text={mode === 'create' ? 'Create Travel Spot' : 'Update Travel Spot'}
                        isLoading={isSubmitting}
                        className={styles.primaryButton}
                    />
                </div>
            </form>
        </Form>
    );
}