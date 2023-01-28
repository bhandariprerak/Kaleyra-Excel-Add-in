import React from "react";
import { FaFacebook, FaTwitterSquare, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";

const KaleyraFooter = () => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px", alignItems: "center" }}>
      <div style={{ flex: "1 0" }}>
        <img src="../../../assets/Kaleyra.png" style={{ width: "30px", height: "30px" }} />
      </div>
      <div style={{ flex: "4 1", fontWeight: "bold" }}>
        <span>
          Sent with <AiFillHeart style={{ fontSize: "large", color: "red" }} /> from Kaleyra
        </span>
      </div>
      <div style={{ flex: "4 2" }}></div>
      <div style={{ display: "flex", flex: "4 1", justifyContent: "space-evenly" }}>
        <FaFacebook style={{ fontSize: "x-large", color: "#303081" }} />
        <FaTwitterSquare style={{ fontSize: "x-large", color: "#303081" }} />
        <FaInstagramSquare style={{ fontSize: "x-large", color: "#303081" }} />
        <FaLinkedin style={{ fontSize: "x-large", color: "#303081" }} />
      </div>
      {/* <div>
        <span>
          For general support, please click <a style={{ color: "red" }}>here</a>
        </span>
      </div>
      <div>
        <span>
          If you need to talk to us, please fill out the following <a style={{ color: "red" }}>form</a>
        </span>
      </div> */}
    </div>
  );
};

export default KaleyraFooter;
