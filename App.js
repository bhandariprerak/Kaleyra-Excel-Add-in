import * as React from "react";
import PropTypes from "prop-types";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import HeroList from "./HeroList";
import Progress from "./Progress";
import KaleyraForm from "./KaleyraForm";

/* global console, Excel, require */

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

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
    const { title, isOfficeInitialized } = this.props;

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
      <div className="ms-welcome">
        <Header logo={require("./../../../assets/Kaleyra-Logo.png")} title={this.props.title} message="" />
        <KaleyraForm />
      </div>
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
