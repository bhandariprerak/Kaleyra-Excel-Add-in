import * as React from "react";
import PropTypes from "prop-types";

export default class Header extends React.Component {
  render() {
    const { title, logo, message } = this.props;

    return (
      <section
        style={{
          display: "flex",
          height: "50px",
          // "margin-bottom": "2rem",
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
            // width="100px"
            height="20px"
            src={logo}
            alt={"Kaleyra-Logo"}
            title={"Kaleyra"}
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
