// src/components/portfolio/sections/common/SectionForm.jsx

'use client';

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from '@/styles/portfolio/sections/common/SectionForm.module.css';

export const SectionForm = ({
    schema,
    defaultValues = {},
    onSubmit,
    onCancel,
    isSaving = false,
    children,
    formId,
}) => {
    const methods = useForm({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const { reset, handleSubmit } = methods;

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <FormProvider {...methods}>
            <form id={formId} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formContainer}>
                    {children}
                </div>
            </form>
        </FormProvider>
    );
};