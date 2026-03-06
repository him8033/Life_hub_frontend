'use client';

import { useState } from 'react';
import { FormContainer, FormRow } from '@/components/common/forms/FormContainer';
import FormInput from '@/components/common/forms/FormInput';
import { PrimaryButton, SecondaryButton, ActionButtons } from '@/components/common/forms/FormButtons';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

const PincodeDirectSearchForm = ({ onSubmit, onClear, isLoading }) => {
    const [pincode, setPincode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pincode.trim()) {
            onSubmit(pincode);
        }
    };

    const handleClear = () => {
        setPincode('');
        onClear();
    };

    const handlePincodeChange = (e) => {
        // Only allow digits and limit to 6 characters
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setPincode(value);
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormRow>
                <FormInput
                    label="Enter Pincode"
                    required
                    type="text"
                    value={pincode}
                    onChange={handlePincodeChange}
                    placeholder="Enter 6-digit pincode (e.g., 229121)"
                    disabled={isLoading}
                    hint="Enter exact 6-digit pincode to search"
                    maxLength="6"
                />
            </FormRow>

            <ActionButtons>
                <PrimaryButton
                    type="submit"
                    disabled={pincode.trim().length !== 6 || isLoading}
                    icon={<DocumentMagnifyingGlassIcon />}
                >
                    {isLoading ? 'Searching...' : 'Find Location'}
                </PrimaryButton>
                <SecondaryButton type="button" onClick={handleClear}>
                    Clear
                </SecondaryButton>
            </ActionButtons>
        </FormContainer>
    );
};

export default PincodeDirectSearchForm;