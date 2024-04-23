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
          `${process.env.REACT_APP_API_URL}/api/product-request/${adminInfo._id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Sort requests first by 'isFulfilled' (false first), then by 'toBeDeliveredOn' date
        const sortedData = data.sort((a, b) => {
          if (a.isFullfilled === b.isFullfilled) {
            // Both have the same fulfilled status; sort by date
            const dateA = new Date(a.toBeDeliveredOn);
            const dateB = new Date(b.toBeDeliveredOn);
            return dateA - dateB; // For ascending order
          }
          // Boolean false is 0 and true is 1, so subtract to put false first
          return (a.isFullfilled ? 1 : 0) - (b.isFullfilled ? 1 : 0);
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
  }, [adminInfo.id]); // Ensure useEffect re-runs if adminInfo.id changes

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen mt-5">
      {requests.length > 0 ? (
        requests.map((request, index) => (
          <RequiredProductCard
            key={index} // It's better to have a unique identifier than index if possible
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
