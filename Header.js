import * as React from "react";
import PropTypes from "prop-types";

export default class Header extends React.Component {
  render() {
    const { title, logo, message } = this.props;

    return (
      <section>
        <img width="100" src={logo} alt={title} title={title} style={{"marginLeft":"10px", "marginTop":"10px", "marginBottom":"20px"}}/>
      </section>
    );
  }
}


Header.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.string,
  message: PropTypes.string,
};
