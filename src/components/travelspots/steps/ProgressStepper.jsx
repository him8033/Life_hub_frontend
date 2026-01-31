'use client';

import { FiCheck } from 'react-icons/fi';
import styles from '@/styles/travelspots/steps/ProgressStepper.module.css';

const SimpleProgressBar = ({
    currentStep,
    steps,
    onStepClick,
    canNavigateToStep
}) => {
    // Determine step status
    const getStepStatus = (stepId) => {
        if (stepId < currentStep) return 'completed';
        if (stepId === currentStep) return 'current';
        return 'upcoming';
    };

    // Check if step is accessible
    const isStepAccessible = (stepId) => {
        if (!canNavigateToStep) return true;
        return canNavigateToStep(stepId);
    };

    return (
        <div className={styles.progressBarContainer}>
            <div className={styles.progressBar}>
                {steps.map((step, index) => {
                    const stepStatus = getStepStatus(step.id);
                    const isAccessible = isStepAccessible(step.id);
                    const isLastStep = index === steps.length - 1;

                    return (
                        <div key={step.id} className={styles.stepWrapper}>
                            <div className={styles.stepGroup}>
                                {/* Step circle */}
                                <button
                                    type="button"
                                    className={`${styles.stepCircle} ${styles[stepStatus]}`}
                                    onClick={() => isAccessible && onStepClick?.(step.id)}
                                    disabled={!isAccessible}
                                    title={`Step ${step.id}: ${step.title}`}
                                    aria-label={`Go to ${step.title}`}
                                >
                                    {stepStatus === 'completed' ? (
                                        <FiCheck className={styles.checkIcon} />
                                    ) : (
                                        <span className={styles.stepNumber}>{step.id}</span>
                                    )}
                                </button>

                                {/* Step label and description */}
                                <div className={styles.labelContainer}>
                                    <div className={`${styles.stepLabel} ${stepStatus === 'current' ? styles.currentLabel : ''}`}>
                                        {step.title}
                                    </div>
                                    {step.description && (
                                        <div className={`${styles.stepDescription} ${stepStatus === 'current' ? styles.currentDescription : ''}`}>
                                            {step.description}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Connector line (except for last step) */}
                            {!isLastStep && (
                                <div className={styles.connectorWrapper}>
                                    <div className={`${styles.connector} ${stepStatus === 'completed' ? styles.completedConnector : ''}`} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SimpleProgressBar;