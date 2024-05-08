import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCounter from "./ProductCounter";
import ButtonLoader from "../loaders/ButtonLoader";
import {
  setProductCount,
  setTotalPrice,
  setBidPrice,
  setIsBidding,
  placingBid,
} from "../../store/productSlice";
import { localAddProductToCart } from "../../store/cartSlice";
import { openErrorSnackbar, openSuccessSnackbar } from "../../store/modalSlice";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
// import { bidSocket as socket } from "../../utils/socket";
import socket from "../../utils/socket";

const ProductAdd = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  const userId = useSelector((state) => state.user.userId);
  const email = useSelector((state) => state.user.email);
  const product = useSelector((state) => state.product.product);
  const price = useSelector((state) => state.product.price);
  const totalPrice = useSelector((state) => state.product.totalPrice);
  const selectedSize = useSelector((state) => state.product.selectedSize);
  const productCount = useSelector((state) => state.product.productCount);
  const productName = useSelector((state) => state.product.productName);
  const isBidding = useSelector((state) => state.product?.isBidding);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const bidPrice = useSelector((state) => state.product.bidPrice);

  useEffect(() => {
    dispatch(setTotalPrice(productCount * bidPrice));
  }, [productCount, bidPrice]);

  useEffect(() => {
    socket.emit("createProdBidRoom", product?._id);
    socket.on("startBid", () => {
      dispatch(setIsBidding(true));
    });
    socket.on("stopBid", () => {
      dispatch(setIsBidding(false));
    });

    return () => {
      socket.off("startBid");
      socket.off("stopBid");
    };
  }, []);

  const increaseCount = () => {
    dispatch(setProductCount(productCount + 1));
  };

  const decreaseCount = () => {
    if (productCount > 1) {
      dispatch(setProductCount(productCount - 1));
    }
  };

  const placeBid = () => {
    if (!isBidding) return;
    setIsLoading(true);
    if (!bidPrice || bidPrice <= 0)
      dispatch(openErrorSnackbar("Bid Price cannot be Empty"));
    if (isLogin) {
      const bidData = {
        userId,
        email,
        productId: id,
        selectedSize,
        count: productCount,
        price: bidPrice,
      };
      dispatch(placingBid(bidData)).then((data) => {
        setIsLoading(false);
        dispatch(openSuccessSnackbar("Bid Placed"));
        socket.emit("bid", bidData);
        if (data.type === "cart/addProductToCart/fulfilled") {
          dispatch(openSuccessSnackbar("Prodduct added to cart!"));
        }
      });
    } else {
      dispatch(
        localAddProductToCart({
          product: product,
          productCount: productCount,
          size: selectedSize,
        })
      );
      dispatch(openSuccessSnackbar("Prodduct added to cart!"));
    }
  };

  return (
    <div className="productadd">
      <div className={"instock mb-4"}>
        {isLogin ? (
          <TextField
            id="standard-basic"
            label="Bidding Price"
            variant="standard"
            type="number"
            disabled={!isBidding}
            onChange={(e) => dispatch(setBidPrice(e.target.value))}
          />
        ) : (
          <span>Login or Signup to make Bid</span>
        )}
      </div>
      <div className="productadd-info">
        <div className="info-name-size-count">
          <span className="info-name">{productName}</span>:
          <span className="info-size">{selectedSize}</span>:
          <span className="info-count">{productCount}x</span>
        </div>
        <div className="info-totalprice">₹{totalPrice}.00</div>
      </div>
      <div className="counter-add">
        <div className="counter !max-w-full flex flex-row justify-between">
          <ProductCounter
            productCount={productCount}
            increaseCount={increaseCount}
            decreaseCount={decreaseCount}
          />
        </div>
        <div className="divider"></div>
        <button
          className={isBidding ? "button-add" : "button-add-disabled"}
          onClick={placeBid}
        >
          {isLoading ? (
            <ButtonLoader />
          ) : (
            <div>
              Place Bid <span className="divider">|</span> ₹{totalPrice}.00
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductAdd;
