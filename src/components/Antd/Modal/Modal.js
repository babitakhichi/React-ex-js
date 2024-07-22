import React from "react";
import { Modal as AntModal } from "antd";

function Modal({
  children,
  isModalVisible,
  title,
  handleCancel,
  handleOk,
  ...rest
}) {
  return (
    <AntModal
      title={title}
      visible={isModalVisible}
      onCancel={handleCancel}
      onOk={handleOk}
      footer={null}
      {...rest}
      placeholder="Basic usage"
    >
      {children}
    </AntModal>
  );
}

export default Modal;
