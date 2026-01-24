'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import ImageUpload from '@/components/common/ImageUpload';
import styles from '@/styles/travelspots/TravelSpotForm.module.css';

export default function TravelSpotFormStep4({ form, initialData, mode, isSubmitting }) {
    // You can add image upload functionality here
    const handleImageUpload = (images) => {
        // Handle uploaded images
        console.log('Uploaded images:', images);
    };

    return (
        <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Location & Media</h3>
            <p className={styles.stepDescription}>
                Add location coordinates and images for your travel spot.
            </p>

            {/* Coordinates */}
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

            {/* Image Upload Section - You can expand this */}
            <div className={styles.formSection}>
                <div className={styles.mediaSection}>
                    <div className={styles.labelContainer}>
                        <FormLabel className={styles.sectionLabel}>
                            Images & Media
                        </FormLabel>
                        <FormDescription className={styles.fieldInfo}>
                            Upload photos of the travel spot
                        </FormDescription>
                    </div>

                    {/* Example image upload - implement based on your ImageUpload component */}
                    <ImageUpload
                        onUpload={handleImageUpload}
                        multiple={true}
                        maxFiles={10}
                        disabled={isSubmitting}
                        existingImages={mode === 'edit' ? initialData.images || [] : []}
                    />
                </div>
            </div>

            {/* Additional Fields - Future expansion */}
            <div className={styles.formSection}>
                <FormField
                    control={form.control}
                    name="additional_notes"
                    render={({ field }) => (
                        <FormItem>
                            <div className={styles.labelContainer}>
                                <FormLabel className={styles.sectionLabel}>
                                    Additional Notes
                                </FormLabel>
                                <FormDescription className={styles.fieldInfo}>
                                    Any additional information or notes
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter any additional notes..."
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
        </div>
    );
}