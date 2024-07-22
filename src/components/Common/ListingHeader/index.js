import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
// import ExportButton from "../../Button/Export/index.btn";
import {
  CsvExport,
  FilterButton,
  CreateButton,
  // ActionButton,
  CommonButton,
} from "../../UiElement";

function ListingHeader({
  btnText,
  btnArray,
  onHandleShow,
  popover,
  extraBtnText,
  extraBtnClass,
  onExtraButtonHandleShow,
  setVisible,
  visible,
  csvData = [],
  fileName = "",
  loading,
  icon
}) {
  const [filterToggle, setFilterToggle] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      {/* <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between"> */}
      <div className="nk-block-head-content">
        <div className="toggle-wrap nk-block-tools-toggle">
          <Link
            to="#"
            className="btn btn-icon btn-trigger toggle-expand mr-n1"
            data-target="more-options"
            onClick={() => setFilterToggle(!filterToggle)}
          >
            <em className="icon ni ni-more-v" />
          </Link>
          <div
            className={`toggle-expand-content ${
              filterToggle ? "expanded" : ""
            }`}
            // className="toggle-expand-content"
            data-content="more-options"
          >
            <ul className="nk-block-tools g-3 ">
              {btnArray.includes("filter") && (
                <li>
                  <FilterButton
                    className="bg-black border-transparent"
                    popover={popover}
                    setVisible={setVisible}
                    visible={visible}
                  />
                </li>
              )}
              {btnArray.includes("csvExport") && csvData?.length > 0 && (
                <li>
                  <CsvExport
                    data={csvData}
                    fileName={fileName}
                    extraClassName="btn btn-white btn-outline-light"
                  >
                    <em className="icon ni ni-download-cloud" />{" "}
                    <span>{t("text.common.csvExports")}</span>
                  </CsvExport>
                </li>
              )}
              {btnArray.includes("create") && (
                <li className="nk-block-tools-opt">
                  <CreateButton icon={icon} onHandleShow={onHandleShow} btnText={btnText} />
                </li>
              )}
              {btnArray.includes("extraButton") && (
                <li className="nk-block-tools-opt">
                  <CommonButton
                    extraClassName={extraBtnClass}
                    onClick={onExtraButtonHandleShow}
                    loading={loading}
                  >
                    {extraBtnText}
                  </CommonButton>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* </div>
      </div> */}
    </>
  );
}

export default ListingHeader;
