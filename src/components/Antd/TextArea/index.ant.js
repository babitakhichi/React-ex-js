import { Form } from "antd";
import { useField } from "formik";

function AntTextArea({ Children, label, name, ...rest }) {
  const [field, meta] = useField(name);
  const config = { ...field, ...rest };

  if (meta && meta.touched && meta.error) {
    config.error = true;
    config.helperText = meta.error;
  }

  return (
    <Form.Item
      help={meta.error && meta?.error && meta?.touched ? meta.error : ""}
      validateStatus={config.error ? "error" : "success"}
      label={label}
    >
      <textarea {...field} {...rest}>
        {Children}
      </textarea>
    </Form.Item>
  );
}

export default AntTextArea;
