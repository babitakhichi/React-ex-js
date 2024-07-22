import { Button as AntButton } from "antd";

function Button({ children, ...rest }) {
  return (
    <AntButton {...rest} placeholder="Basic usage">
      {children}
    </AntButton>
  );
}

export default Button;
