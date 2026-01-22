// src/components/travelspots/TravelSpotMap.jsx
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/travelspots/TravelSpotMap.module.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Dynamically import the entire map component with no SSR
const DynamicMap = dynamic(() => import('./DynamicMap'), {
    ssr: false,
    loading: () => (
        <div className={styles.mapLoading}>
            <div className={styles.spinner}></div>
            <p>Loading map...</p>
        </div>
    ),
});

const TravelSpotMap = ({
    latitude,
    longitude,
    name,
    city,
    address,
    zoom = 13,
    height = '400px',
    interactive = true
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Validate coordinates
    const isValidCoords = latitude && longitude &&
        !isNaN(parseFloat(latitude)) &&
        !isNaN(parseFloat(longitude)) &&
        Math.abs(parseFloat(latitude)) <= 90 &&
        Math.abs(parseFloat(longitude)) <= 180;

    if (!isValidCoords) {
        return (
            <div className={styles.mapPlaceholder}>
                <div className={styles.placeholderIcon}>
                    <FaMapMarkerAlt size={32} />
                </div>
                <h3>No Location Coordinates</h3>
                <p>This travel spot doesn't have location coordinates set.</p>
                {address && (
                    <div className={styles.addressInfo}>
                        <strong>Address:</strong> {address}
                    </div>
                )}
                {city && (
                    <div className={styles.addressInfo}>
                        <strong>City:</strong> {city}
                    </div>
                )}
            </div>
        );
    }

    if (!isMounted) {
        return (
            <div className={styles.mapLoading}>
                <div className={styles.spinner}></div>
                <p>Loading map...</p>
            </div>
        );
    }

    return (
        <DynamicMap
            latitude={latitude}
            longitude={longitude}
            name={name}
            city={city}
            address={address}
            height={height}
            zoom={zoom}
            interactive={interactive}
        />
    );
};

export default TravelSpotMap;