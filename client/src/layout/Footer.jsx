import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-info">
          {/* <img src="" alt="logo" width="165px" /> */}
          <span className="text-lg font-bold">StreetNet</span>
          <div className="footer-info-text">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident
            laborum sunt unde fugit cumque quam explicabo officiis magnam ab hic
            ratione exercitationem accusamus consectetur rem possimus, maiores,
            temporibus quia. Atque ab, eum temporibus odit officia aut
          </div>
        </div>
        <div className="footer-links">
          <p>QUICK LINK</p>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/shop">Shop All</Link>
            </li>
            <li>
              <Link to="/shop?order=rating">Best Offers</Link>
            </li>
          </ul>
        </div>
        <div className="footer-categories">
          <p>CATEGORIES</p>
          <ul>
            <li>
              <Link to="/shop?category_id=1">Vegetables</Link>
            </li>
            <li>
              <Link to="/shop?category_id=2">Fruits</Link>
            </li>
            <li>
              <Link to="/shop?category_id=3">Spices</Link>
            </li>
            <li>
              <Link to="/shop?category_id=4">Cereals</Link>
            </li>
            <li>
              <Link to="/shop?category_id=5">Others</Link>
            </li>
          </ul>
        </div>
        <div className="footer-contact">
          <p>CONTACT US</p>
          <ul>
            <li>streetnet@gmail.com</li>
            <li>+91 XXX-XXX-XXXX</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © 2023 Street Net. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
