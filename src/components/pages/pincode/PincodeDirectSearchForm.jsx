import { useState } from 'react';
import formStyles from '@/styles/pages/pincode/Form.module.css';
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

    return (
        <form onSubmit={handleSubmit} className={formStyles.formContainer}>
            <div className={formStyles.formRow}>
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>
                        Enter Pincode
                        <span className={formStyles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        className={formStyles.formInput}
                        placeholder="Enter 6-digit pincode (e.g., 229121)"
                        maxLength="6"
                        required
                        disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Enter exact 6-digit pincode to search
                    </p>
                </div>
            </div>

            <div className={formStyles.actionButtons}>
                <button
                    type="submit"
                    className={formStyles.primaryButton}
                    disabled={pincode.trim().length !== 6 || isLoading}
                >
                    <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                    {isLoading ? 'Searching...' : 'Find Location'}
                </button>
                <button type="button" onClick={handleClear} className={formStyles.secondaryButton}>
                    Clear
                </button>
            </div>
        </form>
    );
};

export default PincodeDirectSearchForm;