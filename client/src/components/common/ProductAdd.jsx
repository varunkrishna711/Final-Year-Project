import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCounter from "./ProductCounter";
import ButtonLoader from "../loaders/ButtonLoader";
import checkicon from "../../assets/icons/check.svg";
import {
  setProductCount,
  setTotalPrice,
  setBidPrice,
} from "../../store/productSlice";
import { placingBid, localAddProductToCart } from "../../store/cartSlice";
import { openSuccessSnackbar } from "../../store/modalSlice";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";

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
  const isBidding = useSelector((state) => state.product?.product?.isBidding);
  const isLoading = useSelector((state) => state.user.isAddToCartLoading);
  const { id } = useParams();
  const bidPrice = useSelector((state) => state.product?.bidPrice);

  useEffect(() => {
    dispatch(setTotalPrice(productCount * bidPrice));
  }, [productCount, bidPrice]);

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
    if (isLogin) {
      dispatch(
        placingBid({
          userId,
          email,
          productId: id,
          selectedSize,
          count: productCount,
          price: bidPrice,
        })
      ).then((data) => {
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
