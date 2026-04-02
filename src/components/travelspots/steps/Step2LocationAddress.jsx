'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FiMapPin,
    FiNavigation,
    FiChevronRight,
    FiChevronLeft,
    FiGlobe,
    FiMap,
    FiHome,
    FiFlag
} from 'react-icons/fi';

// Custom Form Components
import FormSelect from '@/components/common/forms/FormSelect';
import FormInput from '@/components/common/forms/FormInput';
import FormTextarea from '@/components/common/forms/FormTextarea';
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';

// API Hooks
import {
    useGetCountriesQuery,
    useGetStatesByCountryQuery,
    useGetDistrictsByStateQuery,
    useGetSubDistrictsByDistrictQuery,
    useGetVillagesBySubDistrictQuery,
    useSearchPincodesQuery
} from '@/services/api/locationsApi';

// Validation Schema
import { locationSchema } from '@/lib/validations/travelspotSchema';

// Styles
import styles from '@/styles/travelspots/steps/CommonStepStyles.module.css';
import { FaBuilding } from 'react-icons/fa';
import StepHeader from './StepHeader';
import StepActions from './StepActions';
import FormSection from './FormSection';

const Step2LocationAddress = ({
    initialData = {},
    onSubmit,
    onBackendError,
    isSubmitting = false,
    onCancel,
    onBack,
    mode = 'create'
}) => {
    // Get default values
    const getDefaultValues = () => {
        if (mode === 'edit' && initialData) {
            return {
                country: initialData.country ? String(initialData.country) : '',
                state: initialData.state ? String(initialData.state) : '',
                district: initialData.district ? String(initialData.district) : '',
                sub_district: initialData.sub_district ? String(initialData.sub_district) : '',
                village: initialData.village ? String(initialData.village) : '',
                pincode: initialData.pincode ? String(initialData.pincode) : '',
                full_address: initialData.full_address || '',
                latitude: initialData.latitude ? String(initialData.latitude) : '',
                longitude: initialData.longitude ? String(initialData.longitude) : '',
            };
        }

        return {
            country: '',
            state: '',
            district: '',
            sub_district: '',
            village: '',
            pincode: '',
            full_address: '',
            latitude: '',
            longitude: '',
        };
    };

    // Initialize form
    const methods = useForm({
        resolver: zodResolver(locationSchema),
        defaultValues: getDefaultValues(),
    });

    const {
        setValue,
        watch,
        reset,
        formState: { errors, isValid },
    } = methods;

    // Watch location fields
    const countryId = watch('country');
    const stateId = watch('state');
    const districtId = watch('district');
    const subDistrictId = watch('sub_district');
    const villageId = watch('village');
    const fullAddress = watch('full_address');

    console.log(countryId);
    console.log(stateId);

    // Fetch location data
    const { data: countriesData, isLoading: isLoadingCountries } = useGetCountriesQuery();
    const { data: statesData, isLoading: isLoadingStates } = useGetStatesByCountryQuery(countryId, {
        skip: !countryId || countryId === 'select'
    });
    const { data: districtsData, isLoading: isLoadingDistricts } = useGetDistrictsByStateQuery(stateId, {
        skip: !stateId || stateId === 'select'
    });
    const { data: subDistrictsData, isLoading: isLoadingSubDistricts } = useGetSubDistrictsByDistrictQuery(districtId, {
        skip: !districtId || districtId === 'select'
    });
    const { data: villagesData, isLoading: isLoadingVillages } = useGetVillagesBySubDistrictQuery({
        sub_district_id: subDistrictId,
        limit: 1000
    }, {
        skip: !subDistrictId || subDistrictId === 'select'
    });
    const { data: pincodesData, isLoading: isLoadingPincodes } = useSearchPincodesQuery({
        village_id: villageId
    }, {
        skip: !villageId || villageId === 'select'
    });

    const countries = countriesData?.data || [];
    const states = statesData?.data || [];
    const districts = districtsData?.data || [];
    const subDistricts = subDistrictsData?.data || [];
    const villages = villagesData?.data?.results || [];
    const pincodes = pincodesData?.data || [];

    // Format options for selects
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

    const pincodeOptions = pincodes.map(pincode => ({
        value: String(pincode.id),
        label: pincode.pincode
    }));

    // Handle location selection
    const handleCountryChange = (value) => {
        setValue('country', value);
        setValue('state', '');
        setValue('district', '');
        setValue('sub_district', '');
        setValue('village', '');
        setValue('pincode', '');
    };

    const handleStateChange = (value) => {
        setValue('state', value);
        setValue('district', '');
        setValue('sub_district', '');
        setValue('village', '');
        setValue('pincode', '');
    };

    const handleDistrictChange = (value) => {
        setValue('district', value);
        setValue('sub_district', '');
        setValue('village', '');
        setValue('pincode', '');
    };

    const handleSubDistrictChange = (value) => {
        setValue('sub_district', value);
        setValue('village', '');
        setValue('pincode', '');
    };

    const handleVillageChange = (value) => {
        setValue('village', value);
        setValue('pincode', '');
    };

    // Handle backend errors
    useEffect(() => {
        if (onBackendError) {
            onBackendError(methods);
        }
    }, [methods, onBackendError]);

    // Handle form submission
    const handleFormSubmit = (data) => {
        onSubmit(data);
    };

    // Handle back button
    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    return (
        <div className={styles.stepContainer}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleFormSubmit)} className={styles.form}>
                    {/* Step Header */}
                    <StepHeader
                        title="Location & Address"
                        description="Select the precise location of your travel spot. This helps travelers find and navigate to your spot."
                    />

                    {/* Location Hierarchy Section */}
                    <FormSection
                        icon={FiMapPin}
                        title="Location Hierarchy"
                        subtitle="Select location from country down to village level"
                    >
                        <div className={styles.formGrid}>
                            {/* Country */}
                            <div className={styles.formGroup}>
                                <FormSelect
                                    name="country"
                                    label="Country"
                                    options={countryOptions}
                                    placeholder="Select Country"
                                    required
                                    size="md"
                                    disabled={isSubmitting || isLoadingCountries}
                                    onChange={handleCountryChange}
                                    description="Select the country where the spot is located"
                                />
                            </div>

                            {/* State */}
                            <div className={styles.formGroup}>
                                <FormSelect
                                    name="state"
                                    label="State/UT"
                                    options={stateOptions}
                                    placeholder={!countryId ? "Select country first" : "Select State"}
                                    required
                                    size="md"
                                    disabled={!countryId || isSubmitting || isLoadingStates}
                                    onChange={handleStateChange}
                                    description="Select state or union territory"
                                />
                            </div>

                            {/* District */}
                            <div className={styles.formGroup}>
                                <FormSelect
                                    name="district"
                                    label="District"
                                    options={districtOptions}
                                    placeholder={!stateId ? "Select state first" : "Select District"}
                                    size="md"
                                    disabled={!stateId || isSubmitting || isLoadingDistricts}
                                    onChange={handleDistrictChange}
                                    description="Administrative district"
                                />
                            </div>

                            {/* Sub-District */}
                            <div className={styles.formGroup}>
                                <FormSelect
                                    name="sub_district"
                                    label="City/Sub-District"
                                    options={subDistrictOptions}
                                    placeholder={!districtId ? "Select district first" : "Select Sub-District"}
                                    size="md"
                                    disabled={!districtId || isSubmitting || isLoadingSubDistricts}
                                    onChange={handleSubDistrictChange}
                                    description="City or sub-district area"
                                />
                            </div>

                            {/* Village */}
                            <div className={styles.formGroup}>
                                <FormSelect
                                    name="village"
                                    label="Village/Town"
                                    options={villageOptions}
                                    placeholder={!subDistrictId ? "Select sub-district first" : "Select Village"}
                                    size="md"
                                    disabled={!subDistrictId || isSubmitting || isLoadingVillages}
                                    onChange={handleVillageChange}
                                    description="Specific village or town"
                                />
                            </div>

                            {/* Pincode */}
                            <div className={styles.formGroup}>
                                <FormSelect
                                    name="pincode"
                                    label="Pincode"
                                    options={pincodeOptions}
                                    placeholder={!villageId ? "Select village first" : "Select Pincode"}
                                    size="md"
                                    disabled={!villageId || isSubmitting || isLoadingPincodes}
                                    onChange={(value) => setValue('pincode', value)}
                                    description="Postal code (optional)"
                                    emptyOption={true}
                                    emptyOptionLabel="Not specified"
                                />
                            </div>
                        </div>
                    </FormSection>

                    {/* Coordinates Section */}
                    <FormSection
                        icon={FiNavigation}
                        title="Geographical Coordinates"
                        subtitle="Optional: Enter exact coordinates for precise mapping"
                    >
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <FormInput
                                    name="latitude"
                                    label="Latitude"
                                    type="number"
                                    step="any"
                                    placeholder="e.g., 28.5535"
                                    size="md"
                                    disabled={isSubmitting}
                                    description="Northern coordinate (e.g., 28.5535 for Delhi)"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <FormInput
                                    name="longitude"
                                    label="Longitude"
                                    type="number"
                                    step="any"
                                    placeholder="e.g., 77.2588"
                                    size="md"
                                    disabled={isSubmitting}
                                    description="Eastern coordinate (e.g., 77.2588 for Delhi)"
                                />
                            </div>
                        </div>
                    </FormSection>

                    {/* Full Address Section */}
                    <FormSection
                        icon={FiMapPin}
                        title="Complete Address"
                        subtitle="Full address that will be displayed to travelers"
                    >
                        <div className={styles.formGroup}>
                            <FormTextarea
                                name="full_address"
                                label="Full Address"
                                placeholder="Enter complete address with landmarks"
                                rows={3}
                                maxLength={500}
                                size="md"
                                disabled={isSubmitting}
                                description="Include landmarks, nearby references, and any additional location details"
                            />

                            {/* Character Count */}
                            <div className={styles.charCount}>
                                <span className={styles.charCountText}>
                                    {fullAddress?.length || 0}/500 characters
                                </span>
                            </div>
                        </div>
                    </FormSection>

                    {/* Form Actions */}
                    <StepActions
                        onBack={handleBack}
                        onNext={methods.handleSubmit(handleFormSubmit)}
                        isSubmitting={isSubmitting}
                        isValid={isValid}
                        backText="Back to Basic Info"
                        nextText="Save & Continue"
                        showBack={true}
                        showCancel={false}
                        showNext={true}
                        align="between"
                    />
                </form>
            </FormProvider>
        </div>
    );
};

export default Step2LocationAddress;