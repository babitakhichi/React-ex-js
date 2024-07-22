import { Button } from "react-bootstrap";

function CommonButton({
  children,
  extraClassName = "",
  loading,
  variant = "none",
  ...rest
}) {
  return (
    <Button
      disabled={loading}
      className={`${extraClassName}`}
      variant={variant}
      {...rest}
    >
      {children}
    </Button>
  );
}
export default CommonButton;
