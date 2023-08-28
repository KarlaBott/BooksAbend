import React from "react";
import { Link } from "react-router-dom";
import "../style/Footer.css";

const Footer = () => {
  return (
    <footer>
      <section className="content">
        <Link to="/checkout"> Proceed To Checkout</Link>
      </section>
    </footer>
  );
};

export default Footer;
