import * as React from "react";
import PropTypes from "prop-types";

export default class Header extends React.Component {
  render() {
    const { title, logo, message } = this.props;

    return (
      <section
        style={{
          display: "flex",
          height: "75px",
          // "border-bottom": "1px solid black",
          "margin-bottom": "2rem",
          // backgroundColor: "#c9e0f5",
        }}
      >
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            "justify-content": "center",
            "margin-left": "3px",
          }}
        >
          <img
            width="100"
            // height="50px"
            src={logo}
            alt={"Kaleyra_Logo"}
            title={"Kaleyra"}
            // style={{ borderRadius: "20px" }}
          />
        </div>
        <div style={{ flex: "1 0" }}></div>
        {/* <h1 style={{ flex: "4 0", "font-style": "italic" }}>{"Excel Add-In"}</h1> */}
      </section>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.string,
  message: PropTypes.string,
};
