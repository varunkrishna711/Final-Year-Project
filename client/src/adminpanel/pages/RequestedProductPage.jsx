import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import L from "leaflet";

// Import the images for Leaflet's default marker
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // Size of the shadow
});

// Set this icon as the default icon for all Leaflet markers
L.Marker.prototype.options.icon = DefaultIcon;

export default function RequestedProductPage() {
  const adminInfo = useSelector((state) => state.admin.adminInfo);

  const { id } = useParams();
  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState([10.8505, 76.2711]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    fetchRequestDetails();
    if (adminInfo?.id) {
      fetchAdminLocation();
    }
  }, [id, adminInfo.id]);

  const fetchRequestDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/product-request/request-id/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch request details");
      }
      const data = await response.json();
      setRequestDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminLocation = async () => {
    try {
      setLocationLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/info/${adminInfo.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch admin location");
      }
      const data = await response.json();
      setPosition(data.location);
    } catch (err) {
      setLocationError(err.message);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      setUpdateLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/product-request/request-id/${requestDetails._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isFullfilled: true }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update request status");
      }
      await fetchRequestDetails(); // Refresh the details after updating
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleReject = () => {
    // Optionally, add any logic for reject action here
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container flex" style={{ height: "100vh" }}>
      <div className="flex flex-col items-center justify-center w-1/2 p-6 rounded-lg shadow-xl bg-gradient-to-br from-gray-50 to-gray-100">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">
          Request Details
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div className="space-y-4">
            <p className="text-xl text-gray-700">
              <strong>Item Required:</strong> {requestDetails?.itemRequired}
            </p>
            <p className="text-xl text-gray-700">
              <strong>Quantity:</strong> {requestDetails?.quantityRequired}
            </p>
            <p className="text-xl text-gray-700">
              <strong>Status:</strong>
              {requestDetails?.isFullfilled ? (
                <span className="text-green-600"> Fulfilled</span>
              ) : (
                <span className="text-orange-500"> Pending</span>
              )}
            </p>
            <p className="text-xl text-gray-700">
              <strong>Date Requested:</strong>
              {formatDate(requestDetails?.createdDate)}
            </p>
            <p className="text-xl text-gray-700">
              <strong>Date To Deliver:</strong>
              {formatDate(requestDetails?.toBeDeliveredOn)}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleAccept}
                disabled={updateLoading}
                className="px-4 py-2 font-semibold text-white transition duration-150 ease-in-out bg-green-500 rounded-lg shadow hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 font-semibold text-white transition duration-150 ease-in-out bg-red-500 rounded-lg shadow hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="w-1/2">
        {locationError ? (
          <p className="text-center text-red-500">
            Error fetching location: {locationError}
          </p>
        ) : (
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                Your Location
              </Popup>
            </Marker>
            {requestDetails && requestDetails.vendorLocation && (
              <Marker position={requestDetails.vendorLocation}>
                <Popup>
                  Vendor's location. <br /> {requestDetails.itemRequired}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
