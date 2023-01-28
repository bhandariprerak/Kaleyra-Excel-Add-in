import React from "react";
import { Button } from "@mui/joy";
import { AiFillMessage } from "react-icons/ai";

const Template_Card = (props) => {
  return (
    <div>
      <div style={{ display: "flex", maxHeight: "fit-content" }}>
        <div
          style={{
            display: "flex",
            border: "1px solid rgb(18 18 19 / 16%)",
            borderRadius: "5px",
            flex: "8 0",
            backgroundColor: "white",
          }}
        >
          <div style={{ display: "flex", flex: "2 1", "justify-content": "center", "align-items": "center" }}>
            <AiFillMessage style={{ "font-size": "xx-large", opacity: "0.8" }} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "8 0",
              padding: "10px",
            }}
          >
            <span style={{ "font-weight": "700", "font-size": "small" }}>{props.title}</span>
            <div style={{ display: "flex" }}>
              <span style={{ "font-size": "x-small" }}>{props.created_at}</span>
              <span style={{ "font-size": "x-small" }}>{props.full_name}</span>
            </div>
            <span style={{ "font-size": "small", opacity: "0.85", paddingTop: "2px" }}>{props.content}</span>
          </div>
        </div>
        <div style={{ display: "flex", "justify-content": "center", "flex-direction": "column", flex: "2 1" }}>
          <Button
            size="sm"
            variant="plain"
            style={{ "margin-bottom": "8px", height: "fit-content", pointerEvents: "none" }}
          >
            Template Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Template_Card;
