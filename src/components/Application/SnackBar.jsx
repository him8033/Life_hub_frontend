'use client';

import { useEffect, useState } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import styles from '@/styles/common/Snackbar.module.css';

const Snackbar = ({
    open,
    message,
    type = "info",  // success | warning | info | error
    onClose,
    duration = 5000,
    position = "top-center" // top-center | top-left | top-right | bottom-center | bottom-left | bottom-right
}) => {

    const totalSeconds = duration / 1000;
    const [timeLeft, setTimeLeft] = useState(totalSeconds);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (!open) return;

        setIsExiting(false);
        setTimeLeft(totalSeconds);

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0.1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 0.1;
            });
        }, 100);

        const timer = setTimeout(handleClose, duration);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [open, duration, message]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
            setIsExiting(false);
        }, 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FiCheckCircle className={styles.icon} />;
            case 'error':
            case 'warning':
                return <FiAlertCircle className={styles.icon} />;
            default:
                return <FiInfo className={styles.icon} />;
        }
    };

    if (!open && !isExiting) return null;

    const progressWidth = (timeLeft / totalSeconds) * 100;

    return (
        <div
            className={`
                ${styles.snackbarWrapper} 
                ${styles[position]} 
                ${isExiting ? styles.exiting : ''}
            `}
        >
            <div className={`${styles.snackbar} ${styles[type]}`}>

                <div className={styles.leftStrip}></div>

                <div className={styles.snackbarContent}>
                    <div className={styles.iconWrapper}>
                        {getIcon()}
                    </div>

                    <div className={styles.messageContainer}>
                        <div className={styles.message}>{message}</div>
                        <div className={styles.timeRemaining}>
                            Closing in {Math.ceil(timeLeft)}s...
                        </div>
                    </div>

                    <button onClick={handleClose} className={styles.closeButton}>
                        <FiX />
                    </button>
                </div>

                <div className={styles.bottomProgress}>
                    <div
                        className={styles.progressBar}
                        style={{ width: `${progressWidth}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Snackbar;