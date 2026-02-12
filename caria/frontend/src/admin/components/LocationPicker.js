import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { mapStyles } from '../../config/mapStyles';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '1rem'
};

const center = {
    lat: 35.3382,
    lng: 33.3199
};

const LocationPicker = ({ lat, lng, onChange }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
    });

    const [marker, setMarker] = useState(lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null);

    const onMapClick = useCallback((e) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setMarker({ lat: newLat, lng: newLng });
        onChange({ latitude: newLat, longitude: newLng });
    }, [onChange]);

    return isLoaded ? (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Latitude</label>
                    <input
                        type="number"
                        value={marker?.lat || ""}
                        readOnly
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Longitude</label>
                    <input
                        type="number"
                        value={marker?.lng || ""}
                        readOnly
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold"
                    />
                </div>
            </div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={marker || center}
                zoom={10}
                onClick={onMapClick}
                options={{
                    styles: mapStyles,
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
            >
                {marker && <Marker position={marker} />}
            </GoogleMap>
            <p className="text-[9px] text-slate-400 uppercase font-bold italic text-center">
                * Harita üzerinde konum seçmek için tıklayın
            </p>
        </div>
    ) : (
        <div className="h-[400px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl flex items-center justify-center">
            <span className="text-slate-400 font-bold uppercase tracking-widest">Harita Yükleniyor...</span>
        </div>
    );
};

export default React.memo(LocationPicker);
