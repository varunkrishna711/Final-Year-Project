import React, { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import NoData from "../assets/images/all-clear.png";
import { useSelector } from "react-redux";

export default function ProductRequestHistoryPage() {
  const userId = useSelector((state) => state.user.userId);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async (vendorId) => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/product-request/${vendorId}`
      );
      const data = await response.json();

      // Sort the requests based on the 'toBeDeliveredOn' date
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.toBeDeliveredOn);
        const dateB = new Date(b.toBeDeliveredOn);
        return dateA - dateB; // For ascending order
      });

      setRequests(sortedData);
    };

    fetchData(userId).catch(console.error);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={NoData} alt="No requests" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen mt-5">
      {requests.map((request, index) => (
        <div
          key={index}
          className="flex flex-col w-4/5 p-2 px-4 my-2 bg-green-100 border rounded-lg shadow-md"
        >
          <h2 className="mb-2 text-lg text-green-800">
            {request.itemRequired}
          </h2>
          <p className="flex items-center justify-between mb-2 text-green-800">
            <span>
              Quantity Required: <strong>{request.quantityRequired}</strong>
            </span>
            <div className="flex flex-col items-center">
              {request.isFullfilled ? (
                <>
                  <CheckCircleIcon sx={{ fontSize: "25px", color: "blue" }} />
                  <span className="text-sm">Accepted</span>
                </>
              ) : (
                <>
                  <PendingIcon sx={{ fontSize: "25px", color: "red" }} />
                  <span className="text-sm">Pending</span>
                </>
              )}
            </div>
          </p>

          <p className="text-green-800">
            To Be Delivered On:{" "}
            <strong>{formatDate(request.toBeDeliveredOn)}</strong>
          </p>
        </div>
      ))}
    </div>
  );
}
