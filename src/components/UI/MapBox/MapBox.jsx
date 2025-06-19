import React, { useEffect, memo, useState, useContext, lazy } from 'react';
import { useParams } from 'react-router-dom';

import { MdMyLocation } from 'react-icons/md';

import styles from './MapBox.module.scss';
import Button from '../Button/Button';
import updateCustomer from '../../../utils/updateCustomer';
import { AuthContext } from '../../../context/AuthContext';
import classNames from 'classnames/bind';
import L from 'leaflet';

let L;
// import 'leaflet/dist/leaflet.css';


//- DECLARING GLOBAL VARIABLES FOR MAP
let marker = null,
    circle = null,
    zoomed = null,
    redMarker;

const cx = classNames.bind(styles);

function MapBox({ coordinates, setCoordinates }) {
    const [selectedMarker, setSelectedMarker] = useState('not-selected');
    const [map, setMap] = useState(null);

    const { jwtToken, user } = useContext(AuthContext);

    const { id: paramId } = useParams();

    const id = user.role == 'admin' ? paramId : user._id;

    useEffect(() => {
        (async () => { if (!L) {
            const leafletModule = await import('leaflet');
            L = leafletModule.default;
            await import('leaflet/dist/leaflet.css');
        }
        let mapInstance = L.map('map');
        mapInstance.setView(coordinates, 16);
        mapInstance.setMaxZoom(19);
        mapInstance.setMinZoom(15);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapInstance);


        //- Setting Coordinates for customer that do not have location registered
        const lat = coordinates[0] || 83.60018489346729;
        const lng = coordinates[1] || 28.27182621011652;

        //- Remove previous marker if exist
        if (marker) {
            mapInstance.removeLayer(marker);
            mapInstance.removeLayer(circle);
        }

        //- Set markers to current latitude and longitude
        if (lat && lng) {
            marker = L.marker([lat, lng]).addTo(mapInstance);
            circle = L.circle([lat, lng]).addTo(mapInstance);

            if (!zoomed) {
                zoomed = mapInstance.fitBounds(circle.getBounds());
            }
        }
        setMap(mapInstance);

        //- Clean up map
        return () => {
            mapInstance.off();
            mapInstance.remove();
        };})()
    }, [coordinates]);

    const centerToCustomerLocation = (e) => {
        map.setView(coordinates);
    };
    const addMarker = (e) => {
        //- If marker to add (redMarker) already exists, remove that marker
        if (redMarker) {
            map.removeLayer(redMarker);
        }
        //- Icon for redMarker
        let redMarkerIcon = L.icon({
            iconUrl: '/img/marker-red.png',
            iconSize: [30, 50],
            iconAnchor: [15, 50],
            popupAnchor: [-3, -50],
            className: cx('marker-red'),
        });

        //- Get latitude and longitude of clicked location
        let { lat, lng } = e.latlng;

        //-Create a new redMarker at that position
        redMarker = L.marker([lat, lng], {
            draggable: true,
            icon: redMarkerIcon,
        }).addTo(map);

        //- Set status selectedMarker to true
        setSelectedMarker('selected');

        //- Remove event listener addMarker on click
        map.off('click', addMarker);
    };

    const selectNewLocation = async (event) => {
        //- If marker is not selected, go on to add marker
        if (selectedMarker == 'not-selected') {
            setSelectedMarker('selecting');
            map.on('click', addMarker);
        }

        //- If marker is selected, make changes to customer details
        if (selectedMarker == 'selected') {
            if (redMarker) {
                //- Process if redMarker is present
                let latlng = redMarker.getLatLng();

                //- Define location path as per customerSchema in database
                let newCustomerDetails = {
                    location: {
                        type: 'Point',
                        coordinates: [latlng.lat, latlng.lng],
                    },
                };

                let responseTxt = await updateCustomer(
                    id,
                    newCustomerDetails,
                    jwtToken,
                    user.role
                );

                //- Change coordinates if location change is a success
                if (responseTxt.status == 'success') {
                    setCoordinates(responseTxt.data.location.coordinates);
                    setSelectedMarker('not-selected');
                } else {
                    //todo Make error visible in UI
                }
            }
        }
    };
    const cancelLocationSelect = (event) => {
        map.off('click', addMarker);

        //- If marker to add (redMarker) exists, remove that marker
        if (redMarker) {
            map.removeLayer(redMarker);
        }

        //- Change selectedMarker state to 'not-selected'
        setSelectedMarker('not-selected');
    };

    return (
        <div className={cx('container')}>
            <div className={cx('button-list')}>
                <div className={cx('my-location')}>
                    <MdMyLocation onClick={centerToCustomerLocation} />
                </div>

                <Button
                    className={`action-berry-01 ${
                        selectedMarker == 'not-selected'
                            ? ''
                            : selectedMarker == 'selected'
                            ? 'go'
                            : selectedMarker == 'selecting'
                            ? 'wait'
                            : ''
                    }`}
                    onClick={selectNewLocation}
                    title="Change customer's location."
                >
                    {selectedMarker == 'selected'
                        ? 'Change Location'
                        : selectedMarker == 'selecting'
                        ? 'Pick a location'
                        : 'Select New Location'}
                </Button>
                {selectedMarker == 'selected' ? (
                    <Button
                        className={`action02 stop`}
                        onClick={cancelLocationSelect}
                        title="Cancel changes."
                    >
                        Cancel
                    </Button>
                ) : null}
            </div>

            <div className={cx('map-container')}>
                <div className={cx('map-box')} id="map">
                    Map box
                </div>
            </div>
        </div>
    );
}

export default memo(MapBox);
