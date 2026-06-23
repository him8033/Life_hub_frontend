'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiUser, FiMail, FiPhone, FiFileText,
    FiMapPin, FiGlobe, FiCamera, FiSave, FiTrash2
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import SquareImageUpload from '@/components/common/SquareImageUpload';
import Button from '@/components/common/buttons/Button';
import Loader from '@/components/common/Loader';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { useGetBasicInfoQuery, useSaveBasicInfoMutation } from '@/services/api/portfolioApi';
import { basicInfoSchema } from '@/lib/validations/portfolio/sections/basicInfoSchema';
import styles from '@/styles/portfolio/sections/BasicInfoSection.module.css';

const BasicInfoSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();
    const [isEditing, setIsEditing] = useState(false);

    // Image states
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [removeImage, setRemoveImage] = useState(false);

    // API
    const { data, isLoading, refetch } = useGetBasicInfoQuery(snapshotId, { skip: !snapshotId });
    const [saveBasicInfo, { isLoading: isSaving }] = useSaveBasicInfoMutation();

    const basicInfo = data?.data;

    const methods = useForm({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            summary: '',
            full_address: '',
            website: '',
        },
    });

    const { reset, handleSubmit } = methods;

    // Populate form when data loads
    useEffect(() => {
        if (basicInfo) {
            reset({
                first_name: basicInfo.first_name || '',
                last_name: basicInfo.last_name || '',
                email: basicInfo.email || '',
                phone: basicInfo.phone || '',
                summary: basicInfo.summary || '',
                full_address: basicInfo.full_address || '',
                website: basicInfo.website || '',
            });
            if (basicInfo.image_url) {
                setImagePreview(basicInfo.image_url);
            }
        }
    }, [basicInfo, reset]);

    const handleImageSelect = (file, previewUrl) => {
        setImageFile(file);
        setImagePreview(previewUrl);
        setRemoveImage(false);
    };

    const handleImageRemove = () => {
        setImageFile(null);
        setImagePreview('');
        setRemoveImage(false);
    };

    const handleRemoveExistingImage = () => {
        setImageFile(null);
        setImagePreview('');
        setRemoveImage(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('first_name', data.first_name);
            formData.append('last_name', data.last_name || '');
            formData.append('email', data.email);
            if (data.phone) formData.append('phone', data.phone);
            if (data.summary) formData.append('summary', data.summary);
            if (data.full_address) formData.append('full_address', data.full_address);
            if (data.website) formData.append('website', data.website);

            if (removeImage) {
                formData.append('remove_image', 'true');
            } else if (imageFile) {
                formData.append('image', imageFile, imageFile.name);
            }

            await saveBasicInfo({ snapshotId, data: formData }).unwrap();
            showSnackbar('Basic info saved successfully', 'success', 3000);
            setIsEditing(false);
            refetch();

            // NEW: Notify parent to refresh preview
            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save basic info'), 'error', 5000);
        }
    };

    const handleCancel = () => {
        if (basicInfo) {
            reset({
                first_name: basicInfo.first_name || '',
                last_name: basicInfo.last_name || '',
                email: basicInfo.email || '',
                phone: basicInfo.phone || '',
                summary: basicInfo.summary || '',
                full_address: basicInfo.full_address || '',
                website: basicInfo.website || '',
            });
            setImagePreview(basicInfo.image_url || '');
            setImageFile(null);
            setRemoveImage(false);
        }
        setIsEditing(false);
    };

    if (isLoading) return <Loader text="Loading basic info..." />;

    return (
        <div className={styles.container}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div>
                            <h3 className={styles.title}>Basic Information</h3>
                            <p className={styles.subtitle}>
                                Your personal details for resumes and portfolios
                            </p>
                        </div>
                        {!isEditing ? (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                icon={<FiUser />}
                            >
                                {basicInfo ? 'Edit Info' : 'Add Info'}
                            </Button>
                        ) : (
                            <div className={styles.headerActions}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    isLoading={isSaving}
                                    loadingText="Saving..."
                                    icon={<FiSave />}
                                >
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className={styles.formGrid}>
                        {/* Profile Image */}
                        <div className={styles.imageSection}>
                            <label className={styles.imageLabel}>
                                <FiCamera /> Profile Photo
                            </label>

                            {isEditing ? (
                                <>
                                    {basicInfo?.image_url && !imageFile && !removeImage && (
                                        <div className={styles.existingImageContainer}>
                                            <img
                                                src={basicInfo.image_url}
                                                alt="Profile"
                                                className={styles.existingImage}
                                            />
                                            <button
                                                type="button"
                                                className={styles.removeImageButton}
                                                onClick={handleRemoveExistingImage}
                                                disabled={isSaving}
                                            >
                                                <FiTrash2 /> Remove
                                            </button>
                                        </div>
                                    )}

                                    {(!basicInfo?.image_url || imageFile || removeImage) && (
                                        <SquareImageUpload
                                            onImageSelect={handleImageSelect}
                                            onRemove={handleImageRemove}
                                            previewUrl={imagePreview}
                                            disabled={isSaving}
                                            maxSizeMB={5}
                                            label="Upload Photo"
                                            size="small"
                                            enableCrop={true}
                                            aspectRatio={1}
                                            showCropControls={true}
                                        />
                                    )}
                                </>
                            ) : (
                                <div className={styles.imageDisplay}>
                                    {basicInfo?.image_url ? (
                                        <img
                                            src={basicInfo.image_url}
                                            alt="Profile"
                                            className={styles.profileImage}
                                        />
                                    ) : (
                                        <div className={styles.imagePlaceholder}>
                                            <FiUser size={32} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Name Fields */}
                        <div className={styles.fieldsSection}>
                            <div className={styles.row}>
                                <FormInput
                                    name="first_name"
                                    label="First Name *"
                                    placeholder="Enter first name"
                                    icon={<FiUser />}
                                    disabled={!isEditing || isSaving}
                                    className={styles.formItem}
                                />
                                <FormInput
                                    name="last_name"
                                    label="Last Name"
                                    placeholder="Enter last name"
                                    icon={<FiUser />}
                                    disabled={!isEditing || isSaving}
                                    className={styles.formItem}
                                />
                            </div>

                            <div className={styles.row}>
                                <FormInput
                                    name="email"
                                    label="Email *"
                                    type="email"
                                    placeholder="your@email.com"
                                    icon={<FiMail />}
                                    disabled={!isEditing || isSaving}
                                    className={styles.formItem}
                                />
                                <FormInput
                                    name="phone"
                                    label="Phone"
                                    placeholder="+91 9876543210"
                                    icon={<FiPhone />}
                                    disabled={!isEditing || isSaving}
                                    className={styles.formItem}
                                />
                            </div>

                            <FormInput
                                name="website"
                                label="Website"
                                placeholder="https://yourwebsite.com"
                                icon={<FiGlobe />}
                                disabled={!isEditing || isSaving}
                                className={styles.formItem}
                            />

                            <FormTextarea
                                name="summary"
                                label="Professional Summary"
                                placeholder="Write a brief professional summary..."
                                rows={4}
                                disabled={!isEditing || isSaving}
                                className={styles.formItem}
                            />

                            <FormInput
                                name="full_address"
                                label="Full Address"
                                placeholder="Enter your complete address"
                                icon={<FiMapPin />}
                                disabled={!isEditing || isSaving}
                                className={styles.formItem}
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default BasicInfoSection;