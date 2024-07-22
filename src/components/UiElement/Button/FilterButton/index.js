import React from "react";
// import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function FilterButton({ popover, setVisible, visible }) {
  const { t } = useTranslation();
  // const [visible, setVisible] = useState(false);
  const cancelButton = () => {
    setVisible(false);
  };
  document.addEventListener("click", function (e) {
    let filterCheck;
    filterCheck =
      e.target.closest(".ant-picker-header") ||
      e.target.closest(".ant-picker-body") ||
      e.target.closest(".ant-picker-dropdown") ||
      e.target.closest(".fiterDropdown") ||
      e.target.closest(".ant-select-dropdown");
    const clsList = filterCheck?.classList;
    const condition =
      clsList?.contains("ant-picker-dropdown") ||
      clsList?.contains("ant-picker-body") ||
      clsList?.contains("ant-picker-header") ||
      clsList?.contains("fiterDropdown") ||
      clsList?.contains("ant-select-dropdown");
    if (!condition) {
      cancelButton();
    }
  });
  return (
    <>
      <Dropdown show={visible} className="fiterDropdown">
        <Dropdown.Toggle
          variant="transparent"
          id="dropdown-basic"
          className="btn btn-trigger btn-icon"
          onClick={() => setVisible(!visible)}
        >
          <em className="icon ni ni-filter-alt" />
        </Dropdown.Toggle>
        <Dropdown.Menu align="end" className="filter-wg dropdown-menu-xl">
          <div className="dropdown-head">
            <span className="sub-title dropdown-title">
              {t("text.common.filter")}
            </span>
            <div className="dropdown">
              <Link
                to="/"
                className="link link-dark"
                onClick={(e) => {
                  e.preventDefault();
                  cancelButton();
                }}
              >
                <em className="icon ni ni-cross" />
              </Link>
            </div>
          </div>
          {popover}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
