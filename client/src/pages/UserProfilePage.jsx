import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "../styles/pages/mappage.scss";

const UserProfilePage = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/product/all/${id}`)
        .then((res) => {
          console.log("==========================================", res.data);
          setProducts(res.data);
        });
    };

    const fetchData = async () => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/user/info/${id}`)
        .then((res) => {
          console.log(res.data);
          setUserData(res.data);
        });
    };

    fetchProductData();
    fetchData();
  }, []);

  const handleClick = (id) => {
    navigate(`../../product/${id}`);
  };

//   return (
//     <div className="flex flex-col items-center min-h-[800px] content-center">
//       <div className="flex flex-col items-center content-center mt-8 producer-header">
//         <img
//           src={userData.photo ?? "https://via.placeholder.com/150"}
//           alt={userData.firstname}
//           className="object-cover w-32 h-32 m-0 rounded-full"
//         />
//         <p className="mt-4 text-2xl font-bold">
//           {userData.firstname} {userData.lastname}
//         </p>
//         <p className="mt-1 mb-1 text-green-700">#{userData._id}</p>
//         <p>{userData.email}</p>
//       </div>
//       <div className="flex flex-col items-center content-center w-full mt-8">
//         {userData.location && (
//           <MapContainer
//             center={userData.location}
//             zoom={15}
//             scrollWheelZoom={false}
//             style={{ height: "300px", width: "400px" }}
//           >
//             <TileLayer
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//             <Marker position={userData.location}>
//               <Popup>{userData.name}</Popup>
//             </Marker>
//           </MapContainer>
//         )}
//       </div>
//       {products.length != 0 && (
//         <div className="w-full mt-8 producer-products">
//           <h3 className="mb-4 text-xl font-bold">Products</h3>
//           <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {console.log(products)}
//             {products?.map((product) => (
//               <li
//                 key={product.id}
//                 className="p-4 bg-white rounded-lg shadow"
//                 onClick={() => handleClick(product._id)}
//               >
//                 <img
//                   src={product.images[0]}
//                   alt={product.name}
//                   className="object-cover w-full h-32 mb-2"
//                 />
//                 <p className="font-bold">{product.name}</p>
//                 <p>{product.price}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );

return (
  <div className="flex flex-col items-center min-h-[800px] content-center">
    <div className="flex flex-col items-center content-center mt-8 producer-header">
      <img
        src={userData.photo ?? "https://via.placeholder.com/150"}
        alt={userData.firstname}
        className="object-cover w-32 h-32 m-0 rounded-full"
      />
      <p className="mt-4 text-2xl font-bold">
        {userData.firstname} {userData.lastname}
      </p>
      <p className="mt-1 mb-1 text-green-700">#{userData._id}</p>
      <p>{userData.email}</p>
    </div>
    <div className="flex flex-col items-center content-center w-full mt-8">
      {userData.location && (
        <MapContainer
          center={userData.location}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "300px", width: "400px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={userData.location}>
            <Popup>{userData.name}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
    {products.length != 0 && (
      <div className="w-full mt-8 producer-products">
        <h3 className="flex justify-center mt-5 mb-4 text-3xl font-bold">Products</h3>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products?.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center justify-center p-4 mb-4 bg-white rounded-lg shadow" // Added flexbox styles
              onClick={() => handleClick(product._id)}
              style={{ minHeight: "150px" }} // Set a minimum height to ensure consistent spacing
            >
              <div
                className="flex items-center justify-center w-32 h-32 mb-2 overflow-hidden rounded-lg" // Set square dimensions and rounded corners
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-cover w-full h-full cursor-pointer" // Make the image cover its container
                />
              </div>
              <p className="font-bold">{product.name}</p>
              <p>{product.price}</p>
            </div>
          ))}
        </ul>
      </div>
    )}
  </div>
);

};

export default UserProfilePage;
