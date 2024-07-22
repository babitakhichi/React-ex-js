import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import {
  CommonButton,
  RippleEffect,
  ImageElement,
  Tabs,
  textFormatter,
  GlobalLoader,
  commasFormatter,
  translationTypeFormatter,
  checkValidData,
  ModalComponent,
  // AntSelect,
} from "../../../components";
import userRoutesMap from "../../../routeControl/userRoutes";
import { AdminManageTeamMemberList, UserHomeServices } from "../../../services";
import {
  baseUrlGenerator,
  dateFormatter,
  encoder,
  logger,
  modalNotification,
  momentTimezoneFormatter,
  planData,
} from "../../../utils";
import { bundledData, subscriptionData } from "../../../config/subscriptonData";
import StartMeetingsForm from "../../../components/Form/User/StartMeetingsForm/index.form";
import UnregisterTranslation from "../UnregisterTranslation/index.page";

function Home() {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);
  const [active, setActive] = useState(0);
  const [priceMonth, setPriceMonth] = useState("monthly");
  const [subcriptionData, setSubscriptionData] = useState([]);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [defaultKey, setDefaultKey] = useState("videoConferencing");
  const [visionPartners, setVisionPartners] = useState([]);
  const [visionPartnersLoader, setVisionPartnersLoader] = useState(false);
  const [corporateDefaultKey, setCorporateDefaultKey] = useState("1");
  const [startMeetingModal, setStartMeetingModal] = useState(false);
  const [startMeetingloading, setStartMeetingLoading] = useState(false);
  const [basicActiveTranslation, setBasicActiveTranslation] = useState({});
  const handleStartMeetingModalShow = () => setStartMeetingModal(true);

  const handleStartMeetingModalClose = () => setStartMeetingModal(false);
  const [startTranslaionModal, setStartTranslationModal] = useState(false);
  // const [startMeetingloading, setStartMeetingLoading] = useState(false);
  const handleStartTranslationModalShow = () => setStartTranslationModal(true);

  const handleStartTranslationModalClose = () =>
    setStartTranslationModal(false);
  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
  });

  const getVisionPartners = async () => {
    setVisionPartnersLoader(true);
    try {
      let queryParams = {
        member_type: "visionPartners",
        limit: "all",
      };
      const res = await AdminManageTeamMemberList.getTeamMemberListService({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setVisionPartners(data?.rows);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setVisionPartnersLoader(false);
  };

  useEffect(() => {
    getVisionPartners();
  }, []);
  const settingsThumbs = {
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: ".slider-for",
    dots: false,
    variableWidth: true,
    swipeToSlide: false,
    focusOnSelect: true,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 1000,
  };

  let teamSlider = {
    dots: true,
    infinite: false,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  let settings = {
    dots: false,
    infinite: true,
    asNavFor: ".slider-nav",
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  // const codeData = [
  //   {
  //     value: "price",
  //     label: "Monthly",
  //   },
  //   {
  //     value: "quarterly",
  //     label: "Quarterly",
  //   },
  //   {
  //     value: "half_yearly",
  //     label: "Half-Yearly",
  //   },
  //   {
  //     value: "annual",
  //     label: "Annual",
  //   },
  // ];
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
        setSubscriptionData(data?.rows);
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
    getSubscriptionList();
  }, [defaultKey, priceMonth, corporateDefaultKey]);

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
          {subcriptionData?.length > 0 && (
            <div className="purchasePlan_wrapLeft">
              <h2 className="font-eb">
                {t("text.userHome.product")} <br /> {t("text.userHome.feature")}
              </h2>
              <ul className="list-unstyled  mb-0">
                {defaultKey === "bundled"
                  ? bundledData.map((item) => {
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
                  let planObj = planData(item, priceMonth);
                  return (
                    <Col xs="3" key={key}>
                      <div
                        onMouseEnter={() => setActive(key)}
                        className={`planColumn ${
                          active === key ? "active" : ""
                        }`}
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
                            {/* {priceMonth === "price" && (
                              <h3>
                                ₹ {item?.price}{" "}
                                <span>/ {t("text.userHome.monthly")}</span>
                              </h3>
                            )}
                            {priceMonth === "quarterly" && (
                              <>
                                {priceMonth !== "monthly" && (
                                  <span className="cutOffPrice">
                                    ₹ {item?.price}
                                  </span>
                                )}
                                <h3>
                                  ₹ {item?.quarterly}{" "}
                                  <span>/ {t("text.userHome.monthly")}</span>
                                </h3>
                              </>
                            )}
                            {priceMonth === "half_yearly" && (
                              <>
                                {priceMonth !== "monthly" && (
                                  <span className="cutOffPrice">
                                    ₹ {item?.price}
                                  </span>
                                )}
                                <h3>
                                  ₹ {item?.half_yearly}{" "}
                                  <span>/ {t("text.userHome.monthly")}</span>
                                </h3>
                              </>
                            )}
                            {priceMonth === "annual" && (
                              <>
                                {priceMonth !== "monthly" && (
                                  <span className="cutOffPrice">
                                    ₹ {item?.price}
                                  </span>
                                )}
                                <h3>
                                  ₹ {item?.annual}{" "}
                                  <span> / {t("text.userHome.monthly")}</span>
                                </h3>
                              </>
                            )} */}
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
                            <Link
                              to={userRoutesMap.LOGIN.path}
                              className="btn btn-primary"
                            >
                              {t("text.userHome.start")}{" "}
                              <em className="icon-arrow-next icon-right" />
                            </Link>
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
      name: " Video Conferencing",
      key: "videoConferencing",
      content: alldatahtml,
      navIcon: "video-conferencing-icon.svg",
    },
    {
      name: "Translation",
      key: "translation",
      content: alldatahtml,
      navIcon: "translation-icon.svg",
    },
    {
      name: "Bundled",
      key: "bundled",
      content: alldatahtml,
      navIcon: "bundled-icon.svg",
    },
  ];
  const allCorporatedatahtml = (
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
  );
  const corporateSubscription = [
    {
      name: "Corporate",
      key: "1",
      content: allCorporatedatahtml,
    },
    {
      name: "Personal Account",
      key: "0",
      content: allCorporatedatahtml,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      let navbar = document.querySelector(".navbar");
      let sliderNav = document.querySelector(".sliderNav ");
      let navbarHeight = navbar?.clientHeight;
      let sliderNavHeight = sliderNav?.clientHeight;
      let banner = document.querySelectorAll(".bannerSec_txt");
      banner.forEach((element) => {
        element.style.paddingTop = `${navbarHeight}px`;
        element.style.paddingBottom = `${sliderNavHeight + 50}px`;
      });
    }, 300);
  });
  const startMeetingsSubmit = async (value) => {
    setStartMeetingLoading(true);
    try {
      let bodyData = {
        start_date: dateFormatter(new Date(), "YYYY-MM-DD"),
        start_time: dateFormatter(new Date(), "HH:mm"),
        isStartNow: true,
        ...value,
      };

      let date = `${bodyData?.start_date} ${bodyData?.start_time}`;
      bodyData.start_date = momentTimezoneFormatter(new Date(date))
        .utc()
        .format();
      bodyData.seleted_time = date;
      delete bodyData.start_time;

      bodyData.is_corporate = 0;
      // bodyData.corporate_id = activeAccount?.id;
      let res = await UserHomeServices.unRegisterUseAddMeetingService(bodyData);
      const { success, message, data } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        if (data?.id) {
          window.open(
            baseUrlGenerator(
              `${userRoutesMap.UNREGISTER_JITSI_MEET.path}/${encoder(data?.id)}`
            )
          );
        }

        setStartMeetingModal(false);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }

      // handleStartMeetingModalClose();
    } catch (error) {
      logger(error);
    }
    setStartMeetingLoading(false);
  };
  const getSubscriptionBaseList = async () => {
    try {
      const res = await UserHomeServices.unRegisterUserSubscriptionService();
      const { success, data, message } = res;
      if (success === 1) {
        setBasicActiveTranslation(data);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
  };
  useEffect(() => {
    getSubscriptionBaseList();
  }, []);

  return (
    <>
      <div className="homePage">
        <section id="home" className="bannerSec position-relative">
          <Slider
            {...settings}
            asNavFor={nav2}
            ref={(slider) => setSlider1(slider)}
          >
            <div className="bannerSec_bg bannerSec_bg-one">
              <Container>
                <Row>
                  <Col sm={6} md={5}>
                    <div className="bannerSec_txt d-flex flex-column align-items-start justify-content-center">
                      <h3 className="font-eb text-white">
                        A fully secure social & business communication platform
                        for the world
                      </h3>
                      <p>
                        A cross platform mobile & web solution with a bouquet of
                        services to make your interactions fun & easy.
                      </p>
                      <RippleEffect>
                        <CommonButton variant="primary">
                          Get The App
                        </CommonButton>
                      </RippleEffect>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="bannerSec_bg bannerSec_bg-two">
              <Container>
                <Row>
                  <Col sm={7} md={6}>
                    <div className="bannerSec_txt d-flex flex-column align-items-start justify-content-center">
                      <h3 className="font-eb text-white">
                        Communicate with ease in high definition with your
                        colleagues, friends & family!
                      </h3>
                      <p>
                        No more worrying about your data privacy as Daakia is
                        end-to-end encrypted with best-in-class OMEMO
                        encryption.
                      </p>
                      <RippleEffect>
                        <CommonButton variant="primary">
                          Get The App
                        </CommonButton>
                      </RippleEffect>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
            <div className="bannerSec_bg bannerSec_bg-three">
              <Container>
                <Row>
                  <Col sm={7} md={5}>
                    <div className="bannerSec_txt d-flex flex-column align-items-start justify-content-center">
                      <h3 className="font-eb text-white">
                        A One Stop solution to effectively collaborate for your
                        personal & business needs!
                      </h3>
                      <p>
                        Be it at work, school, home or on the go; Daakia lets
                        you manage everything with ease. No more juggling with
                        multiple apps!
                      </p>
                      <RippleEffect>
                        <CommonButton variant="primary">
                          Get The App
                        </CommonButton>
                      </RippleEffect>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Slider>
          <Container>
            <Slider
              className="sliderNav"
              {...settingsThumbs}
              asNavFor={nav1}
              ref={(slider) => setSlider2(slider)}
            >
              <div className="sliderNav_item">
                <p>1</p>
                <h6>Welcome To Daakia</h6>
              </div>
              <div className="sliderNav_item">
                <p>2</p>
                <h6>Secure Communication</h6>
              </div>
              <div className="sliderNav_item">
                <p>3</p>
                <h6>Effective Collaboration</h6>
              </div>
            </Slider>
          </Container>
        </section>

        <section id="weOffer" className="py-70 offserSec position-relative">
          <Container>
            <div className="text-center heading mx-auto">
              <h3 className="heading_sub font-ad">Solutions We Offer</h3>
              <h2 className="heading_main text-white">
                Share Your Memories Like Never Before
              </h2>
              <p className="mb-0 text-white">
                &#34;Daakia&#34; is a first of its kind super app in the field
                of social & business communication. Our platform provides single
                stop solution for end-to-end encrypted chat & call, audio/video
                conference, social media and translation services.
              </p>
            </div>
            <div className="offserSec_bottom">
              <Row className="justify-content-center">
                <Col lg={10}>
                  <div className="d-flex flex-nowrap offserSec_img">
                    <div className="imgLeft">
                      <picture>
                        <source
                          type="image/webp"
                          srcSet="assets/images/frontend/offer-img1.webp"
                          alt="offer-img1"
                        />
                        <ImageElement
                          source="offer-img1.png"
                          alt="offer-img1"
                          className="img-fluid"
                        />
                      </picture>
                    </div>
                    <div className="imgRight ms-sm-2 mt-2 mt-sm-0">
                      <picture>
                        <source
                          type="image/webp"
                          srcSet="assets/images/frontend/offer-img2.webp"
                          alt="offer-img2"
                        />
                        <ImageElement
                          source="offer-img2.png"
                          alt="offer-img2"
                          className="img-fluid"
                        />
                      </picture>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </section>
        <section id="pricing" className="py-70 planSec purchasePlan bg-white">
          <Container>
            <div className="text-center heading mx-auto">
              <h3 className="heading_sub font-ad">Subscription</h3>
              <h2 className="heading_main">Choose A Plan And Get Started</h2>
              {/* <p className="mb-0">
                Experience all of Daakia for a{" "}
                <span className="text-danger">30-days Free</span> Trial. Post
                this, you may choose any of the following subscriptions plans.
                You can cancel/modify your subscription anytime.
              </p> */}
            </div>
            <Tabs
              tabContent={corporateSubscription}
              activeKey={corporateDefaultKey}
              setActiveKey={setCorporateDefaultKey}
              navDivClassName="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-between purchasePlan_head"
              pills
              navClass="tabWithBg"
            />
          </Container>
        </section>
        <section id="howItWorks" className="pt-lg-0 py-70 howWorks bg-white">
          <Container>
            <div className="text-center heading mx-auto">
              <h3 className="heading_sub font-ad">How It Works</h3>
              <h2 className="heading_main">How to Make Best Use of Daakia</h2>
              <p className="mb-0">
                A cross-platform web & mobile solution to make collaboration and
                communication easy and effective; be it at office, home or on
                the go. Bring your work, classroom or webinar together on Daakia
                and enjoy a more streamlined, secured experience that makes
                seamless cross-language communication possible.
              </p>
            </div>
            <div className="howWorks_cnt">
              <Row className="gx-2 gx-sm-3 justify-content-center">
                <Col>
                  <div
                    className="box text-center"
                    style={{
                      backgroundImage:
                        "url('./assets/images/frontend/how-works/box-1-bg.svg')",
                    }}
                  >
                    <ImageElement
                      source="how-works/create-account.svg"
                      alt="create-and-verify-account"
                    />
                    <p className="mb-0 font-bd">
                      Create & <br />
                      Verify Account
                    </p>
                  </div>
                </Col>
                <Col>
                  <div
                    className="box text-center"
                    style={{
                      backgroundImage:
                        "url('./assets/images/frontend/how-works/box-2-bg.svg')",
                    }}
                  >
                    <ImageElement
                      source="how-works/language.svg"
                      alt="bring-the-world-closer-together"
                    />
                    <p className="mb-0 font-bd">
                      Bring The World <br /> Closer Together
                    </p>
                  </div>
                </Col>
                <Col>
                  <div
                    className="box text-center"
                    style={{
                      backgroundImage:
                        "url('./assets/images/frontend/how-works/box-3-bg.svg')",
                    }}
                  >
                    <ImageElement
                      source="how-works/speak.svg"
                      alt="speak-freely-with-your-loved-ones"
                    />
                    <p className="mb-0 font-bd">
                      Speak Freely With <br /> Your Loved Ones
                    </p>
                  </div>
                </Col>
                <Col>
                  <div
                    className="box text-center"
                    style={{
                      backgroundImage:
                        "url('./assets/images/frontend/how-works/box-4-bg.svg')",
                    }}
                  >
                    <ImageElement
                      source="how-works/transactions.svg"
                      alt="simple-and-fast-transactions"
                    />
                    <p className="mb-0 font-bd">
                      Simple & Fast <br />
                      Transactions
                    </p>
                  </div>
                </Col>
                <Col>
                  <div
                    className="box text-center"
                    style={{
                      backgroundImage:
                        "url('./assets/images/frontend/how-works/box-5-bg.svg')",
                    }}
                  >
                    <ImageElement
                      source="how-works/events.svg"
                      alt="create-and-organize-events"
                    />
                    <p className="mb-0 font-bd">Create & Organize Events</p>
                  </div>
                </Col>
                <Col>
                  <div
                    className="box text-center"
                    style={{
                      backgroundImage:
                        "url('./assets/images/frontend/how-works/box-6-bg.svg')",
                    }}
                  >
                    <ImageElement
                      source="how-works/status.svg"
                      alt="post-status-and-share-your-memories"
                    />
                    <p className="mb-0 font-bd">
                      Post Status & <br /> Share Your Memories
                    </p>
                  </div>
                </Col>
                <Col>
                  <div
                    className="box text-center"
                    style={{
                      backgroundImage:
                        "url('./assets/images/frontend/how-works/box-7-bg.svg')",
                    }}
                  >
                    <ImageElement
                      source="how-works/clips.svg"
                      alt="express-yourself-with-clips"
                    />
                    <p className="mb-0 font-bd">
                      Express Yourself
                      <br /> With Clips
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </section>
        <section
          id="team"
          className="py-70 teamSec position-relative overflow-hidden"
        >
          <Container>
            <div className="teamSec_top">
              <Row className="align-items-center">
                <Col md={5}>
                  <div className="heading mb-md-0">
                    <h3 className="heading_sub font-ad">Our Team</h3>
                    <h2 className="heading_main">Meet Our Amazing Team</h2>
                  </div>
                </Col>
                <Col md={7}>
                  <div className="teamCard d-flex align-items-center position-relative">
                    <div className="teamCard_img flex-shrink-0">
                      <ImageElement
                        source="team-img.jpg"
                        alt="team-img"
                        className="img-fluid rounded-circle"
                      />
                    </div>
                    <div className="teamCard_desc">
                      <h3 className="mb-1 font-eb">Mr. Animesh Kumar</h3>
                      <h6 className="font-sb">Founder & CEO</h6>
                      <p className="mb-0">
                        Animesh is the Founder & CEO of Daakia Pvt. Ltd. <br />{" "}
                        He spearheads the company&#39;s innovative product
                        portfolios and manages business levers to drive growth
                        and build a value rich work culture.
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="teamSec_bottom  visionSec">
              <h4 className="font-bd">Our Vision Partners & Advisors</h4>
              <Slider className="innerSlider" {...teamSlider}>
                {visionPartnersLoader ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <GlobalLoader />
                  </div>
                ) : visionPartners?.length > 0 ? (
                  visionPartners?.map((item, index) => {
                    return (
                      <div key={index} className="sliderItem">
                        <div className="sliderItem_head d-flex align-items-center">
                          <div className="sliderItem_imgBox">
                            <ImageElement
                              previewSource={item?.img_url}
                              alt="partner-img"
                              className="img-fluid"
                            />
                          </div>
                          <div className="sliderItem_infoBox">
                            <h3>{textFormatter(item?.name)}</h3>
                            <p>{textFormatter(item?.position)}</p>
                          </div>
                        </div>
                        <p>{checkValidData(item?.description)}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="emptySec text-center w-100">
                    {/* <ImageElement

                        source="video-conferencing-icon.svg"

                        alt="No Data Found"

                      /> */}

                    <h2>{t("text.common.noData")}</h2>

                    {/* <p className="mb-0">
  
                  There are no Pricing Plan to show here right now.
  
                </p> */}
                  </div>
                )}
              </Slider>
              {/* <Row className="g-2 g-md-3 g-xl-4  g-xxl-5">
                {
                  visionPartnersLoader ? <GlobalLoader /> : 
                  visionPartners.length > 0 ?
                    visionPartners?.map((item, index) => {
                      return <Col key={index} sm={6} lg={4}>
                        <div className="partners d-flex bg-white align-items-start h-100">
                          <div className="partners_img flex-shrink-0 overflow-hidden">
                            <ImageElement
                              previewSource={item?.img_url}
                              alt="partner-img1"
                              className="img-fluid rounded-circle"
                            />
                          </div>
                          <div className="partners_desc">
                            <h3 className="font-bd">{item?.name}</h3>
                            <p className="mb-0">
                             {item?.description}
                            </p>
                          </div>
                        </div>
                      </Col>
                    }) : <>No Data Found</>
                }
                 <Col sm={6} lg={4}>
                  <div className="partners d-flex bg-white align-items-start h-100">
                    <div className="partners_img flex-shrink-0 overflow-hidden">
                      <ImageElement
                        source="partner-img1.jpg"
                        alt="partner-img1"
                        className="img-fluid rounded-circle"
                      />
                    </div>
                    <div className="partners_desc">
                      <h3 className="font-bd">Dr. Sonali Hazarika</h3>
                      <p className="mb-0">
                        Executive Director of UG Programs & Associate Professor
                        of Finance, Bruch College, City University of New York,
                        USA
                      </p>
                    </div>
                  </div>
                </Col>
                <Col sm={6} lg={4}>
                  <div className="partners d-flex bg-white align-items-start h-100">
                    <div className="partners_img flex-shrink-0 overflow-hidden">
                      <ImageElement
                        source="partner-img2.jpg"
                        alt="partner-img2"
                        className="img-fluid rounded-circle"
                      />
                    </div>
                    <div className="partners_desc">
                      <h3 className="font-bd">Mr. Ayushman Hazarika</h3>
                      <p className="mb-0">
                        Director Finance, Novartis Pharmaceuticals Corp., USA
                      </p>
                    </div>
                  </div>
                </Col>
                <Col sm={6} lg={4}>
                  <div className="partners d-flex bg-white align-items-start h-100">
                    <div className="partners_img flex-shrink-0 overflow-hidden">
                      <ImageElement
                        source="partner-img3.jpg"
                        alt="partner-img3"
                        className="img-fluid rounded-circle"
                      />
                    </div>
                    <div className="partners_desc">
                      <h3 className="font-bd">Mr. N.P. Ojha</h3>
                      <p className="mb-0">
                        APAC Strategy Head & Sr. Partner, Bain & Company
                      </p>
                    </div>
                  </div>
                </Col> 
              </Row> */}
            </div>
          </Container>
        </section>
        {/* <section className="py-70 featuresSec position-relative overflow-hidden">
          <Container>
            <div className="text-center heading mx-auto mb-0">
              <h3 className="heading_sub font-ad">Unique Features</h3>
              <h2 className="heading_main">
                Daakia, Your Own Digital Messenger!
              </h2>
              <p className="mb-0">
                A cross-platform web & mobile solution to make collaboration and
                communication easy and effective; be it at office, home or on
                the go. Bring your work, classroom or webinar together on Daakia
                and enjoy a more streamlined, secured experience that makes
                seamless cross-language communication possible.
              </p>
            </div>
            <div className="featuresBox d-md-flex position-relative">
              <div className="featuresBox_left position-relative">
                <div className="featuresBox_card featuresBox_card-translation bg-white">
                  <div className="d-flex align-items-center">
                    <ImageElement
                      source="translation-services.svg"
                      alt="translation-services"
                      className="img-fluid flex-shrink-0"
                    />
                    <h5 className="font-sb mb-0">
                      Translation <br className="d-none d-lg-block" /> Services
                    </h5>
                  </div>
                  <p className="mb-0">
                    There are many variations of passages of Lorem Ipsum
                    available, but the majority have.
                  </p>
                </div>
                <div className="featuresBox_card featuresBox_card-chat bg-white">
                  <div className="d-flex align-items-center">
                    <ImageElement
                      source="chats-calls.svg"
                      alt="chats-calls"
                      className="img-fluid flex-shrink-0"
                    />
                    <h5 className="font-sb mb-0">
                      Chats & <br className="d-none d-lg-block" /> Calls
                    </h5>
                  </div>
                  <p className="mb-0">
                    There are many variations of passages of Lorem Ipsum
                    available, but the majority have
                  </p>
                </div>
              </div>
              <div className="featuresBox_center position-relative">
                <div className="centerImg h-100">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="assets/images/frontend/features-img.webp"
                      alt="features-img"
                    />
                    <ImageElement
                      source="features-img.jpg"
                      alt="features-img"
                      className="img-fluid"
                    />
                  </picture>
                </div>
                <div className="featuresBox_card featuresBox_card-media bg-white">
                  <div className="d-flex align-items-center">
                    <ImageElement
                      source="social-media.svg"
                      alt="social-media"
                      className="img-fluid flex-shrink-0"
                    />
                    <h5 className="font-sb mb-0">
                      Social Media <br className="d-none d-lg-block" /> Platform
                    </h5>
                  </div>
                  <p className="mb-0">
                    There are many variations of passages of Lorem Ipsum
                    available
                  </p>
                </div>
              </div>
              <div className="featuresBox_right position-relative">
                <div className="featuresBox_card featuresBox_card-easy bg-white">
                  <div className="d-flex align-items-center">
                    <ImageElement
                      source="easy-to-use.svg"
                      alt="easy-to-use"
                      className="img-fluid flex-shrink-0"
                    />
                    <h5 className="font-sb mb-0">
                      Easy to <br className="d-none d-lg-block" /> Use
                    </h5>
                  </div>
                  <p className="mb-0">
                    There are many variations of passages of Lorem Ipsum
                    available, but the majority have.
                  </p>
                </div>
                <div className="featuresBox_card featuresBox_card-audio bg-white">
                  <div className="d-flex align-items-center">
                    <ImageElement
                      source="audio-video.svg"
                      alt="audio-video"
                      className="img-fluid flex-shrink-0"
                    />
                    <h5 className="font-sb mb-0">
                      Audio/Video <br className="d-none d-lg-block" />{" "}
                      Conference
                    </h5>
                  </div>
                  <p className="mb-0">
                    There are many variations of passages of Lorem Ipsum
                    available, but the majority have.
                  </p>
                </div>
                <div className="featuresBox_card featuresBox_card-safe bg-white">
                  <div className="d-flex align-items-center">
                    <ImageElement
                      source="safe-secure.svg"
                      alt="safe-secure"
                      className="img-fluid flex-shrink-0"
                    />
                    <h5 className="font-sb mb-0">
                      Safe & <br className="d-none d-lg-block" /> Secure
                    </h5>
                  </div>
                  <p className="mb-0">
                    There are many variations of passages of Lorem Ipsum
                    available, but the majority.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section> */}
      </div>
      <ModalComponent
        show={startMeetingModal}
        modalExtraClass="noHeader"
        onHandleVisible={handleStartMeetingModalShow}
        onHandleCancel={handleStartMeetingModalClose}
        title=""
        size="md"
      >
        <StartMeetingsForm
          onSubmit={startMeetingsSubmit}
          handleStartMeetingModalClose={handleStartMeetingModalClose}
          startMeetingloading={startMeetingloading}
        />
      </ModalComponent>
      <ModalComponent
        show={startTranslaionModal}
        modalExtraClass="noHeader translationModal"
        onHandleVisible={handleStartTranslationModalShow}
        onHandleCancel={handleStartTranslationModalClose}
        title=""
        size="xl"
      >
        <UnregisterTranslation
          basicActiveTranslation={basicActiveTranslation}
        />
      </ModalComponent>
    </>
  );
}

export default Home;
