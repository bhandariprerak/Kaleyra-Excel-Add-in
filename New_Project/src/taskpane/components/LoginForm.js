import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { CssVarsProvider } from "@mui/joy/styles";
import { TextField, Alert, Button } from "@mui/joy";
import { connect } from "react-redux";
import { API_KEY, SID, LOGIN, Sender_ID, Template_Data, Formatted_Sender_ID } from "../components/Redux/Actions";
import { Snackbar, LinearProgress } from "@mui/material";
import axios from "axios";

const LoginForm = (props) => {
  const defaultValues = {
    apiKey: props.apiKey,
    sidKey: props.sid,
  };

  const {
    handleSubmit,
    control,
    formState: { errors: formerrors },
  } = useForm({ defaultValues });

  const [opentoast, setopentoast] = useState(false);
  const [Errormessage, setErrormessage] = useState({ message: "error", var: "danger" });
  const [isLoading, setisloading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setopentoast(false);
  };

  const onSubmitLogin = (data) => {
    //Todo - pass the api key and sid to fetch and verify

    setisloading(true);

    var config = {
      method: "get",
      url: `https://api.in.kaleyra.io/v1/${data.sidKey}/messages/identifier`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "api-key": data.apiKey,
      },
    };

    axios(config)
      .then(function (response) {
        props.submitkeys({ ...data, login: true, sender_ids: response.data.data });
        setisloading(false);
        Load_Template(data);
        formated_sender_id(response.data.data);
      })
      .catch(function (error) {
        setopentoast(true);
        setErrormessage({ message: error?.response?.data?.error.error, var: "danger" }); 
        setisloading(false);
      });
  };

  const Load_Template = (val) => {
    var config_template = {
      method: "get",
      url: `https://api.in.kaleyra.io/v1/${val.sidKey}/messages/template?status={"is":1}`,
      // url: `https://cloud-api-stage.smsinfini.com/v1/${val.sidKey}/messages/template?status={"is":1}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "api-key": val.apiKey,
      },
    };

    axios(config_template)
      .then(function (response) {
        props.storeTemplate(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
        setopentoast(true);
        setErrormessage({ message: error?.response?.data?.error.error, var: "danger" });
      });
  };

  const formated_sender_id = (Sender_IDS) => {
    const sender_options = [];
    Sender_IDS?.forEach((ele) => {
      sender_options.push({ label: ele.identifier, value: ele.identifier });
    });
    props.updateSenderIDS(sender_options);
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "auto",
        alignContent: "center",
      }}
    >
      <img
        src="../../../assets/background2.png"
        style={{ position: "absolute", "z-index": "-1", opacity: "0.3", bottom: "0" }}
      />
      <CssVarsProvider>
        <form onSubmit={handleSubmit(onSubmitLogin)}>
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="apiKey"
              rules={{
                required: true,
              }}
              defaultValue={props.apiKey}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ margin: "8px", flex: "8 0" }}
                  placeholder={"Enter API Key"}
                  autoComplete={"off"}
                  className={`no-form-error ${formerrors.apikey ? "form-error" : ""}`}
                />
              )}
            />
            <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 0" }}>
              <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                API-Key
              </Button>
            </div>
          </div>
          {formerrors.apiKey && formerrors.apiKey.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              **The API Key is required.
            </Alert>
          )}
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="sidKey"
              rules={{
                required: true,
              }}
              defaultValue={props.sid}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ margin: "8px", flex: "8 0" }}
                  placeholder={"Enter SID"}
                  autoComplete={"off"}
                  className={`no-form-error ${formerrors.sidKey ? "form-error" : ""}`}
                />
              )}
            />
            <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 0" }}>
              <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                SID
              </Button>
            </div>
          </div>
          {formerrors.sidKey && formerrors.sidKey.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              **The SID is required.
            </Alert>
          )}
          {!isLoading && (
            <input
              type="submit"
              value={"Next"}
              style={{
                backgroundColor: "#0066A2",
                color: "white",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                width: "80px",
                height: "48px",
                borderRadius: "25px",
                marginTop: "10px",
              }}
            />
          )}
        </form>
      </CssVarsProvider>
      {isLoading && (
        <div>
          <LinearProgress />
        </div>
      )}
      <Snackbar open={opentoast} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} color={Errormessage.var} sx={{ width: "100%" }}>
          {Errormessage.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    apiKey: state.API_KEY,
    sid: state.SID,
    loggin: state.Valid_Login,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitkeys: (Submit_data) => {
      dispatch(API_KEY(Submit_data.apiKey));
      dispatch(SID(Submit_data.sidKey));
      dispatch(LOGIN(Submit_data.login));
      dispatch(Sender_ID(Submit_data.sender_ids));
    },
    storeTemplate: (template_data) => {
      dispatch(Template_Data(template_data));
    },
    updateSenderIDS: (val) => {
      dispatch(Formatted_Sender_ID(val));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
