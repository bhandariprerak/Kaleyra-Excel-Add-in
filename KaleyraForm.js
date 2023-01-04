import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button, Textarea, Alert, TextField } from "@mui/joy";
import { useEffect } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import { TextareaAutosize, Snackbar } from "@mui/material";
import axios from "axios";

// var axios = require('axios');

const KaleyraForm = () => {
  const [validNums, setValidnums] = useState([]);
  const [mobilenumber, setmobileNumber] = useState("");
  const [basereplace, setBasereplace] = useState([]);
  const [replacevalues, setreplacevalues] = useState({});
  const [opentoast, setopentoast] = useState(false);
  const [Errormessage, setErrormessage] = useState({ message: "error", var: "danger" });

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors: formerrors },
    reset,
  } = useForm({ defaultValues: { replaceables: [] } });

  useEffect(() => {
    let str = "";
    validNums.forEach((num) => {
      str = str + num + ",";
    });
    setmobileNumber(str.slice(0, -1));
    setValue("mobileNumbers", str);
  }, [validNums]);

  const onSubmit = (data) => {
    let error = false;
    const mobilenum = data.mobileNumbers.split(",").slice(0, -1);
    
    // check if user has added variables in base message 
    if (
      (data.baseMessage.match(/{{(.*?)\}}/gm) != null || data.baseMessage.match(/{{(.*?)\}}/gm) === []) &&
      data.replaceables?.length === 0
    ) {
      error = true;
      setErrormessage({ message: "Click on Add variables", var: "warning" });
      setopentoast(true);
    }
    /* Add condition to check if the length of mobile numbers and replaceables are same or not */

    // check if length of mobile numbers and all replaceable fields are equal
    if (data.replaceables) {
      for (let i = 0; i < data.replaceables?.length; i++) {
        if (data.replaceables[i]?.value?.length != mobilenum.length) {
          error = true;
          setErrormessage({
            message: `${
              mobilenum.length > data.replaceables[i]?.value?.length
                ? `${data.replaceables[i]?.label} has ${Math.abs(
                    data.replaceables[i]?.value?.length - mobilenum.length
                  )} less values`
                : `Add ${Math.abs(data.replaceables[i]?.value?.length - mobilenum.length)} more mobile numbers`
            }`,
            var: "danger",
          });
          setopentoast(true);
          break;
        }
      }
    }
    if (!error){

      for (let i in mobilenum) {
        let tonumber = mobilenum[i];
        let message = data.baseMessage;
        for (let j in data.replaceables) {
          message = message.replace(`${data.replaceables[j].label}`, `${data.replaceables[j].value[i]}`);
        }
        var payloadData = JSON.stringify({
          "to": tonumber,
          "sender": data.senderID,
          "source": "api", // TODO: get new source "ms-excel-add-in" whitelisted from sms team.
          "type": data.messageType,
          "body": message,
          "template_id": data.templateID
        });
        var config = {
          method: 'post',
          url: `https://api.kaleyra.io/v1/${data.sidKey}/messages`,
          headers: { 
            'api-key': data.apiKey, 
            'Content-Type': 'application/json'
          },
          data : payloadData
        };
        axios(config)
        .then(function (response) {
           console.log(JSON.stringify(response.data));
           setErrormessage({ message: "Successful API call", var: "success" });
           setopentoast(true);
        })  
        .catch(function (error) {
          console.log(error);
          setErrormessage({ message: "ERROR in API call", var: "danger" });
          setopentoast(true);
        });
      }
      setErrormessage({ message: "Successfully Submitted Form", var: "success" });
      setopentoast(true);
      reset({});
      setValidnums([]);
      setmobileNumber("");
      setBasereplace([]);
      setreplacevalues({});
    }
  };

  const { fields, append } = useFieldArray({
    control,
    name: "replaceables",
  });

  const processBaseMessage = () => {
    let str = getValues("baseMessage");
    let arr = str.match(/{{(.*?)\}}/gm);
    setBasereplace(arr);
    setValue("replaceables", []);
    let replaceobj = {};
    arr?.forEach((ele) => {
      replaceobj[ele] = replacevalues ? (replacevalues[ele] ? replacevalues[ele] : []) : [];
      append({ value: replacevalues ? replacevalues[ele] : "", label: ele });
    });
    setreplacevalues(replaceobj);
  };

  const getNumbers = async (label, index) => {
    let numbers = [];
    let num_cols = 0;
    let formattednumbers = [];
    try {
      await Excel.run(async (context) => {
        /**
         * Insert your Excel code here
         */
        const range = context.workbook.getSelectedRange();
        // Read the range address

        range.load("address");
        range.load("values");
        range.load("columnCount");

        // Update the fill color
        range.format.fill.color = "yellow";

        await context.sync();
        numbers = range.values;
        num_cols = range.columnCount;
      });
      if (num_cols <= 1) {
        switch (label) {
          case "mobileNumber":
            numbers.forEach((num) => {
              if (Number.isInteger(num[0]) && num[0].toString().length <= 12) {
                formattednumbers.push(num[0]);
              }
            });
            setValidnums(Array.from(new Set([...validNums, ...formattednumbers])));
            break;

          default:
            console.log("default case");
            numbers.forEach((num) => {
              formattednumbers.push(num[0]);
            });
            setreplacevalues({ ...replacevalues, [label]: [...replacevalues[label], ...formattednumbers] });
            setValue(`replaceables[${index}].value`, [...replacevalues[label], ...formattednumbers]);
            break;
        }
      } else {
        setErrormessage({ message: "Select only one column!", var: "danger" });
        setopentoast(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setopentoast(false);
  };

  const resetNumbers = (label, index) => {
    switch (label) {
      case "mobileNumber":
        setmobileNumber("");
        setValidnums([]);
        setValue("mobileNumbers", "");
        break;

      default:
        setreplacevalues({ ...replacevalues, [label]: "" });
        setValue(`replaceables[${index}].value`, "");
        break;
    }
  };

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <CssVarsProvider>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="mobileNumbers"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <TextareaAutosize
                  {...field}
                  style={{
                    margin: "8px",
                    flex: "8 0",
                    height: "100px",
                    width: "50%",
                    resize: "vertical",
                    overflow: "auto",
                    opacity: "1",
                    color: "rgba(0, 0, 0, 1)",
                    borderRadius: "5px",
                    padding: "8px",
                    backgroundColor: "white",
                  }}
                  minRows={4}
                  value={mobilenumber}
                  disabled
                  placeholder={"Select mobile numbers from the sheet"}
                />
              )}
            />
            <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 0" }}>
              <Button
                size="sm"
                variant="soft"
                style={{ "margin-bottom": "8px", height: "fit-content" }}
                onClick={() => getNumbers("mobileNumber", 0)}
              >
                Get Numbers
              </Button>
              <Button
                size="sm"
                variant="soft"
                style={{ "margin-bottom": "8px", height: "fit-content" }}
                onClick={() => resetNumbers("mobileNumber", 0)}
              >
                Clear
              </Button>
            </div>
          </div>
          {formerrors.mobileNumbers && formerrors.mobileNumbers.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              *The Mobile Numbers are required.
            </Alert>
          )}
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="apiKey"
              rules={{
                required: true,
              }}
              defaultValue={""}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ margin: "8px", flex: "8 0" }}
                  placeholder={"Enter API Key"}
                  autoComplete={"on"}
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
              *The API Key is required.
            </Alert>
          )}
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="sidKey"
              rules={{
                required: true,
              }}
              defaultValue={""}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ margin: "8px", flex: "8 0" }}
                  placeholder={"Enter SID"}
                  autoComplete={"on"}
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
              *The SID is required.
            </Alert>
          )}
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="senderID"
              rules={{
                required: true,
                pattern: /^[A-Za-z]+$/gm,
              }}
              defaultValue={""}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ margin: "8px", flex: "8 0" }}
                  placeholder={"Enter Sender ID"}
                  autoComplete={"on"}
                  className={`no-form-error ${formerrors.senderID ? "form-error" : ""}`}
                />
              )}
            />
            <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 0" }}>
              <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                Sender ID
              </Button>
            </div>
          </div>
          {formerrors.senderID && formerrors.senderID.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              *The Sender ID is required.
            </Alert>
          )}
          {formerrors.senderID && formerrors.senderID.type === "pattern" && (
            <Alert color="danger" variant="outlined" size="sm">
              *The Sender ID can contain only alphabets.
            </Alert>
          )}
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="messageType"
              rules={{
                required: true,
              }}
              defaultValue={"MKT"}
              render={({ field }) => (
                <select
                  {...field}
                  placeholder={"Select Message Type..."}
                  style={{ margin: "8px", flex: "8 0", height: "35px", borderRadius: "10px" }}
                >
                  <option value={"MKT"}>MKT</option>
                  <option value={"OTP"}>OTP</option>
                  <option value={"TXN"}>TXN</option>
                </select>
              )}
            />
            <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 0" }}>
              <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                Message Type
              </Button>
            </div>
          </div>
          {formerrors.messageType && formerrors.messageType.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              *The Message Type is required.
            </Alert>
          )}
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="templateID"
              rules={{
                required: true,
                pattern: /^[0-9]+$/gm,
              }}
              defaultValue={""}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ margin: "8px", flex: "8 0" }}
                  placeholder={"Enter Template ID"}
                  autoComplete={"on"}
                  className={`no-form-error ${formerrors.templateID ? "form-error" : ""}`}
                />
              )}
            />
            <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 0" }}>
              <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                Template ID
              </Button>
            </div>
          </div>
          {formerrors.templateID && formerrors.templateID.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              *The Template ID is required.
            </Alert>
          )}
          {formerrors.templateID && formerrors.templateID.type === "pattern" && (
            <Alert color="danger" variant="outlined" size="sm">
              *The Template ID can contain only numbers.
            </Alert>
          )}
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="baseMessage"
              rules={{
                required: true,
              }}
              defaultValue={""}
              render={({ field }) => (
                <Textarea
                  {...field}
                  style={{ height: "75px", margin: "8px", flex: "8 0" }}
                  placeholder={"Enter the Base Message"}
                  autoComplete={"on"}
                  className={`no-form-error ${formerrors.baseMessage ? "form-error" : ""}`}
                />
              )}
            />
            <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 0" }}>
              <Button
                size="sm"
                variant="soft"
                style={{ "margin-bottom": "8px", height: "fit-content" }}
                onClick={processBaseMessage}
              >
                Add Variables
              </Button>
            </div>
          </div>
          {formerrors.baseMessage && formerrors.baseMessage.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              *The Base Message is required.
            </Alert>
          )}
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
                        <TextareaAutosize
                          {...field}
                          style={{
                            height: "100px",
                            margin: "8px",
                            flex: "8 0",
                            opacity: "1",
                            color: "rgba(0, 0, 0, 1)",
                            borderRadius: "8px",
                            padding: "8px",
                            backgroundColor: "white",
                            width: "50%",
                            resize: "vertical",
                            overflow: "auto",
                          }}
                          minRows={4}
                          value={replacevalues ? replacevalues[item.label] : ""}
                          placeholder={"Select data from the sheet"}
                          disabled
                          className={`no-form-error ${formerrors.replaceables?.[index]?.value ? "form-error" : ""}`}
                        />
                      )}
                    />
                    <div
                      style={{
                        display: "flex",
                        "justify-content": "center",
                        "flex-direction": "column",
                        flex: "2 0",
                      }}
                    >
                      <Button
                        size="sm"
                        variant="soft"
                        style={{ "margin-bottom": "8px", height: "fit-content" }}
                        onClick={() => getNumbers(item.label, index)}
                      >
                        {`Get ${item.label}`}
                      </Button>
                      <Button
                        size="sm"
                        variant="soft"
                        style={{ "margin-bottom": "8px", height: "fit-content" }}
                        onClick={() => resetNumbers(item.label, index)}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  {formerrors.replaceables?.[index]?.value &&
                    formerrors.replaceables?.[index]?.value.type === "required" && (
                      <Alert color="danger" variant="outlined" size="sm">
                        *The {item.label} is required.
                      </Alert>
                    )}
                </div>
              );
            })}
          <input
            type="submit"
            style={{
              backgroundColor: "#0066A2",
              color: "white",
              border: "none",
              "font-weight": "bold",
              cursor: "pointer",
              width: "80px",
              height: "48px",
              "border-radius": "25px",
              marginTop: "10px",
            }}
          />
        </form>
      </CssVarsProvider>
      <Snackbar open={opentoast} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} color={Errormessage.var} sx={{ width: "100%" }}>
          {Errormessage.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default KaleyraForm;

