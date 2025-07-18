import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useState } from 'react';

function MapComponent({ onMapClick }) {

    const handleClick = (e) => {
        const location = {
            lat: e.detail.latLng.lat,
            lng: e.detail.latLng.lng
        };

        const lat = location.lat;
        const lng = location.lng;

        const finalCoords = lat + " " + lng;

        onMapClick(finalCoords);
    }

    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
                <div className="max-w-7xl h-160 ml-auto mr-auto">
                    <Map
                        defaultZoom={15}
                        defaultCenter={{ lat: 28.6016, lng: -81.2005 }}
                        onCameraChanged={(ev) => {
                        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom);
                        }}
                        onClick={handleClick}
                    />
                </div>
            </APIProvider>       
        </>
    )
}

export default MapComponent;
