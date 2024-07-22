import { Form, Select, Tag } from "antd";
import { useField } from "formik";

const tagRender = (props) => {
  const { label, value, closable, onClose } = props;

  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
          ? "grey"
          : "red"
      }
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        marginRight: 3,
      }}
    >
      {label}
    </Tag>
  );
};

function MultipleInput({ name, placeholder, defaultValue, icon, ...rest }) {
  const [field, meta, helpers] = useField(name);
  const config = { ...field, ...rest };

  if (meta && meta.touched && meta.error) {
    config.error = true;
    config.helperText = meta.error;
  }

  const handleChangeSelect = (value) => {
    helpers.setValue(value);
    helpers.setTouched(true);
    if (value.length === 0) {
      helpers.setValue(undefined);
    } else {
      helpers.setValue(value);
    }
  };

  const getError = (data) => {
    let error = "";
    if (typeof data === "string") {
      error = data;
    } else {
      data.every((item) => {
        if (item) {
          error = item;
        }
      });
    }
    return error;
  };

  return (
    <Form.Item
      label={rest?.label}
      help={
        meta.error && meta?.error && meta?.touched ? getError(meta.error) : ""
      }
      validateStatus={config.error ? "error" : "success"}
    >
      {icon}
      <Select
        mode="tags"
        allowClear
        defaultValue={defaultValue}
        tagRender={tagRender}
        open={false}
        style={{
          width: "100%",
        }}
        placeholder={placeholder}
        onChange={handleChangeSelect}
        onBlur={() => {
          helpers.setTouched(true);
        }}
      />
    </Form.Item>
  );
}

export default MultipleInput;
