// src/components/portfolio/sections/BasicInfoSection.jsx

'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiCamera, FiTrash2, FiEdit2
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import SquareImageUpload from '@/components/common/SquareImageUpload';
import Button from '@/components/common/buttons/Button';
import { SectionLayout } from './common/SectionLayout';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { useGetBasicInfoQuery, useSaveBasicInfoMutation } from '@/services/api/portfolioApi';
import { basicInfoSchema } from '@/lib/validations/portfolio/sections/basicInfoSchema';
import styles from '@/styles/portfolio/sections/BasicInfoSection.module.css';

const BasicInfoSection = ({ snapshotId, onDataChange }) => {
    const { showSnackbar } = useSnackbar();

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [removeImage, setRemoveImage] = useState(false);

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

    const { reset, handleSubmit, watch } = methods;
    const firstName = watch('first_name');

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
            refetch();

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to save basic info'), 'error', 5000);
        }
    };

    const hasData = basicInfo && (
        basicInfo.first_name ||
        basicInfo.last_name ||
        basicInfo.email ||
        basicInfo.phone ||
        basicInfo.summary ||
        basicInfo.full_address ||
        basicInfo.website ||
        basicInfo.image_url
    );

    return (
        <SectionLayout
            title="Basic Information"
            subtitle="Your personal details for resumes and portfolios"
            icon={FiUser}
            isLoading={isLoading}
            isSaving={isSaving}
            hasData={hasData}
            onSave={handleSubmit(handleFormSubmit)}
            saveButtonText={hasData ? 'Update Info' : 'Save Info'}
        >
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className={styles.formContainer}>
                        {/* Left Column - Form Fields */}
                        <div className={styles.leftColumn}>
                            {/* Name Row */}
                            <div className={styles.fieldRow}>
                                <FormInput
                                    name="first_name"
                                    label="First Name *"
                                    placeholder="Enter first name"
                                    icon={<FiUser size={16} />}
                                    disabled={isSaving}
                                    className={styles.fieldItem}
                                />
                                <FormInput
                                    name="last_name"
                                    label="Last Name"
                                    placeholder="Enter last name"
                                    icon={<FiUser size={16} />}
                                    disabled={isSaving}
                                    className={styles.fieldItem}
                                />
                            </div>

                            {/* Email & Phone */}
                            <div className={styles.fieldRow}>
                                <FormInput
                                    name="email"
                                    label="Email *"
                                    type="email"
                                    placeholder="your@email.com"
                                    icon={<FiMail size={16} />}
                                    disabled={isSaving}
                                    className={styles.fieldItem}
                                />
                                <FormInput
                                    name="phone"
                                    label="Phone"
                                    placeholder="+91 9876543210"
                                    icon={<FiPhone size={16} />}
                                    disabled={isSaving}
                                    className={styles.fieldItem}
                                />
                            </div>

                            {/* Website */}
                            <FormInput
                                name="website"
                                label="Website"
                                placeholder="https://yourwebsite.com"
                                icon={<FiGlobe size={16} />}
                                disabled={isSaving}
                                className={styles.fieldItem}
                            />

                            {/* Full Address */}
                            <FormInput
                                name="full_address"
                                label="Full Address"
                                placeholder="Enter your complete address"
                                icon={<FiMapPin size={16} />}
                                disabled={isSaving}
                                className={styles.fieldItem}
                            />
                        </div>

                        {/* Right Column - Profile Photo */}
                        <div className={styles.rightColumn}>
                            <div className={styles.photoSection}>
                                <h4 className={styles.photoSectionTitle}>
                                    <FiCamera className={styles.photoIcon} />
                                    Profile Photo
                                </h4>

                                {basicInfo?.image_url && !imageFile && !removeImage ? (
                                    <div className={styles.existingPhoto}>
                                        <div className={styles.photoFrame}>
                                            <img
                                                src={basicInfo.image_url}
                                                alt="Profile"
                                                className={styles.profileImage}
                                            />
                                        </div>
                                        <div className={styles.photoActions}>
                                            <button
                                                type="button"
                                                className={styles.changePhotoBtn}
                                                onClick={() => {
                                                    // Trigger file input
                                                    document.getElementById('photo-upload-input')?.click();
                                                }}
                                            >
                                                <FiEdit2 size={14} />
                                                Change
                                            </button>
                                            <button
                                                type="button"
                                                className={styles.removePhotoBtn}
                                                onClick={handleRemoveExistingImage}
                                                disabled={isSaving}
                                            >
                                                <FiTrash2 size={14} />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <SquareImageUpload
                                        onImageSelect={handleImageSelect}
                                        onRemove={handleImageRemove}
                                        previewUrl={imagePreview}
                                        disabled={isSaving}
                                        maxSizeMB={5}
                                        label={imagePreview ? 'Change Photo' : 'Upload Photo'}
                                        size="medium"
                                        enableCrop={true}
                                        aspectRatio={1}
                                        showCropControls={true}
                                    />
                                )}

                                <p className={styles.photoHint}>
                                    Square image recommended (e.g., 400×400px)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Summary - Full Width */}
                    <div className={styles.summarySection}>
                        <FormTextarea
                            name="summary"
                            label="Professional Summary"
                            placeholder="A brief, compelling overview of your career."
                            rows={4}
                            disabled={isSaving}
                            className={styles.fieldItem}
                        />
                        <p className={styles.summaryHint}>
                            Write a brief professional summary...
                        </p>
                    </div>
                </form>
            </FormProvider>
        </SectionLayout>
    );
};

export default BasicInfoSection;