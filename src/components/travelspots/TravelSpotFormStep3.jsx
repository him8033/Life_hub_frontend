'use client';

import { Input } from '@/components/ui/input';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FiClock, FiDollarSign, FiCalendar } from 'react-icons/fi';
import styles from '@/styles/travelspots/TravelSpotForm.module.css';

export default function TravelSpotFormStep3({ form, isSubmitting }) {
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
        <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Pricing & Timing</h3>
            <p className={styles.stepDescription}>
                Information about entry fee and visiting hours.
            </p>

            <div className={styles.pricingTimingSection}>
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
                                                <SelectValue placeholder="Select opening time" />
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
                                                <SelectValue placeholder="Select closing time" />
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
        </div>
    );
}