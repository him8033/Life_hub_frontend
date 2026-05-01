'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PageLayout from '@/components/layout/PageLayout';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import Button from '@/components/common/buttons/Button';
import SimpleInput from '@/components/common/forms/SimpleInput';
import SimpleSelect from '@/components/common/forms/SimpleSelect';
import SimpleTextarea from '@/components/common/forms/SimpleTextarea';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import styles from '@/styles/dashboard/profile.module.css';
import { 
    FiCamera, FiTrash2, FiPlus, FiStar, 
    FiEdit3, FiSave, FiX, FiLink, FiArrowUp, FiArrowDown 
} from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaGlobe } from 'react-icons/fa';
import {
    useGetMeQuery,
    useUpdateProfileMutation,
    useUploadProfileImageMutation,
    useDeleteProfileImageMutation,
    useCreateSocialLinkMutation,
    useUpdateSocialLinkMutation,
    useDeleteSocialLinkMutation,
    useSetPrimarySocialLinkMutation,
    useReorderSocialLinksMutation,
} from '@/services/api/authApi';
import {
    useGetStatesByCountryQuery,
    useGetDistrictsByStateQuery,
    useGetSubDistrictsByDistrictQuery,
    useGetVillagesBySubDistrictQuery,
} from '@/services/api/locationsApi';

// Social Platform Icons mapping
const platformIcons = {
    linkedin: FaLinkedin,
    github: FaGithub,
    twitter: FaTwitter,
    facebook: FaFacebook,
    instagram: FaInstagram,
    youtube: FaYoutube,
    website: FaGlobe,
};

const platformOptions = [
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'GitHub', label: 'GitHub' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Website', label: 'Website' },
    { value: 'Other', label: 'Other' },
];

