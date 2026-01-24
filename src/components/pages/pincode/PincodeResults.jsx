import { useState, useEffect } from 'react';
import { useSearchPincodesQuery } from '@/services/api/locationsApi';
import resultsStyles from '@/styles/pages/pincode/Results.module.css';
import { TagIcon } from '@heroicons/react/24/outline';

const PincodeResults = ({ villageId }) => {
    const { data: pincodesData, isLoading, error } = useSearchPincodesQuery({
        village_id: villageId
    }, {
        skip: !villageId
    });

    const pincodes = pincodesData?.data || [];

    if (isLoading) {
        return (
            <div className={resultsStyles.resultsSection}>
                <div className="text-center py-8">
                    <div className={resultsStyles.loadingSpinner}></div>
                    <p>Loading pincodes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={resultsStyles.resultsSection}>
                <div className="text-center py-8 text-red-600">
                    Error loading pincodes: {error.message}
                </div>
            </div>
        );
    }

    if (!villageId) {
        return null;
    }

    if (pincodes.length === 0) {
        return (
            <div className={resultsStyles.resultsSection}>
                <div className={resultsStyles.resultsHeader}>
                    <h3 className={resultsStyles.resultsTitle}>
                        <TagIcon className="h-6 w-6" />
                        Pincode Results
                    </h3>
                </div>
                <div className={resultsStyles.noResults}>
                    <div className={resultsStyles.noResultsIcon}>📍</div>
                    <p className={resultsStyles.noResultsTitle}>No Pincodes Found</p>
                    <p className={resultsStyles.noResultsText}>
                        No pincodes found for the selected location.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={resultsStyles.resultsSection}>
            <div className={resultsStyles.resultsHeader}>
                <h3 className={resultsStyles.resultsTitle}>
                    <TagIcon className="h-6 w-6" />
                    Pincode Results
                </h3>
                <span className={resultsStyles.resultsCount}>
                    {pincodes.length} {pincodes.length === 1 ? 'Pincode' : 'Pincodes'}
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
                                <td>{item?.village_name || 'N/A'}</td>
                                <td className={resultsStyles.pincodeCell}>{item.pincode}</td>
                                <td>{item?.sub_district_name || 'N/A'}</td>
                                <td>{item?.district_name || 'N/A'}</td>
                                <td>{item?.state_name || 'N/A'}</td>
                                <td>{item?.country_name || 'N/A'}</td>
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
        </div>
    );
};

export default PincodeResults;