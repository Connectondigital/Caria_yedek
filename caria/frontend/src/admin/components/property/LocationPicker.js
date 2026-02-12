import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '1rem',
};

const defaultCenter = {
    lat: 35.3364, // Kyrenia default
    lng: 33.3188
};

const LocationPicker = ({ lat, lng, onChange }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-picker-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    const [map, setMap] = useState(null);
    const markerRef = useRef(null);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    const handleMapClick = (e) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        onChange(newLat, newLng);
    };

    // Update center when props change initially or if no map movement
    useEffect(() => {
        if (map && lat && lng) {
            // Optional: only pan if significantly different or initial load
            // map.panTo({ lat: parseFloat(lat), lng: parseFloat(lng) });
        }
    }, [lat, lng, map]);

    if (!isLoaded) return <div className="w-full h-48 bg-slate-100 rounded-xl animate-pulse" />;

    const markerPosition = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;

    return (
        <div className="w-full h-64 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden relative group">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={markerPosition || defaultCenter}
                zoom={11}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleMapClick}
                options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    draggableCursor: 'crosshair',
                }}
            >
                {markerPosition && (
                    <MarkerF position={markerPosition} />
                )}
            </GoogleMap>
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg pointer-events-none">
                {markerPosition ? 'Konum Seçildi' : 'Haritadan Konum Seçin'}
            </div>
            {!markerPosition && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-slate-900/80 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl">
                        İlanın yerini işaretlemek için tıklayın
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(LocationPicker);
