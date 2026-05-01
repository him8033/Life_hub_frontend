'use client';

import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import ProfileImageUpload from '@/components/common/ProfileImageUpload';
import {
    useUploadProfileImageMutation,
    useDeleteProfileImageMutation
} from '@/services/api/authApi';
import { extractErrorMessage } from '@/utils/errorHandler';
import styles from '@/styles/dashboard/profile/ProfileHeader.module.css';
import { useState } from 'react';

const ProfileHeader = ({ profile, refetch }) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [imageLoading, setImageLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploadImage] = useUploadProfileImageMutation();
    const [deleteImage] = useDeleteProfileImageMutation();

    const handleImageSelect = async (file, previewUrl) => {
        if (!file) {
            if (previewUrl) showSnackbar(previewUrl, 'error', 5000);
            return;
        }

        setImageLoading(true);
        setPreviewUrl(previewUrl);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await uploadImage(formData).unwrap();
            showSnackbar(res.message || 'Profile image updated successfully', 'success', 5000);
            // Clear preview after successful upload
            setPreviewUrl('');
            // Refetch to get updated profile data with new image
            refetch();
        } catch (error) {
            const errorMsg = extractErrorMessage(error, 'Failed to upload image');
            showSnackbar(errorMsg, 'error', 5000);
            // Clear preview on error to show the last valid image
            setPreviewUrl('');
            // Refetch to restore the last valid state
            refetch();
        } finally {
            setImageLoading(false);
        }
    };

    const handleImageRemove = () => {
        setPreviewUrl('');
    };

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
            const res = await deleteImage().unwrap();
            showSnackbar(res.message || 'Profile image deleted successfully', 'success', 5000);
            setPreviewUrl('');
            refetch();
        } catch (error) {
            const errorMsg = extractErrorMessage(error, 'Failed to delete profile image');
            showSnackbar(errorMsg, 'error', 5000);
            // Refetch to restore the last valid state in case of error
            refetch();
        }
    };

    return (
        <div className={styles.profileHeader}>
            <ProfileImageUpload
                imageUrl={profile?.profile_image_url}
                firstName={profile?.user?.first_name}
                lastName={profile?.user?.last_name}
                imageSize={160}
                onImageSelect={handleImageSelect}
                onRemove={handleImageRemove}
                onImageDelete={handleImageDelete}
                loading={imageLoading}
                previewUrl={previewUrl}
                showDelete={!!profile?.profile_image_url}
                label="Upload Photo"
                changeLabel="Change"
                removeLabel="Remove Photo"
            />

            <div className={styles.headerInfo}>
                <h1 className={styles.userName}>{profile?.user?.full_name}</h1>
                <p className={styles.userEmail}>{profile?.user?.email}</p>
                <span className={styles.userRole}>{profile?.user?.role}</span>
                {profile?.headline && (
                    <p className={styles.userHeadline}>{profile?.headline}</p>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;