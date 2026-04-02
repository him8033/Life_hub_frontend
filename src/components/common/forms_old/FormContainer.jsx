'use client';

import formStyles from '@/styles/forms/FormElements.module.css';

export function FormContainer({ children, onSubmit, className = '', ...props }) {
    return (
        <form onSubmit={onSubmit} className={`${formStyles.formContainer} ${className}`} {...props}>
            {children}
        </form>
    );
}

export function FormRow({ children, className = '', ...props }) {
    return (
        <div className={`${formStyles.formRow} ${className}`} {...props}>
            {children}
        </div>
    );
}