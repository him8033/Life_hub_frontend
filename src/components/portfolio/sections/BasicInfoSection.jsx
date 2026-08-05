// src/components/portfolio/sections/BasicInfoSection.jsx

'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
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
import RichTextEditor from '@/components/common/forms/RichTextEditor';

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
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [lastSavedData, setLastSavedData] = useState(null);
    const saveTimeoutRef = useRef(null);
    const isInitialMount = useRef(true);

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
        mode: 'onChange',
    });

    const { reset, handleSubmit, watch, getValues } = methods;

    // Watch all form fields
    const formValues = useWatch({
        control: methods.control,
    });

    // Track if form has changed
    const [hasChanges, setHasChanges] = useState(false);

    // Reset form when basicInfo loads
    useEffect(() => {
        if (basicInfo) {
            const values = {
                first_name: basicInfo.first_name || '',
                last_name: basicInfo.last_name || '',
                email: basicInfo.email || '',
                phone: basicInfo.phone || '',
                summary: basicInfo.summary || '',
                full_address: basicInfo.full_address || '',
                website: basicInfo.website || '',
            };
            reset(values);
            setLastSavedData(values);
            setHasChanges(false);

            if (basicInfo.image_url) {
                setImagePreview(basicInfo.image_url);
            } else {
                setImagePreview('');
            }
        }
        isInitialMount.current = false;
    }, [basicInfo, reset]);

    // Check for changes in form values
    useEffect(() => {
        if (isInitialMount.current || !basicInfo) return;

        const currentValues = getValues();
        const hasChanged = JSON.stringify(currentValues) !== JSON.stringify(lastSavedData);
        setHasChanges(hasChanged);

        // Auto-save on change with debounce
        if (hasChanged && !isSaving) {
            // Clear existing timeout
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            // Set new timeout for auto-save (1.5 second delay)
            saveTimeoutRef.current = setTimeout(() => {
                handleAutoSave(currentValues);
            }, 1500);
        }

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [formValues, basicInfo, lastSavedData, isSaving]);

    // Auto-save function
    const handleAutoSave = useCallback(async (values) => {
        if (!values || !basicInfo) return;

        try {
            setIsAutoSaving(true);

            // Check if any required fields are empty
            if (!values.first_name || !values.email) {
                return; // Don't auto-save if required fields are empty
            }

            const formData = new FormData();
            formData.append('first_name', values.first_name || '');
            formData.append('last_name', values.last_name || '');
            formData.append('email', values.email || '');
            if (values.phone) formData.append('phone', values.phone);
            if (values.summary) formData.append('summary', values.summary);
            if (values.full_address) formData.append('full_address', values.full_address);
            if (values.website) formData.append('website', values.website);

            // Handle image removal
            if (removeImage) {
                formData.append('remove_image', 'true');
            } else if (imageFile) {
                formData.append('image', imageFile);
            }

            if (basicInfo?.profilebasicinfo_id) {
                formData.append('profilebasicinfo_id', basicInfo.profilebasicinfo_id);
            }

            // Check if data has actually changed before saving
            const currentData = {
                first_name: values.first_name || '',
                last_name: values.last_name || '',
                email: values.email || '',
                phone: values.phone || '',
                summary: values.summary || '',
                full_address: values.full_address || '',
                website: values.website || '',
            };

            if (JSON.stringify(currentData) === JSON.stringify(lastSavedData) && !imageFile && !removeImage) {
                return; // No changes to save
            }

            await saveBasicInfo({
                snapshotId,
                data: formData
            }).unwrap();

            setLastSavedData(currentData);
            setHasChanges(false);
            setIsAutoSaving(false);

            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            setIsAutoSaving(false);
            // Don't show snackbar for auto-save errors to avoid spamming
            console.error('Auto-save failed:', error);
        }
    }, [basicInfo, imageFile, removeImage, lastSavedData, saveBasicInfo, snapshotId, onDataChange]);

    // Handle navigation (save before navigating)
    const handleNavigate = useCallback(async (direction) => {
        const currentValues = getValues();

        // Check if required fields are filled
        if (!currentValues.first_name || !currentValues.email) {
            showSnackbar('Please fill in all required fields (First Name and Email)', 'warning', 3000);
            return;
        }

        // If there are changes, save immediately
        if (hasChanges || imageFile || removeImage) {
            try {
                setIsAutoSaving(true);
                const formData = new FormData();
                formData.append('first_name', currentValues.first_name || '');
                formData.append('last_name', currentValues.last_name || '');
                formData.append('email', currentValues.email || '');
                if (currentValues.phone) formData.append('phone', currentValues.phone);
                if (currentValues.summary) formData.append('summary', currentValues.summary);
                if (currentValues.full_address) formData.append('full_address', currentValues.full_address);
                if (currentValues.website) formData.append('website', currentValues.website);

                if (removeImage) {
                    formData.append('remove_image', 'true');
                } else if (imageFile) {
                    formData.append('image', imageFile);
                }

                if (basicInfo?.profilebasicinfo_id) {
                    formData.append('profilebasicinfo_id', basicInfo.profilebasicinfo_id);
                }

                await saveBasicInfo({
                    snapshotId,
                    data: formData
                }).unwrap();

                setLastSavedData({
                    first_name: currentValues.first_name || '',
                    last_name: currentValues.last_name || '',
                    email: currentValues.email || '',
                    phone: currentValues.phone || '',
                    summary: currentValues.summary || '',
                    full_address: currentValues.full_address || '',
                    website: currentValues.website || '',
                });
                setHasChanges(false);
                setIsAutoSaving(false);

                if (onDataChange) {
                    onDataChange();
                }

                // Navigate after save
                if (direction === 'next' && onNext) {
                    onNext();
                } else if (direction === 'previous' && onPrevious) {
                    onPrevious();
                }
            } catch (error) {
                setIsAutoSaving(false);
                showSnackbar('Failed to save before navigating', 'error', 3000);
            }
        } else {
            // No changes, navigate directly
            if (direction === 'next' && onNext) {
                onNext();
            } else if (direction === 'previous' && onPrevious) {
                onPrevious();
            }
        }
    }, [hasChanges, imageFile, removeImage, basicInfo, saveBasicInfo, snapshotId, onDataChange, onNext, onPrevious, getValues, showSnackbar]);

    // Handle Next button click with auto-save
    const handleNextWithSave = useCallback(() => {
        handleNavigate('next');
    }, [handleNavigate]);

    // Handle Previous button click with auto-save
    const handlePreviousWithSave = useCallback(() => {
        handleNavigate('previous');
    }, [handleNavigate]);

    // Handle image selection with auto-save
    const handleImageSelectWithAutoSave = useCallback((file, previewUrl) => {
        setImageFile(file);
        setImagePreview(previewUrl);
        setRemoveImage(false);
        // Mark as changed to trigger auto-save
        setHasChanges(true);
    }, []);

    // Handle manual save button click
    const handleManualSave = useCallback((data) => {
        // Clear any pending auto-save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        // Call the original form submit
        handleFormSubmit(data);
    }, []);

    const handleImageRemove = () => {
        setImageFile(null);
        setImagePreview('');
        setRemoveImage(false);
        setHasChanges(true);
    };

    const handleImageDelete = () => {
        setImageFile(null);
        setImagePreview('');
        setRemoveImage(true);
        setHasChanges(true);
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
                formData.append('image', imageFile);
            }

            if (basicInfo?.profilebasicinfo_id) {
                formData.append('profilebasicinfo_id', basicInfo.profilebasicinfo_id);
            }

            await saveBasicInfo({
                snapshotId,
                data: formData
            }).unwrap();

            showSnackbar('Basic info saved successfully', 'success', 3000);
            refetch();

            const currentValues = {
                first_name: data.first_name || '',
                last_name: data.last_name || '',
                email: data.email || '',
                phone: data.phone || '',
                summary: data.summary || '',
                full_address: data.full_address || '',
                website: data.website || '',
            };
            setLastSavedData(currentValues);
            setHasChanges(false);

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

    const isUpdate = !!basicInfo?.profilebasicinfo_id;
    const showExistingImage = basicInfo?.image_url && !imageFile && !removeImage;

    return (
        <SectionLayout
            title="Basic Information"
            subtitle="Your personal details for resumes and portfolios"
            icon={FiUser}
            isLoading={isLoading}
            isSaving={isSaving || isAutoSaving}
            hasData={hasData}
            onSave={handleSubmit(handleManualSave)}
            saveButtonText={isUpdate ? 'Update Info' : 'Save Info'}
            onPrevious={handlePreviousWithSave}
            onNext={handleNextWithSave}
            showPrevious={showPrevious}
            showNext={showNext}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            previousSectionName={previousSectionName}
            nextSectionName={nextSectionName}
        >
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleManualSave)}>
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
                                    onImageSelect={handleImageSelectWithAutoSave}
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
                        {/* <FormTextarea
                            name="summary"
                            label="Professional Summary"
                            placeholder="A brief, compelling overview of your career."
                            rows={4}
                            disabled={isSaving}
                            className={styles.fieldItem}
                        /> */}
                        <RichTextEditor
                            name="summary"
                            label="Professional Summary"
                            placeholder="A brief, compelling overview of your career..."
                            description="Write a brief professional summary that highlights your key skills and experience."
                            minHeight="120px"
                            maxHeight="300px"
                            disabled={isSaving}
                            size="md"
                            className={styles.fieldItem}
                        />
                    </div>

                    {/* Auto-save indicator */}
                    {isAutoSaving && (
                        <div className={styles.autoSaveIndicator}>
                            <span className={styles.autoSaveText}>Auto-saving...</span>
                        </div>
                    )}
                    {hasChanges && !isAutoSaving && !isSaving && (
                        <div className={styles.unsavedIndicator}>
                            <span className={styles.unsavedText}>Unsaved changes</span>
                        </div>
                    )}
                </form>
            </FormProvider>
        </SectionLayout>
    );
};

export default BasicInfoSection;