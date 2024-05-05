import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchOneProduct,
  fetchProductReviews,
  createReview,
  fetchProducts,
} from "../api/productsApi";
import { createProductRequest } from "../api/productRequestApi";
import { placeBid } from "../api/cartApi";

const initialState = {
  product: null,
  productId: 1,
  productImages: [],
  productName: "",
  categories: [],
  price: 0,
  totalPrice: 0,
  rating: 5,
  effects: "",
  relieve: "",
  ingridients: "",
  sizes: ["", "", ""],
  selectedSize: null,
  bidPrice: 0,
  bids: [],
  productCount: 1,
  shortDescription: "",
  description: "",
  selectedRating: 0,
  reviews: [],
  reviewsCount: 0,
  instock: true,
  reviewAddedText: null,
  reviewError: null,
  featuredProducts: [],
  isAddReviewLoading: false,
  isLoading: false,
};

export const loadOneProduct = createAsyncThunk(
  "product/loadOneProduct",
  async (id) => {
    try {
      const response = await fetchOneProduct(id);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const loadProductReviews = createAsyncThunk(
  "product/loadProductReviews",
  async (id) => {
    try {
      const response = await fetchProductReviews(id);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const addProductReview = createAsyncThunk(
  "product/addReview",
  async (arg) => {
    try {
      const response = await createReview(
        arg.userId,
        arg.productId,
        arg.name,
        arg.rate,
        arg.review
      );
      return response;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const addProductRequest = createAsyncThunk(
  "product/addProductRequest",
  async (arg) => {
    try {
      const response = await createProductRequest(
        arg.userId,
        arg.productName,
        arg.quantity,
        arg.deliveryDate,
        arg.location
      );
      return response;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const loadFeaturedProducts = createAsyncThunk(
  "shop/loadFeaturedProducts",
  async () => {
    try {
      const response = await fetchProducts(
        1,
        4,
        0,
        1000,
        [1, 2, 3, 4, 5],
        "rating"
      );
      return response;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const placingBid = createAsyncThunk("cart/placingBid", async (arg) => {
  try {
    const response = await placeBid(arg);
    return response;
  } catch (error) {
    throw error.response.data;
  }
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductId: (state, action) => {
      state.productId = action.payload;
    },
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
    setBidPrice: (state, action) => {
      state.bidPrice = action.payload;
    },
    setProductCount: (state, action) => {
      state.productCount = action.payload;
    },
    setIsBidding: (state, action) => {
      state.isBidding = action.payload;
    },
    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
    setReviewError: (state, action) => {
      state.reviewError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOneProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadOneProduct.fulfilled, (state, action) => {
        state.product = action.payload;
        state.productName = action.payload.name;
        state.productImages = action.payload.images;
        state.categories = action.payload.categories;
        state.price = action.payload.price;
        state.rating = action.payload.rating;
        state.effects = action.payload.effects;
        state.relieve = action.payload.relieve;
        state.ingridients = action.payload.ingridients;
        state.sizes = action.payload.sizes;
        state.selectedSize = action.payload.sizes[0];
        state.description = action.payload.description;
        state.shortDescription = action.payload.shortDescription;
        state.instock = action.payload.instock;
        state.isBidding = action.payload.isBidding;
        state.bids = action.payload.bids;
        state.isLoading = false;
      })
      .addCase(loadOneProduct.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(loadProductReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.reverse();
        state.reviewsCount = action.payload.length;
      })
      .addCase(addProductReview.pending, (state, action) => {
        state.isAddReviewLoading = true;
      })
      .addCase(addProductReview.fulfilled, (state, action) => {
        state.reviewsCount++;
        state.reviewAddedText = "Review added successfully!";
        state.reviewError = null;
        state.isAddReviewLoading = false;
      })
      .addCase(addProductReview.rejected, (state, action) => {
        state.reviewError = action.error.message;
        state.reviewAddedText = null;
        state.isAddReviewLoading = false;
      })
      .addCase(loadFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload.rows;
      })
      .addCase(placingBid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(placingBid.fulfilled, (state, action) => {
        state.count = action.payload?.products?.length;
        state.subTotal = action.payload?.subTotal;
        state.isLoading = false;
      })
      .addCase(placingBid.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const {
  setProductId,
  setSelectedSize,
  setProductCount,
  setIsBidding,
  setBidPrice,
  setTotalPrice,
  setReviewError,
} = productSlice.actions;

export default productSlice.reducer;
