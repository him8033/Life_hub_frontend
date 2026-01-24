import { useState, useEffect } from 'react';
import {
    useGetCountriesQuery,
    useGetStatesByCountryQuery,
    useGetDistrictsByStateQuery,
    useGetSubDistrictsByDistrictQuery,
    useGetVillagesBySubDistrictQuery,
} from '@/services/api/locationsApi';
import formStyles from '@/styles/pages/pincode/Form.module.css';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const PincodeSearchForm = ({ onSubmit, onClear }) => {
    const [formData, setFormData] = useState({
        country: '',
        state: '',
        district: '',
        subDistrict: '',
        village: '',
    });

    // RTK Query Hooks
    const { data: countryData, isLoading: isCountryLoading } = useGetCountriesQuery();
    const { data: statesData, isLoading: isStateLoading } = useGetStatesByCountryQuery(formData.country, {
        skip: !formData.country
    });
    const { data: districtsData, isLoading: isDistrictLoading } = useGetDistrictsByStateQuery(formData.state, {
        skip: !formData.state
    });
    const { data: subDistrictsData, isLoading: isSubDistrictLoading } = useGetSubDistrictsByDistrictQuery(formData.district, {
        skip: !formData.district
    });
    const { data: villagesData, isLoading: isVillageLoading } = useGetVillagesBySubDistrictQuery({
        sub_district_id: formData.subDistrict,
        limit: 1000
    }, {
        skip: !formData.subDistrict
    });

    const countries = countryData?.data || [];
    const states = statesData?.data || [];
    const districts = districtsData?.data || [];
    const subDistricts = subDistrictsData?.data || [];
    const villages = villagesData?.data?.results || [];

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // Reset dependent fields when parent changes
            if (field === 'country') {
                newData.state = '';
                newData.district = '';
                newData.subDistrict = '';
                newData.village = '';
            } else if (field === 'state') {
                newData.district = '';
                newData.subDistrict = '';
                newData.village = '';
            } else if (field === 'district') {
                newData.subDistrict = '';
                newData.village = '';
            } else if (field === 'subDistrict') {
                newData.village = '';
            }

            return newData;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.village) {
            onSubmit(formData);
        }
    };

    const handleClear = () => {
        setFormData({
            country: '',
            state: '',
            district: '',
            subDistrict: '',
            village: '',
        });
        onClear();
    };

    const isLoading = isCountryLoading || isStateLoading || isDistrictLoading || isSubDistrictLoading || isVillageLoading;

    return (
        <form onSubmit={handleSubmit} className={formStyles.formContainer}>
            <div className={formStyles.formRow}>
                {/* Country Select */}
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>
                        Country
                        <span className={formStyles.required}>*</span>
                    </label>
                    <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className={formStyles.formSelect}
                        required
                        disabled={isCountryLoading}
                    >
                        <option value="">Select Country</option>
                        {countries.map(country => (
                            <option key={country.id} value={country.id}>
                                {country.name} ({country.iso_code})
                            </option>
                        ))}
                    </select>
                </div>

                {/* State Select */}
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>
                        State
                        <span className={formStyles.required}>*</span>
                    </label>
                    <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={formStyles.formSelect}
                        required
                        disabled={!formData.country || isStateLoading}
                    >
                        <option value="">Select State</option>
                        {states.map(state => (
                            <option key={state.id} value={state.id}>
                                {state.name} ({state.type})
                            </option>
                        ))}
                    </select>
                </div>

                {/* District Select */}
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>
                        District
                        <span className={formStyles.required}>*</span>
                    </label>
                    <select
                        value={formData.district}
                        onChange={(e) => handleInputChange('district', e.target.value)}
                        className={formStyles.formSelect}
                        required
                        disabled={!formData.state || isDistrictLoading}
                    >
                        <option value="">Select District</option>
                        {districts.map(district => (
                            <option key={district.id} value={district.id}>
                                {district.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sub-District Select */}
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>
                        City/Sub-District
                        <span className={formStyles.required}>*</span>
                    </label>
                    <select
                        value={formData.subDistrict}
                        onChange={(e) => handleInputChange('subDistrict', e.target.value)}
                        className={formStyles.formSelect}
                        required
                        disabled={!formData.district || isSubDistrictLoading}
                    >
                        <option value="">Select City/Sub-District</option>
                        {subDistricts.map(subDistrict => (
                            <option key={subDistrict.id} value={subDistrict.id}>
                                {subDistrict.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Village Select */}
                <div className={formStyles.formGroup}>
                    <label className={formStyles.formLabel}>
                        Village/Town
                        <span className={formStyles.required}>*</span>
                    </label>
                    <select
                        value={formData.village}
                        onChange={(e) => {
                            handleInputChange('village', e.target.value);
                        }}
                        className={formStyles.formSelect}
                        required
                        disabled={!formData.subDistrict || isVillageLoading}
                    >
                        <option value="">Select Village/Town</option>
                        {villages.map(village => (
                            <option key={village.id} value={village.id}>
                                {village.name} ({village.category})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={formStyles.actionButtons}>
                <button
                    type="submit"
                    className={formStyles.primaryButton}
                    disabled={!formData.village || isLoading}
                >
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    {isLoading ? 'Loading...' : 'Search Pincodes'}
                </button>
                <button type="button" onClick={handleClear} className={formStyles.secondaryButton}>
                    Clear All
                </button>
            </div>
        </form>
    );
};

export default PincodeSearchForm;