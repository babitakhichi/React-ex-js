// import { t } from "i18next";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ImageElement, GlobalLoader } from "..";
import { selectUserData } from "../../../redux/AuthSlice/index.slice";
import moduleRoutesMap from "../../../routeControl";

function DropdownMenu({
  heading,
  menuList,
  mainClassName,
  linkClassName,
  menuClassName,
  listClassName,
  dropdownType = "profile",
  loading,
  toggleClassName = "",
  notificationList,
  notificationLoading,
}) {
  const userData = useSelector(selectUserData);
  const navigate = useNavigate();
  return (
    <>
      <Dropdown className={mainClassName}>
        <Dropdown.Toggle variant="none" as="a" className={toggleClassName}>
          {heading}
        </Dropdown.Toggle>

        <Dropdown.Menu as="ul" className={menuClassName}>
          {notificationLoading ? (
            <GlobalLoader />
          ) : (
            <>
              {menuList.length > 0
                ? menuList.map((item, key) => {
                    return (
                      <Dropdown.Item bsPrefix={listClassName} as="li" key={key}>
                        {dropdownType === "profile" ? (
                          <Link
                            className={linkClassName}
                            to={item?.path ?? "#"}
                            onClick={item?.onClick}
                            disabled={loading}
                          >
                            {item?.label}
                            <span className="icon-dropdown-arrow-right" />
                          </Link>
                        ) : (
                          <Link
                            to="# "
                            className="d-flex align-items-stretch justify-content-start"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(
                                moduleRoutesMap?.[userData?.user_type]
                                  ?.Notification.path
                              );
                            }}
                          >
                            <div className="mainHeader_notification_pic">
                              {item?.thumb_image_url ? (
                                <ImageElement
                                  previewSource={item?.thumb_image_url}
                                  alt="profile"
                                  className="img-fluid"
                                />
                              ) : (
                                <ImageElement source="profile-img.jpg" />
                              )}
                            </div>
                            <div className="mainHeader_notification_ctn">
                              {item?.message}
                            </div>
                            <div className="mainHeader_notification_info">
                              <p>
                                {/* {totalTimeDifference(
                                item?.created_at,
                                new Date()
                              )} */}
                              </p>
                            </div>
                          </Link>
                        )}
                      </Dropdown.Item>
                    );
                  })
                : {
                    /* <NoDataFound
                  text={t("text.common.noData")}
                  source="no-available-treatments.svg"
                /> */
                  }}
            </>
          )}
          {dropdownType === "notification" && (
            <div className="text-center">
              {notificationList?.length > 0 && (
                <Link
                  to="#"
                  className="viewall"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(
                      moduleRoutesMap?.[userData?.user_type]?.Notification.path
                    );
                    window.CloseDrop();
                  }}
                >
                  VIEW ALL
                </Link>
              )}
            </div>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default DropdownMenu;
