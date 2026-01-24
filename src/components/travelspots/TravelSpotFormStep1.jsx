'use client';

import { Input } from '@/components/ui/input';
import {
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
import ReactMultiSelect from '@/components/ui/ReactMultiSelect';
import { FiCheck } from 'react-icons/fi';
import { useGetPublicSpotCategoriesQuery } from '@/services/api/spotcategoryApi';
import styles from '@/styles/travelspots/TravelSpotForm.module.css';
import useSlugGenerator from '@/hooks/useSlugGenerator';
import { useEffect } from 'react';

export default function TravelSpotFormStep1({ form, mode, isSubmitting }) {
    const { slug, generateFrom, updateManually } = useSlugGenerator(
        mode === 'edit' ? form.getValues('slug') || '' : ''
    );

    const { data: categoriesData, isLoading: isLoadingCategories } = useGetPublicSpotCategoriesQuery();

    const categories = categoriesData?.data?.map(cat => ({
        value: cat.spotcategory_id,
        label: cat.name,
    })) || [];

    // Indian cities
    const indianCities = [
        'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
        'Agra', 'Jaipur', 'Pune', 'Ahmedabad', 'Surat', 'Lucknow',
        'Kanpur', 'Nagpur', 'Patna', 'Indore', 'Thane', 'Bhopal',
        'Visakhapatnam', 'Vadodara', 'Firozabad', 'Ludhiana', 'Rajkot',
        'Siliguri', 'Nashik', 'Faridabad', 'Patiala', 'Meerut'
    ].sort();

    // Sync slug in create mode
    useEffect(() => {
        if (mode === 'create') {
            form.setValue('slug', slug);
        }
    }, [slug, form, mode]);

    const isSlugValid = (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

    return (
        <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Basic Information</h3>
            <p className={styles.stepDescription}>
                Provide the basic details about your travel spot.
            </p>

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
                                                if (mode === 'create') {
                                                    generateFrom(e.target.value);
                                                }
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

            {/* Categories */}
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

            {/* City */}
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
        </div>
    );
}