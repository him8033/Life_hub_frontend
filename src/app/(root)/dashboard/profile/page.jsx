'use client';

import { useGetMeQuery } from '@/services/api/authApi';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import SocialLinksSection from '@/components/profile/SocialLinksSection';
import styles from '@/styles/dashboard/profile/Profile.module.css';

export default function ProfilePage() {
    const { data: meData, isLoading, error, refetch } = useGetMeQuery();
    const profile = meData?.data;
    console.log(profile);

    if (isLoading) return <Loader text="Loading profile..." />;

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load profile"}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

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
        <div className={styles.container}>
            <ProfileHeader profile={profile} refetch={refetch} />
            <ProfileForm profile={profile} refetch={refetch} />
            <SocialLinksSection profile={profile} refetch={refetch} />
        </div>
    );
}