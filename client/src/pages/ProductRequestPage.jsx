import React from "react";
import ButtonLoader from "../components/loaders/ButtonLoader";
import { useState, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPosition } from "../store/mapSlice";
import { addProductRequest } from "../store/productSlice";
import { openErrorSnackbar, openSuccessSnackbar } from "../store/modalSlice";

const ProductRequestPage = (props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [location, setLocation] = useState(null);
  const currentPosition = useSelector((state) => state.map.currentPosition);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    dispatch(
      addProductRequest({
        userId,
        productName,
        quantity,
        deliveryDate,
        location,
      })
    )
      .then((data) => {
        dispatch(openSuccessSnackbar("Request added succesfully!"));
        navigate("/product-request-history");
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        dispatch(openErrorSnackbar(err.message));
      });
  };

  const handleLocationSelect = (e) => {
    setLocation([e.latlng.lat, e.latlng.lng]);
  };

  const MapEvents = () => {
    const map = useMapEvents({
      click: (e) => {
        handleLocationSelect(e);
      },
    });

    return null;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log({ latitude, longitude });
        dispatch(setCurrentPosition([latitude, longitude]));
        setLocation([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting geolocation:", error.message);
      }
    );
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-green-100">
        <form
          className="w-full max-w-lg p-8 bg-white rounded shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center justify-between mb-2 text-xl font-semibold text-green-800">
            <span className="text-2xl">Request a product</span>
          </div>

          <div className="mb-4">
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              className="block w-full p-2 mt-1 border border-black rounded-md focus:ring-green-500 focus:border-green-500"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              className="block w-full p-2 mt-1 border border-black rounded-md focus:ring-green-500 focus:border-green-500"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="deliveryDate"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Delivery
            </label>
            <input
              type="date"
              id="deliveryDate"
              className="block w-full p-2 mt-1 border border-black rounded-md focus:ring-green-500 focus:border-green-500"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <div className="h-60">
              {currentPosition && (
                <MapContainer
                  center={currentPosition}
                  zoom={13}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapEvents />
                  {location && (
                    <Marker position={location}>
                      <Popup>Your Location</Popup>
                    </Marker>
                  )}
                </MapContainer>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded focus:outline-none focus:shadow-outline"
          >
            {isLoading ? <ButtonLoader /> : "Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductRequestPage;
