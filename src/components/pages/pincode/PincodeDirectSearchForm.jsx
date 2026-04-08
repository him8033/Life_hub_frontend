'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import SimpleInput from '@/components/common/forms/SimpleInput';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';
import { FiSearch, FiX } from 'react-icons/fi';
import styles from '@/styles/pages/pincode/PincodeSearchForm.module.css';

const PincodeDirectSearchForm = ({ onSubmit, onClear, isLoading }) => {
    const [pincode, setPincode] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    const methods = useForm({
        defaultValues: {
            pincode: '',
        }
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pincode.trim()) {
            onSubmit(pincode);
        }
    };

    const handleClear = () => {
        setPincode('');
        methods.reset();
        if (onClear) {
            onClear();
        }
    };

    const handlePincodeChange = (value) => {
        const sanitizedValue = value.replace(/\D/g, '').slice(0, 6);
        setPincode(sanitizedValue);
        methods.setValue('pincode', sanitizedValue);
    };

    const isPincodeValid = pincode.trim().length === 6;

    if (!isMounted) {
        return null;
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit} className={styles.directForm}>
                <div className={styles.directFormGrid}>
                    <SimpleInput
                        name="pincode"
                        label="Enter Pincode"
                        type="text"
                        value={pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        placeholder="Enter 6-digit pincode (e.g., 229121)"
                        disabled={isLoading}
                        description="Enter exact 6-digit pincode to search"
                        maxLength={6}
                        required
                        size="md"
                    />
                </div>

                {/* Form Actions */}
                <ButtonGroup align="end" className={styles.formActions}>
                    <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={handleClear}
                        icon={<FiX />}
                        iconPosition="left"
                    >
                        Clear
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={!isPincodeValid || isLoading}
                        isLoading={isLoading}
                        loadingText="Searching..."
                        icon={<FiSearch />}
                        iconPosition="left"
                    >
                        Find Location
                    </Button>
                </ButtonGroup>
            </form>
        </FormProvider>
    );
};

export default PincodeDirectSearchForm;