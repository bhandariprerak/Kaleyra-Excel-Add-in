import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Button, Alert, TextField } from "@mui/joy";
import RenderTooltip from "./RenderTooltip";

const UrlForm = () => {
  const { control, formerrors, setValue } = useFormContext();
  const [shortenurl, setshortenurl] = useState(true);
  const [trackuser, settrackuser] = useState(true);

  useEffect(() => {
    setValue("shortenurl", shortenurl ? 1 : 0);
    setValue("trackuser", trackuser ? 1 : 0);
  }, [shortenurl, trackuser]);
  return (
    <div>
      <div style={{ display: "flex" }}>
        <Controller
          control={control}
          name={`urlinput`}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <TextField
              {...field}
              style={{
                margin: "8px",
                flex: "8 0",
                "min-width": "100px",
              }}
              placeholder={"Enter URL"}
              type="url"
              className={`no-form-error ${formerrors.urlinput ? "form-error" : ""}`}
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
            URL
          </Button>
        </div>
        <RenderTooltip content="Click to Enable/Disable it." />
      </div>
      <div style={{ display: "flex" }}>
        {formerrors.urlinput && formerrors.urlinput.type === "required" && (
          <Alert color="danger" variant="outlined" size="sm" style={{ backgroundColor: "white", flex: "8 0" }}>
            *The URL is required.
          </Alert>
        )}
        <div style={{ flex: "2 1" }}></div>
      </div>
      <div style={{ display: "flex" }}>
        <Controller
          control={control}
          name={`slug_url`}
          //   rules={{
          //     required: true,
          //   }}
          render={({ field }) => (
            <TextField
              {...field}
              style={{
                margin: "8px",
                flex: "8 0",
                "min-width": "100px",
              }}
              placeholder={"(Optional)Enter Slug"}
              type="url"
              className={`no-form-error ${formerrors.slug_url ? "form-error" : ""}`}
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
            URL Slug
          </Button>
        </div>
        <RenderTooltip content="Click to Enable/Disable it." />
      </div>
      <div style={{ display: "flex" }}>
        {formerrors.slug_url && formerrors.slug_url.type === "required" && (
          <Alert color="danger" variant="outlined" size="sm" style={{ backgroundColor: "white", flex: "8 0" }}>
            *The Slug for URL is required.
          </Alert>
        )}
        <div style={{ flex: "2 1" }}></div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flex: "8 0", justifyContent: "space-around" }}>
        <div className="togglebutton">
            <div style={{ backgroundColor: "white", borderRadius: "8px" }}>
              <Button variant={shortenurl === true ? "solid" : "outlined"} onClick={() => setshortenurl(!shortenurl)}>
                SHORTEN URL
              </Button>
            </div>
          </div>
          <div className="togglebutton">
            <div style={{ backgroundColor: "white", borderRadius: "8px" }}>
              <Button variant={trackuser === true ? "solid" : "outlined"} onClick={() => settrackuser(!trackuser)}>
                TRACK USER
              </Button>
            </div>
          </div>
          {/* <div className="togglebutton">
            <div style={{ backgroundColor: "white", borderRadius: "8px" }}>
              <Button variant={shortenurl === true ? "solid" : "outlined"} onClick={() => setshortenurl(!shortenurl)}>
                SHORTEN URL
              </Button>
            </div>
          </div> */}
        </div>
        <div style={{ flex: "2 1" }}>
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
              Enable/Disable
            </Button>
          </div>
        </div>
        <RenderTooltip content="Click to Enable/Disable it." />
      </div>
      {/* <div style={{ display: "flex" }}>
        <Controller
          control={control}
          name={`slug_url`}
          //   rules={{
          //     required: true,
          //   }}
          render={({ field }) => (
            <TextField
              {...field}
              style={{
                margin: "8px",
                flex: "8 0",
                "min-width": "100px",
              }}
              placeholder={"(Optional)Enter Slug"}
              type="url"
              className={`no-form-error ${formerrors.slug_url ? "form-error" : ""}`}
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
            URL Slug
          </Button>
        </div>
        <RenderTooltip content="Click to Enable/Disable it." />
      </div>
      <div style={{ display: "flex" }}>
        {formerrors.slug_url && formerrors.slug_url.type === "required" && (
          <Alert color="danger" variant="outlined" size="sm" style={{ backgroundColor: "white", flex: "8 0" }}>
            *The Slug for URL is required.
          </Alert>
        )}
        <div style={{ flex: "2 1" }}></div>
      </div> */}
      {/* <div style={{ display: "flex" }}>
        <Controller
          control={control}
          name={`callback_url`}
          //   rules={{
          //     required: true,
          //   }}
          render={({ field }) => (
            <TextField
              {...field}
              style={{
                margin: "8px",
                flex: "8 0",
                "min-width": "100px",
              }}
              placeholder={"(Optional)Enter Callback URL"}
              type="url"
              className={`no-form-error ${formerrors.callback_url ? "form-error" : ""}`}
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
            Callback URL
          </Button>
        </div>
        <RenderTooltip content="Click to Enable/Disable it." />
      </div>
      <div style={{ display: "flex" }}>
        {formerrors.callback_url && formerrors.callback_url.type === "required" && (
          <Alert color="danger" variant="outlined" size="sm" style={{ backgroundColor: "white", flex: "8 0" }}>
            *The Callback URL is required.
          </Alert>
        )}
        <div style={{ flex: "2 1" }}></div>
      </div> */}
    </div>
  );
};

export default UrlForm;
