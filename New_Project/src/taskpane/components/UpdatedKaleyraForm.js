import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { LOGIN } from "../components/Redux/Actions";
import AutocompleteSelect from "./AutocompleteSelect";
import { TextField, Alert, Button } from "@mui/joy";
import { CssVarsProvider } from "@mui/joy/styles";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Template_Card from "./Template_Card";
import KaleyraForm from "./KaleyraForm";
import { LinearProgress } from "@mui/material";
import KaleyraFooter from "./KaleyraFooter";

const UpdatedKaleyraForm = (props) => {
  const [senderid, setsenderid] = useState({});
  const [formatedTemplates, setformattedTemplates] = useState([]);
  const [template, settemplate] = useState({});
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const formatted_template_options = [];
    if (props.Templates_data?.length !== 0 && senderid !== {}) {
      const template_options = props.Templates_data?.filter((ele) => ele.sender_id === senderid.value);
      template_options?.forEach((ele) => {
        formatted_template_options.push({ ...ele, label: ele.title, value: ele.id });
      });
    }
    setformattedTemplates(formatted_template_options);
  }, [senderid]);

  useEffect(() => {
    if (Object.keys(template).length !== 0 && Object.keys(senderid).length !== 0) {
      setloading(true);
      setTimeout(() => {
        setloading(false);
      }, 2000);
    }
  }, [template]);

  return (
    <div style={{ position: "relative" }}>
      <img
        src="../../../assets/background.png"
        style={{ position: "absolute", "z-index": "-1", opacity: "0.35", top: "0" }}
      />
      <div style={{ width: "80%", margin: "auto", paddingBottom: "75px" }}>
        {/* <img
          src="../../../assets/background.png"
          style={{ position: "absolute", "z-index": "-1", opacity: "0.35", top: "0" }}
        /> */}
        <CssVarsProvider>
          <div>
            <IoArrowBackCircleOutline
              style={{ "font-size": "xx-large", color: "#383887" }}
              onClick={() => {
                props.goBack(false);
              }}
            />
          </div>

          <div style={{ display: "flex" }}>
            <div style={{ margin: "8px", flex: "8 2" }}>
              <AutocompleteSelect
                setsender={(sender) => {
                  setsenderid(sender);
                  settemplate({});
                }}
                senderidOptions={props.formatted_senderid_options}
                value={senderid}
              />
            </div>
            <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 1" }}>
              <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                Sender ID
              </Button>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ margin: "8px", flex: "8 2" }}>
              <AutocompleteSelect
                setsender={(template) => settemplate(template)}
                senderidOptions={formatedTemplates}
                value={template}
              />
            </div>
            <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 1" }}>
              <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                Select Template
              </Button>
            </div>
          </div>
          {Object.keys(template).length !== 0 && (
            <Template_Card
              title={template.title || ""}
              content={template.content || ""}
              created_at={template.created_at || ""}
              full_name={template.full_name || ""}
            />
          )}
        </CssVarsProvider>
        <div>
          {Object.keys(template).length !== 0 &&
            Object.keys(senderid).length !== 0 &&
            (loading ? (
              <LinearProgress style={{ margin: "10px" }} />
            ) : (
              <KaleyraForm template={template} sender_id={senderid} />
            ))}
        </div>
      </div>
      <div style={{ position: "fixed", width: "100%", bottom: "0" }}>
        <KaleyraFooter />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loggedin: state.Valid_Login,
    Sender_Arr: state.Sender_IDS,
    Templates_data: state.Template_Data,
    formatted_senderid_options: state.Formatted_Sender_Ids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    goBack: (val) => {
      dispatch(LOGIN(val));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UpdatedKaleyraForm);
