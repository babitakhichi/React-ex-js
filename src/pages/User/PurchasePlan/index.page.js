import { t } from "i18next";
import React, { useState, useEffect } from "react";

import { Container, Col, Row, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  checkValidCount,
  commasFormatter,
  CommonButton,
  GlobalLoader,
  ImageElement,
  ModalComponent,
  Popovers,
  RippleEffect,
  statusFormatter,
  // SweetAlert,
  Tabs,
  textFormatter,
  translationTypeFormatter,
} from "../../../components";
import { bundledData, subscriptionData } from "../../../config/subscriptonData";
import {
  getProfile,
  getUserSubscription,
  selectProfileData,
  selectSubscriptionData,
  selectUserAccountData,
} from "../../../redux/UserSlice/index.slice";
import userRoutesMap from "../../../routeControl/userRoutes";
import { UserHomeServices } from "../../../services";
import {
  getActiveAccount,
  getCurrentActiveSubscription,
  getIscorporateActive,
  logger,
  modalNotification,
  planData,
  removeLocalStorage,
  setLocalStorage,
  validSubscriptionSwitch,
} from "../../../utils";

function PurchasePlan() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const account = useSelector(selectUserAccountData);
  const [priceMonth, setPriceMonth] = useState("monthly");
  const [defaultKey, setDefaultKey] = useState(
    location?.state || "videoConferencing"
  );
  const activeAccount = getActiveAccount(account);
  const [corporateDefaultKey] = useState(
    getIscorporateActive(account) ? "1" : "0"
  );
  const [subcriptionData, setSubscriptionData] = useState([]);

  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const [isUpgradeAlertVisible, setIsUpgradeAlertVisible] = useState(false);

  const userActiveSubscription = useSelector(selectSubscriptionData);
  const [activeSubscription, setActiveSubscription] = useState({});
  const [switchData, setSwitchData] = useState({});
  const [switchText, setSwitchText] = useState("");
  const userData = useSelector(selectProfileData);

  const planType = {
    monthly: "Monthly",
    quarterly: "Quarterly",
    halfyearly: "Half Yearly",
    annual: "Yearly",
  };

  useEffect(() => {
    let queryParams = {
      is_corporate: corporateDefaultKey === "1",
      corporate_id: activeAccount?.id,
    };
    dispatch(getUserSubscription({ queryParams }));
    dispatch(getProfile());
  }, []);

  useEffect(() => {
    if (location.state) {
      setDefaultKey(location?.state);
    }
  }, [location?.state]);

  useEffect(() => {
    if (defaultKey) {
      navigate(userRoutesMap.PURCHASE_PLAN.path, {
        state: "",
      });
    }
  }, [defaultKey]);

  useEffect(() => {
    if (userActiveSubscription?.length > 0) {
      let data;
      let checkData = getCurrentActiveSubscription(
        userActiveSubscription,
        defaultKey
      );
      if (JSON.stringify(checkData) !== "{}") {
        data = checkData;
      } else if (defaultKey !== "bundled") {
        data = getCurrentActiveSubscription(userActiveSubscription, "bundled");
      } else {
        data = userActiveSubscription.filter((i) => !i?.is_base);
      }

      setActiveSubscription(data);
    }
  }, [userActiveSubscription, defaultKey]);

  const getSubscriptionList = async () => {
    setSubscriptionLoading(true);
    try {
      let price;
      if (priceMonth === "monthly") price = "price";
      else if (priceMonth === "halfyearly") price = "half_yearly";
      else price = priceMonth;

      let queryParams = {
        offset: 0,
        limit: 10,
        status: "active",
        sortBy: price,
        sortType: "ASC",
        plan: defaultKey,
        is_corporate: corporateDefaultKey,
      };
      const res = await UserHomeServices.userSubscriptionListingService({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setSubscriptionData(data.rows);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setSubscriptionLoading(false);
  };

  useEffect(() => {
    removeLocalStorage("plan");

    if (activeAccount?.account?.includes("(Guest)"))
      navigate(userRoutesMap.USER_DASHBOARD.path);
  }, []);

  useEffect(() => {
    getSubscriptionList();
  }, [defaultKey, priceMonth]);

  const codeData = [
    {
      value: "monthly",
      label: "Monthly",
    },
    {
      value: "quarterly",
      label: "Quarterly",
    },
    {
      value: "halfyearly",
      label: "Half-Yearly",
    },
    {
      value: "annual",
      label: "Annual",
    },
  ];

  const saveSubscriptionData = (item) => {
    let data = { ...item, duration: priceMonth };
    data.is_corporate = corporateDefaultKey;
    let checkDate = validSubscriptionSwitch(activeSubscription);
    if (corporateDefaultKey === "0") {
      if (
        activeSubscription?.id &&
        !activeSubscription?.Subscription?.is_basic
      ) {
        data.isSwitch = true;
        data.refund_order_id = activeSubscription?.order_id;
        data.refund_amount =
          !activeSubscription?.is_switch && checkDate
            ? activeSubscription?.order_amount
            : 0;
      } else if (
        defaultKey === "bundled" &&
        activeSubscription?.length > 0 &&
        !activeSubscription?.Subscription?.is_basic
      ) {
        data.isSwitch = true;
      } else {
        data.isSwitch = false;
      }
    }

    setLocalStorage("plan", data);
    // navigate(userRoutesMap.PAYMENT_METHOD.path);
    navigate(userRoutesMap.PAYMENT_SUMMARY.path);
  };

  const onSwitchPlan = async (item, obj) => {
    try {
      let prevData = { ...item };
      let text = "";
      let price = obj?.subscriptionPrice * obj?.duration;

      if (activeSubscription?.id) {
        // if (!activeSubscription?.is_switch) {
        let checkDate = validSubscriptionSwitch(activeSubscription);
        if (checkDate) {
          prevData.isRefund = checkDate;
          prevData.isCancelled = activeSubscription?.is_cancelled;
          if (price >= activeSubscription?.order_amount) {
            prevData.adjustAmount = activeSubscription?.order_amount;
            text = `You already have “${
              activeSubscription?.Subscription?.name
            }” (${statusFormatter(
              activeSubscription?.Subscription?.plan_type
            )}) – ${
              planType?.[activeSubscription?.plan_type]
            } active in your profile. If you switch the plan, INR ${
              activeSubscription?.order_amount
            } will be adjusted during the purchase and the new plan will be effective immediately.`;
          } else {
            prevData.adjustAmount =
              activeSubscription?.order_amount -
              (activeSubscription?.order_amount - price);
            prevData.totalRefundAmount =
              activeSubscription?.order_amount - price > 0
                ? activeSubscription?.order_amount - price
                : activeSubscription?.order_amount;
            text = `You already have “${
              activeSubscription?.Subscription?.name
            }” (${statusFormatter(
              activeSubscription?.Subscription?.plan_type
            )}) – ${
              planType?.[activeSubscription?.plan_type]
            } active in your profile. If you switch the plan, INR ${
              activeSubscription?.order_amount - price > 0
                ? activeSubscription?.order_amount - price
                : activeSubscription?.order_amount
            } will be refunded after the purchase and the new plan will be effective immediately.`;
          }
        } else {
          prevData.isCancelled = activeSubscription?.is_cancelled;
          text = `You already have ${`“${
            activeSubscription?.Subscription?.name
          }" (${statusFormatter(
            activeSubscription?.Subscription?.plan_type
          )}) – ${
            planType?.[activeSubscription?.plan_type]
          }`} active in your profile. If you switch the plan now, the new plan will be effective immediately and no refund will be processed for the current plans.`;
        }
        // } else {
        //   text = `You already have “${
        //     activeSubscription?.Subscription?.name
        //   }” (${statusFormatter(
        //     activeSubscription?.Subscription?.plan_type
        //   )}) – ${
        //     planType?.[activeSubscription?.plan_type]
        //   } which is already switched. If you switch the plan now, the new plan will be effective immediately and no refund will be processed for the current plans.`;
        // }
      } else {
        let videoData = getCurrentActiveSubscription(
          userActiveSubscription,
          "videoConferencing"
        );
        let translationData = getCurrentActiveSubscription(
          userActiveSubscription,
          "translation"
        );
        let checkVideoDate = validSubscriptionSwitch(videoData);
        let checktranslationDate = validSubscriptionSwitch(translationData);
        let refundAmount = 0;
        let adjustAmount = 0;

        let planName = `${
          videoData?.Subscription?.name
            ? `“${videoData?.Subscription?.name}" (${statusFormatter(
                videoData?.Subscription?.plan_type
              )}) – ${planType?.[videoData?.plan_type]}`
            : ""
        } ${
          videoData?.Subscription?.name && translationData?.Subscription?.name
            ? "and"
            : ""
        } ${
          translationData?.Subscription?.name
            ? `“${translationData?.Subscription?.name}" (${statusFormatter(
                translationData?.Subscription?.plan_type
              )}) – ${planType?.[translationData?.plan_type]}`
            : ""
        }`;
        prevData.isVideoConference = checkVideoDate;
        prevData.videoRefund = videoData?.order_amount;
        prevData.videoOrderId = videoData?.order_id;
        prevData.isTranslation = checktranslationDate;
        prevData.translationRefund = translationData?.order_amount;
        prevData.translationOrderId = translationData?.order_id;
        if (checkVideoDate || checktranslationDate) {
          prevData.isRefund = true;
          if (checkVideoDate && checktranslationDate) {
            refundAmount =
              checkValidCount(videoData?.order_amount) +
              checkValidCount(translationData?.order_amount);
            adjustAmount =
              checkValidCount(videoData?.order_amount) +
              checkValidCount(translationData?.order_amount);
            // planName = `“${videoData?.Subscription?.name}" (${statusFormatter(
            //   videoData?.Subscription?.plan_type
            // )}) – ${planType?.[videoData?.plan_type]} and “${
            //   translationData?.Subscription?.name
            // }” (${statusFormatter(
            //   translationData?.Subscription?.plan_type
            // )}) – ${planType?.[translationData?.plan_type]}`;
          } else if (checkVideoDate) {
            refundAmount = checkValidCount(videoData?.order_amount);
            adjustAmount = checkValidCount(videoData?.order_amount);
            // planName = `“${videoData?.Subscription?.name}" (${statusFormatter(
            //   videoData?.Subscription?.plan_type
            // )}) – ${planType?.[videoData?.plan_type]}`;
          } else if (checktranslationDate) {
            refundAmount = checkValidCount(translationData?.order_amount);
            adjustAmount = checkValidCount(translationData?.order_amount);
            // planName = `“${
            //   translationData?.Subscription?.name
            // }" (${statusFormatter(
            //   translationData?.Subscription?.plan_type
            // )}) – ${planType?.[translationData?.plan_type]}`;
          }
          prevData.refund_amount = adjustAmount;
          if (price >= adjustAmount) {
            prevData.adjustAmount = adjustAmount;
            text = `You already have ${planName} active in your profile. If you switch the plan, INR ${adjustAmount} will be adjusted during the purchase and the new plan will be effective immediately.`;
          } else {
            prevData.adjustAmount = adjustAmount - (adjustAmount - price);
            prevData.totalRefundAmount = refundAmount - price;
            text = `You already have ${planName} active in your profile. If you switch the plan, INR ${
              refundAmount - price
            } will be refunded after the purchase and the new plan will be effective immediately.`;
          }
        } else {
          if (videoData?.id && translationData?.id) {
            // planName = `“${videoData?.Subscription?.name}" (${statusFormatter(
            //   videoData?.Subscription?.plan_type
            // )}) – ${planType?.[videoData?.plan_type]} and “${
            //   translationData?.Subscription?.name
            // }” (${statusFormatter(
            //   translationData?.Subscription?.plan_type
            // )}) – ${planType?.[translationData?.plan_type]}`;
          } else if (videoData?.id) {
            // planName = `“${videoData?.Subscription?.name}" (${statusFormatter(
            //   videoData?.Subscription?.plan_type
            // )}) – ${planType?.[videoData?.plan_type]}`;
          } else if (translationData?.id) {
            // planName = `“${
            //   translationData?.Subscription?.name
            // }" (${statusFormatter(
            //   translationData?.Subscription?.plan_type
            // )}) – ${planType?.[translationData?.plan_type]}`;
          }
          text = `You already have ${planName} active in your profile. If you switch the plan now, the new plan will be effective immediately and no refund will be processed for the current plans.`;
        }
      }

      setIsUpgradeAlertVisible(true);
      setSwitchData(prevData);
      setSwitchText(text);
    } catch (error) {
      logger(error);
    }
  };

  const onUpgradeConfirm = () => {
    setIsUpgradeAlertVisible(false);
    saveSubscriptionData(switchData);
    return true;
  };

  const alldatahtml = (
    <div
      className={`purchasePlan_wrap d-flex align-items-top ${
        subscriptionLoading ? "justify-content-center" : ""
      }`}
    >
      {subscriptionLoading ? (
        <GlobalLoader />
      ) : (
        <>
          {" "}
          {subcriptionData?.length > 0 && (
            <div className="purchasePlan_wrapLeft">
              <h2 className="font-eb">
                {t("text.userHome.product")} <br /> {t("text.userHome.feature")}
              </h2>
              <ul className="list-unstyled  mb-0">
                {defaultKey === "bundled"
                  ? bundledData?.map((item) => {
                      return <li>{item?.lable}</li>;
                    })
                  : subscriptionData[defaultKey].map((item) => {
                      return <li>{item?.lable}</li>;
                    })}
              </ul>
            </div>
          )}
          {subcriptionData?.length > 0 ? (
            <div className="purchasePlan_wrapRight">
              <Row className="flex-nowrap">
                {subcriptionData?.map((item, key) => {
                  let { SubscriptionFeature } = item;
                  let activeClass = "";
                  if (active === key) {
                    activeClass = "active";
                  }
                  let planObj = planData(item, priceMonth);

                  return (
                    <Col xs="3" key={key}>
                      <div
                        onMouseEnter={() => setActive(key)}
                        className={`planColumn ${activeClass}`}
                      >
                        <div className="planColumn_outer">
                          <div className="planColumn_head">
                            <h2>{textFormatter(item?.name)}</h2>

                            {item.is_basic ? (
                              <h3>Free Plan</h3>
                            ) : (
                              <>
                                {priceMonth !== "monthly" && (
                                  <span className="cutOffPrice">
                                    ₹ {item?.price}
                                  </span>
                                )}
                                <h3>
                                  ₹ {planObj?.subscriptionPrice}{" "}
                                  <span> / {t("text.userHome.monthly")}</span>
                                </h3>
                              </>
                            )}
                          </div>

                          {defaultKey === "videoConferencing" && (
                            <ul className="list-unstyled mb-0">
                              <li>
                                {+SubscriptionFeature?.audio_video_conference >
                                0 ? (
                                  `Upto   ${
                                    SubscriptionFeature?.audio_video_conference
                                  } ${t("text.userHome.participants")} `
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {" "}
                                {SubscriptionFeature?.meet_duration ? (
                                  `${SubscriptionFeature?.meet_duration} ${t(
                                    "text.userHome.mins"
                                  )}`
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {" "}
                                {SubscriptionFeature?.international_phone ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.host_meeting_mobile ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.conference_chat ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.whiteboard ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.noise_cancellation ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {SubscriptionFeature?.record_meeting ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {SubscriptionFeature?.save_cloud ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {SubscriptionFeature?.cloud_storage ? (
                                  ` ${SubscriptionFeature?.cloud_storage} ${t(
                                    "text.userHome.gb"
                                  )}`
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {SubscriptionFeature?.poll ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {" "}
                                {SubscriptionFeature?.raise_hand ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.breakout_room ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.screen_sharing ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.voice_transcription ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.voice_text_translation ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.live_stream ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.share_youtube ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.track_attendance ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.mute_participant ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.disable_camera ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.compatibility ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.mobile_support ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.encryption ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.lobby ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.protected_meeting ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.spam_protection ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              {/* <li>
                                {+SubscriptionFeature?.video_translation > 0 ? (
                                  SubscriptionFeature?.video_translation
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li> */}
                            </ul>
                          )}
                          {defaultKey === "translation" && (
                            <ul className="list-unstyled mb-0">
                              <li>
                                {item?.SubscriptionTranslationTypes?.length >
                                0 ? (
                                  commasFormatter(
                                    item?.SubscriptionTranslationTypes?.map(
                                      (type) => {
                                        return `${translationTypeFormatter(
                                          type?.translation_type
                                        )}`;
                                      }
                                    )
                                  )
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {item?.SubscriptionDocumentTypes?.length > 0 ? (
                                  commasFormatter(
                                    item?.SubscriptionDocumentTypes?.map(
                                      (type) => {
                                        return `${type?.document_type}`;
                                      }
                                    )
                                  )
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {item?.SubscriptionMediaTypes?.length > 0 ? (
                                  commasFormatter(
                                    item?.SubscriptionMediaTypes?.map(
                                      (type) => {
                                        return `${type?.media_type}`;
                                      }
                                    )
                                  )
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {" "}
                                {SubscriptionFeature?.voice_transcription ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {+SubscriptionFeature?.translation > 0 ? (
                                  SubscriptionFeature?.translation
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                            </ul>
                          )}
                          {defaultKey === "bundled" && (
                            <ul className="list-unstyled mb-0">
                              <li>
                                {item?.SubscriptionTranslationTypes?.length >
                                0 ? (
                                  commasFormatter(
                                    item?.SubscriptionTranslationTypes?.map(
                                      (type) => {
                                        return `${translationTypeFormatter(
                                          type?.translation_type
                                        )}`;
                                      }
                                    )
                                  )
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {item?.SubscriptionDocumentTypes?.length > 0 ? (
                                  commasFormatter(
                                    item?.SubscriptionDocumentTypes?.map(
                                      (type) => {
                                        return `${type?.document_type}`;
                                      }
                                    )
                                  )
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {item?.SubscriptionMediaTypes?.length > 0 ? (
                                  commasFormatter(
                                    item?.SubscriptionMediaTypes?.map(
                                      (type) => {
                                        return `${type?.media_type}`;
                                      }
                                    )
                                  )
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              {/* <li>
                                {" "}
                                {SubscriptionFeature?.voice_transcription ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li> */}
                              <li>
                                {+SubscriptionFeature?.translation > 0 ? (
                                  SubscriptionFeature?.translation
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {+SubscriptionFeature?.audio_video_conference >
                                0 ? (
                                  `Upto   ${
                                    SubscriptionFeature?.audio_video_conference
                                  } ${t("text.userHome.participants")} `
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {" "}
                                {SubscriptionFeature?.meet_duration ? (
                                  `${SubscriptionFeature?.meet_duration} ${t(
                                    "text.userHome.mins"
                                  )}`
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {" "}
                                {SubscriptionFeature?.international_phone ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.host_meeting_mobile ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.conference_chat ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.whiteboard ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.noise_cancellation ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {SubscriptionFeature?.record_meeting ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {SubscriptionFeature?.save_cloud ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {SubscriptionFeature?.cloud_storage ? (
                                  ` ${SubscriptionFeature?.cloud_storage} ${t(
                                    "text.userHome.gb"
                                  )}`
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {SubscriptionFeature?.poll ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              <li>
                                {" "}
                                {SubscriptionFeature?.raise_hand ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.breakout_room ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.screen_sharing ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.voice_transcription ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.voice_text_translation ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.live_stream ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.share_youtube ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.track_attendance ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.mute_participant ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.disable_camera ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.compatibility ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.mobile_support ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.encryption ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.lobby ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.protected_meeting ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>{" "}
                              <li>
                                {" "}
                                {SubscriptionFeature?.spam_protection ? (
                                  <em className="icon-check" />
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li>
                              {/* <li>
                                {+SubscriptionFeature?.video_translation > 0 ? (
                                  SubscriptionFeature?.video_translation
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li> */}
                              {/* <li>
                                {+SubscriptionFeature?.video_translation > 0 ? (
                                  SubscriptionFeature?.video_translation
                                ) : (
                                  <em className="icon-close" />
                                )}
                              </li> */}
                            </ul>
                          )}
                        </div>
                        <div className="bottomBtn text-center">
                          <RippleEffect>
                            {((item?.is_basic &&
                              activeSubscription?.Subscription === undefined) ||
                              (item?.id ===
                                activeSubscription?.Subscription?.id &&
                                activeSubscription?.plan_type ===
                                  priceMonth)) &&
                            corporateDefaultKey === "0" ? (
                              <>
                                <Link
                                  to="#"
                                  disabled
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                  className="btn btn-primary"
                                >
                                  {/* {JSON.stringify(activeSubscription) === "{}"
                                    ? "Already activated"
                                    : "Not clickable"} */}
                                  Already activated
                                  <em className="icon-arrow-next icon-right" />
                                </Link>
                              </>
                            ) : (
                              item?.is_basic === false && (
                                <Link
                                  to="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (
                                      activeSubscription?.id &&
                                      !activeSubscription?.Subscription
                                        ?.is_basic &&
                                      corporateDefaultKey === "0"
                                    ) {
                                      onSwitchPlan(item, planObj);
                                    } else if (
                                      defaultKey === "bundled" &&
                                      activeSubscription?.length > 0 &&
                                      !activeSubscription?.Subscription
                                        ?.is_basic &&
                                      corporateDefaultKey === "0"
                                    ) {
                                      onSwitchPlan(item, planObj);
                                    } else {
                                      saveSubscriptionData(item);
                                    }
                                  }}
                                  className="btn btn-primary"
                                >
                                  {t("text.manageSubscription.purchasePlan")}{" "}
                                  <em className="icon-arrow-next icon-right" />
                                </Link>
                              )
                            )}
                          </RippleEffect>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          ) : (
            <div className="emptySec text-center w-100">
              <ImageElement
                source="video-conferencing-icon.svg"
                alt="No Data Found"
              />
              <h2>{t("text.common.noData")}</h2>
              <p className="mb-0">
                There are no Pricing Plan to show here right now.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
  const userSubscription = [
    {
      name: t("text.manageSubscription.audioVideoconferencing"),
      key: "videoConferencing",
      content: alldatahtml,
      navIcon: "video-conferencing-icon.svg",
    },
    {
      name: " Translation",
      key: "translation",
      content: alldatahtml,
      navIcon: "translation-icon.svg",
    },
    {
      name: " Bundled",
      key: "bundled",
      content: alldatahtml,
      navIcon: "bundled-icon.svg",
    },
  ];

  const handleUpgradeAlertShow = () => setIsUpgradeAlertVisible(true);
  const handleClose = () => {
    setIsUpgradeAlertVisible(false);
  };
  return (
    <>
      <section className="purchasePlan py-70">
        <Container>
          {!userData?.UserBusinessAccount && (
            <div className="purchasePlan_corporate d-flex flex-wrap flex-md-nowrap align-items-center justify-content-center">
              <p className="mb-md-0 me-md-3 text-center text-md-start">
                {t("text.userPurchasePlan.updateProfileText")}
              </p>
              <RippleEffect extraClassName="flex-shrink-0">
                <Link
                  to={userRoutesMap.USER_ACCOUNT.path}
                  className="btn btn-primary"
                >
                  {t("text.userProfile.updateProfile")}
                  <em className="icon-arrow-next icon-right" />
                </Link>
              </RippleEffect>
            </div>
          )}
          <div className="text-center heading mx-auto">
            <h3 className="heading_sub font-ad">
              {t("text.userPurchasePlan.price")}{" "}
            </h3>
            <h1 className="heading_main">
              {" "}
              {t("text.userPurchasePlan.choosePlan")}
            </h1>
            {/* <p className="mb-0">{t("text.userPurchasePlan.upgrade")}</p> */}
          </div>
          {/* <Tabs
            tabContent={corporateSubscription}
            activeKey={corporateDefaultKey}
            // setActiveKey={setCorporateDefaultKey}
            navDivClassName="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-between purchasePlan_head"
            pills
            navClass="tabWithBg"
          /> */}
          <Nav className="tabWithBg border-0 p-0" variant="pills">
            <Nav.Item>
              <Nav.Link className="active">
                {corporateDefaultKey === "1" ? "Corporate" : "Personal Account"}
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tabs
            tabContent={userSubscription}
            tabsFor="table"
            activeKey={defaultKey}
            setActiveKey={setDefaultKey}
            navDivClassName="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-between purchasePlan_head"
            // navClass="nav nav-pills"
            pills
            codeData={codeData}
            priceMonth={priceMonth}
            setPriceMonth={setPriceMonth}
            // onTabChange={onTabChange}
          />
        </Container>
      </section>
      {/* <SweetAlert
        title=" Switching the plan?"
        text={switchText}
        show={isUpgradeAlertVisible}
        icon="warning"
        showCancelButton
        cancelButtonText={t("text.common.no")}
        confirmButtonText={t("text.common.yes")}
        setIsAlertVisible={setIsUpgradeAlertVisible}
        // showLoaderOnConfirm
        // loading={loading}
        onConfirmAlert={onUpgradeConfirm}
      /> */}
      <ModalComponent
        show={isUpgradeAlertVisible}
        modalExtraClass="paymentSuccessModal planSwitchModal"
        onHandleVisible={handleUpgradeAlertShow}
        onHandleCancel={handleClose}
        title=""
        size="md"
        closeButton={false}
        extraTitleClassName="p-0"
      >
        <div className="text-center">
          <Popovers
            placement="bottom"
            overlayClassName="modalSwitchPlan"
            content={
              <>
                <h5>Refund Policy</h5>
                <ul className="ps-3 mb-0">
                  <li>
                    Full refund will be processed if you cancel the plan within
                    7 days of initial purchase.
                  </li>
                  <li>
                    Refund will not be processed if you cancel the subscription
                    after 7 days of initial purchase.
                  </li>
                  <li>
                    If you switch the plan within 7 days of initial plan
                    purchase, you are eligible to get refund/adjustment of your
                    initial plan. Refund/Adjustment only happens once.
                  </li>
                  <li>
                    Refund/adjustment will not take place if you switch the plan
                    after 7 days of initial plan purchase.
                  </li>
                </ul>
              </>
            }
          >
            <em className="icon-info modalSwitchPlan_infoIcon position-absolute" />
          </Popovers>
          <ImageElement
            source="plan-switch.svg"
            alt="plan-switch"
            className="img-fluid mb-0"
          />
          <h3 className="font-eb mt-3 mt-lg-4 mb-2 mb-lg-3">
            Switching the plan?
          </h3>
          <p>{switchText}</p>
          <div>
            <RippleEffect>
              <CommonButton
                extraClassName="btn-md"
                variant="primary"
                onClick={() => onUpgradeConfirm()}
              >
                {t("text.common.yes")}
              </CommonButton>
            </RippleEffect>
            <RippleEffect>
              <CommonButton
                extraClassName="btn-md ms-2"
                variant="info"
                onClick={() => handleClose()}
              >
                {t("text.common.no")}
              </CommonButton>
            </RippleEffect>
          </div>
        </div>
      </ModalComponent>
    </>
  );
}

export default PurchasePlan;
