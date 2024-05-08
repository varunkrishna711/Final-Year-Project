import React from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { deleteProduct, loadProducts } from "../../../store/adminSlice";
import {
  openSuccessSnackbar,
  openErrorSnackbar,
  openAdminModal,
  closeAdminModal,
} from "../../../store/modalSlice";

const ProductListCard = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToProductEditPage = () => {
    navigate(`edit/${props._id}`);
  };
  const goToProductPage = () => {
    navigate(`${props._id}`);
  };

  const handleDelete = () => {
    dispatch(deleteProduct(props._id)).then((data) => {
      if (data.type === "admin/deleteProduct/fulfilled") {
        dispatch(openSuccessSnackbar("Product successfully deleted"));
        dispatch(
          loadProducts({
            categoryId: null,
            name: null,
            page: 1,
            limit: 10,
            minPrice: 0,
            maxPrice: 1000,
            inStock: null,
          })
        );
        dispatch(closeAdminModal());
      }
      if (data.type === "admin/deleteProduct/rejected") {
        dispatch(openErrorSnackbar(data.error.message));
        dispatch(closeAdminModal());
      }
    });
  };

  const onClickDelete = () => {
    dispatch(
      openAdminModal({
        text: `Delete product ${props.name}`,
        callback: handleDelete,
      })
    );
  };

  return (
    <tr className="productlistcard">
      <td>
        <div className="td-content td-id">
          <button className="link-button" onClick={goToProductPage}>
            #{props.id}
          </button>
        </div>
      </td>
      <td>
        <div className="td-content td-image">
          <div className="overflow-hidden image-wrapper">
            <img src={props.image} alt="productimg" />
          </div>
        </div>
      </td>
      <td>
        <div className="td-content td-productname">
          <button className="link-button" onClick={goToProductPage}>
            {props.name}
          </button>
        </div>
      </td>
      <td>
        <div className="td-content td-price">
          ₹<span>{props.price}</span>.00
        </div>
      </td>
      <td>
        <div className="td-content td-category">
          {props.categories?.map((category) => (
            <span key={category.id}>{category.name}</span>
          ))}
        </div>
      </td>
      <td>
        <div className="td-content td-status">
          {props.inStock ? (
            <span className="instock-true">In stock</span>
          ) : (
            <span className="instock-false">Out Of stock</span>
          )}
        </div>
      </td>
      <td>
        <div className="flex flex-row td-content td-remove">
          <button className="delete-product-btn" onClick={onClickDelete}>
            <DeleteIcon sx={{ fontSize: "20px" }} />
          </button>
          <button className="delete-product-btn" onClick={goToProductEditPage}>
            <EditIcon sx={{ fontSize: "20px" }} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductListCard;
