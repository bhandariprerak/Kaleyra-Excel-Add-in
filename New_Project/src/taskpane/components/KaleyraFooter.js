import React from "react";
import { FaFacebook, FaTwitterSquare, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";

const KaleyraFooter = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px",
        alignItems: "center",
        //position: "fixed",
        //bottom: "0",
        //width: "100%",
        backgroundColor: "white",
      }}
    >
      <div style={{ flex: "5 1", fontWeight: "bold", display: "flex" }}>
        <span>Sent with&nbsp;</span>
        <AiFillHeart style={{ fontSize: "large", color: "red" }} /> <span>&nbsp;from&nbsp;</span>
        <img src="../../../assets/KaleyraLogo.png" style={{ width: "20px", height: "20px" }} />
      </div>
      <div style={{ flex: "4 2" }}></div>
      <div style={{ display: "flex", flex: "4 1", justifyContent: "space-evenly" }}>
        <a href="https://www.facebook.com/KaleyraPlatform/">
          <FaFacebook style={{ fontSize: "x-large", color: "#303081" }} />
        </a>
        <a href="https://twitter.com/kaleyra_">
          <FaTwitterSquare style={{ fontSize: "x-large", color: "#303081" }} />
        </a>
        <a href="https://instagram.com/kaleyra.cloudcomm/">
          <FaInstagramSquare style={{ fontSize: "x-large", color: "#303081" }} />
        </a>
        <a href="https://www.linkedin.com/company/kaleyra/">
          <FaLinkedin style={{ fontSize: "x-large", color: "#303081" }} />
        </a>
      </div>
    </div>
  );
};

export default KaleyraFooter;
