import React from "react";
import AdminPanelInput from "../UI/AdminPanelInput";
import AdminPanelSelect from "../UI/AdminPanelSelect";
import AdminPanelSelectMany from "../UI/AdminPanelSelectMany";
import AdminPanelChipsInput from "../UI/AdminPanelChipsInput";
import AdminPanelTextArea from "../UI/AdminPanelTextArea";
import { categoriesEnum } from "../../../utils/categoriesEnum";

const NewProduct = (props) => {
  const handleNameInput = (value) => {
    props.setName(value);
  };

  const handlePriceInput = (value) => {
    props.setPrice(value);
  };

  const handleInStockSelect = (value) => {
    props.setInstock(value);
  };

  const handleCategoriesSelect = (value) => {
    props.setCategoriesId(value);
  };

  const handleSizesInput = (value) => {
    props.setSizes(value);
  };

  // const handleEffectsInput = (value) => {
  //   props.setEffects(value);
  // };

  // const handleRelieveInput = (value) => {
  //   props.setRelieve(value);
  // };

  // const handleIngridientsInput = (value) => {
  //   props.setIngridients(value);
  // };

  const handleShortDescriptionInput = (value) => {
    props.setShortDescription(value);
  };

  const handleDescriptionInput = (value) => {
    props.setDescription(value);
  };

  return (
    <div className="newproduct">
      <div className="newproduct-header">Product Info</div>
      <div className="product-name">
        <AdminPanelInput
          label="Product Name"
          placeholder="Product Name"
          onChange={handleNameInput}
        />
      </div>
      <div className="product-price-instock">
        <AdminPanelInput
          label="Price"
          suffix=".00 INR"
          placeholder="Product Price"
          onChange={handlePriceInput}
        />
        <AdminPanelSelect
          label="In Stock"
          options={[
            { text: "In Stock", value: true },
            { text: "Out Of Stock", value: false },
          ]}
          onChange={handleInStockSelect}
        />
      </div>
      <div className="product-categories">
        <AdminPanelSelectMany
          label="Category"
          options={[
            { text: "Vegetables", value: categoriesEnum.Vegetable },
            { text: "Fruits", value: categoriesEnum.Fruits },
            { text: "Spices", value: categoriesEnum.Spices },
            { text: "Cereals", value: categoriesEnum.Cereals },
            { text: "Others", value: categoriesEnum.Others },
          ]}
          onChange={handleCategoriesSelect}
        />
      </div>
      <div className="product-sizes">
        <AdminPanelChipsInput
          label="Sizes"
          placeholder="Size"
          onChange={handleSizesInput}
        />
      </div>
      <div className="product-shortdescription">
        <AdminPanelTextArea
          label="Short Description"
          placeholder="Short Description..."
          onChange={handleShortDescriptionInput}
        />
      </div>
      <div className="product-description">
        <AdminPanelTextArea
          label="Description"
          placeholder="Description..."
          onChange={handleDescriptionInput}
        />
      </div>
    </div>
  );
};

export default NewProduct;
