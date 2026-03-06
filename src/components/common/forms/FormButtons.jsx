'use client';

import formStyles from '@/styles/forms/FormElements.module.css';

export function PrimaryButton({ children, onClick, type = 'button', disabled = false, icon, className = '', ...props }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${formStyles.primaryButton} ${className}`}
            {...props}
        >
            {icon && <span className={formStyles.buttonIcon}>{icon}</span>}
            {children}
        </button>
    );
}

export function SecondaryButton({ children, onClick, type = 'button', disabled = false, icon, className = '', ...props }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${formStyles.secondaryButton} ${className}`}
            {...props}
        >
            {icon && <span className={formStyles.buttonIcon}>{icon}</span>}
            {children}
        </button>
    );
}

export function ActionButtons({ children, className = '', ...props }) {
    return (
        <div className={`${formStyles.actionButtons} ${className}`} {...props}>
            {children}
        </div>
    );
}