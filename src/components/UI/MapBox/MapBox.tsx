import React, {
  useEffect,
  memo,
  useState,
  useContext,
  MouseEvent as ReactMouseEvent,
} from "react";
import { useParams } from "react-router-dom";

import { MdMyLocation } from "react-icons/md";

import styles from "./MapBox.module.scss";
import Button from "../Button/Button";
import updateCustomer from "../../../utils/updateCustomer";
import { AuthContext } from "../../../context/AuthContext";
import classNames from "classnames/bind";

import type { Map as LeafletMap, Marker as LeafletMarker, Layer, Zoom, Circle } from "leaflet";

let L: typeof import("leaflet") | undefined = undefined;

//- DECLARING GLOBAL VARIABLES FOR MAP
let marker: LeafletMarker | null = null,
  circle: Circle | null = null,
  zoomed: LeafletMap | null = null,
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

  if (!jwtToken || !user) {
    return (
      <div className={cx("container")}>
        You are not authorized to view this page.
      </div>
    );
  }

  const { id: paramId } = useParams<{ id: string }>();

  const id = user.role === "admin" ? paramId : user._id;

  useEffect(() => {
    (async () => {
      if (!L) {
        const leafletModule = await import("leaflet");
        L = leafletModule.default ?? leafletModule;
        await import("leaflet/dist/leaflet.css");
      }
      if (!L) return;

      const mapInstance = L.map("map");
      mapInstance.setView(coordinates, 16);
      mapInstance.setMaxZoom(19);
      mapInstance.setMinZoom(15);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
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
        if (circle) mapInstance.removeLayer(circle);
      }

      //- Set markers to current latitude and longitude
      if (lat && lng) {
        marker = L.marker([lat, lng]).addTo(mapInstance);
        circle = L.circle([lat, lng],60).addTo(mapInstance);

        if (!zoomed) {
          zoomed = mapInstance.fitBounds(circle.getBounds()) ;
        }
      }
      setMap(mapInstance);

      //- Clean up map
      return () => {
        mapInstance.off();
        mapInstance.remove();
      };
    })();
  }, [coordinates]);

  // Use ReactMouseEvent<HTMLDivElement> or appropriate for icon click
  const centerToCustomerLocation = (e: ReactMouseEvent) => {
    if (map) {
      map.setView(coordinates);
    }
  };

  // Leaflet mouse event for map click
  const addMarker = (e: any) => {
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

  const selectNewLocation = async (event: ReactMouseEvent) => {
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
            coordinates: [latlng.lat, latlng.lng],
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

  const cancelLocationSelect = (event: ReactMouseEvent) => {
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

        <Button
          className={`action-berry-01 ${
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
          {selectedMarker === "selected"
            ? "Change Location"
            : selectedMarker === "selecting"
            ? "Pick a location"
            : "Select New Location"}
        </Button>
        {selectedMarker === "selected" && (
          <Button
            className={`action02 stop`}
            onClick={cancelLocationSelect}
            title="Cancel changes."
          >
            Cancel
          </Button>
        )}
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
