'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/travelspots/TravelSpotForm.module.css';
import useSlugGenerator from '@/hooks/useSlugGenerator';

export default function TravelSpotForm({
    initialData = {},
    onSubmit,
    isSubmitting = false,
    mode = 'create' // 'create' or 'edit'
}) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        short_description: '',
        full_address: '',
        city: 'Delhi',
        latitude: '',
        longitude: '',
    });

    const [errors, setErrors] = useState({});
    const {
        slug,
        generateFrom,
        updateManually,
        reset,
    } = useSlugGenerator(initialData.slug);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // AUTO slug from name
        if (name === 'name') {
            generateFrom(value);
        }

        // MANUAL slug edit
        if (name === 'slug') {
            updateManually(value);
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
        if (formData.latitude && (formData.latitude < -90 || formData.latitude > 90)) {
            newErrors.latitude = 'Latitude must be between -90 and 90';
        }
        if (formData.longitude && (formData.longitude < -180 || formData.longitude > 180)) {
            newErrors.longitude = 'Longitude must be between -180 and 180';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({
            ...formData,
            name: formData.name.trim(),
            slug: formData.slug.trim(),
            short_description: formData.short_description.trim(),
            full_address: formData.full_address.trim(),
            city: formData.city.trim(),
            latitude: formData.latitude.trim(),
            longitude: formData.longitude.trim(),
        });
    };

    useEffect(() => {
        setFormData(prev =>
            prev.slug === slug ? prev : { ...prev, slug }
        );
    }, [slug]);

    useEffect(() => {
        if (mode === 'edit' && initialData?.slug) {
            reset(initialData.slug);

            setFormData({
                name: initialData.name || '',
                slug: initialData.slug || '',
                short_description: initialData.short_description || '',
                full_address: initialData.full_address || '',
                city: initialData.city || 'Delhi',
                latitude: initialData.latitude || '',
                longitude: initialData.longitude || '',
            });
        }
    }, [initialData, mode, reset]);

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                {/* Name */}
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                        Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                        placeholder="Enter travel spot name"
                    />
                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                </div>

                {/* Slug */}
                <div className={styles.formGroup}>
                    <label htmlFor="slug" className={styles.label}>
                        Slug *
                    </label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.slug ? styles.inputError : ''}`}
                        placeholder="e.g., lotus-temple"
                    />
                    {errors.slug && <span className={styles.error}>{errors.slug}</span>}
                    <p className={styles.helpText}>URL-friendly identifier</p>
                </div>

                {/* City */}
                <div className={styles.formGroup}>
                    <label htmlFor="city" className={styles.label}>
                        City
                    </label>
                    <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={styles.select}
                    >
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Agra">Agra</option>
                        <option value="Jaipur">Jaipur</option>
                    </select>
                </div>

                {/* Short Description */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="short_description" className={styles.label}>
                        Short Description
                    </label>
                    <textarea
                        id="short_description"
                        name="short_description"
                        value={formData.short_description}
                        onChange={handleChange}
                        className={styles.textarea}
                        placeholder="Brief description of the travel spot"
                        rows="3"
                    />
                </div>

                {/* Full Address */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="full_address" className={styles.label}>
                        Full Address
                    </label>
                    <textarea
                        id="full_address"
                        name="full_address"
                        value={formData.full_address}
                        onChange={handleChange}
                        className={styles.textarea}
                        placeholder="Complete address with landmarks"
                        rows="3"
                    />
                </div>

                {/* Coordinates */}
                <div className={styles.formGroup}>
                    <label htmlFor="latitude" className={styles.label}>
                        Latitude
                    </label>
                    <input
                        type="number"
                        id="latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        step="any"
                        className={`${styles.input} ${errors.latitude ? styles.inputError : ''}`}
                        placeholder="e.g., 28.5535"
                    />
                    {errors.latitude && <span className={styles.error}>{errors.latitude}</span>}
                    <p className={styles.helpText}>Between -90 and 90</p>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="longitude" className={styles.label}>
                        Longitude
                    </label>
                    <input
                        type="number"
                        id="longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        step="any"
                        className={`${styles.input} ${errors.longitude ? styles.inputError : ''}`}
                        placeholder="e.g., 77.2588"
                    />
                    {errors.longitude && <span className={styles.error}>{errors.longitude}</span>}
                    <p className={styles.helpText}>Between -180 and 180</p>
                </div>
            </div>

            <div className={styles.formActions}>
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className={styles.secondaryButton}
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className={styles.spinner}></span>
                            {mode === 'create' ? 'Creating...' : 'Updating...'}
                        </>
                    ) : (
                        mode === 'create' ? 'Create Travel Spot' : 'Update Travel Spot'
                    )}
                </button>
            </div>
        </form>
    );
}