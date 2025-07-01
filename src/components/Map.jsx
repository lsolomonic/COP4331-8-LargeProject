import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useState } from 'react'

function MapComponent() {

    return (
        <APIProvider apiKey={'api-key-here'}>
            <div className="max-w-7xl h-125 ml-auto mr-auto">
                <Map
                    defaultZoom={15}
                    defaultCenter={{ lat: 28.6016, lng: -81.2005 }}
                    onCameraChanged={(ev) => {
                    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom);
                    }}
                />
            </div>
        </APIProvider>
    )
}

export default MapComponent;
