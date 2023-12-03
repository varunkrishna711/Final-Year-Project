import React from "react";
import staricon from "../../assets/icons/star.svg";
import { useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const ProductMainInfo = () => {
  const product = useSelector((state) => state.product.product);
  const productName = useSelector((state) => state.product.productName);
  const categories = useSelector((state) => state.product.categories);
  const price = useSelector((state) => state.product.price);
  const rating = useSelector((state) => state.product.rating);
  const reviewsCount = useSelector((state) => state.product.reviewsCount);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    display: "flex",
    boxShadow: 24,
    p: 4,
  };

  // console.log(product);
  return (
    <div className="productmaininfo">
      {/* <div className="text-vitamins">VITAMINS</div> */}
      <div className="flex flex-row items-center justify-between head">
        <h2>{productName}</h2>
        {product?.isBidding && (
          <div className="live">
            <div
              onClick={handleOpen}
              className="flex flex-row items-center justify-center px-4 py-2 text-red-700 bg-red-200 rounded-lg bidding text-bold"
            >
              <>
                <span class="relative flex h-4 w-4 mr-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-4 w-4 bg-red-700"></span>
                </span>
                Bidding
              </>
            </div>
          </div>
        )}
      </div>
      <div className="product-categories">
        {categories?.map((category) => (
          <div key={category.id} className="product-category">
            {category.name}
          </div>
        ))}
      </div>
      <div className="product-price-rating">
        <div className="product-price">Base Price ₹{price}.00</div>
        <div className="product-rating">
          <img src={staricon} alt="staricon" />
          <span className="rate">{rating}/5</span>
          <span className="divider">|</span>
          <span className="reviews-count">{reviewsCount}</span>
          <span className="text-reviews">Reviews</span>
        </div>
      </div>
    </div>
  );
};

export default ProductMainInfo;
