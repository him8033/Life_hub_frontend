'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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

// Shadcn Components
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
import styles from '@/styles/travelspots/steps/Step2LocationAddress.module.css';
import { FaBuilding } from 'react-icons/fa';

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
    const form = useForm({
        resolver: zodResolver(locationSchema),
        defaultValues: getDefaultValues(),
    });

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = form;

    // Watch location fields
    const countryId = watch('country');
    const stateId = watch('state');
    const districtId = watch('district');
    const subDistrictId = watch('sub_district');
    const villageId = watch('village');
    const fullAddress = watch('full_address');

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

    // Handle location selection
    const handleCountryChange = (value) => {
        const actualValue = value === 'select' ? '' : value;
        setValue('country', actualValue);
        // if (!actualValue) {
        setValue('state', '');
        setValue('district', '');
        setValue('sub_district', '');
        setValue('village', '');
        setValue('pincode', '');
        // }
    };

    const handleStateChange = (value) => {
        const actualValue = value === 'select' ? '' : value;
        setValue('state', actualValue);
        // if (!actualValue) {
        setValue('district', '');
        setValue('sub_district', '');
        setValue('village', '');
        setValue('pincode', '');
        // }
    };

    const handleDistrictChange = (value) => {
        const actualValue = value === 'select' ? '' : value;
        setValue('district', actualValue);
        // if (!actualValue) {
        setValue('sub_district', '');
        setValue('village', '');
        setValue('pincode', '');
        // }
    };

    const handleSubDistrictChange = (value) => {
        const actualValue = value === 'select' ? '' : value;
        setValue('sub_district', actualValue);
        // if (!actualValue) {
        setValue('village', '');
        setValue('pincode', '');
        // }
    };

    const handleVillageChange = (value) => {
        const actualValue = value === 'select' ? '' : value;
        setValue('village', actualValue);
        // if (!actualValue) {
        setValue('pincode', '');
        // }
    };

    const handlePincodeChange = (value) => {
        setValue('pincode', value === 'select' ? '' : value);
    };

    // Handle backend errors
    useEffect(() => {
        if (onBackendError) {
            onBackendError(form);
        }
    }, [form, onBackendError]);

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
            {/* Step Header */}
            <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>Location & Address</h1>
                <p className={styles.stepDescription}>
                    Select the precise location of your travel spot. This helps travelers find and navigate to your spot.
                </p>
            </div>

            {/* Form */}
            <Form {...form}>
                <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
                    {/* Location Hierarchy Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <FiMapPin className={styles.icon} />
                                Location Hierarchy
                            </h2>
                            <p className={styles.sectionSubtitle}>
                                Select location from country down to village level
                            </p>
                        </div>

                        <div className={styles.hierarchyContainer}>
                            {/* Row 1: Country & State */}
                            <div className={styles.hierarchyRow}>
                                <div className={styles.formGroup}>
                                    <FormField
                                        control={control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className={styles.labelContainer}>
                                                    <FormLabel className={styles.label}>
                                                        <FiGlobe className={styles.icon} />
                                                        Country
                                                        <span className={styles.required}>*</span>
                                                    </FormLabel>
                                                    <FormDescription className={styles.fieldInfo}>
                                                        Select the country
                                                    </FormDescription>
                                                </div>
                                                <Select
                                                    value={field.value || "select"}
                                                    onValueChange={handleCountryChange}
                                                    disabled={isSubmitting || isLoadingCountries}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className={styles.select}>
                                                            <SelectValue placeholder="Select Country" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="select" className={styles.selectItem}>Select Country</SelectItem>
                                                        {countries.map(country => (
                                                            <SelectItem key={country.id} value={String(country.id)} className={styles.selectItem}>
                                                                {country.name} ({country.iso_code})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className={styles.errorMessage} />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <FormField
                                        control={control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className={styles.labelContainer}>
                                                    <FormLabel className={styles.label}>
                                                        <FiFlag className={styles.icon} />
                                                        State/UT
                                                        <span className={styles.required}>*</span>
                                                    </FormLabel>
                                                    <FormDescription className={styles.fieldInfo}>
                                                        Select state or union territory
                                                    </FormDescription>
                                                </div>
                                                <Select
                                                    value={field.value || "select"}
                                                    onValueChange={handleStateChange}
                                                    disabled={!countryId || countryId === 'select' || isSubmitting || isLoadingStates}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className={styles.select}>
                                                            <SelectValue
                                                                placeholder={!countryId || countryId === 'select' ? "Select country first" : "Select State"}
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="select" className={styles.selectItem}>Select State</SelectItem>
                                                        {states.map(state => (
                                                            <SelectItem key={state.id} value={String(state.id)} className={styles.selectItem}>
                                                                {state.name} ({state.type})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className={styles.errorMessage} />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Row 2: District & Sub-District */}
                            <div className={styles.hierarchyRow}>
                                <div className={styles.formGroup}>
                                    <FormField
                                        control={control}
                                        name="district"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className={styles.labelContainer}>
                                                    <FormLabel className={styles.label}>
                                                        <FaBuilding className={styles.icon} />
                                                        District
                                                        <span className={styles.required}>*</span>
                                                    </FormLabel>
                                                    <FormDescription className={styles.fieldInfo}>
                                                        Administrative district
                                                    </FormDescription>
                                                </div>
                                                <Select
                                                    value={field.value || "select"}
                                                    onValueChange={handleDistrictChange}
                                                    disabled={!stateId || stateId === 'select' || isSubmitting || isLoadingDistricts}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className={styles.select}>
                                                            <SelectValue
                                                                placeholder={!stateId || stateId === 'select' ? "Select state first" : "Select District"}
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="select" className={styles.selectItem}>Select District</SelectItem>
                                                        {districts.map(district => (
                                                            <SelectItem key={district.id} value={String(district.id)} className={styles.selectItem}>
                                                                {district.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className={styles.errorMessage} />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <FormField
                                        control={control}
                                        name="sub_district"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className={styles.labelContainer}>
                                                    <FormLabel className={styles.label}>
                                                        <FiMap className={styles.icon} />
                                                        City/Sub-District
                                                        <span className={styles.required}>*</span>
                                                    </FormLabel>
                                                    <FormDescription className={styles.fieldInfo}>
                                                        City or sub-district area
                                                    </FormDescription>
                                                </div>
                                                <Select
                                                    value={field.value || "select"}
                                                    onValueChange={handleSubDistrictChange}
                                                    disabled={!districtId || districtId === 'select' || isSubmitting || isLoadingSubDistricts}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className={styles.select}>
                                                            <SelectValue
                                                                placeholder={!districtId || districtId === 'select' ? "Select district first" : "Select Sub-District"}
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="select" className={styles.selectItem}>Select Sub-District</SelectItem>
                                                        {subDistricts.map(subDistrict => (
                                                            <SelectItem key={subDistrict.id} value={String(subDistrict.id)} className={styles.selectItem}>
                                                                {subDistrict.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className={styles.errorMessage} />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Row 3: Village & Pincode */}
                            <div className={styles.hierarchyRow}>
                                <div className={styles.formGroup}>
                                    <FormField
                                        control={control}
                                        name="village"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className={styles.labelContainer}>
                                                    <FormLabel className={styles.label}>
                                                        <FiHome className={styles.icon} />
                                                        Village/Town
                                                        <span className={styles.required}>*</span>
                                                    </FormLabel>
                                                    <FormDescription className={styles.fieldInfo}>
                                                        Specific village or town
                                                    </FormDescription>
                                                </div>
                                                <Select
                                                    value={field.value || "select"}
                                                    onValueChange={handleVillageChange}
                                                    disabled={!subDistrictId || subDistrictId === 'select' || isSubmitting || isLoadingVillages}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className={styles.select}>
                                                            <SelectValue
                                                                placeholder={!subDistrictId || subDistrictId === 'select' ? "Select sub-district first" : "Select Village"}
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="select" className={styles.selectItem}>Select Village</SelectItem>
                                                        {villages.map(village => (
                                                            <SelectItem key={village.id} value={String(village.id)} className={styles.selectItem}>
                                                                {village.name} ({village.category})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className={styles.errorMessage} />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <FormField
                                        control={control}
                                        name="pincode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className={styles.labelContainer}>
                                                    <FormLabel className={styles.label}>
                                                        Pincode
                                                    </FormLabel>
                                                    <FormDescription className={styles.fieldInfo}>
                                                        Postal code (optional)
                                                    </FormDescription>
                                                </div>
                                                <Select
                                                    value={field.value || "select"}
                                                    onValueChange={handlePincodeChange}
                                                    disabled={!villageId || villageId === 'select' || isSubmitting || isLoadingPincodes}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className={styles.select}>
                                                            <SelectValue
                                                                placeholder={!villageId || villageId === 'select' ? "Select village first" : "Select Pincode"}
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="select" className={styles.selectItem}>Not specified</SelectItem>
                                                        {pincodes.map(pincode => (
                                                            <SelectItem key={pincode.id} value={String(pincode.id)} className={styles.selectItem}>
                                                                {pincode.pincode}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className={styles.errorMessage} />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coordinates Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <FiNavigation className={styles.icon} />
                                Geographical Coordinates
                            </h2>
                            <p className={styles.sectionSubtitle}>
                                Optional: Enter exact coordinates for precise mapping
                            </p>
                        </div>

                        <div className={styles.coordinatesSection}>
                            <div className={styles.coordinatesRow}>
                                <FormField
                                    control={control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem className={styles.coordinateField}>
                                            <FormLabel className={styles.coordinateLabel}>
                                                Latitude
                                            </FormLabel>
                                            <div style={{ position: 'relative' }}>
                                                <span className={styles.coordinateIcon}>N</span>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        placeholder="e.g., 28.5535"
                                                        {...field}
                                                        className={styles.coordinateInput}
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage className={styles.errorMessage} />
                                            <div className={styles.coordinateHelper}>
                                                <FiMap className={styles.icon} />
                                                Northern coordinate (e.g., 28.5535 for Delhi)
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="longitude"
                                    render={({ field }) => (
                                        <FormItem className={styles.coordinateField}>
                                            <FormLabel className={styles.coordinateLabel}>
                                                Longitude
                                            </FormLabel>
                                            <div style={{ position: 'relative' }}>
                                                <span className={styles.coordinateIcon}>E</span>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        placeholder="e.g., 77.2588"
                                                        {...field}
                                                        className={styles.coordinateInput}
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage className={styles.errorMessage} />
                                            <div className={styles.coordinateHelper}>
                                                <FiMap className={styles.icon} />
                                                Eastern coordinate (e.g., 77.2588 for Delhi)
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Full Address Section */}
                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <FiMapPin className={styles.icon} />
                                Complete Address
                            </h2>
                            <p className={styles.sectionSubtitle}>
                                Full address that will be displayed to travelers
                            </p>
                        </div>

                        <div className={styles.fullAddressSection}>
                            <FormField
                                control={control}
                                name="full_address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter complete address with landmarks"
                                                {...field}
                                                className={styles.textarea}
                                                rows={3}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <div className={styles.charCount}>
                                            {fullAddress?.length || 0} characters
                                        </div>
                                        <FormMessage className={styles.errorMessage} />
                                        <p className={styles.helperText}>
                                            Include landmarks, nearby references, and any additional location details
                                        </p>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={handleBack}
                            className={styles.backButton}
                            disabled={isSubmitting}
                        >
                            <FiChevronLeft className={styles.icon} />
                            Back to Basic Info
                        </button>

                        <button
                            type="submit"
                            className={styles.nextButton}
                            disabled={isSubmitting || !isValid}
                        >
                            {isSubmitting ? (
                                <span className={styles.loadingButton}>
                                    <div className={styles.spinner}></div>
                                    Saving...
                                </span>
                            ) : (
                                <>
                                    Save & Continue
                                    <FiChevronRight className={styles.icon} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Step2LocationAddress;