export default function ProfilePage() {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    // UI States
    const [isEditing, setIsEditing] = useState(false);
    const [showSocialForm, setShowSocialForm] = useState(false);
    const [editingSocialId, setEditingSocialId] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    // Location States
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedSubDistrict, setSelectedSubDistrict] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');

    // API Queries
    const { data: meData, isLoading, error, refetch } = useGetMeQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [uploadImage] = useUploadProfileImageMutation();
    const [deleteImage] = useDeleteProfileImageMutation();
    const [createSocialLink] = useCreateSocialLinkMutation();
    const [updateSocialLink] = useUpdateSocialLinkMutation();
    const [deleteSocialLink] = useDeleteSocialLinkMutation();
    const [setPrimarySocialLink] = useSetPrimarySocialLinkMutation();
    const [reorderSocialLinks] = useReorderSocialLinksMutation();

    // Location API hooks
    const { data: statesData } = useGetStatesByCountryQuery(1);
    const { data: districtsData, isLoading: isDistrictLoading } = useGetDistrictsByStateQuery(selectedState, {
        skip: !selectedState
    });
    const { data: subDistrictsData, isLoading: isSubDistrictLoading } = useGetSubDistrictsByDistrictQuery(selectedDistrict, {
        skip: !selectedDistrict
    });
    const { data: villagesData, isLoading: isVillageLoading } = useGetVillagesBySubDistrictQuery({
        sub_district_id: selectedSubDistrict,
        limit: 1000
    }, {
        skip: !selectedSubDistrict
    });

    const profile = meData?.data;
    const socialLinks = profile?.social_links || [];

    // Transform location data
    const states = statesData?.data || [];
    const districts = districtsData?.data || [];
    const subDistricts = subDistrictsData?.data || [];
    const villages = villagesData?.data?.results || [];

    const stateOptions = states.map(state => ({ value: state.id, label: state.name }));
    const districtOptions = districts.map(district => ({ value: district.id, label: district.name }));
    const subDistrictOptions = subDistricts.map(sd => ({ value: sd.id, label: sd.name }));
    const villageOptions = villages.map(village => ({ value: village.id, label: village.name }));

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues: {
            first_name: '',
            last_name: '',
            phone_number: '',
            headline: '',
            bio: '',
            full_address: '',
        }
    });

    const {
        register: registerSocial,
        handleSubmit: handleSocialSubmit,
        reset: resetSocial,
        setValue: setSocialValue,
        formState: { errors: socialErrors },
    } = useForm({
        defaultValues: {
            platform_name: '',
            url: '',
        }
    });

    // Populate form with profile data
    useEffect(() => {
        if (profile) {
            reset({
                first_name: profile.user?.first_name || '',
                last_name: profile.user?.last_name || '',
                phone_number: profile.phone_number || '',
                headline: profile.headline || '',
                bio: profile.bio || '',
                full_address: profile.full_address || '',
            });
            setSelectedState(profile.state || '');
            setSelectedDistrict(profile.district || '');
            setSelectedSubDistrict(profile.sub_district || '');
            setSelectedVillage(profile.village || '');
        }
    }, [profile, reset]);

    // Reset location when state changes
    const handleStateChange = (value) => {
        setSelectedState(value);
        setSelectedDistrict('');
        setSelectedSubDistrict('');
        setSelectedVillage('');
        setValue('district', '');
        setValue('sub_district', '');
        setValue('village', '');
    };

    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);
        setSelectedSubDistrict('');
        setSelectedVillage('');
        setValue('sub_district', '');
        setValue('village', '');
    };

    const handleSubDistrictChange = (value) => {
        setSelectedSubDistrict(value);
        setSelectedVillage('');
        setValue('village', '');
    };

    // Profile Update
    const handleProfileUpdate = async (data) => {
        try {
            const payload = {
                ...data,
                state: selectedState || null,
                district: selectedDistrict || null,
                sub_district: selectedSubDistrict || null,
                village: selectedVillage || null,
            };

            await updateProfile(payload).unwrap();
            showSnackbar('Profile updated successfully', 'success', 5000);
            setIsEditing(false);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors) {
                const firstError = Object.values(backendErrors).flat()[0];
                showSnackbar(firstError || 'Failed to update profile', 'error', 5000);
            } else {
                showSnackbar('Failed to update profile. Please try again.', 'error', 5000);
            }
        }
    };

    // Image Upload
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            showSnackbar('Please upload a valid image file (JPEG, PNG, WebP, or GIF)', 'error', 5000);
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showSnackbar('Image size should be less than 5MB', 'error', 5000);
            return;
        }

        setImageLoading(true);
        try {
            const formData = new FormData();
            formData.append('profile_image', file);
            await uploadImage(formData).unwrap();
            showSnackbar('Profile image updated successfully', 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors) {
                showSnackbar(backendErrors.image?.[0] || 'Failed to upload image', 'error', 5000);
            } else {
                showSnackbar('Failed to upload image. Please try again.', 'error', 5000);
            }
        } finally {
            setImageLoading(false);
            // Reset file input
            e.target.value = '';
        }
    };

    // Image Delete
    const handleImageDelete = async () => {
        const ok = await confirm({
            title: 'Delete Profile Image',
            message: 'Are you sure you want to delete your profile image? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        });

        if (!ok) return;

        try {
            await deleteImage().unwrap();
            showSnackbar('Profile image deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar('Failed to delete profile image', 'error', 5000);
            }
        }
    };

    // Social Link Create
    const handleSocialLinkCreate = async (data) => {
        try {
            await createSocialLink(data).unwrap();
            showSnackbar('Social link added successfully', 'success', 5000);
            resetSocial();
            setShowSocialForm(false);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors) {
                const firstError = Object.values(backendErrors).flat()[0];
                showSnackbar(firstError || 'Failed to add social link', 'error', 5000);
            } else {
                showSnackbar('Failed to add social link', 'error', 5000);
            }
        }
    };

    // Social Link Update
    const handleSocialLinkUpdate = async (data) => {
        try {
            await updateSocialLink({ usersociallink_id: editingSocialId, data }).unwrap();
            showSnackbar('Social link updated successfully', 'success', 5000);
            resetSocial();
            setEditingSocialId(null);
            setShowSocialForm(false);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors) {
                const firstError = Object.values(backendErrors).flat()[0];
                showSnackbar(firstError || 'Failed to update social link', 'error', 5000);
            } else {
                showSnackbar('Failed to update social link', 'error', 5000);
            }
        }
    };

    // Social Link Delete
    const handleSocialLinkDelete = async (id, platformName) => {
        const ok = await confirm({
            title: 'Delete Social Link',
            message: `Are you sure you want to delete the "${platformName}" link?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        });

        if (!ok) return;

        try {
            await deleteSocialLink(id).unwrap();
            showSnackbar('Social link deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar('Failed to delete social link', 'error', 5000);
            }
        }
    };

    // Set Primary Social Link
    const handleSetPrimary = async (id) => {
        try {
            await setPrimarySocialLink(id).unwrap();
            showSnackbar('Primary social link updated', 'success', 5000);
            refetch();
        } catch (error) {
            showSnackbar('Failed to set primary social link', 'error', 5000);
        }
    };

    // Reorder Social Links
    const handleMoveUp = async (index) => {
        if (index === 0) return;
        const newLinks = [...socialLinks];
        [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
        
        try {
            await reorderSocialLinks({ 
                ordered_ids: newLinks.map(link => link.usersociallink_id) 
            }).unwrap();
            refetch();
        } catch (error) {
            showSnackbar('Failed to reorder social links', 'error', 5000);
        }
    };

    const handleMoveDown = async (index) => {
        if (index === socialLinks.length - 1) return;
        const newLinks = [...socialLinks];
        [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
        
        try {
            await reorderSocialLinks({ 
                ordered_ids: newLinks.map(link => link.usersociallink_id) 
            }).unwrap();
            refetch();
        } catch (error) {
            showSnackbar('Failed to reorder social links', 'error', 5000);
        }
    };

    // Edit Social Link
    const editSocialLink = (link) => {
        setSocialValue('platform_name', link.platform_name);
        setSocialValue('url', link.url);
        setEditingSocialId(link.usersociallink_id);
        setShowSocialForm(true);
    };

    // Cancel Social Form
    const cancelSocialForm = () => {
        resetSocial();
        setEditingSocialId(null);
        setShowSocialForm(false);
    };

    // Get Platform Icon
    const getPlatformIcon = (platformName) => {
        const key = platformName?.toLowerCase();
        const Icon = platformIcons[key] || FiLink;
        return <Icon />;
    };

    // Loading State
    if (isLoading) return <Loader text="Loading profile..." />;
    
    // Error State
    if (error) {
        return (
            <ErrorState 
                message={error?.data?.message || "Failed to load profile"} 
                onRetry={refetch} 
                retryMsg="Retry" 
            />
        );
    }
    
    // Empty State
    if (!profile) {
        return (
            <ErrorState 
                message="Profile not found" 
                onRetry={refetch} 
                retryMsg="Retry" 
            />
        );
    }

    return (
        <PageLayout
            heroTitle="My Profile"
            heroDescription="Manage your personal information and social links"
            showHero={true}
        >
            <div className={styles.container}>
                {/* Profile Header with Image */}
                <div className={styles.profileHeader}>
                    <div className={styles.imageSection}>
                        <div className={styles.imageWrapper}>
                            {profile.profile_image_url ? (
                                <img 
                                    src={profile.profile_image_url} 
                                    alt={profile.user?.full_name}
                                    className={styles.profileImage}
                                />
                            ) : (
                                <div className={styles.imagePlaceholder}>
                                    {profile.user?.first_name?.charAt(0)}
                                    {profile.user?.last_name?.charAt(0)}
                                </div>
                            )}
                            {imageLoading && (
                                <div className={styles.imageLoadingOverlay}>
                                    <Loader text="" />
                                </div>
                            )}
                        </div>
                        <div className={styles.imageActions}>
                            <label className={styles.uploadButton}>
                                <FiCamera />
                                <span>Change Photo</span>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleImageUpload}
                                    hidden
                                />
                            </label>
                            {profile.profile_image_url && (
                                <button 
                                    className={styles.deleteButton}
                                    onClick={handleImageDelete}
                                >
                                    <FiTrash2 />
                                    <span>Remove</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.userName}>{profile.user?.full_name}</h1>
                        <p className={styles.userEmail}>{profile.user?.email}</p>
                        <span className={styles.userRole}>{profile.user?.role}</span>
                        {profile.headline && (
                            <p className={styles.userHeadline}>{profile.headline}</p>
                        )}
                    </div>
                </div>

                {/* Profile Details Form */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Personal Information</h2>
                        <Button
                            variant={isEditing ? 'outline' : 'primary'}
                            size="sm"
                            onClick={() => {
                                if (isEditing) {
                                    reset();
                                    setSelectedState(profile.state || '');
                                    setSelectedDistrict(profile.district || '');
                                    setSelectedSubDistrict(profile.sub_district || '');
                                    setSelectedVillage(profile.village || '');
                                }
                                setIsEditing(!isEditing);
                            }}
                            icon={isEditing ? <FiX /> : <FiEdit3 />}
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit(handleProfileUpdate)}>
                        <div className={styles.formGrid}>
                            <SimpleInput
                                label="First Name"
                                name="first_name"
                                register={register}
                                error={errors.first_name}
                                disabled={!isEditing}
                                placeholder="Enter first name"
                            />
                            <SimpleInput
                                label="Last Name"
                                name="last_name"
                                register={register}
                                error={errors.last_name}
                                disabled={!isEditing}
                                placeholder="Enter last name"
                            />
                            <SimpleInput
                                label="Phone Number"
                                name="phone_number"
                                register={register}
                                error={errors.phone_number}
                                disabled={!isEditing}
                                placeholder="Enter phone number"
                            />
                            <SimpleInput
                                label="Headline"
                                name="headline"
                                register={register}
                                error={errors.headline}
                                disabled={!isEditing}
                                placeholder="e.g., Full Stack Developer"
                            />
                        </div>

                        <SimpleTextarea
                            label="Bio"
                            name="bio"
                            register={register}
                            error={errors.bio}
                            disabled={!isEditing}
                            placeholder="Tell us about yourself..."
                            rows={4}
                        />

                        <SimpleInput
                            label="Full Address"
                            name="full_address"
                            register={register}
                            error={errors.full_address}
                            disabled={!isEditing}
                            placeholder="Enter your full address"
                        />

                        {/* Location Selects */}
                        <div className={styles.formGrid}>
                            <SimpleSelect
                                label="State"
                                name="state"
                                value={selectedState}
                                onChange={(e) => handleStateChange(e.target.value)}
                                options={stateOptions}
                                disabled={!isEditing}
                                placeholder="Select State"
                            />
                            <SimpleSelect
                                label="District"
                                name="district"
                                value={selectedDistrict}
                                onChange={(e) => handleDistrictChange(e.target.value)}
                                options={districtOptions}
                                disabled={!isEditing || !selectedState || isDistrictLoading}
                                placeholder="Select District"
                            />
                            <SimpleSelect
                                label="Sub District"
                                name="sub_district"
                                value={selectedSubDistrict}
                                onChange={(e) => handleSubDistrictChange(e.target.value)}
                                options={subDistrictOptions}
                                disabled={!isEditing || !selectedDistrict || isSubDistrictLoading}
                                placeholder="Select Sub District"
                            />
                            <SimpleSelect
                                label="Village"
                                name="village"
                                value={selectedVillage}
                                onChange={(e) => setSelectedVillage(e.target.value)}
                                options={villageOptions}
                                disabled={!isEditing || !selectedSubDistrict || isVillageLoading}
                                placeholder="Select Village"
                            />
                        </div>

                        {isEditing && (
                            <div className={styles.formActions}>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    isLoading={isUpdating}
                                    loadingText="Saving..."
                                    disabled={!isDirty && !selectedState !== profile.state}
                                >
                                    <FiSave /> Save Changes
                                </Button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Social Links Section */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Social Links</h2>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                                if (showSocialForm) {
                                    cancelSocialForm();
                                } else {
                                    setShowSocialForm(true);
                                }
                            }}
                            icon={showSocialForm ? <FiX /> : <FiPlus />}
                        >
                            {showSocialForm ? 'Cancel' : 'Add Link'}
                        </Button>
                    </div>

                    {/* Social Link Form */}
                    {showSocialForm && (
                        <form 
                            onSubmit={handleSocialSubmit(
                                editingSocialId ? handleSocialLinkUpdate : handleSocialLinkCreate
                            )}
                            className={styles.socialForm}
                        >
                            <div className={styles.socialFormGrid}>
                                <SimpleSelect
                                    label="Platform"
                                    name="platform_name"
                                    value={registerSocial('platform_name').value || ''}
                                    onChange={(e) => setSocialValue('platform_name', e.target.value)}
                                    options={platformOptions}
                                    error={socialErrors.platform_name}
                                    placeholder="Select Platform"
                                />
                                <SimpleInput
                                    label="URL"
                                    name="url"
                                    register={registerSocial}
                                    error={socialErrors.url}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className={styles.socialFormActions}>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    onClick={cancelSocialForm}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    size="sm"
                                >
                                    {editingSocialId ? 'Update Link' : 'Add Link'}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Social Links List */}
                    <div className={styles.socialLinksList}>
                        {socialLinks.length === 0 ? (
                            <div className={styles.emptySocial}>
                                <FiLink className={styles.emptyIcon} />
                                <p>No social links added yet</p>
                            </div>
                        ) : (
                            socialLinks.map((link, index) => (
                                <div key={link.usersociallink_id} className={styles.socialLinkItem}>
                                    <div className={styles.socialLinkOrder}>
                                        <button 
                                            className={styles.orderButton}
                                            onClick={() => handleMoveUp(index)}
                                            disabled={index === 0}
                                            title="Move up"
                                        >
                                            <FiArrowUp size={12} />
                                        </button>
                                        <span className={styles.orderNumber}>{index + 1}</span>
                                        <button 
                                            className={styles.orderButton}
                                            onClick={() => handleMoveDown(index)}
                                            disabled={index === socialLinks.length - 1}
                                            title="Move down"
                                        >
                                            <FiArrowDown size={12} />
                                        </button>
                                    </div>
                                    
                                    <div className={styles.socialLinkIcon}>
                                        {getPlatformIcon(link.platform_name)}
                                    </div>
                                    
                                    <div className={styles.socialLinkInfo}>
                                        <h4 className={styles.socialLinkName}>
                                            {link.platform_name}
                                            {link.is_primary && (
                                                <FiStar className={styles.primaryStar} title="Primary link" />
                                            )}
                                        </h4>
                                        <a 
                                            href={link.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={styles.socialLinkUrl}
                                        >
                                            {link.url}
                                        </a>
                                    </div>
                                    
                                    <div className={styles.socialLinkActions}>
                                        {!link.is_primary && (
                                            <button
                                                className={styles.actionButton}
                                                onClick={() => handleSetPrimary(link.usersociallink_id)}
                                                title="Set as primary"
                                            >
                                                <FiStar />
                                            </button>
                                        )}
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => editSocialLink(link)}
                                            title="Edit"
                                        >
                                            <FiEdit3 />
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.deleteAction}`}
                                            onClick={() => handleSocialLinkDelete(link.usersociallink_id, link.platform_name)}
                                            title="Delete"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}