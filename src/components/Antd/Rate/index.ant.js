import { Rate as AntRate } from "antd";

function Rate({ children, disabled, allowHalf, ...rest }) {
  return (
    <AntRate
      {...rest}
      placeholder="Basic usage"
      disabled={disabled}
      allowHalf={allowHalf}
    >
      {children}
    </AntRate>
  );
}

export default Rate;
