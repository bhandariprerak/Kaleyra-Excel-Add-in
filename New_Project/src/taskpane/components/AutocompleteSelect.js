import React from "react";
import Select, { components } from "react-select";

const Input = (props) => {
  const { autoComplete = props.autoComplete } = props.selectProps;
  return <components.Input {...props} autoComplete={autoComplete} />;
};

const AutocompleteSelect = (props) => {
  return (
    <Select
      components={{ Input }}
      autoComplete="new-password"
      options={props.senderidOptions}
      onChange={(e) => props.setsender(e)}
      value={props.value}
    />
  );
};

export default AutocompleteSelect;
