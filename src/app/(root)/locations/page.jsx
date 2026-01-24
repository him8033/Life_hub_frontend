'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/pages/PincodeFinder.module.css';
import PincodeSearchForm from '@/components/pages/pincode/PincodeSearchForm';
import PincodeDirectSearchForm from '@/components/pages/pincode/PincodeDirectSearchForm';
import PincodeResults from '@/components/pages/pincode/PincodeResults';
import ReverseSearchResults from '@/components/pages/pincode/ReverseSearchResults';
import { MapPinIcon, HomeIcon } from '@heroicons/react/24/outline';

const PincodeFinder = () => {
    const [activeTab, setActiveTab] = useState('pincode');
    const [villageId, setVillageId] = useState(null);
    const [directPincode, setDirectPincode] = useState(null);

    const handlePincodeSearch = (formData) => {
        setVillageId(formData.village);
    };

    const handleDirectSearch = (pincode) => {
        setDirectPincode(pincode);
    };

    const handleClear = () => {
        setVillageId(null);
        setDirectPincode(null);
    };

    return (
        <div className={styles.pincodeContainer}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Pincode Finder</h1>
                <p className={styles.heroSubtitle}>
                    Find pincodes by location or discover village details by pincode
                </p>
            </section>

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Tab Navigation */}
                <div className={styles.tabContainer}>
                    <div className={styles.tabHeader}>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'pincode' ? styles.active : ''}`}
                            onClick={() => setActiveTab('pincode')}
                        >
                            <MapPinIcon className="h-5 w-5" />
                            Find Pincode
                        </button>
                        <button
                            className={`${styles.tabButton} ${activeTab === 'village' ? styles.active : ''}`}
                            onClick={() => setActiveTab('village')}
                        >
                            <HomeIcon className="h-5 w-5" />
                            Find Village by Pincode
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className={styles.tabContent}>
                        {activeTab === 'pincode' ? (
                            <>
                                <PincodeSearchForm
                                    onSubmit={handlePincodeSearch}
                                    onClear={handleClear}
                                />
                                <PincodeResults
                                    villageId={villageId}
                                />
                            </>
                        ) : (
                            <>
                                <PincodeDirectSearchForm
                                    onSubmit={handleDirectSearch}
                                    onClear={handleClear}
                                    isLoading={false}
                                />
                                <ReverseSearchResults
                                    pincode={directPincode}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PincodeFinder;