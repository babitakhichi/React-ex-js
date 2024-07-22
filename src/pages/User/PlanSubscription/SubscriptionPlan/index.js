import { t } from "i18next";
import React, { useEffect, useState, useCallback, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  CommonButton,
  Popovers,
  RippleEffect,
  statusFormatter,
  textFormatter,
} from "../../../../components";
import {
  getUserSubscription,
  selectSubscriptionData,
  selectUserAccountData,
} from "../../../../redux/UserSlice/index.slice";
import userRoutesMap from "../../../../routeControl/userRoutes";
import {
  dateFormatter,
  getActiveAccount,
  showSubscriptionFeatures,
} from "../../../../utils";

export default function SubscriptionPlan({
  setDisableRenewalAlertVisible,
  setIsCancelAlertVisible,
  setPlanData,
}) {
  const navigate = useNavigate();
  const [userSubscriptionData, setUserSubscriptionData] = useState([]);
  let planList = useSelector(selectSubscriptionData);
  const account = useSelector(selectUserAccountData);
  let features = useCallback((data) => {
    return showSubscriptionFeatures(data);
  }, []);
  const dispatch = useDispatch();
  useEffect(() => {
    let activeAccount = getActiveAccount(account);
    let queryParams = {
      is_corporate: false,
      corporate_id:
        activeAccount?.id,
    };
    dispatch(getUserSubscription({ queryParams }));
  }, []);
  useEffect(() => {
    if (planList?.length > 0) {
      let filteredData = planList.filter((item) => {
        return !item?.is_base;
      });
      setUserSubscriptionData(filteredData);
    }
  }, [planList]);

  const handleNavigation = (type) => {
    navigate(userRoutesMap.PURCHASE_PLAN.path, {
      state: type?.Subscription?.plan_type,
    });
  };

  const redirectPath = useMemo(() => {
    return {
      translation: userRoutesMap.TRANSLATION.path,
      videoConferencing: userRoutesMap.VIDEO_CONFERENCING.path,
      bundled: userRoutesMap.USER_DASHBOARD.path,
    };
  });

  return (
    <div className="planSubscription_box customCard">
      <h3 className="title font-eb mb-0">
        {t("text.planAndSubscription.subscriptionPlan")}
      </h3>
      {userSubscriptionData?.length > 0 ? (
        <>
          <div className="plansList">
            <ul className="list-unstyled d-flex justify-content-between mb-0 flex-wrap">
              {userSubscriptionData.map((item, key) => {
                if (!item?.is_base) {
                  return (
                    <li className="plansList_box position-relative" key={key}>
                      <h5 className="font-bd mb-2">
                        {key + 1}.{" "}
                        {statusFormatter(item?.Subscription?.plan_type)}{" "}
                        {t("text.userPayment.plan")} :{" "}
                        {textFormatter(item?.Subscription?.name)}
                      </h5>
                      <p className="font-sb mb-2 mb-md-3">
                        {t("text.planAndSubscription.dateOfExp")}:{" "}
                        <span className="font-bd">
                          {" "}
                          {dateFormatter(item?.expires_on, "DD-MM-YYYY")}
                        </span>
                        <Link
                          to={redirectPath?.[item?.plan_category]}
                          className="link-primary my-2 d-block"
                        >
                          Use Now
                        </Link>
                      </p>
                      <div className="">
                        {!item?.is_cancelled && (
                          <>
                            <RippleEffect>
                              <CommonButton
                                loading={!item?.auto_recurring}
                                onClick={() => {
                                  setPlanData(item);
                                  setDisableRenewalAlertVisible(true);
                                }}
                                extraClassName="btn-md"
                                variant="secondary"
                              >
                                {t("text.planAndSubscription.autoRenewal")}
                              </CommonButton>
                            </RippleEffect>

                            <RippleEffect extraClassName="ms-xl-3 ms-2">
                              <Popovers
                                placement="right"
                                overlayClassName="featuresInfo"
                                content={
                                  <>
                                    <h5 className="mb-xl-3 mb-2">
                                      {statusFormatter(
                                        item?.Subscription?.plan_type
                                      )}{" "}
                                      Features
                                    </h5>
                                    <ul
                                      className="featuresInfo_list list-unstyled mb-0"
                                      dangerouslySetInnerHTML={{
                                        __html: features(item),
                                      }}
                                    />
                                  </>
                                }
                              >
                                <div>
                                  <CommonButton
                                    extraClassName="btn-md btn-feature"
                                    variant="secondary"
                                  >
                                    Features
                                  </CommonButton>
                                </div>
                              </Popovers>
                            </RippleEffect>
                          </>
                        )}
                      </div>
                      <div className="d-flex mt-2 mt-md-3 mt-lg-4">
                        <RippleEffect>
                          <CommonButton
                            extraClassName="btn-md"
                            variant="primary"
                            onClick={() => {
                              handleNavigation(item);
                            }}
                          >
                            {t("text.planAndSubscription.switch")}
                          </CommonButton>
                        </RippleEffect>
                        {!item?.is_cancelled ? (
                          <RippleEffect extraClassName="ms-2 ms-md-3">
                            <CommonButton
                              onClick={() => {
                                setPlanData(item);
                                setIsCancelAlertVisible(true);
                              }}
                              extraClassName="btn-md"
                              variant="info"
                            >
                              {t("text.common.cancel")}
                            </CommonButton>
                          </RippleEffect>
                        ) : (
                          <RippleEffect extraClassName="ms-xl-3 ms-2">
                            <Popovers
                              placement="right"
                              overlayClassName="featuresInfo"
                              content={
                                <>
                                  <h5 className="mb-xl-3 mb-2">
                                    {statusFormatter(
                                      item?.Subscription?.plan_type
                                    )}{" "}
                                    Features
                                  </h5>
                                  <ul
                                    className="featuresInfo_list list-unstyled mb-0"
                                    dangerouslySetInnerHTML={{
                                      __html: features(item),
                                    }}
                                  />
                                </>
                              }
                            >
                              <div>
                                <CommonButton
                                  extraClassName="btn-md btn-feature"
                                  variant="secondary"
                                >
                                  Features
                                </CommonButton>
                              </div>
                            </Popovers>
                          </RippleEffect>
                        )}
                      </div>
                    </li>
                  );
                }
              })}
              <li className="plansList_box plansList_box-explore position-relative text-center align-self-center my-3">
                <h5 className="font-bd mb-0">
                  {t("text.planAndSubscription.exploreOther")}
                </h5>
                <div className="mt-2 mt-lg-3">
                  <RippleEffect>
                    <Link
                      to={userRoutesMap.PURCHASE_PLAN.path}
                      className="btn btn-primary btn-md"
                    >
                      {t("text.planAndSubscription.explore")}
                    </Link>
                  </RippleEffect>
                </div>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className="noActivePlans mx-auto text-center">
          <h3 className="mb-1 font-eb">
            {" "}
            {t("text.planAndSubscription.basicActive")}
          </h3>
          <p className="mb-2 mb-lg-3">
            {t("text.planAndSubscription.basicActiveDescription")}
          </p>
          <RippleEffect>
            <Link
              to={userRoutesMap.PURCHASE_PLAN.path}
              className="btn btn-primary btn-md"
            >
              {t("text.planAndSubscription.explore")}
            </Link>
          </RippleEffect>
        </div>
      )}

      <div className="text-center mt-4 mt-xxl-5">
        <p className="mb-0 text-secondary">
          Purchased plan can be cancelled within 7 days to get full refund{" "}
        </p>
      </div>

      {/* <li className="plansList_box position-relative">
                                                        <h5 className="font-bd mb-2">2. Audio/Video Conference: Gold</h5>
                                                        <p className="font-sb mb-2 mb-md-3">Date of expiration: <span className="font-bd">24-10-2023  </span></p>
                                                        <RippleEffect><CommonButton onClick={() => setDisableRenewalAlertVisible(true)} extraClassName="btn-md" variant="secondary">Disable Auto Renewal</CommonButton></RippleEffect>
                                                        <div className="d-flex mt-2 mt-md-3 mt-lg-4">
                                                            <RippleEffect><CommonButton  extraClassName="btn-md" variant="primary">Switch</CommonButton></RippleEffect>
                                                            <RippleEffect extraClassName="ms-2 ms-md-3"><CommonButton onClick={() => setIsCancelAlertVisible(true)} extraClassName="btn-md" variant="info">Cancel</CommonButton></RippleEffect>
                                                        </div>
                                                    </li> */}
      {/* <li className="plansList_box position-relative text-center">
            <h5 className="font-bd mb-0">
              {t("text.planAndSubscription.exploreOther")}
            </h5>
            <div className="mt-2 mt-lg-3">
              <RippleEffect>
                <Link
                  to={userRoutesMap.PURCHASE_PLAN.path}
                  className="btn btn-primary btn-md"
                >
                  {t("text.planAndSubscription.explore")}
                </Link>
              </RippleEffect>
            </div>
          </li> */}
    </div>
  );
}
