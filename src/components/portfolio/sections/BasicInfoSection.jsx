// src/components/portfolio/sections/BasicInfoSection.jsx

'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiCamera
} from 'react-icons/fi';

import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import ProfileImageUpload from '@/components/common/ProfileImageUpload';
import { SectionLayout } from './common/SectionLayout';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { useGetBasicInfoQuery, useSaveBasicInfoMutation } from '@/services/api/portfolioApi';
import { basicInfoSchema } from '@/lib/validations/portfolio/sections/basicInfoSchema';
import styles from '@/styles/portfolio/sections/BasicInfoSection.module.css';

const BasicInfoSection = ({
    snapshotId,
    onDataChange,
    onPrevious,
    onNext,
    showPrevious = false,
    showNext = false,
    isFirstStep = false,
    isLastStep = false,
    previousSectionName = '',
    nextSectionName = '',
}) => {
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

    const { reset, handleSubmit } = methods;

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

            // Set preview from existing image
            if (basicInfo.image_url) {
                setImagePreview(basicInfo.image_url);
            } else {
                setImagePreview('');
            }
        }
    }, [basicInfo, reset]);

    const handleImageSelect = (file, previewUrl) => {
        setImageFile(file);
        setImagePreview(previewUrl);
        setRemoveImage(false);
    };

    const handleImageRemove = () => {
        // Called when user clicks X on the uploaded image (new image)
        setImageFile(null);
        setImagePreview('');
        setRemoveImage(false);
    };

    const handleImageDelete = () => {
        // Called when user clicks "Remove Photo" on existing image
        setImageFile(null);
        setImagePreview('');
        setRemoveImage(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            const formData = new FormData();

            // Basic fields
            formData.append('first_name', data.first_name);
            formData.append('last_name', data.last_name || '');
            formData.append('email', data.email);
            if (data.phone) formData.append('phone', data.phone);
            if (data.summary) formData.append('summary', data.summary);
            if (data.full_address) formData.append('full_address', data.full_address);
            if (data.website) formData.append('website', data.website);

            // Image handling
            if (removeImage) {
                // User wants to delete the existing image
                formData.append('remove_image', 'true');
            } else if (imageFile) {
                // User uploaded a new image
                formData.append('image', imageFile);
            }

            // If updating existing, include the profilebasicinfo_id
            if (basicInfo?.profilebasicinfo_id) {
                formData.append('profilebasicinfo_id', basicInfo.profilebasicinfo_id);
            }

            await saveBasicInfo({
                snapshotId,
                data: formData
            }).unwrap();

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

    // Check if there's an existing basic info ID for update
    const isUpdate = !!basicInfo?.profilebasicinfo_id;

    // Determine if we should show the existing image
    const showExistingImage = basicInfo?.image_url && !imageFile && !removeImage;

    return (
        <SectionLayout
            title="Basic Information"
            subtitle="Your personal details for resumes and portfolios"
            icon={FiUser}
            isLoading={isLoading}
            isSaving={isSaving}
            hasData={hasData}
            onSave={handleSubmit(handleFormSubmit)}
            saveButtonText={isUpdate ? 'Update Info' : 'Save Info'}
            onPrevious={onPrevious}
            onNext={onNext}
            showPrevious={showPrevious}
            showNext={showNext}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            previousSectionName={previousSectionName}
            nextSectionName={nextSectionName}
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

                                <ProfileImageUpload
                                    onImageSelect={handleImageSelect}
                                    onRemove={handleImageRemove}
                                    onImageDelete={handleImageDelete}
                                    imageUrl={showExistingImage ? basicInfo.image_url : null}
                                    previewUrl={imagePreview || null}
                                    firstName={basicInfo?.first_name || ''}
                                    lastName={basicInfo?.last_name || ''}
                                    disabled={isSaving}
                                    loading={isSaving}
                                    maxSizeMB={5}
                                    label="Upload Photo"
                                    changeLabel="Change Photo"
                                    removeLabel="Remove Photo"
                                    size="medium"
                                    enableCrop={true}
                                    aspectRatio={1}
                                    showCropControls={true}
                                    showDelete={true}
                                    imageSize={160}
                                    borderWidth={4}
                                />

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