import React, { useEffect, memo } from 'react';
import styles from './MapBox.module.scss';

//- DECLARING GLOBAL VARIABLES FOR MAP
let marker = null,
    circle = null,
    zoomed = null;

function MapBox({ coordinates }) {
    console.log(
        'RENDERING MAPBOX ...................................................'
    );
    console.log(coordinates);

    useEffect(() => {
        var map = L.map('map');

        map.setView(coordinates, 17);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        // const lat = position.coords.latitude;
        const lat = coordinates[0] || 83.60018489346729;
        // const lng = position.coords.longitude;
        const lng = coordinates[1] || 28.27182621011652;

        // const accuracy = position.coords.accuracy;

        // Remove previous marker if exist
        if (marker) {
            map.removeLayer(marker);
            map.removeLayer(circle);
        }
        console.log(lat, lng);
        console.log(coordinates);
        // [83.60018489346729, 28.27182621011652];
        // Set markers to current latitude and longitude
        if (lat && lng) {
            // marker = L.marker([lat, lng]).addTo(map);
            marker = L.marker([lat, lng]).addTo(map);
            circle = L.circle([lat, lng]).addTo(map);

            if (!zoomed) {
                zoomed = map.fitBounds(circle.getBounds());
            }
        }

        //- CLEANING UP MAP VARIABLE
        return () => {
            map.off();
            map.remove();
        };
    }, [coordinates]);

    return (
        <div className="mapbox" id="map">
            Map box
        </div>
    );
}

export default memo(MapBox);
