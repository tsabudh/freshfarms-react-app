import classNames from "classnames/bind";
import {
  type Map as LeafletMap,
  type Marker as LeafletMarker,
  type Circle,
  type LeafletEvent,
  Map,
} from "leaflet";
import React, {
  useEffect,
  memo,
  useState,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import { MdMyLocation } from "react-icons/md";
import { useParams } from "react-router-dom";

import styles from "./MapBox.module.scss";
import { AuthContext } from "../../../context/AuthContext";
import { updateCustomer } from "../../../utils/updateCustomer";
import Button from "../Button/Button";

let L: typeof import("leaflet") | undefined = undefined;

//- DECLARING GLOBAL VARIABLES FOR MAP
let zoomed: LeafletMap | null = null,
  redMarker: LeafletMarker | null = null;

const cx = classNames.bind(styles);

interface MapBoxProps {
  coordinates: [number, number];
  setCoordinates: (coordinates: [number, number]) => void;
}

function MapBox({ coordinates, setCoordinates }: MapBoxProps) {
  const [selectedMarker, setSelectedMarker] = useState<
    "not-selected" | "selected" | "selecting"
  >("not-selected");
  const [map, setMap] = useState<LeafletMap | null>(null);

  const { jwtToken, user } = useContext(AuthContext);
  const mapRef = useRef<Map | null>(null); // to store map instance
  const markerRef = useRef<LeafletMarker | null>(null);
  const circleRef = useRef<Circle | null>(null);
  const initialCoordinates = useRef(coordinates);

  useLayoutEffect(() => {
    let isMounted = true;
    const coords = initialCoordinates.current;

    (async () => {
      if (!L) {
        const leafletModule = await import("leaflet");
        L = leafletModule.default ?? leafletModule;
        await import("leaflet/dist/leaflet.css");
      }
      if (!L || !isMounted) return;

      if (!mapRef.current) {
        const mapInstance = L.map("map");
        mapInstance.setView(coords, 16);
        mapInstance.setMaxZoom(19);
        mapInstance.setMinZoom(15);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapInstance);

        mapRef.current = mapInstance;
        setMap(mapInstance);
      }

      // const map = mapRef.current;

      // const lat = coordinates[0] || 28.27182621011652;
      // const lng = coordinates[1] || 83.60018489346729;

      // //- Remove previous marker if exists
      // if (marker) {
      //   map.removeLayer(marker);
      //   if (circleRef.current) map.removeLayer(circleRef.current);
      // }

      // markerRef.current = L.marker([lat, lng]).addTo(map);
      // circleRef.current = L.circle([lat, lng], { radius: 60 }).addTo(map);

      // if (!zoomed) {
      //   zoomed = map.fitBounds(circleRef.current.getBounds());
      // }
    })();

    // ✅ Only run on component unmount
    return () => {
      isMounted = false;

      // 🔐 Only destroy the map when unmounting
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }

      markerRef.current = null;
      circleRef.current = null;
      zoomed = null;
    };
  }, []);

  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!(mapInstance && L)) return;

    // Set default/fallback coordinates if missing
    const lat = coordinates[0] || 28.27182621011652;
    const lng = coordinates[1] || 83.60018489346729;

    // Remove old marker and circle
    if (markerRef.current) {
      mapInstance.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    if (circleRef.current) {
      mapInstance.removeLayer(circleRef.current);
      circleRef.current = null;
    }

    if (redMarker) mapInstance.removeLayer(redMarker);
    // Add new marker and circle
    markerRef.current = L.marker([lat, lng]).addTo(mapInstance);
    circleRef.current = L.circle([lat, lng], { radius: 60 }).addTo(mapInstance);

    // Zoom to circle bounds if not zoomed already
    if (!zoomed) {
      zoomed = mapInstance.fitBounds(circleRef.current.getBounds());
    }

    return () => {
      // Clean up current marker/circle on unmount or dependency change
      if (markerRef.current) {
        mapInstance.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      if (circleRef.current) {
        mapInstance.removeLayer(circleRef.current);
        circleRef.current = null;
      }
    };
  }, [coordinates]);

  // Use ReactMouseEvent<HTMLDivElement> or appropriate for icon click
  const centerToCustomerLocation = () => {
    if (map) {
      map.setView(coordinates);
    }
  };

  type MapClickEvent = LeafletEvent & {
    latlng: {
      lat: number;
      lng: number;
    };
  };

  // Leaflet mouse event for map click
  const addMarker = (e: MapClickEvent) => {
    if (!map || !L) return;

    //- If marker to add (redMarker) already exists, remove that marker
    if (redMarker) {
      map.removeLayer(redMarker);
    }
    //- Icon for redMarker
    const redMarkerIcon = L.icon({
      iconUrl: "/img/marker-red.png",
      iconSize: [30, 50],
      iconAnchor: [15, 50],
      popupAnchor: [-3, -50],
      className: cx("marker-red"),
    });

    //- Get latitude and longitude of clicked location
    const { lat, lng } = e.latlng;

    //-Create a new redMarker at that position
    redMarker = L.marker([lat, lng], {
      draggable: true,
      icon: redMarkerIcon,
    }).addTo(map);

    //- Set status selectedMarker to true
    setSelectedMarker("selected");

    //- Remove event listener addMarker on click
    map.off("click", addMarker);
  };

  const { id: paramId } = useParams<{ id: string }>();
  if (!jwtToken || !user) {
    return (
      <div className={cx("container")}>
        You are not authorized to view this page.
      </div>
    );
  }
  const id = user.role === "admin" ? paramId : user._id;

  const selectNewLocation = async () => {
    if (!map) return;

    //- If marker is not selected, go on to add marker
    if (selectedMarker === "not-selected") {
      setSelectedMarker("selecting");
      map.on("click", addMarker);
    }

    //- If marker is selected, make changes to customer details
    else if (selectedMarker === "selected") {
      if (redMarker) {
        //- Process if redMarker is present
        const latlng = redMarker.getLatLng();

        //- Define location path as per customerSchema in database
        const newCustomerDetails = {
          location: {
            type: "Point",
            coordinates: [latlng.lat, latlng.lng] as [number, number],
          },
        };

        const responseTxt = await updateCustomer(
          id!,
          newCustomerDetails,
          jwtToken,
          user.role
        );

        //- Change coordinates if location change is a success
        if (responseTxt.status === "success") {
          setCoordinates(responseTxt.data.location.coordinates);
          setSelectedMarker("not-selected");
        } else {
          // todo: Make error visible in UI
          console.error("Failed to update customer location");
        }
      }
    }
  };

  const cancelLocationSelect = () => {
    if (!map) return;

    map.off("click", addMarker);

    //- If marker to add (redMarker) exists, remove that marker
    if (redMarker) {
      map.removeLayer(redMarker);
      redMarker = null;
    }

    //- Change selectedMarker state to 'not-selected'
    setSelectedMarker("not-selected");
  };

  return (
    <div className={cx("container")}>
      <div className={cx("button-list")}>
        <div className={cx("my-location")}>
          <MdMyLocation onClick={centerToCustomerLocation} />
        </div>

        {selectedMarker === "not-selected" || selectedMarker === "selected" ? (
          <Button
            className={`action02 ${
              selectedMarker === "not-selected"
                ? ""
                : selectedMarker === "selected"
                ? "go"
                : selectedMarker === "selecting"
                ? "wait"
                : ""
            }`}
            onClick={selectNewLocation}
            title="Change customer's location."
          >
            {selectedMarker === "not-selected"
              ? "Change customer's location"
              : "Confirm location"}
          </Button>
        ) : (
          ""
        )}
        {selectedMarker === "selected" || selectedMarker === "selecting" ? (
          <Button
            className={`action02 stop`}
            onClick={cancelLocationSelect}
            title="Cancel changes."
          >
            Cancel
          </Button>
        ) : null}
      </div>

      <div className={cx("map-container")}>
        <div className={cx("map-box")} id="map">
          Map box
        </div>
      </div>
    </div>
  );
}

export default memo(MapBox);
