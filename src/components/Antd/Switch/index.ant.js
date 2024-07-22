import React from "react";
import { Switch as AntSwitch } from "antd";

export default function Switch({ onChange, statusValue, disabled }) {
  return (
    <AntSwitch
      defaultChecked={statusValue}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
