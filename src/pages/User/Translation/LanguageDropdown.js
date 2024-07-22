import React from "react";
import { Link } from "react-router-dom";
// import { Input as TextInput } from "../../../components";

function LanguageDropdown({
  langDropdownClose,
  setLanguage,
  languageData,
  // autoDetectLanguage,
  search,
  setSearch,
  defaultKey,
}) {
  return (
    <>
      <div className="fullMenuBar bg-white">
        <div className="fullMenuBar_search position-relative">
          <div className="form-group mb-0 position-relative">
            <input
              className="form-control bg-white rounded-0"
              type="text"
              placeholder="Search Language"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link
            onClick={() => {
              langDropdownClose();
              setSearch("");
            }}
            className="closeIcon"
          >
            <em className="icon-close" />
          </Link>
        </div>
        <div className="fullMenuBar_list">
          <ul className="list-unstyled d-flex flex-wrap mb-0">
            {search?.length === 0 && defaultKey === "translateText" && (
              <li>
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    langDropdownClose();
                    setSearch("");
                    // setLanguage(autoDetectLanguage?.[0]);
                    setLanguage({
                      code_alpha_1: undefined,
                      codeName: "Auto Detection",
                      rtl: false,
                    });
                  }}
                >
                  Auto Detection
                </Link>{" "}
              </li>
            )}
            {languageData?.length > 0 ? (
              languageData.map((item, key) => {
                return (
                  <li key={key}>
                    {" "}
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        langDropdownClose();
                        setLanguage(item);
                        setSearch("");
                      }}
                    >
                      {item?.codeName}
                    </Link>{" "}
                  </li>
                );
              })
            ) : (
              <>No Data found</>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
export default LanguageDropdown;
