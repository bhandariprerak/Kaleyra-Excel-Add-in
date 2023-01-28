const intialState = {
  API_KEY: "",
  SID: "",
  Valid_Login: false,
};

const KaleyraReducer = (state = intialState, action) => {
  switch (action.type) {
    case "SET_API_KEY":
      return {
        ...state,
        API_KEY: action.payload.API_KEY,
      };

    case "SET_SID":
      return {
        ...state,
        SID: action.payload.SID,
      };

    case "SET_LOGIN":
      return {
        ...state,
        Valid_Login: action.payload.valid,
      };

    case "UPDATE_SENDER_IDS":
      return {
        ...state,
        Sender_IDS: action.payload.sender_ids,
      };

    case "UPDATE_TEMPLATE_DATA":
      return {
        ...state,
        Template_Data: action.payload.template_data,
      };

    case "FORMAT_SENDER_IDS":
      return {
        ...state,
        Formatted_Sender_Ids: action.payload.Format_sender_ids,
      };

    default:
      return { ...state };
  }
};

export default KaleyraReducer;
