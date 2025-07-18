import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';

function MapComponent({ onMapClick, mapPins }) {
  const [selectedPinId, setSelectedPinId] = useState(null);

  const handleClick = (e) => {
    const { lat, lng } = e.detail.latLng;
    onMapClick(`${lat} ${lng}`);
  };

  const parseLocation = (locStr) => {
    if (!locStr) return null;
    const parts = locStr.split(' ');
    if (parts.length !== 2) return null;
    return { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
  };

  // parse coords
  const selectedPin = mapPins.find(pin => pin._id === selectedPinId);
  const selectedCoords = selectedPin ? parseLocation(selectedPin.location) : null;

  return (
    <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
      <div className="max-w-7xl h-160 mx-auto">
        <Map
          defaultZoom={15}
          defaultCenter={parseLocation(mapPins[0]?.location) || { lat: 28.6016, lng: -81.2005 }}
          mapId="YOUR_MAP_ID"
          onClick={handleClick}
        >
          {mapPins.map((pin) => {
            const coords = parseLocation(pin.location);
            if (!coords) return null;

            return (
              <AdvancedMarker
                key={pin._id}
                position={coords}
                title={pin.building}
                onClick={() => setSelectedPinId(pin._id)}
              />
            );
          })}

          {selectedPinId && selectedCoords && (
            <InfoWindow
              position={selectedCoords}
              onCloseClick={() => setSelectedPinId(null)}
            >
              <div>
                <h2 className="font-bold">{selectedPin.building}</h2>
                <p className="text-sm">Vibe: {selectedPin.vibe}</p>
                <p className="text-xs text-gray-500">{selectedPin.location}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}

export default MapComponent;
