export const API_KEY = (ApiKey) => {
  return {
    type: "SET_API_KEY",
    payload: {
      API_KEY: ApiKey,
    },
  };
};

export const SID = (val) => {
  return {
    type: "SET_SID",
    payload: {
      SID: val,
    },
  };
};

export const LOGIN = (val) => {
  return {
    type: "SET_LOGIN",
    payload: {
      valid: val,
    },
  };
};

export const Sender_ID = (val) => {
  return {
    type: "UPDATE_SENDER_IDS",
    payload: {
      sender_ids: val,
    },
  };
};

export const Formatted_Sender_ID = (val) => {
  return {
    type: "FORMAT_SENDER_IDS",
    payload: {
      Format_sender_ids: val,
    },
  };
};

export const Template_Data = (val) => {
  return {
    type: "UPDATE_TEMPLATE_DATA",
    payload: {
      template_data: val,
    },
  };
};
