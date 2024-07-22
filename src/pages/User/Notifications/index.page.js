import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { GlobalLoader, ImageElement } from "../../../components";
import CommonButton from "../../../components/UiElement/Button/Common/index.btn";
import userRoutesMap from "../../../routeControl/userRoutes";
import { NotificationServices } from "../../../services";
import {
  getActiveAccount,
  logger,
  modalNotification,
  totalTimeDifference,
} from "../../../utils";
import { selectUserAccountData } from "../../../redux/UserSlice/index.slice";

function Notifications() {
  const userAccountData = useSelector(selectUserAccountData);
  const [notificationList, setNotificationList] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [sizePerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  // const [noOfPage, setNoOfPage] = useState();
  const [totalCount, setTotalCount] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);
  const loadMore = () => {
    setPage(page + 1);
  };
  const [accountName, setAccountName] = useState(
    userAccountData?.find((acc) => acc?.status === "1")?.account
  );
  useEffect(() => {
    const activeAccount = getActiveAccount(userAccountData);
    setAccountName(activeAccount?.account);
  }, [userAccountData]);
  const handlenotificationList = async () => {
    setLoading(true);
    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        type: "customer",
      };
      const res = await NotificationServices.getNotificationListService({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setNotificationList([...notificationList, ...data?.rows]);
        // setNoOfPage(data?.count > 0 ? Math.ceil(data?.count / sizePerPage) : 1);
        setTotalCount(data?.count);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    handlenotificationList();
  }, [page]);
  const redirectNotification = (data) => {
    let pathObject;
    if (accountName?.includes("(Guest)")) {
      pathObject = {
        userPlanExpired: userRoutesMap.USER_DASHBOARD.path,
        userSubscription: userRoutesMap.USER_DASHBOARD.path,
        userSubscriptionFail: userRoutesMap.USER_DASHBOARD.path,
        userSignup: userRoutesMap.USER_DASHBOARD.path,
      };
    } else {
      pathObject = {
        userPlanExpired: userRoutesMap.PLAN_SUBSCRIPTION.path,
        userSubscription: userRoutesMap.PLAN_SUBSCRIPTION.path,
        userSubscriptionFail: userRoutesMap.PLAN_SUBSCRIPTION.path,
        userSignup: userRoutesMap.USER_DASHBOARD.path,
      };
    }
    navigate(pathObject?.[data?.type]);
  };
  return (
    <>
      <div className="notificationPage">
        <section className="notificaton py-70">
          <Container>
            <h1 className="backheading font-eb">
              <Link to={userRoutesMap.USER_DASHBOARD.path}>
                <em className="icon-arrow-back" />
              </Link>
              {t("text.adminHeader.notification")}
            </h1>
            <div className="notificaton_box customCard">
              <ul className="notificaton_list list-unstyled mb-0 overflow-auto">
                {loading ? (
                  <div className="py-3">
                    <GlobalLoader />
                  </div>
                ) : notificationList.length > 0 ? (
                  notificationList.map((item) => {
                    return (
                      <li
                        className="notificaton_list_item d-flex align-items-center justify-content-start"
                        onClick={() => {
                          redirectNotification(item);
                        }}
                      >
                        <div className="userImg me-2 flex-shrink-0">
                          <img
                            className="img-fluid"
                            src="../assets/images/frontend/notifications.png"
                            alt="profile"
                          />
                        </div>
                        <div className="notifyMsg">
                          <h6 className="font-sb">{item?.title}</h6>
                          <p className="mb-0">{item?.message}</p>
                          <span>
                            {" "}
                            {totalTimeDifference(item?.createdAt, new Date())}
                          </span>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <div className="emptySec text-center w-100">
                    <ImageElement
                      source="no-notification.svg"
                      alt="No Data Found"
                    />
                    <h6>{t("text.common.noData")}</h6>
                    {/* <p className="mb-0">
                There are no Pricing Plan to show here right now.
              </p> */}
                  </div>
                )}

                {/* <li className="notificaton_list_item d-flex align-items-center justify-content-start">
                            <div className="userImg me-2 flex-shrink-0">
                                <img className="img-fluid" src="../assets/images/frontend/profile.jpg" alt="profile"/>
                            </div>
                            <div className="notifyMsg">
                                <p className="mb-0">Lorem ipsum dolor sit amet consec</p>
                                <span>1 month ago</span>
                            </div>
                        </li> */}
              </ul>
              {totalCount > notificationList?.length && (
                <div className="text-center mt-3">
                  <CommonButton
                    variant="info"
                    onClick={() => {
                      loadMore();
                    }}
                  >
                    {t("text.common.loadMore")}
                  </CommonButton>
                </div>
              )}
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}

export default Notifications;
