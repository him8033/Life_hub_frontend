'use client';

import { Textarea } from '@/components/ui/textarea';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import styles from '@/styles/travelspots/TravelSpotForm.module.css';

export default function TravelSpotFormStep2({ form, isSubmitting }) {
    const shortDescription = form.watch('short_description') || '';
    const longDescription = form.watch('long_description') || '';

    return (
        <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Description & Address</h3>
            <p className={styles.stepDescription}>
                Provide descriptions and location details for your travel spot.
            </p>

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
        </div>
    );
}