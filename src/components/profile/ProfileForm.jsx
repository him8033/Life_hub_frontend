'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/common/buttons/Button';
import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { useUpdateProfileMutation } from '@/services/api/authApi';
import LocationSelects from './LocationSelects';
import { profileSchema } from '@/lib/validations/profileSchema';
import styles from '@/styles/dashboard/profile/ProfileForm.module.css';
import { FiEdit3, FiSave, FiX, FiMail, FiCalendar } from 'react-icons/fi';

const ProfileForm = ({ profile, refetch }) => {
    const { showSnackbar } = useSnackbar();
    const [isEditing, setIsEditing] = useState(false);
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const methods = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            headline: '',
            bio: '',
            date_of_birth: '',
            full_address: '',
            country: '',
            state: '',
            district: '',
            sub_district: '',
            village: '',
            pincode: '',
        },
        mode: 'onChange',
    });

    const {
        handleSubmit,
        watch,
        reset,
        formState: { errors, isDirty },
    } = methods;

    const fullAddress = watch('full_address');
    const bio = watch('bio');

    // Populate form when profile data is available
    useEffect(() => {
        if (profile) {
            reset({
                first_name: profile.user?.first_name || '',
                last_name: profile.user?.last_name || '',
                email: profile.user?.email || '',
                phone_number: profile.phone_number || '',
                headline: profile.headline || '',
                bio: profile.bio || '',
                date_of_birth: profile.date_of_birth || '',
                full_address: profile.full_address || '',
                country: profile.country ? String(profile.country) : '',
                state: profile.state ? String(profile.state) : '',
                district: profile.district ? String(profile.district) : '',
                sub_district: profile.sub_district ? String(profile.sub_district) : '',
                village: profile.village ? String(profile.village) : '',
                pincode: profile.pincode ? String(profile.pincode) : '',
            });
        }
    }, [profile, reset]);

    const resetToOriginal = () => {
        if (profile) {
            reset({
                first_name: profile.user?.first_name || '',
                last_name: profile.user?.last_name || '',
                email: profile.user?.email || '',
                phone_number: profile.phone_number || '',
                headline: profile.headline || '',
                bio: profile.bio || '',
                date_of_birth: profile.date_of_birth || '',
                full_address: profile.full_address || '',
                country: profile.country ? String(profile.country) : '',
                state: profile.state ? String(profile.state) : '',
                district: profile.district ? String(profile.district) : '',
                sub_district: profile.sub_district ? String(profile.sub_district) : '',
                village: profile.village ? String(profile.village) : '',
                pincode: profile.pincode ? String(profile.pincode) : '',
            });
        }
    };

    const handleCancelEditing = () => {
        resetToOriginal();
        setIsEditing(false);
    };

    const handleProfileUpdate = async (data) => {
        try {
            const payload = {
                first_name: data.first_name?.trim(),
                last_name: data.last_name?.trim(),
                phone_number: data.phone_number || null,
                headline: data.headline || null,
                bio: data.bio || null,
                date_of_birth: data.date_of_birth || null,
                full_address: data.full_address || null,
                country: data.country || null,
                state: data.state || null,
                district: data.district || null,
                sub_district: data.sub_district || null,
                village: data.village || null,
                pincode: data.pincode || null,
            };

            Object.keys(payload).forEach((key) => {
                if (payload[key] === '') payload[key] = null;
            });

            await updateProfile(payload).unwrap();
            showSnackbar('Profile updated successfully', 'success', 5000);
            setIsEditing(false);
            refetch();
        } catch (error) {
            const errorMsg = extractErrorMessage(error, 'Failed to update profile');
            showSnackbar(errorMsg, 'error', 5000);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <FormProvider {...methods}>
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Personal Information</h2>
                    <Button
                        variant={isEditing ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => (isEditing ? handleCancelEditing() : setIsEditing(true))}
                        icon={isEditing ? <FiX /> : <FiEdit3 />}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </div>

                <form onSubmit={handleSubmit(handleProfileUpdate)}>
                    {/* Name Fields */}
                    <div className={styles.formGrid}>
                        <FormInput
                            name="first_name"
                            label="First Name *"
                            disabled={!isEditing}
                            placeholder="Enter first name"
                        />
                        <FormInput
                            name="last_name"
                            label="Last Name *"
                            disabled={!isEditing}
                            placeholder="Enter last name"
                        />
                    </div>

                    {/* Email - Read Only */}
                    <div className={styles.formGroup}>
                        <FormInput
                            name="email"
                            label="Email Address"
                            disabled={true}
                            placeholder="Your email address"
                            icon={<FiMail />}
                        />
                        <p className={styles.helpText}>
                            Email cannot be changed. Contact support for email updates.
                        </p>
                    </div>

                    {/* Phone & Headline */}
                    <div className={styles.formGrid}>
                        <FormInput
                            name="phone_number"
                            label="Phone Number"
                            disabled={!isEditing}
                            placeholder="Enter phone number"
                            type="tel"
                        />
                        <FormInput
                            name="headline"
                            label="Headline"
                            disabled={!isEditing}
                            placeholder="e.g., Full Stack Developer"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className={styles.formGroup}>
                        <FormInput
                            name="date_of_birth"
                            label="Date of Birth"
                            disabled={!isEditing}
                            type="date"
                            icon={<FiCalendar />}
                        />
                        {!isEditing && profile?.date_of_birth && (
                            <p className={styles.helpText}>
                                {formatDate(profile.date_of_birth)}
                            </p>
                        )}
                    </div>

                    {/* Bio */}
                    <div className={styles.formGroup}>
                        <FormTextarea
                            name="bio"
                            label="Bio"
                            disabled={!isEditing}
                            placeholder="Tell us about yourself..."
                            rows={4}
                        />
                        <div className={styles.charCount}>
                            <span className={`${styles.charCountText} ${bio?.length > 500 ? styles.charCountError : ''}`}>
                                {bio?.length || 0}/500 characters
                            </span>
                        </div>
                    </div>

                    {/* Location Hierarchy */}
                    <LocationSelects isEditing={isEditing} />

                    {/* Save Button */}
                    {isEditing && (
                        <div className={styles.formActions}>
                            <Button
                                type="button"
                                variant="outline"
                                size="md"
                                onClick={handleCancelEditing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                isLoading={isUpdating}
                                loadingText="Saving..."
                                disabled={!isDirty}
                            >
                                <FiSave /> Save Changes
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </FormProvider>
    );
};

export default ProfileForm;