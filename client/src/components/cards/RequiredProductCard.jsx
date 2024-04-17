import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { useNavigate } from "react-router-dom";

const RequiredProductCard = ({ request, index, isNavigate }) => {
  const navigate = useNavigate();

  const handleOnClick = (id) => {
    if (isNavigate) navigate(`${id}`); // Navigate to the specific request detail page
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      key={index}
      className="flex flex-col w-4/5 p-2 px-4 my-2 bg-green-100 border rounded-lg shadow-md"
      onClick={() => handleOnClick(request._id)}
    >
      <h2 className="mb-2 text-lg text-green-800">{request.itemRequired}</h2>
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
  );
};

export default RequiredProductCard;
