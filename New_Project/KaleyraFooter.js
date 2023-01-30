import React from "react";
import { FaFacebook, FaTwitterSquare, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { AiFillHeart, AiOutlineInstagram } from "react-icons/ai";

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
        <a href="https://www.facebook.com/KaleyraPlatform/" title="Facebook">
          <FaFacebook style={{ fontSize: "x-large", color: "#3b5998" }} />
        </a>
        <a href="https://twitter.com/kaleyra_" title="Twitter">
          <FaTwitterSquare style={{ fontSize: "x-large", color: "#00acee" }} />
        </a>
        <a href="https://instagram.com/kaleyra.cloudcomm/" title="Instagram">
          <AiOutlineInstagram
            style={{
              fontSize: "x-large",
              color: "white",
              borderRadius: "5px",
              background:
                "radial-gradient(circle farthest-corner at 35% 90%, #fec564, transparent 50%), radial-gradient(circle farthest-corner at 0 140%, #fec564, transparent 50%), radial-gradient(ellipse farthest-corner at 0 -25%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 20% -50%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 0, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 60% -20%, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 100%, #d9317a, transparent), linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%)",
            }}
          />
        </a>
        <a href="https://www.linkedin.com/company/kaleyra/" title="LinkedIn">
          <FaLinkedin style={{ fontSize: "x-large", color: "#0e76a8" }} />
        </a>
      </div>
    </div>
  );
};

export default KaleyraFooter;
