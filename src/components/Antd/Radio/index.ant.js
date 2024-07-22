import React from "react";
import { Form, Radio as AntRadio } from "antd";

function Checkbox({ children, ...rest }) {
  return (
    <Form.Item
      className="mb-0"
      rules={[{ required: true, message: "Please select an option!" }]}
    >
      <AntRadio {...rest} placeholder="Basic usage">
        {children}
      </AntRadio>
    </Form.Item>
  );
}

export default Checkbox;
