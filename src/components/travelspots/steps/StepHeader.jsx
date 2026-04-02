'use client';

import styles from '@/styles/travelspots/steps/StepHeader.module.css';

const StepHeader = ({ title, description }) => {
    return (
        <div className={styles.stepHeader}>
            <h1 className={styles.stepTitle}>{title}</h1>
            <p className={styles.stepDescription}>{description}</p>
        </div>
    );
};

export default StepHeader;