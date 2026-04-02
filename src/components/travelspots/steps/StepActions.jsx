'use client';

import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import styles from '@/styles/travelspots/steps/StepActions.module.css';

const StepActions = ({
    onBack,
    onNext,
    onCancel,
    isSubmitting,
    isValid = true,
    backText = 'Back',
    nextText = 'Save & Continue',
    cancelText = 'Cancel',
    showCancel = true,
    showBack = true,
    showNext = true,
    align = 'between', // 'between', 'end', 'start'
    nextVariant = 'primary',
    backVariant = 'outline',
    cancelVariant = 'outline',
}) => {
    const backButton = showBack && (
        <Button
            type="button"
            variant={backVariant}
            size="md"
            onClick={onBack}
            disabled={isSubmitting}
            icon={<FiChevronLeft />}
            iconPosition="left"
        >
            {backText}
        </Button>
    );

    const nextButton = showNext && (
        <Button
            type={onNext ? "button" : "submit"}
            variant={nextVariant}
            size="md"
            isLoading={isSubmitting}
            loadingText="Saving..."
            disabled={isSubmitting || !isValid}
            onClick={onNext}
            icon={<FiChevronRight />}
            iconPosition="right"
        >
            {nextText}
        </Button>
    );

    const cancelButton = showCancel && (
        <Button
            type="button"
            variant={cancelVariant}
            size="md"
            onClick={onCancel}
            disabled={isSubmitting}
            icon={<FiX />}
            iconPosition="left"
        >
            {cancelText}
        </Button>
    );

    return (
        <ButtonGroup align={align} className={styles.stepActions}>
            {backButton}
            <div className={styles.rightActions}>
                {cancelButton}
                {nextButton}
            </div>
        </ButtonGroup>
    );
};

export default StepActions;