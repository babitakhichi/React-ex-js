import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import moment from "moment";

import { Dropdown } from "react-bootstrap";
import { logout, selectUserData } from "../../redux/AuthSlice/index.slice";
import { GlobalLoader, ImageElement, SweetAlert } from "../UiElement";
import { AdminAuthServices, NotificationServices } from "../../services";
import routesMap from "../../routeControl/adminRoutes";
import {
  encoder,
  logger,
  modalNotification,
  totalTimeDifference,
} from "../../utils";
import { iconNameFormatter } from "../Formatter";

// import adminRoutesMap from "../../routeControl/adminRoutes";
// import { classicDataTimeFormate } from "../../helpers";

function AdminHeader({ menuToggle }) {
  const { t } = useTranslation();
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jwt } = userData;
  const [loading, setLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [notificationCount, setNotificationCount] = useState();
  // const [sellerData, setSellerRequestData] = useState([]);
  const showSweetAlert = () => {
    setIsAlertVisible(true);
  };

  const accountLogout = async () => {
    try {
      const response = await AdminAuthServices.logoutService();
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        dispatch(logout(navigate, userData?.userRole));
        setLoading(false);
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };

  const onConfirmAlert = () => {
    setLoading(false);
    accountLogout();
    setIsAlertVisible(false);
    return true;
  };

  /**
   * Work on show time in commented code
   */
  // const totalTimeCount = (createdAt, updatedAt) => {
  //   let startTime = moment(createdAt);
  //   let endTime = moment(updatedAt);
  //   let difference = startTime.from(endTime);
  //   return difference;
  // };
  const getNotificationCount = async () => {
    try {
      let queryParams = {
        type: "admin",
      };
      const res = await NotificationServices.unreadCountService({
        queryParams,
      });
      const { data, success } = res;
      if (success === 1) {
        setNotificationCount(data?.count);
      }
    } catch (error) {
      logger(error);
    }
  };
  const handleRead = async () => {
    // setNotificationLoading(true);

    try {
      let bodyData = { type: "admin" };
      const response = await NotificationServices.readNotificationsService(
        bodyData
      );
      const { success } = response;
      if (success === 1) {
        getNotificationCount();
      }
    } catch (error) {
      logger(error);
    }
    // setNotificationLoading(false);
  };

  const handlenotificationList = async () => {
    setNotificationLoading(true);
    try {
      let queryParams = {
        type: "admin",
      };
      const response = await NotificationServices.getNotificationListService({
        queryParams,
      });
      const { success, data } = response;
      if (success === 1) {
        setNotificationList(data?.rows);
      }
    } catch (error) {
      logger(error);
    }
    setNotificationLoading(false);
  };
  // useEffect(() => {
  //   if (jwt) {
  //     getNotificationCount();
  //   }
  // }, [jwt]);
  useEffect(() => {
    if (jwt) {
      handlenotificationList();
      getNotificationCount();
      const interval = setInterval(() => {
        getNotificationCount();
      }, 20000);
      return () => clearInterval(interval);
    }
  }, []);
  const redirectNotification = (data) => {
    let pathObject = {
      adminUserSignup: routesMap.MANAGE_CUSTOMERS.path,
      adminSubscription: routesMap.MANAGE_CUSTOMERS.path,
      adminQuery: routesMap.PENDING_QUERIES.path,
      adminDiscountRequest: routesMap.DISCOUNT_REQUESTS.path,
      adminSubscriptionFail: `${routesMap?.CUSTOMERS_DETAILS?.path}/${encoder(
        data?.notificationData
      )}`,
    };

    navigate(pathObject?.[data?.type]);
  };
  return (
    <div className="nk-header nk-header-fixed is-light">
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger d-xl-none ms-n1">
            <Link
              onClick={() => menuToggle()}
              to="#"
              className="nk-nav-toggle nk-quick-nav-icon"
            >
              <em className="icon ni ni-menu" />
            </Link>
          </div>
          <div className="nk-header-brand d-xl-none">
            <Link to={routesMap.DASHBOARD.path} className="logo-link">
              <img
                className="logo-img"
                src="/assets/images/admin/logo-dark.svg"
                alt="logo"
              />
            </Link>
          </div>
          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              {/* <Dropdown as="li">
                  <Dropdown.Toggle as="a" className="nk-quick-nav-icon btn-icon btn-icon-break">
                    <div className="badge badge-circle bg-primary">2</div><em className="ni ni-users" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end" className="dropdown-menu-xl dropdown-menu-s1">
                    <div className="dropdown-head">
                      <span className="sub-title nk-dropdown-title">
                        {t("text.adminHeader.sellerRequest")}
                      </span>
                    </div>
                    <div className="dropdown-body">
                      <div className="nk-notification">
                        <div className="nk-notification-item dropdown-inner">
                          <div className="user-info nk-notification-content">
                            <div className="nk-notification-text">
                            </div>
                            <div className="nk-notification-time" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-foot center">
                      <Link to="#">{t("text.common.viewAll")}</Link>
                    </div>
                  </Dropdown.Menu>
                </Dropdown> */}
              <Dropdown
                as="li"
                className="notification-dropdown"
                onToggle={(e) => {
                  if (e) {
                    handlenotificationList();
                  }
                }}
              >
                <Dropdown.Toggle
                  as="a"
                  className="nk-quick-nav-icon btn-icon btn-icon-break"
                >
                  {notificationCount > 0 && (
                    <div className="badge badge-circle align-items-center bg-primary">
                      {notificationCount}
                    </div>
                  )}
                  {/* <div className="badge badge-circle align-items-center bg-primary">
                    5
                  </div> */}
                  <em className="ni ni-bell" />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="dropdown-menu-xl">
                  <div className="dropdown-head">
                    <span className="sub-title nk-dropdown-title">
                      {t("text.notification.name")}
                    </span>
                    {notificationCount > 0 && (
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRead();
                        }}
                      >
                        {t("text.notification.markAllRead")}
                      </Link>
                    )}
                  </div>
                  <div className="dropdown-body">
                    <div className="nk-notification">
                      {notificationLoading ? (
                        <GlobalLoader />
                      ) : notificationList.length > 0 ? (
                        notificationList.map((item) => {
                          return (
                            <Link
                              to="#"
                              className="d-flex align-items-stretch justify-content-start"
                              onClick={(e) => {
                                e.preventDefault();
                                handleRead();
                                redirectNotification(item);
                                // navigate(routesMap.NOTIFICATIONS.path);
                                document.body.click();
                              }}
                            >
                              <div
                                className={`nk-notification-item w-100 dropdown-inner ${
                                  item?.receiverRead !== "read"
                                    ? "bg-lighter"
                                    : ""
                                }`}
                              >
                                <div className="nk-notification-icon">
                                  <em className="icon icon-circle bg-warning-dim ni ni-curve-down-right" />
                                </div>
                                <div className="nk-notification-content overflow-hidden">
                                  <h6 className="mb-0 nk-notification-text">
                                    {item?.title}
                                  </h6>
                                  <div className="nk-notification-text text-truncate">
                                    {item?.message}
                                  </div>
                                  <div className="nk-notification-time">
                                    {totalTimeDifference(
                                      item?.createdAt,
                                      new Date()
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        })
                      ) : (
                        <div className="emptySec text-center w-100">
                          {/* <ImageElement
                            source="video-conferencing-icon.svg"
                            alt="No Data Found"
                          /> */}
                          <h6>{t("text.common.noData")}</h6>
                          {/* <p className="mb-0">
                There are no Pricing Plan to show here right now.
              </p> */}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="dropdown-foot center">
                    {notificationList?.length > 0 && (
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRead();
                          navigate(routesMap.NOTIFICATIONS.path);
                          document.body.click();
                        }}
                      >
                        {t("text.common.viewAll")}
                      </Link>
                    )}
                    {/* <Link to="#">{t("text.common.viewAll")}</Link> */}
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown as="li" className="user-dropdown">
                <Dropdown.Toggle as="a" className="me-n1" id="dropdown-basic">
                  <div className="user-toggle">
                    <div className="user-avatar sm">
                      {userData?.userData?.avatar ? (
                        <ImageElement
                          previewSource={userData?.userData?.avatar}
                        />
                      ) : (
                        <em className="icon ni ni-user-alt" />
                      )}
                    </div>
                    <div className="user-info d-none d-xl-block">
                      {/* <div className="user-status user-status-unverified">
                        Unverified
                      </div> */}
                      <div className="user-name dropdown-indicator">
                        {userData?.userData?.full_name || "-"}
                      </div>
                    </div>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="dropdown-menu-md">
                  <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
                    <div className="user-card">
                      <div className="user-avatar">
                        {userData?.userData?.avatar ? (
                          <ImageElement
                            previewSource={userData?.userData?.avatar}
                          />
                        ) : (
                          <span>
                            {iconNameFormatter(userData?.userData?.full_name)}
                          </span>
                        )}
                      </div>
                      <div className="user-info">
                        <span className="lead-text">
                          {userData?.userData?.full_name || "-"}
                        </span>
                        <span className="sub-text">
                          {userData?.userData?.email || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-inner">
                    <ul className="link-list">
                      <li>
                        <Link
                          to={routesMap.PROFILE.path}
                          onClick={() => {
                            document.body.click();
                          }}
                        >
                          <em className="icon ni ni-user-alt" />
                          <span>View Profile</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={routesMap.CHANGE_PASSWORD.path}
                          onClick={() => {
                            document.body.click();
                          }}
                        >
                          <em className="icon ni ni-lock-alt-fill" />
                          <span>Change Password</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="dropdown-inner">
                    <ul className="link-list">
                      <li>
                        <Link
                          to="/"
                          onClick={(e) => {
                            e.preventDefault();
                            showSweetAlert();
                          }}
                        >
                          <em className="icon ni ni-signout" />
                          <span>Sign out</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Dropdown.Menu>
                <SweetAlert
                  reverseButtons
                  title={t("text.common.logout")}
                  text={t("text.common.wantToLogout")}
                  show={isAlertVisible}
                  icon="warning"
                  showCancelButton
                  cancelButtonText={t("text.common.no")}
                  confirmButtonText={t("text.common.yes")}
                  setIsAlertVisible={setIsAlertVisible}
                  showLoaderOnConfirm
                  loading={loading}
                  onConfirmAlert={onConfirmAlert}
                />
              </Dropdown>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
