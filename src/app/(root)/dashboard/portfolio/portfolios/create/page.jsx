'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreatePortfolioChoice from '@/components/portfolio/CreatePortfolioChoice';
import PortfolioSettingsForm from '@/components/portfolio/PortfolioSettingsForm';
import { useCreatePortfolioProjectMutation } from '@/services/api/portfolioApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import styles from '@/styles/common/CommonForm.module.css';
import { FiGlobe } from 'react-icons/fi';

export default function CreatePortfolioPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [createPortfolio, { isLoading }] = useCreatePortfolioProjectMutation();
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
        router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.LIST);
    };

    const handleSubmit = async (formData) => {
        if (isLoading) return;
        try {
            // If mode is 'fresh', don't send snapshot_id
            const payload = { ...formData };
            if (mode === 'fresh') {
                delete payload.snapshot_id;
            }

            const result = await createPortfolio(payload).unwrap();
            showSnackbar(result.message || 'Portfolio created successfully!', 'success', 5000);

            const portfolioId = result.data?.portfolio_id;
            if (portfolioId) {
                router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.VIEW(portfolioId));
            } else {
                router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.LIST);
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
                <CreatePortfolioChoice
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
                                <FiGlobe className={styles.pageIcon} />
                                <h1 className={styles.pageTitle}>
                                    {mode === 'fresh' ? 'Create New Portfolio' : 'Create Portfolio from Existing Data'}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className={styles.pageContent}>
                        <PortfolioSettingsForm
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