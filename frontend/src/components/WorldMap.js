import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const WorldMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    initializeMap();
    addClickListener();

    return cleanupMap;
  }, []);

  const initializeMap = () => {
    mapRef.current = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);
  };

  const addClickListener = () => {
    mapRef.current.on('click', onClickMap);
  };

  const onClickMap = (e) => {
    const { lat, lng: lon } = e.latlng;

    fetch(`http://127.0.0.1:5000/hmax?lat=${lat}&lon=${lon}`)
      .then(response => response.json())
      .then(({ error, hmax }) => {
        if (error) {
          console.error('Error:', error);
          return;
        }

        if (mapRef.current) {
          mapRef.current.closePopup();
          L.popup()
            .setLatLng(e.latlng)
            .setContent(`lat: ${lat}<br/> lon: ${lon}<br/> hmax: ${hmax}`)
            .openOn(mapRef.current);
        }
      })
      .catch(error => console.error('Error fetching hmax:', error));
  };

  const cleanupMap = () => {
    if (mapRef.current) {
      mapRef.current.off('click', onClickMap);
      mapRef.current.remove();
    }
  };

  return <div id="map" style={{ height: '100vh', width: '100vw' }}></div>;
};

export default WorldMap;