'use client';

import { useState } from 'react';
import {
    useGetCountriesQuery,
    useGetStatesByCountryQuery,
    useGetDistrictsByStateQuery,
    useGetSubDistrictsByDistrictQuery,
    useGetVillagesBySubDistrictQuery,
} from '@/services/api/locationsApi';
import { FormContainer, FormRow } from '@/components/common/forms/FormContainer';
import FormSelect from '@/components/common/forms/FormSelect';
import { PrimaryButton, SecondaryButton, ActionButtons } from '@/components/common/forms/FormButtons';
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

    // Transform data for select options
    const countryOptions = countries.map(country => ({
        value: country.id,
        label: `${country.name} (${country.iso_code})`
    }));

    const stateOptions = states.map(state => ({
        value: state.id,
        label: `${state.name} (${state.type})`
    }));

    const districtOptions = districts.map(district => ({
        value: district.id,
        label: district.name
    }));

    const subDistrictOptions = subDistricts.map(subDistrict => ({
        value: subDistrict.id,
        label: subDistrict.name
    }));

    const villageOptions = villages.map(village => ({
        value: village.id,
        label: `${village.name} (${village.category})`
    }));

    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormRow>
                {/* Country Select */}
                <FormSelect
                    label="Country"
                    required
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    options={countryOptions}
                    disabled={isCountryLoading}
                    loading={isCountryLoading}
                    placeholder="Select Country"
                />

                {/* State Select */}
                <FormSelect
                    label="State"
                    required
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    options={stateOptions}
                    disabled={!formData.country || isStateLoading}
                    loading={isStateLoading}
                    placeholder="Select State"
                />

                {/* District Select */}
                <FormSelect
                    label="District"
                    required
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    options={districtOptions}
                    disabled={!formData.state || isDistrictLoading}
                    loading={isDistrictLoading}
                    placeholder="Select District"
                />

                {/* Sub-District Select */}
                <FormSelect
                    label="City/Sub-District"
                    required
                    value={formData.subDistrict}
                    onChange={(e) => handleInputChange('subDistrict', e.target.value)}
                    options={subDistrictOptions}
                    disabled={!formData.district || isSubDistrictLoading}
                    loading={isSubDistrictLoading}
                    placeholder="Select City/Sub-District"
                />

                {/* Village Select */}
                <FormSelect
                    label="Village/Town"
                    required
                    value={formData.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    options={villageOptions}
                    disabled={!formData.subDistrict || isVillageLoading}
                    loading={isVillageLoading}
                    placeholder="Select Village/Town"
                />
            </FormRow>

            <ActionButtons>
                <PrimaryButton
                    type="submit"
                    disabled={!formData.village || isLoading}
                    icon={<MagnifyingGlassIcon />}
                >
                    {isLoading ? 'Loading...' : 'Search Pincodes'}
                </PrimaryButton>
                <SecondaryButton type="button" onClick={handleClear}>
                    Clear All
                </SecondaryButton>
            </ActionButtons>
        </FormContainer>
    );
};

export default PincodeSearchForm;