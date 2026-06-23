'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateResumeChoice from '@/components/portfolio/CreateResumeChoice';
import ResumeSettingsForm from '@/components/portfolio/ResumeSettingsForm';
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
    let formRef = null;

    const [step, setStep] = useState('choice');
    const [mode, setMode] = useState('fresh'); // 'fresh' | 'existing'

    const handleStartFresh = () => {
        setMode('fresh');
        setStep('settings');
    };

    const handleUseExisting = () => {
        setMode('existing');
        setStep('settings');
    };

    const handleCancel = () => {
        router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.LIST);
    };

    const handleSubmit = async (formData) => {
        if (isLoading) return;
        try {
            // If mode is 'fresh', don't send snapshot_id
            const payload = { ...formData };
            if (mode === 'fresh') {
                delete payload.snapshot_id;
            }

            const result = await createResume(payload).unwrap();
            showSnackbar(result.message || 'Resume created successfully!', 'success', 5000);

            const resumeId = result.data?.resume_id;
            if (resumeId) {
                router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.VIEW(resumeId));
            } else {
                router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.LIST);
            }
        } catch (error) {
            const backendErrors = error?.data?.errors;

            if (backendErrors?.field_errors && formRef) {
                Object.entries(backendErrors.field_errors).forEach(
                    ([field, messages]) => {
                        formRef.setError(field, {
                            type: 'server',
                            message: messages[0],
                        });
                    }
                );
            }

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            }
        }
    };

    return (
        <>
            {step === 'choice' && (
                <CreateResumeChoice
                    onStartFresh={handleStartFresh}
                    onUseExisting={handleUseExisting}
                    onCancel={handleCancel}
                />
            )}

            {step === 'settings' && (
                <div className={styles.pageContainer}>
                    <div className={styles.pageHeader}>
                        <div className={styles.headerContent}>
                            <div className={styles.pageTitleWrapper}>
                                <FiFileText className={styles.pageIcon} />
                                <h1 className={styles.pageTitle}>
                                    {mode === 'fresh' ? 'Create New Resume' : 'Create Resume from Existing Data'}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className={styles.pageContent}>
                        <ResumeSettingsForm
                            mode={mode}
                            onSubmit={handleSubmit}
                            onBackendError={(form) => (formRef = form)}
                            isSubmitting={isLoading}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            )}
        </>
    );
}