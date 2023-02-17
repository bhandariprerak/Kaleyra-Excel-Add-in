import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { FcInfo } from "react-icons/fc";
import { AiOutlineInfoCircle } from "react-icons/ai";

const RenderTooltip = (props) => {
  return (
    <div>
      <Tooltip title={props.content}>
        <div>
          <AiOutlineInfoCircle style={{ color: "#544da7" }} />
        </div>
      </Tooltip>
    </div>
  );
};

export default RenderTooltip;
