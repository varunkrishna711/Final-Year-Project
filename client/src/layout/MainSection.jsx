import React from "react";
import { Link } from "react-router-dom";
import mainimage from "../assets/images/capsicum.png";

const MainSection = () => {
  return (
    <section>
      <div className="mainsection-text">
        {/* <p className="bestseller"></p> */}
        <h1>CONNECTING VENDORS & PRODUCERS NEARBY</h1>
        <p className="vitamins-supplements">Fruits, Vegetables & more</p>
        <p className="freeshipping">
          Get your bonus<span>|</span>Free shipping
        </p>
        <Link to="shop">
          <button>Shop All</button>
        </Link>
      </div>
      <div className="mainsection-img">
        <img src={mainimage} alt="" />
      </div>
    </section>
  );
};

export default MainSection;
