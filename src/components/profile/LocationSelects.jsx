'use client';

import { useFormContext } from 'react-hook-form';
import FormSelect from '@/components/common/forms/FormSelect';
import FormInput from '@/components/common/forms/FormInput';
import { FiMapPin } from 'react-icons/fi';
import styles from '@/styles/dashboard/profile/LocationSelects.module.css';
import {
    useGetCountriesQuery,
    useGetStatesByCountryQuery,
    useGetDistrictsByStateQuery,
    useGetSubDistrictsByDistrictQuery,
    useGetVillagesBySubDistrictQuery,
    useSearchPincodesQuery,
} from '@/services/api/locationsApi';

const LocationSelects = ({ isEditing }) => {
    const { watch, setValue } = useFormContext();

    const country = watch('country');
    const state = watch('state');
    const district = watch('district');
    const sub_district = watch('sub_district');
    const village = watch('village');
    const pincode = watch('pincode');
    const fullAddress = watch('full_address');

    // Location API hooks
    const { data: countriesData, isLoading: isLoadingCountries } = useGetCountriesQuery();
    const { data: statesData, isLoading: isLoadingStates } = useGetStatesByCountryQuery(country, {
        skip: !country,
    });
    const { data: districtsData, isLoading: isLoadingDistricts } = useGetDistrictsByStateQuery(state, {
        skip: !state,
    });
    const { data: subDistrictsData, isLoading: isLoadingSubDistricts } = useGetSubDistrictsByDistrictQuery(district, {
        skip: !district,
    });
    const { data: villagesData, isLoading: isLoadingVillages } = useGetVillagesBySubDistrictQuery(
        { sub_district_id: sub_district, limit: 1000 },
        { skip: !sub_district }
    );
    const { data: pincodesData, isLoading: isLoadingPincodes } = useSearchPincodesQuery(
        { village_id: village },
        { skip: !village }
    );

    const countries = countriesData?.data || [];
    const states = statesData?.data || [];
    const districts = districtsData?.data || [];
    const subDistricts = subDistrictsData?.data || [];
    const villages = villagesData?.data?.results || [];
    const pincodes = pincodesData?.data || [];

    const makeOptions = (data, formatter) => data.map(formatter);

    // Reset dependent fields when parent changes
    const handleCountryChange = (value) => {
        setValue('state', '');
        setValue('district', '');
        setValue('sub_district', '');
        setValue('village', '');
        setValue('pincode', '');
    };

    const handleStateChange = (value) => {
        setValue('district', '');
        setValue('sub_district', '');
        setValue('village', '');
        setValue('pincode', '');
    };

    const handleDistrictChange = (value) => {
        setValue('sub_district', '');
        setValue('village', '');
        setValue('pincode', '');
    };

    const handleSubDistrictChange = (value) => {
        setValue('village', '');
        setValue('pincode', '');
    };

    const handleVillageChange = (value) => {
        setValue('pincode', '');
    };

    return (
        <div className={styles.locationSection}>
            <div className={styles.locationSectionHeader}>
                <FiMapPin className={styles.locationIcon} />
                <span>Location & Address</span>
            </div>

            {/* Location Hierarchy */}
            <div className={styles.formGrid}>
                <FormSelect
                    name="country"
                    label="Country"
                    options={makeOptions(countries, (c) => ({
                        value: String(c.id),
                        label: `${c.name} (${c.iso_code})`,
                    }))}
                    disabled={!isEditing || isLoadingCountries}
                    placeholder="Select Country"
                    onChange={handleCountryChange}
                />
                <FormSelect
                    name="state"
                    label="State/UT"
                    options={makeOptions(states, (s) => ({
                        value: String(s.id),
                        label: s.name,
                    }))}
                    disabled={!isEditing || !country || isLoadingStates}
                    placeholder={!country ? 'Select country first' : 'Select State'}
                    onChange={handleStateChange}
                />
                <FormSelect
                    name="district"
                    label="District"
                    options={makeOptions(districts, (d) => ({
                        value: String(d.id),
                        label: d.name,
                    }))}
                    disabled={!isEditing || !state || isLoadingDistricts}
                    placeholder={!state ? 'Select state first' : 'Select District'}
                    onChange={handleDistrictChange}
                />
                <FormSelect
                    name="sub_district"
                    label="City/Sub-District"
                    options={makeOptions(subDistricts, (sd) => ({
                        value: String(sd.id),
                        label: sd.name,
                    }))}
                    disabled={!isEditing || !district || isLoadingSubDistricts}
                    placeholder={!district ? 'Select district first' : 'Select Sub-District'}
                    onChange={handleSubDistrictChange}
                />
                <FormSelect
                    name="village"
                    label="Village/Town"
                    options={makeOptions(villages, (v) => ({
                        value: String(v.id),
                        label: v.name,
                    }))}
                    disabled={!isEditing || !sub_district || isLoadingVillages}
                    placeholder={!sub_district ? 'Select sub-district first' : 'Select Village'}
                    onChange={handleVillageChange}
                />
                <FormSelect
                    name="pincode"
                    label="Pincode"
                    options={makeOptions(pincodes, (p) => ({
                        value: String(p.id),
                        label: p.pincode,
                    }))}
                    disabled={!isEditing || !village || isLoadingPincodes}
                    placeholder={!village ? 'Select village first' : 'Select Pincode'}
                    emptyOption={true}
                    emptyOptionLabel="Not specified"
                />
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Full Address */}
            <div className={styles.fullAddressSection}>
                <FormInput
                    name="full_address"
                    label="Complete Address"
                    disabled={!isEditing}
                    placeholder="Enter your complete address with landmarks and nearby references"
                    description="Include building name, street, landmarks, and any additional location details"
                />
                <div className={styles.charCount}>
                    <span className={`${styles.charCountText} ${fullAddress?.length > 500 ? styles.charCountError : ''}`}>
                        {fullAddress?.length || 0}/500 characters
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LocationSelects;