import React from "react";
import { Dropdown, Space } from "antd";
import { Link } from "react-router-dom";

function AntDropdown({ menu, dropdownText, dropdownIcon }) {
  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Link to="#" onClick={(e) => e.preventDefault()}>
        <Space>
          {dropdownText}
          {dropdownIcon}
        </Space>
      </Link>
    </Dropdown>
  );
}

export default AntDropdown;
