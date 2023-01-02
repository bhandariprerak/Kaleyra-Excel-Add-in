import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button, Textarea, Alert, TextField, Select, Option } from "@mui/joy";
import { useEffect } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
// import MenuItem from "@mui/material/MenuItem";

const KaleyraForm = () => {
  const [validNums, setValidnums] = useState([]);
  const [mobilenumber, setmobileNumber] = useState("");
  const [basereplace, setBasereplace] = useState([]);
  const [basemessage, setBaseMessage] = useState("");
  const [proceed, setproceed] = useState(true);
  const [messageType, setmessageType] = useState("");
  const {
    handleSubmit,
    control,
    // setValue,
    // getValues,
    formState: { errors: formerrors },
    reset,
  } = useForm({ defaultValues: { replaceables: [] } });

  ////defaultValues: { replaceables: [{ value: "" }] }

  useEffect(() => {
    // let existing_value = getValues("mobileNumber");
    // let prev_arr = [];
    // let final_arr = [];
    // console.log(existing_value);
    // console.log(prev_arr);
    // if (existing_value) {
    //   prev_arr = existing_value?.split("|");
    //   final_arr = [...new Set([...prev_arr, ...validNums])];
    // } else {
    //   final_arr = [...new Set(validNums)];
    // }
    let str = "";
    //console.log(final_arr);
    // console.log(existing_value);
    // console.log(prev_arr);
    // // let newarr = [...new Set([...prev_arr, ...validNums])];
    // // console.log(newarr);
    validNums.forEach((num) => {
      str = str + num + ",";
    });
    //setValue("mobileNumber", str);
    setmobileNumber(str.slice(0,-1));
  }, [validNums]);
  console.log(validNums);
  const onSubmit = (data) => {
    // let proceed = true;
    if (!data.mobileNumber && !mobilenumber) {
      setproceed(false);
    } else {
      console.log("form submitted");
      console.log(data);
      console.log(mobilenumber);
      setproceed(true);
    }
  };

  console.log(mobilenumber);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "replaceables",
  });

  const processBaseMessage = (data) => {
    let str = data.baseMessage;
    let arr = str.match(/{{(.*?)\}}/gm);
    console.log(arr);
    setBasereplace(arr);
    reset({ replaceables: [] });
    arr.forEach((ele) => {
      append({ value: "", label : ele });
    });
  };

  const getNumbers = async () => {
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
      // allowing user to select one column at a time
      if (num_cols <= 1) {
        numbers.forEach((num) => {
          if (Number.isInteger(num[0]) && num[0].toString().length <= 12) {
            formattednumbers.push(num[0]);
          }
        });
        // setValidnums(Array.from(new Set([...validNums, ...Array.from(new Set(formattednumbers))])));
        setValidnums(Array.from(new Set([...validNums, ...formattednumbers])));
      } else {
        console.log("error length columns");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // to clear the text field for get numbers and empty the variables
  const resetNumbers = () => {
    setmobileNumber("");
    setValidnums([]);
  };

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <CssVarsProvider>
        
        <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex" }}>
        <Controller
              control={control}
              name="mobileNumbers"
              value={mobilenumber}
              rules={{
                // required: true,
                // pattern: /[0-9|]+$/,
              }}
              render={({ field }) => (
          <Textarea
          {...field}
          style={{
              margin: "8px",
              flex: "8 0",
              height: "75px",
              // "overflow-y": "scroll",
              // "overflow-x": "hidden",
            }}
            value={mobilenumber}
            placeholder={"Please select mobile numbers from sheet"}
          />
          )}
        />
          <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 0" }}>
            <Button
              size="sm"
              variant="soft"
              style={{ "margin-bottom": "8px", height: "fit-content" }}
              onClick={getNumbers}
            >
              Get Numbers
            </Button>
            <Button
              size="sm"
              variant="soft"
              style={{ "margin-bottom": "8px", height: "fit-content" }}
              onClick={resetNumbers}
            >
              Clear
            </Button>
          </div>
        </div>
        {formerrors.mobileNumbers && formerrors.mobileNumbers.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              *Mobile Number(s) is/are required.
            </Alert>
          )}
          {/* <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="mobileNumber"
              rules={{
                //required: true,
                pattern: /[0-9|]+$/,
              }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  style={{
                    margin: "8px",
                    flex: "8 0",
                    height: "75px",
                  }}
                  placeholder={"Enter Mobile Numbers....."}
                  className={`no-form-error ${formerrors.mobileNumber ? "form-error" : ""}`}
                />
              )}
            />
            <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 0" }}>
              <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                Add Numbers
              </Button>
            </div>
          </div>
          {formerrors.mobileNumber && formerrors.mobileNumber.type === "required" && (
            <Alert color="danger" variant="outlined" size="sm">
              **The mobile numbers are required.
            </Alert>
          )}
          {formerrors.mobileNumber && formerrors.mobileNumber.type === "pattern" && (
            <Alert color="danger" variant="outlined" size="sm">
              **The mobile numbers can contain only numbers[0-9] and |.
            </Alert>
          )}
          {!proceed && (
            <Alert color="danger" variant="outlined" size="sm">
              **The mobile numbers are required.
            </Alert>
          )} */}
          {/* <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="additionalNumbers"
              rules={{
                pattern: /[0-9 |]+$/,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ margin: "8px", flex: "8 0" }}
                  placeholder={"Enter Mobile Numbers..."}
                  className={`no-form-error ${formerrors.additionalNumbers ? "form-error" : ""}`}
                />
              )}
            />
            <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 0" }}>
              <Button
                size="sm"
                variant="plain"
                style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
              >
                Add Other Numbers
              </Button>
            </div>
          </div>
          {formerrors.additionalNumbers && formerrors.additionalNumbers.type === "pattern" && (
            <Alert color="danger" variant="outlined" size="sm">
              **The mobile numbers can contain only numbers[0-9], space and |.
            </Alert>
          )} */}
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="apiKey"
              rules={{
                required: true,
              }}
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
              *The SID is required.
            </Alert>
          )}

          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="senderID"
              rules={{
                required: true,
              }}

              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ margin: "8px", flex: "8 0" }}
                  placeholder={"Enter Sender ID"}
                  autoComplete={"off"}
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



          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="messageType"
              rules={{
                required: true,
              }}
              defaultValue={"MKT"}
              render={({ field }) => (
                // <Select {...field} placeholder={"Select Message Type..."} style={{ margin: "8px", flex: "8 0" }}>
                //   <MenuItem value={""}>--Select--</MenuItem>
                //   <MenuItem value={"type-1"}>Type-1</MenuItem>
                //   <MenuItem value={"type-2"}>Type-2</MenuItem>
                //   <MenuItem value={"type-3"}>Type-3</MenuItem>
                // </Select>
                <select
                  {...field}
                  placeholder={"Select Message Type..."}
                  style={{ margin: "8px", flex: "8 0", height: "35px", borderRadius: "10px" }}
                >
                  <option value="MKT">MKT</option>
                  <option value="TXN">TXN</option>
                  <option value="OTP">OTP</option>
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
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  style={{ margin: "8px", flex: "8 0" }}
                  placeholder={"Enter Template ID"}
                  autoComplete={"off"}
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
          <div style={{ display: "flex" }}>
            <Controller
              control={control}
              name="baseMessage"
              rules={{
                required: true,
              }}
              value={basemessage}
              onChange={(e) => setBaseMessage(e.target.value)}
              render={({ field: { value, onChange } }) => (
                <Textarea
                  style={{ height: "75px", margin: "8px", flex: "8 0" }}
                  value={value}
                  onChange={onChange}
                  placeholder={"Enter the Base Message"}
                  autoComplete={"off"}
                  className={`no-form-error ${formerrors.baseMessage ? "form-error" : ""}`}
                />
              )}
            />
            <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 0" }}>
              <Button
                size="sm"
                variant="soft"
                style={{ "margin-bottom": "8px", height: "fit-content" }}
                onClick={handleSubmit(processBaseMessage)}
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
          {basereplace.length != 0 &&
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
                          style={{ margin: "8px", flex: "8 0" }}
                          placeholder={"Enter Values"}
                          className={`no-form-error ${formerrors.replaceables?.[index]?.label ? "form-error" : ""}`}
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
                        variant="plain"
                        style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
                      >
                        {item.label}
                      </Button>
                    </div>
                  </div>
                  {formerrors.replaceables?.[index]?.label &&
                    formerrors.replaceables?.[index]?.label.type === "required" && (
                      <Alert color="danger" variant="outlined" size="sm">
                        *The {item.label} is required.
                      </Alert>
                    )}
                </div>
              );
            })}
          {/* <button onClick={clickme}>Numbers</button> */}
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
    </div>
  );
};

export default KaleyraForm;
