import React from "react";
import { Checkbox as AntCheckbox } from "antd";

function Checkbox({ children, ...rest }) {
  return (
    <AntCheckbox {...rest} placeholder="Basic usage">
      {children}
    </AntCheckbox>
  );
}

export default Checkbox;
