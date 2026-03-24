'use client';

import { FormProvider } from 'react-hook-form';
import styles from '@/styles/auth/AuthForm.module.css';

export default function AuthForm({
    methods,
    onSubmit,
    children,
    className = '',
}) {
    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className={`${styles.authForm} ${className}`}
            >
                {children}
            </form>
        </FormProvider>
    );
}