import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button, Alert, TextField } from "@mui/joy";
import { useEffect } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import { Snackbar, LinearProgress } from "@mui/material";
import { connect } from "react-redux";
import axios from "axios";

const KaleyraForm = (props) => {
  const [basereplace, setBasereplace] = useState([]);
  const [replacevalues, setreplacevalues] = useState({});
  const [opentoast, setopentoast] = useState(false);
  const [Errormessage, setErrormessage] = useState({ message: "error", var: "danger" });
  const [isLoading, setisloading] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors: formerrors },
  } = useForm({ defaultValues: { replaceables: [] } });

  const onSubmit = async (data) => {
    setisloading(true);
    const startRow = data.Start_Range;
    const endRow = data.End_Range;
    const Map_Ranges = new Map();

    data.replaceables.forEach((ele) => {
      Map_Ranges.set(ele.label, { ...ele, range: `${ele.value}${startRow}:${ele.value}${endRow}`, ColValues: "" });
    });

    Map_Ranges.set("MobileNumbers", {
      range: `${data.mobileNumber}${startRow}:${data.mobileNumber}${endRow}`,
      ColValues: "",
    });

    // here we map the custom variables with their values and color the custom varibales yellow
    try {
      await Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        await context.sync();
        data.replaceables.forEach(async (ele) => {
          let obj = Map_Ranges.get(ele.label);
          const range = sheet.getRange(obj.range);
          range.load("text");
          range.format.fill.color = "yellow";
          await context.sync();
          Map_Ranges.set(ele.label, { ...obj, ColValues: format_excel_data(range.text) });
        });
      });
    } catch (error) {
      console.error(error);
    }
    // here we map the custom variables object to their mobile numbers and color the mobile numbers column yellow
    try {
      await Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const mobile_range = Map_Ranges.get("MobileNumbers");
        const range = sheet.getRange(mobile_range.range);
        range.load("text");
        range.format.fill.color = "yellow";
        await context.sync();
        Map_Ranges.set("MobileNumbers", { ...mobile_range, ColValues: format_excel_data(range.text) });
      });
    } catch (error) {
      console.error(error);
    }
    let str = "";
    data.replaceables.forEach((ele) => {
      str = str + ele.label + "|";
    });

    console.log("Prepared replaceables");

    // making the batch of 500
    // var i = 0;
    // for(let j=0; j< Map_Ranges.length; j++){ 
      // var batchData = Map_Ranges.slice(i, i+500);

    const final_body = prepare_sms_body(Map_Ranges, str);
    // const final_body = prepare_sms_body(batchData, str);

    var data = JSON.stringify({
      channel: "SMS",
      type: props.template?.purpose,
      source: "MSEXCEL",
      from: props.sender_id.value,
      template_id: `${props.template?.template_id}`,
      unicode: "Auto",
      callback_profile_id: data.callbackProfileId,
      prefix: data.Prefix,
      sms: final_body,
    });

    var config = {
      method: "post",
      url: `https://cloud-api.in.kaleyra.io/v1/${props.sid}/messages/json`,
      headers: {
        "api-key": `${props.apiKey}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    console.log("API call triggered");

    axios(config)
      .then(function (response) {
        setErrormessage({ message: "successfully submitted!", var: "success" });
        setopentoast(true);
        setisloading(false);
      })
      .catch(function (error) {
        console.log(error);
        setErrormessage({ message: `${error?.code}:${error?.message}`, var: "danger" });
        setopentoast(true);
        setisloading(false);
      });
  };

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "replaceables",
  });

  useEffect(() => {
    const processBaseMessage = () => {
      let str = props.template?.content;
      let arr = str.match(/{(.*?)\}/gm);
      setBasereplace(arr);
      setValue("replaceables", []);
      let replaceobj = {};
      arr?.forEach((ele) => {
        replaceobj[ele] = replacevalues ? (replacevalues[ele] ? replacevalues[ele] : []) : [];
        append({ value: replacevalues ? replacevalues[ele] : "", label: ele, defaultValue: "" });
      });
      setreplacevalues(replaceobj);
    };
    processBaseMessage();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setopentoast(false);
  };

  const format_excel_data = (old_arr) => {
    let new_arr = [];
    old_arr.forEach((ele) => {
      new_arr.push(ele[0]);
    });
    return new_arr;
  };

  const prepare_sms_body = (all_data, str) => {
    const final_sms_body = [];
    const message = props.template?.content;
    const replace_pattern = new RegExp(`${str.slice(0, -1)}`, `gim`);

    all_data.get("MobileNumbers").ColValues.forEach((ele, i) => {
      final_sms_body.push({
        to: ele,
        body: str
          ? message.replace(replace_pattern, function (matched) {
              return all_data.get(matched)?.ColValues[i] !== ""
                ? all_data.get(matched)?.ColValues[i]
                : all_data.get(matched)?.defaultValue;
            })
          : message,
      });
    });
    console.log("Final message body prepared");
    return final_sms_body;
  };

  return (
    <div>
      <CssVarsProvider>
        <form onSubmit={handleSubmit(onSubmit)}>
          {basereplace?.length != 0 &&
            fields.map((item, index) => {
              return (
                <div key={item.id}>
                  <div style={{ display: "flex" }}>
                    <Controller
                      control={control}
                      name={`replaceables[${index}].value`}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          style={{
                            margin: "8px",
                            flex: "4 0",
                            "min-width": "100px",
                          }}
                          placeholder={"Enter Column"}
                          className={`no-form-error ${formerrors.replaceables?.[index]?.value ? "form-error" : ""}`}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`replaceables[${index}].defaultValue`}
                      // rules={{
                      //   required: true,
                      // }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          style={{
                            margin: "8px",
                            flex: "4 0",
                            "min-width": "100px",
                          }}
                          placeholder={"Enter default Value"}
                          className={`no-form-error ${formerrors.replaceables?.[index]?.value ? "form-error" : ""}`}
                        />
                      )}
                    />
                    <div
                      style={{
                        display: "flex",
                        "justify-content": "center",
                        "flex-direction": "column",
                        flex: "2 1",
                      }}
                    >
                      <Button
                        size="sm"
                        variant="plain"
                        style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
                      >
                        {`${item.label}`}
                      </Button>
                    </div>
                  </div>
                  {formerrors.replaceables?.[index]?.value &&
                    formerrors.replaceables?.[index]?.value.type === "required" && (
                      <Alert color="danger" variant="outlined" size="sm">
                        *The {item.label} is required.
                      </Alert>
                    )}
                  {formerrors.replaceables?.[index]?.defaultValue &&
                    formerrors.replaceables?.[index]?.defaultValue.type === "required" && (
                      <Alert color="danger" variant="outlined" size="sm">
                        *The default value for {item.label} is required.
                      </Alert>
                    )}
                </div>
              );
            })}
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="mobileNumber"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{
                    margin: "8px",
                    flex: "8 0",
                  }}
                  placeholder={"Enter Column"}
                />
              )}
            />
            <div style={{ display: "flex", flex: "2 0", alignItems: "center" }}>
              <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                Mobile Number
              </Button>
            </div>
          </div>
          {formerrors.mobileNumber && formerrors.mobileNumber.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              *The Mobile Number column is required.
            </Alert>
          )}
          
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="Prefix"
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{
                    margin: "8px",
                    flex: "8 0",
                  }}
                  placeholder={"(Optional)Enter Prefix"}
                />
              )}
            />
            <div style={{ display: "flex", flex: "2 0", alignItems: "center" }}>
            <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                Prefix     
              </Button>
            </div>
          </div>
          {formerrors.callbackProfileId && formerrors.callbackProfileId.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              *The Call Back profile ID is required.
            </Alert>
          )}
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="Start_Range"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{
                    margin: "8px",
                    flex: "4 0",
                    "min-width": "100px",
                  }}
                  placeholder={"Start"}
                />
              )}
            />
            <Controller
              control={control}
              name="End_Range"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{
                    margin: "8px",
                    flex: "4 0",
                    "min-width": "100px",
                  }}
                  placeholder={"End"}
                />
              )}
            />
            <div style={{ display: "flex", flex: "2 0", alignItems: "center" }}>
              <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                Enter Range
              </Button>
            </div>
          </div>
          {formerrors.Start_Range && formerrors.Start_Range.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              *The Start Range of cells are required.
            </Alert>
          )}
          {formerrors.End_Range && formerrors.End_Range.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              *The End Range of cells are required.
            </Alert>
          )}
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="callbackProfileId"
              // rules={
              //   {
              //     required: true,
              //   }
              // }
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{
                    margin: "8px",
                    flex: "8 0",
                  }}
                  placeholder={"(Optional)Enter Callback Profile ID"}
                />
              )}
            />
            <div style={{ display: "flex", flex: "2 0", alignItems: "center" }}>
              <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                Callback Profile ID
              </Button>
            </div>
          </div>
          {formerrors.callbackProfileId && formerrors.callbackProfileId.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              *The Call Back profile ID is required.
            </Alert>
          )}
          {!isLoading && (
            <div>
              <button class="button" onClick={handleSubmit(onSubmit)}>
                <span>Submit </span>
              </button>
            </div>
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
  };
};

export default connect(mapStateToProps)(KaleyraForm);
