import React from "react";
import AdminPagination from "./AdminPagination";
import ProductListCard from "../cards/ProductListCard";
import { categoriesEnum } from "../../../utils/categoriesEnum";

const ProductList = (props) => {
  const handleNameInput = (e) => {
    props.setName(e.target.value);
  };

  const handleMinPriceInput = (e) => {
    props.setMinPrice(e.target.value);
  };

  const handleMaxPriceInput = (e) => {
    props.setMaxPrice(e.target.value);
  };

  const handleCategorySelect = (e) => {
    if (e.target.value === "all") {
      props.setCategoryId(null);
    } else {
      props.setCategoryId(e.target.value);
    }
  };

  const handleInstockSelect = (e) => {
    if (e.target.value === "all") {
      props.setInStock(null);
    } else {
      props.setInStock(e.target.value);
    }
  };

  const handleLimitSelect = (e) => {
    props.setLimit(e.target.value);
    props.changeLimit(e.target.value);
  };

  const handlePageChange = (value) => {
    props.setPage(value);
    props.changePage(value);
  };

  return (
    <div className="productlist">
      <table className="productlist-table">
        <thead className="table-header">
          <tr className="table-header-tr">
            <th className="table-header-th th-id">
              <div className="th-content">
                <div className="th-text">Id</div>
              </div>
            </th>
            <th className="table-header-th th-image">
              <div className="th-content">
                <div className="th-text"> Image</div>
              </div>
            </th>
            <th className="table-header-th th-productname">
              <div className="th-content">
                <div className="th-text">Product Name</div>
                <input
                  className="th-input input-product-name"
                  type="text"
                  placeholder="Product Name"
                  onChange={(e) => handleNameInput(e)}
                />
              </div>
            </th>
            <th className="table-header-th th-price">
              <div className="th-content">
                <div className="th-text">Price</div>
                <div className="th-input-group">
                  <input
                    className="th-input input-price"
                    type="text"
                    placeholder="Min"
                    onChange={(e) => handleMinPriceInput(e)}
                  />
                  <input
                    className="th-input input-price"
                    type="text"
                    placeholder="Max"
                    onChange={(e) => handleMaxPriceInput(e)}
                  />
                </div>
              </div>
            </th>
            <th className="table-header-th th-category">
              <div className="th-content">
                <div className="th-text">Category</div>
                <select
                  className="th-select"
                  onChange={(e) => handleCategorySelect(e)}
                >
                  <option value={"all"}>All</option>
                  <option value={categoriesEnum.Vegetable}>Vegetables</option>
                  <option value={categoriesEnum.Fruits}>Fruits</option>
                  <option value={categoriesEnum.Spices}>Spices</option>
                  <option value={categoriesEnum.Cereals}>Cereals</option>
                  <option value={categoriesEnum.Others}>Others</option>
                </select>
              </div>
            </th>
            <th className="table-header-th th-status">
              <div className="th-content">
                <div className="th-text">Status</div>
                <select
                  className="th-select"
                  onChange={(e) => handleInstockSelect(e)}
                >
                  <option value="all">All</option>
                  <option value={true}>In stock</option>
                  <option value={false}>Out of stock</option>
                </select>
              </div>
            </th>
            <th className="table-header-th th-remove">
              <div className="th-content th-content-remove">
                <div className="th-text th-text-remove"></div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.products?.rows?.map((product) => (
            <ProductListCard
              key={product._id}
              _id={product._id}
              id={product._id.slice(0, 5)}
              image={product.images[0]}
              name={product.name}
              price={product.price}
              categories={product.categories}
              inStock={product.instock}
            />
          ))}
        </tbody>
      </table>
      <div className="productlist-pagination">
        <div className="pagination-results-per-page">
          Show
          <select
            className="select-per-page"
            onChange={(e) => handleLimitSelect(e)}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          per page
        </div>
        <div>
          <AdminPagination
            pageCount={props.pageCount}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
