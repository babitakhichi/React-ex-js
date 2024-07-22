import React from "react";
import { Select as AntSelect, Form } from "antd";
import "./style.scss";
import { useField } from "formik";

const { Option } = AntSelect;

function Select({
  children,
  icon,
  arrayOfData,
  label = "",
  name,
  setFieldValue,
  onSelect,
  validateField = false,
  callField,
  focusNext = false,
  focusId = "",
  ...rest
}) {
  const [field, meta, helpers] = useField(name);
  const config = { ...field, ...rest };

  if (meta && meta.touched && meta.error) {
    config.error = true;
    config.helperText = meta.error;
  }

  const handleChangeSelect = (value) => {
    helpers.setValue(value);
    if (validateField) {
      setTimeout(() => {
        callField.validateForm();
      }, 200);
    }
    if (focusNext) {
      setTimeout(() => {
        document.getElementById(focusId)?.focus();
      }, 100);
    }
  };
  return (
    <Form.Item
      className="mb-0"
      label={label}
      help={meta.error && meta?.error && meta?.touched ? meta.error : ""}
      validateStatus={config.error ? "error" : "success"}
    >
      {icon}
      <AntSelect
        size="large"
        {...field}
        {...rest}
        onChange={onSelect || handleChangeSelect}
      >
        {children ??
          arrayOfData?.map((item) => (
            <Option
              key={item?.id || item.name}
              disabled={item?.disabled || false}
              value={item?.value || item?.id || item?.country_short_code}
            >
              {item?.name ||
                item?.language_name ||
                item?.contact_reason ||
                item?.country_name ||
                `${item?.firstName}${" "}${item?.lastName}`}
            </Option>
          ))}
      </AntSelect>
    </Form.Item>
  );
}

export default Select;
