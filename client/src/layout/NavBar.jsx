import React from "react";
import Navlink from "../components/UI/Navlink.jsx";
import NavDropdown from "../components/UI/NavDropdown.jsx";
import OpenCartModal from "../components/common/OpenCartModal.jsx";

const NavBar = () => {
  return (
    <div className="navbar">
      <ul className="nav">
        <Navlink value="Home" link="/" />
        <Navlink value="Shop All" link="/shop" />
        <Navlink value="Map" link="/map" />
        <Navlink value="Request Product" link="/product-request" />
        <Navlink value="Chat" link="/chats" />
        <NavDropdown
          title="Categories"
          items={[
            { text: "Vegetables", link: "/shop?category_id=1" },
            { text: "Fruits", link: "/shop?category_id=2" },
            { text: "Spices", link: "/shop?category_id=3" },
            { text: "Cereals", link: "/shop?category_id=4" },
            { text: "Others", link: "/shop?category_id=5" },
          ]}
        />
      </ul>

      <OpenCartModal />
    </div>
  );
};

export default NavBar;
