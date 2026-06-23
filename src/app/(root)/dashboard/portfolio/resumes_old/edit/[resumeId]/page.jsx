'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import ResumeForm from '@/components/portfolio/ResumeForm';
import { useGetResumeProjectQuery, useUpdateResumeProjectMutation } from '@/services/api/portfolioApi';
import styles from '@/styles/common/CommonForm.module.css';
import { FiFileText } from 'react-icons/fi';

export default function EditResumePage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const resumeId = params.resumeId;

    const { data, isLoading, error, refetch } = useGetResumeProjectQuery(resumeId, { skip: !resumeId });
    const [updateResume, { isLoading: isSubmitting }] = useUpdateResumeProjectMutation();
    const resume = data?.data;

    const handleSubmit = async (formData) => {
        try {
            await updateResume({ resumeId, data: formData }).unwrap();
            showSnackbar('Resume updated!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.LIST);
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to update'), 'error', 5000);
        }
    };

    if (isLoading) return <Loader text="Loading resume..." />;
    if (error?.status === 404) return <NotFoundState title="Resume Not Found" message="The resume doesn't exist." backLabel="Back to Resumes" backTo={ROUTES.DASHBOARD.PORTFOLIO.RESUME.LIST} fullPage />;
    if (error) return <ErrorState message={error?.data?.message || "Failed to load resume"} onRetry={refetch} retryMsg="Retry" />;
    if (!resume) return <NotFoundState title="Resume Not Found" message="The resume doesn't exist." backLabel="Back to Resumes" backTo={ROUTES.DASHBOARD.PORTFOLIO.RESUME.LIST} fullPage />;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FiFileText className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Edit Resume: {resume.title}</h1>
                    </div>
                </div>
            </div>
            <div className={styles.pageContent}>
                <ResumeForm initialData={resume} onSubmit={handleSubmit} isSubmitting={isSubmitting} mode="edit" />
            </div>
        </div>
    );
}