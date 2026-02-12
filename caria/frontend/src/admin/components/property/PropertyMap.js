import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0.75rem',
};

const defaultCenter = {
    lat: 35.3364, // Kyrenia default
    lng: 33.3188
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
        {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [{ "color": "#f5f5f5" }]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#616161" }]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#f5f5f5" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#e9e9e9" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9e9e9e" }]
        }
    ]
};

const PropertyMap = ({ properties, selectedId, onSelect }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    // Filter properties with valid coordinates
    const validProperties = properties.filter(p => p.latitude && p.longitude);

    // Pan to selected property
    React.useEffect(() => {
        if (map && selectedId) {
            const selected = validProperties.find(p => p.id === selectedId);
            if (selected) {
                map.panTo({ lat: selected.latitude, lng: selected.longitude });
                map.setZoom(15);
            }
        }
    }, [selectedId, map, validProperties]);

    if (!isLoaded) return <div className="w-full h-full bg-slate-100 rounded-xl animate-pulse" />;

    return (
        <div className="w-full h-full border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={mapOptions}
            >
                {validProperties.map(property => (
                    <MarkerF
                        key={property.id}
                        position={{ lat: property.latitude, lng: property.longitude }}
                        onClick={() => onSelect(property)}
                        label={{
                            text: typeof property.price === 'number'
                                ? `£${(property.price / 1000).toFixed(0)}k`
                                : property.price || '£',
                            color: selectedId === property.id ? "white" : "black",
                            className: "font-bold text-xs bg-white px-2 py-1 rounded shadow-md border border-gray-300",
                            fontSize: "10px",
                            fontWeight: "bold"
                        }}
                        icon={{
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: selectedId === property.id ? "#3BB2B8" : "white",
                            fillOpacity: 1,
                            strokeColor: selectedId === property.id ? "#2B8A8E" : "#666",
                            strokeWeight: 2,
                        }}
                    />
                ))}
            </GoogleMap>
        </div>
    );
};

export default React.memo(PropertyMap);
