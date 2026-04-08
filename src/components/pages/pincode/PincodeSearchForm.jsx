'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
    useGetCountriesQuery,
    useGetStatesByCountryQuery,
    useGetDistrictsByStateQuery,
    useGetSubDistrictsByDistrictQuery,
    useGetVillagesBySubDistrictQuery,
} from '@/services/api/locationsApi';
import FormSelect from '@/components/common/forms/FormSelect';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';
import { FiSearch, FiX } from 'react-icons/fi';
import styles from '@/styles/pages/pincode/PincodeSearchForm.module.css';

const PincodeSearchForm = ({ onSubmit, onClear }) => {
    const [isMounted, setIsMounted] = useState(false);

    // Initialize react-hook-form
    const methods = useForm({
        defaultValues: {
            country: '',
            state: '',
            district: '',
            subDistrict: '',
            village: '',
        }
    });

    const { watch, setValue, getValues, reset } = methods;
    
    // Watch form values
    const countryId = watch('country');
    const stateId = watch('state');
    const districtId = watch('district');
    const subDistrictId = watch('subDistrict');
    const villageId = watch('village');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // RTK Query Hooks
    const { data: countryData, isLoading: isCountryLoading } = useGetCountriesQuery();
    const { data: statesData, isLoading: isStateLoading } = useGetStatesByCountryQuery(countryId, {
        skip: !countryId
    });
    const { data: districtsData, isLoading: isDistrictLoading } = useGetDistrictsByStateQuery(stateId, {
        skip: !stateId
    });
    const { data: subDistrictsData, isLoading: isSubDistrictLoading } = useGetSubDistrictsByDistrictQuery(districtId, {
        skip: !districtId
    });
    const { data: villagesData, isLoading: isVillageLoading } = useGetVillagesBySubDistrictQuery({
        sub_district_id: subDistrictId,
        limit: 1000
    }, {
        skip: !subDistrictId
    });

    const countries = countryData?.data || [];
    const states = statesData?.data || [];
    const districts = districtsData?.data || [];
    const subDistricts = subDistrictsData?.data || [];
    const villages = villagesData?.data?.results || [];

    // Handle input changes - reset dependent fields
    const handleCountryChange = (value) => {
        setValue('country', value);
        setValue('state', '');
        setValue('district', '');
        setValue('subDistrict', '');
        setValue('village', '');
    };

    const handleStateChange = (value) => {
        setValue('state', value);
        setValue('district', '');
        setValue('subDistrict', '');
        setValue('village', '');
    };

    const handleDistrictChange = (value) => {
        setValue('district', value);
        setValue('subDistrict', '');
        setValue('village', '');
    };

    const handleSubDistrictChange = (value) => {
        setValue('subDistrict', value);
        setValue('village', '');
    };

    const handleVillageChange = (value) => {
        setValue('village', value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (villageId) {
            onSubmit({ village: villageId });
        }
    };

    const handleClear = () => {
        reset();
        if (onClear) {
            onClear();
        }
    };

    const isLoading = isCountryLoading || isStateLoading || isDistrictLoading || isSubDistrictLoading || isVillageLoading;

    // Transform data for select options
    const countryOptions = countries.map(country => ({
        value: String(country.id),
        label: `${country.name} (${country.iso_code})`
    }));

    const stateOptions = states.map(state => ({
        value: String(state.id),
        label: `${state.name} (${state.type})`
    }));

    const districtOptions = districts.map(district => ({
        value: String(district.id),
        label: district.name
    }));

    const subDistrictOptions = subDistricts.map(subDistrict => ({
        value: String(subDistrict.id),
        label: subDistrict.name
    }));

    const villageOptions = villages.map(village => ({
        value: String(village.id),
        label: `${village.name} (${village.category})`
    }));

    if (!isMounted) {
        return null;
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                    {/* Country Select */}
                    <FormSelect
                        name="country"
                        label="Country"
                        options={countryOptions}
                        disabled={isCountryLoading}
                        placeholder="Select Country"
                        required
                        size="md"
                        description="Select the country"
                        onChange={handleCountryChange}
                    />

                    {/* State Select */}
                    <FormSelect
                        name="state"
                        label="State"
                        options={stateOptions}
                        disabled={!countryId || isStateLoading}
                        placeholder={!countryId ? "Select country first" : "Select State"}
                        required
                        size="md"
                        description="Select state or union territory"
                        onChange={handleStateChange}
                    />

                    {/* District Select */}
                    <FormSelect
                        name="district"
                        label="District"
                        options={districtOptions}
                        disabled={!stateId || isDistrictLoading}
                        placeholder={!stateId ? "Select state first" : "Select District"}
                        required
                        size="md"
                        description="Administrative district"
                        onChange={handleDistrictChange}
                    />

                    {/* Sub-District Select */}
                    <FormSelect
                        name="subDistrict"
                        label="City/Sub-District"
                        options={subDistrictOptions}
                        disabled={!districtId || isSubDistrictLoading}
                        placeholder={!districtId ? "Select district first" : "Select City/Sub-District"}
                        required
                        size="md"
                        description="City or sub-district area"
                        onChange={handleSubDistrictChange}
                    />

                    {/* Village Select */}
                    <FormSelect
                        name="village"
                        label="Village/Town"
                        options={villageOptions}
                        disabled={!subDistrictId || isVillageLoading}
                        placeholder={!subDistrictId ? "Select sub-district first" : "Select Village/Town"}
                        required
                        size="md"
                        description="Specific village or town"
                        onChange={handleVillageChange}
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
                        Clear All
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={!villageId || isLoading}
                        isLoading={isLoading}
                        loadingText="Loading..."
                        icon={<FiSearch />}
                        iconPosition="left"
                    >
                        Search Pincodes
                    </Button>
                </ButtonGroup>
            </form>
        </FormProvider>
    );
};

export default PincodeSearchForm;