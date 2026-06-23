'use client';

import { FiFileText, FiFolder } from 'react-icons/fi';
import styles from '@/styles/portfolio/resume/CreateResumeChoice.module.css';

export default function CreateResumeChoice({ onStartFresh, onUseExisting, onCancel }) {
    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Create New Resume</h2>
                    <p className={styles.modalSubtitle}>How would you like to start?</p>
                </div>

                <div className={styles.options}>
                    <button className={styles.optionCard} onClick={onStartFresh}>
                        <div className={styles.optionIcon}>
                            <FiFileText />
                        </div>
                        <div className={styles.optionContent}>
                            <h3 className={styles.optionTitle}>Start from Scratch</h3>
                            <p className={styles.optionDesc}>
                                Create a brand new resume with fresh data. Fill in your details step by step.
                            </p>
                        </div>
                        <span className={styles.optionArrow}>→</span>
                    </button>

                    <button className={styles.optionCard} onClick={onUseExisting}>
                        <div className={styles.optionIcon}>
                            <FiFolder />
                        </div>
                        <div className={styles.optionContent}>
                            <h3 className={styles.optionTitle}>Use Existing Profile Data</h3>
                            <p className={styles.optionDesc}>
                                Select a snapshot that already has your details like experience, education, and skills.
                            </p>
                        </div>
                        <span className={styles.optionArrow}>→</span>
                    </button>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}