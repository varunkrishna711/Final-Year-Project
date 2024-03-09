import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutingMachineLayer = ({ from, to }) => {
  console.log(from, to);
  if (to) {
    console.log(from, to);
    const instance = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
      },
      show: true,
      addWaypoints: false,
      routeWhileDragging: true,
      draggableWaypoints: true,
      fitSelectedRoutes: true,
      showAlternatives: true,
    });
    return instance;
  }
};

const RoutingMachine = createControlComponent(createRoutingMachineLayer);

export default RoutingMachine;
