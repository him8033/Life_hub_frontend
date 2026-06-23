'use client';

import { useRouter } from 'next/navigation';
import ResumeForm from '@/components/portfolio/ResumeForm';
import { useCreateResumeProjectMutation } from '@/services/api/portfolioApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import styles from '@/styles/common/CommonForm.module.css';
import { FiFileText } from 'react-icons/fi';

export default function CreateResumePage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [createResume, { isLoading }] = useCreateResumeProjectMutation();

    const handleSubmit = async (formData) => {
        try {
            await createResume(formData).unwrap();
            showSnackbar('Resume created successfully!', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.LIST);
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to create resume'), 'error', 5000);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.pageTitleWrapper}>
                        <FiFileText className={styles.pageIcon} />
                        <h1 className={styles.pageTitle}>Create Resume</h1>
                    </div>
                </div>
            </div>
            <div className={styles.pageContent}>
                <ResumeForm onSubmit={handleSubmit} isSubmitting={isLoading} mode="create" />
            </div>
        </div>
    );
}