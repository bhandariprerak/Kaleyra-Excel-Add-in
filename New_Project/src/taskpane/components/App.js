import * as React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Progress from "./Progress";
import UpdatedKaleyraForm from "./UpdatedKaleyraForm";
import LoginForm from "./LoginForm";
import { connect } from "react-redux";
import KaleyraFooter from "./KaleyraFooter";

/* global console, Excel, require */

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

  // componentDidMount() {
  //   this.setState({
  //     listItems: [
  //       {
  //         icon: "Ribbon",
  //         primaryText: "Achieve more with Office integration",
  //       },
  //       {
  //         icon: "Unlock",
  //         primaryText: "Unlock features and functionality",
  //       },
  //       {
  //         icon: "Design",
  //         primaryText: "Create and visualize like a pro",
  //       },
  //     ],
  //   });
  // }

  // click = async () => {
  //   try {
  //     await Excel.run(async (context) => {
  //       /**
  //        * Insert your Excel code here
  //        */
  //       const range = context.workbook.getSelectedRange();

  //       // Read the range address
  //       range.load("address");

  //       // Update the fill color
  //       range.format.fill.color = "yellow";

  //       await context.sync();
  //       console.log(`The range address was ${range.address}.`);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  render() {
    const { title, isOfficeInitialized, loggedin } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/Kaleyra.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    return (
      <div>
        <Header logo={require("./../../../assets/Kaleyra-Logo.png")} title={this.props.title} message="Welcome" />
        {!loggedin ? <LoginForm /> : <UpdatedKaleyraForm />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loggedin: state.Valid_Login,
  };
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
  loggedin: PropTypes.bool,
};

export default connect(mapStateToProps)(App);
