import { useState, useEffect } from 'react';
import { useSearchPincodesQuery } from '@/services/api/locationsApi';
import resultsStyles from '@/styles/pages/pincode/Results.module.css';
import { HomeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const ReverseSearchResults = ({ pincode }) => {
    const { data: pincodesData, isLoading, error } = useSearchPincodesQuery({
        search: pincode
    }, {
        skip: !pincode
    });

    const pincodes = pincodesData?.data || [];

    if (isLoading) {
        return (
            <div className={resultsStyles.resultsSection}>
                <div className="text-center py-8">
                    <div className={resultsStyles.loadingSpinner}></div>
                    <p>Searching for pincode {pincode}...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={resultsStyles.resultsSection}>
                <div className="text-center py-8 text-red-600">
                    Error searching pincode: {error.message}
                </div>
            </div>
        );
    }

    if (!pincode) {
        return null;
    }

    if (pincodes.length === 0) {
        return (
            <div className={resultsStyles.resultsSection}>
                <div className={resultsStyles.resultsHeader}>
                    <h3 className={resultsStyles.resultsTitle}>
                        <MapPinIcon className="h-6 w-6" />
                        Search Results for Pincode: {pincode}
                    </h3>
                </div>
                <div className={resultsStyles.noResults}>
                    <div className={resultsStyles.noResultsIcon}>🔍</div>
                    <p className={resultsStyles.noResultsTitle}>No Locations Found</p>
                    <p className={resultsStyles.noResultsText}>
                        No locations found for pincode {pincode}. Please check the pincode and try again.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={resultsStyles.resultsSection}>
            <div className={resultsStyles.resultsHeader}>
                <h3 className={resultsStyles.resultsTitle}>
                    <MapPinIcon className="h-6 w-6" />
                    Search Results for Pincode: {pincode}
                </h3>
                <span className={resultsStyles.resultsCount}>
                    {pincodes.length} {pincodes.length === 1 ? 'Location' : 'Locations'}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className={resultsStyles.resultsTable}>
                    <thead className={resultsStyles.tableHeader}>
                        <tr>
                            <th>Area</th>
                            <th>Pin Code</th>
                            <th>Sub District</th>
                            <th>District</th>
                            <th>State</th>
                            <th>Country</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody className={resultsStyles.tableBody}>
                        {pincodes.map((item, index) => (
                            <tr key={index}>
                                <td>{item.village_name || 'N/A'}</td>
                                <td className={resultsStyles.pincodeCell}>{item.pincode}</td>
                                <td>{item.sub_district_name || 'N/A'}</td>
                                <td>{item.district_name || 'N/A'}</td>
                                <td>{item.state_name || 'N/A'}</td>
                                <td>{item.country_name || 'N/A'}</td>
                                <td>
                                    <span className={`${resultsStyles.categoryBadge} ${item.village_category === 'Urban'
                                            ? resultsStyles.urban
                                            : resultsStyles.rural
                                        }`}>
                                        {item.village_category || 'N/A'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className={resultsStyles.villageCard}>
                <h4 className={resultsStyles.resultsTitle}>Search Summary</h4>
                <div className={resultsStyles.villageGrid}>
                    <div className={resultsStyles.villageDetail}>
                        <span className={resultsStyles.detailLabel}>Pincode</span>
                        <span className={resultsStyles.detailValue}>{pincode}</span>
                    </div>
                    <div className={resultsStyles.villageDetail}>
                        <span className={resultsStyles.detailLabel}>Total Locations</span>
                        <span className={resultsStyles.detailValue}>{pincodes.length}</span>
                    </div>
                    <div className={resultsStyles.villageDetail}>
                        <span className={resultsStyles.detailLabel}>States Covered</span>
                        <span className={resultsStyles.detailValue}>
                            {[...new Set(pincodes.map(p => p.state_name))].filter(Boolean).join(', ')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReverseSearchResults;