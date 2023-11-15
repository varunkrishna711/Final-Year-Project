import React from "react";
import { useNavigate } from "react-router-dom";
import NavlinkMobile from "../UI/NavlinkMobile";
import NavDropdownMobile from "../UI/NavDropDownMobile";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../store/userSlice";
import { categoriesEnum } from "../../utils/categoriesEnum";

const NavBarMobile = ({ closeNavBarModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.user.isLogin);

  const handleClickMyAccount = () => {
    navigate("/myaccount");
    closeNavBarModal();
  };
  const handleClickMyCart = () => {
    navigate("/cart");
    closeNavBarModal();
  };
  const handleLogout = () => {
    dispatch(userLogout());
    closeNavBarModal();
  };

  return (
    <div className="navbarmobile-wrapper">
      <button className="closebtn" onClick={closeNavBarModal}>
        <CloseRoundedIcon sx={{ fontSize: "27px" }} />
      </button>

      <div className="navbarmobile">
        <ul className="nav-mobile">
          <NavlinkMobile
            value="Home"
            link="/"
            closeNavBarModal={closeNavBarModal}
          />
          <NavlinkMobile
            value="Shop All"
            link="/shop"
            closeNavBarModal={closeNavBarModal}
          />
          <NavDropdownMobile
            title="Categories"
            items={[
              { text: "Vegetables", link: "/shop?category_id=1" },
              { text: "Fruits", link: "/shop?category_id=2" },
              { text: "Spices", link: "/shop?category_id=3" },
              { text: "Cereals", link: "/shop?category_id=4" },
              { text: "Others", link: "/shop?category_id=5" },
            ]}
            closeNavBarModal={closeNavBarModal}
          />
          {/* <NavlinkMobile
            value="Best Offers"
            link="/shop?order=rating"
            closeNavBarModal={closeNavBarModal}
          />
          <NavDropdownMobile
            title="Categories"
            items={[
              { text: "Vegetables", value: categoriesEnum.Vegetable },
              { text: "Fruits", value: categoriesEnum.Fruits },
              { text: "Spices", value: categoriesEnum.Spices },
              { text: "Cereals", value: categoriesEnum.Cereals },
              { text: "Others", value: categoriesEnum.Others },
            ]}
            closeNavBarModal={closeNavBarModal}
          /> */}
          {/* <NavlinkMobile
            value="Omega"
            link="/shop?category_id=9"
            closeNavBarModal={closeNavBarModal}
          /> */}
        </ul>
        <div className="navbarmobile-browse">
          <div className="text-browse">BROWSE</div>
          <ul className="browse-menu">
            <li className="browse-menu-item" onClick={handleClickMyCart}>
              <ShoppingCartOutlinedIcon sx={{ fontSize: "14px" }} />{" "}
              <span>My Cart</span>
            </li>
            {isLogin && (
              <>
                <li className="browse-menu-item" onClick={handleClickMyAccount}>
                  <ManageAccountsIcon sx={{ fontSize: "14px" }} />{" "}
                  <span>My Account</span>
                </li>
                <li
                  className="browse-menu-item logout-item"
                  onClick={handleLogout}
                >
                  <LogoutIcon sx={{ fontSize: "14px" }} /> <span>Logout</span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBarMobile;
