import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "../styles/pages/mappage.scss";
import {
  setCurrentPosition,
  setSelectedLocation,
  loadProducersNearby,
  setRoutingLocation,
} from "../store/mapSlice";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import RoutingMachine from "../components/UI/RoutingMachine";
import DirectionsIcon from "@mui/icons-material/Directions";
import MapIcon from "@mui/icons-material/Map";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MapPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nearbyProducers = useSelector((state) => state.map.nearbyProducers);
  const currentPosition = useSelector((state) => state.map.currentPosition);
  const selectedLocation = useSelector((state) => state.map.selectedLocation);
  const routingLocation = useSelector((state) => state.map.routingLocation);

  const [selectedProducerIndex, setSelectedProducerIndex] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setCurrentPosition([latitude, longitude]));
        // dispatch(setSelectedLocation([latitude, longitude]));
        dispatch(loadProducersNearby({ latitude, longitude }));
      },
      (error) => {
        console.error("Error getting geolocation:", error.message);
      }
    );
  }, []);

  const markerRefs = useRef(nearbyProducers.map(() => React.createRef()));

  const handleProfilePage = (p) => {
    console.log(p);
    navigate(`/user/${p._id}`);
  };

  const FlyToName = ({ coordinates }) => {
    const map = useMap();
    useEffect(() => {
      if (coordinates) {
        map.flyTo(coordinates, 18, {
          duration: 2,
        });
      }
    }, [map, coordinates]);

    return null;
  };

  const handleNameClick = (coordinates, index) => {
    dispatch(setSelectedLocation(coordinates));
    setSelectedProducerIndex(index); // Update the selected producer index
  };

  const handleDirectionClick = (coordinates) => {
    dispatch(setRoutingLocation(coordinates));
  };

  const handleMarkerHover = (index) => {
    if (markerRefs.current[index]?.current) {
      markerRefs.current[index].current.openPopup();
    }
  };

  const handleMarkerLeave = (index) => {
    if (markerRefs.current[index]?.current) {
      markerRefs.current[index].current.closePopup();
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-[600px]">
      <div className="h-full producers-list w-[35%] max-w-[600px] py-4 overflow-y-auto">
        <div className="flex items-center justify-between px-4 my-4 head ">
          <span className="text-xl font-bold">Nearest Producers</span>
          <MyLocationIcon
            className="transition-colors cursor-pointer hover:text-green-800"
            onClick={() => {
              dispatch(setSelectedLocation(currentPosition));
            }}
          />
        </div>
        {nearbyProducers.map((p, i) => (
          <div
            className={`flex flex-row items-center justify-between p-4 transition-colors cursor-pointer details ${
              i === selectedProducerIndex
                ? "bg-blue-100 text-blue-900"
                : "hover:bg-slate-100 hover:text-green-900"
            }`}
            onClick={() => handleNameClick([p.location[0], p.location[1]], i)}
            key={i}
          >
            <div className="flex flex-col">
              <span
                className="flex items-center text-base decoration-inherit text-inherit hover:underline"
                onClick={() => handleProfilePage(p)}
              >
                {p.firstname} {p.lastname}{" "}
              </span>
              <span className="text-sm text-slate-600">{p.email}</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center direction">
                <MapIcon className="text-slate-950" />
                <span className="text-sm text-slate-500">
                  {Math.round(p.distance * 100) / 100} km
                </span>
              </div>
              <div
                className="flex flex-col items-center direction"
                onClick={(e) =>
                  handleDirectionClick([p.location[0], p.location[1]])
                }
              >
                <DirectionsIcon className="text-slate-950" />
                <span className="text-xs text-slate-500">Direction</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {currentPosition && (
        <MapContainer
          center={currentPosition}
          zoom={13}
          scrollWheelZoom={true}
          className="flex-grow-2"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={currentPosition}>
            <Popup>Your Current Location</Popup>
          </Marker>
          {nearbyProducers.map((p, index) => (
            <Marker
              key={index}
              position={[p.location[0], p.location[1]]}
              ref={markerRefs.current[index]}
              eventHandlers={{
                mouseover: () => handleMarkerHover(index),
                mouseout: () => handleMarkerLeave(index),
              }}
            >
              <Popup>
                {p.firstname} {p.lastname}
              </Popup>
            </Marker>
          ))}
          <FlyToName coordinates={selectedLocation} />
          {routingLocation && (
            <RoutingMachine
              key={JSON.stringify(routingLocation)}
              from={currentPosition}
              to={routingLocation}
            />
          )}
        </MapContainer>
      )}
    </div>
  );
};
export default MapPage;
