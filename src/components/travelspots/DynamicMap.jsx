// src/components/travelspots/DynamicMap.jsx (FIXED VERSION)
'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '@/styles/travelspots/TravelSpotMap.module.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
    iconUrl: '/leaflet/images/marker-icon.png',
    shadowUrl: '/leaflet/images/marker-shadow.png',
});

const DynamicMap = ({
    latitude,
    longitude,
    name,
    city,
    address,
    zoom = 13,
    height = '400px',
    interactive = true
}) => {
    const position = [parseFloat(latitude), parseFloat(longitude)];

    // Create custom marker icon
    const customIcon = new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4F46E5" width="32" height="32">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
        `),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        className: 'custom-marker-icon'
    });

    return (
        <div className={styles.mapWrapper}>
            <div className={styles.mapContainer} style={{ height }}>
                <MapContainer
                    center={position}
                    zoom={zoom}
                    className={styles.leafletMap}
                    scrollWheelZoom={interactive}
                    zoomControl={interactive}
                    dragging={interactive}
                    touchZoom={interactive}
                    doubleClickZoom={interactive}
                    boxZoom={interactive}
                    keyboard={interactive}
                    attributionControl={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maxZoom={19}
                    />

                    <Marker position={position} icon={customIcon}>
                        <Popup>
                            <div className={styles.popupContent}>
                                <h4>{name}</h4>
                                {city && <p><strong>City:</strong> {city}</p>}
                                {address && <p><strong>Address:</strong> {address}</p>}
                                <p className={styles.coordinates}>
                                    <strong>Coordinates:</strong> {latitude}, {longitude}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* Buttons moved OUTSIDE the map container */}
            <div className={styles.mapControls}>
                <button
                    className={styles.mapControlButton}
                    onClick={() => {
                        window.open(
                            `https://www.google.com/maps?q=${latitude},${longitude}`,
                            '_blank'
                        );
                    }}
                >
                    Open in Google Maps
                </button>
                <button
                    className={`${styles.mapControlButton} ${styles.osmButton}`}
                    onClick={() => {
                        window.open(
                            `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`,
                            '_blank'
                        );
                    }}
                >
                    Open in OSM
                </button>
                <div className={styles.mapCredits}>
                    © OpenStreetMap contributors
                </div>
            </div>
        </div>
    );
};

export default DynamicMap;