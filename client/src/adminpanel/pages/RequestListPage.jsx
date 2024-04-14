import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RequiredProductCard from "../../components/cards/RequiredProductCard";

export default function ProductRequestHistoryPage() {
  const adminInfo = useSelector((state) => state.admin.adminInfo);

  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8800/api/product-request/${adminInfo.id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Sort the requests based on the 'toBeDeliveredOn' date
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.toBeDeliveredOn);
          const dateB = new Date(b.toBeDeliveredOn);
          return dateA - dateB; // For ascending order
        });

        if (isMounted) {
          setRequests(sortedData);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to set the flag to false when the component unmounts
    };
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen mt-5">
      {requests.length > 0 ? (
        requests.map((request, index) => (
          <RequiredProductCard
            request={request}
            index={index}
            isNavigate={true}
          />
        ))
      ) : (
        <p>No requests found</p>
      )}
    </div>
  );
}
