'use client';

import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import styles from '@/styles/pages/PincodeFinder.module.css';
import PincodeSearchForm from '@/components/pages/pincode/PincodeSearchForm';
import PincodeDirectSearchForm from '@/components/pages/pincode/PincodeDirectSearchForm';
import PincodeResults from '@/components/pages/pincode/PincodeResults';
import ReverseSearchResults from '@/components/pages/pincode/ReverseSearchResults';
import { MapPinIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function PincodeFinder() {
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
        <PageLayout
            heroTitle="Pincode Finder"
            heroSubtitle="Find pincodes by location or discover village details by pincode"
        >
            <div className={styles.tabContainer}>
                <div className={styles.tabHeader}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'pincode' ? styles.active : ''}`}
                        onClick={() => setActiveTab('pincode')}
                    >
                        <MapPinIcon className={styles.tabIcon} />
                        Find Pincode
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'village' ? styles.active : ''}`}
                        onClick={() => setActiveTab('village')}
                    >
                        <HomeIcon className={styles.tabIcon} />
                        Find Village by Pincode
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'pincode' ? (
                        <>
                            <PincodeSearchForm
                                onSubmit={handlePincodeSearch}
                                onClear={handleClear}
                            />
                            <PincodeResults villageId={villageId} />
                        </>
                    ) : (
                        <>
                            <PincodeDirectSearchForm
                                onSubmit={handleDirectSearch}
                                onClear={handleClear}
                                isLoading={false}
                            />
                            <ReverseSearchResults pincode={directPincode} />
                        </>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}