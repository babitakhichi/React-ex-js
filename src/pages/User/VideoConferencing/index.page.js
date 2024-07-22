import { t } from "i18next";

import React, { useState, useEffect } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Container, Table, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  ImageElement,
  ModalComponent,
  RippleEffect,
  PlanMeetingForm,
  Tabs,
  // nameFormatter,
  textFormatter,
  GlobalLoader,
  checkValidData,
  SweetAlert,
  Pagination,
  StartMeetingsForm,
  ShareForm,
  RecordingForm,
  // CommonButton,
} from "../../../components";
import {
  selectProfileData,
  selectSubscriptionData,
  selectUserAccountData,
} from "../../../redux/UserSlice/index.slice";
import userRoutesMap from "../../../routeControl/userRoutes";
// import userRoutesMap from "../../../routeControl/userRoutes";
import { VideoConferenceService } from "../../../services";
import {
  baseUrlGenerator,
  dateFormatter,
  encoder,
  getActiveAccount,
  getCurrentActiveSubscription,
  getIscorporateActive,
  getTimeZoneData,
  logger,
  modalNotification,
  momentDateTimeTimezoneFormatter,
  momentTimezoneFormatter,
} from "../../../utils";
import { timezoneData } from "../../../config/timezoneData";

function VideoConferencing() {
  const [planMeeting, setPlanMeeting] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertRecordingVisible, setIsAlertRecordingVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordingLoading, setRecordingLoading] = useState(false);
  const [startMeetingloading, setStartMeetingLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [defaultKey, setDefaultKey] = useState("upcoming");
  const [tableData, setTableData] = useState([]);
  const userData = useSelector(selectProfileData);
  const [planData, setPlanData] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletId, setDeleteId] = useState("");
  const [noOfPage, setNoOfPage] = useState(0);
  const [count, setTotalCount] = useState(2);
  const [shareId, setShareId] = useState("");
  const sizePerPage = 10;
  const [page, setPage] = useState(1);
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const userAccounts = useSelector(selectUserAccountData);
  const userActiveSubscriptions = useSelector(selectSubscriptionData);
  // const [enableConfrencing,setEnableConfrencing] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // const [recurringMeeting, setRecurringMeeting] = useState(false);
  const handleClose = () => {
    setPlanMeeting(false);
    setPlanData({});
  };

  const [recordingModal, setRecordingModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [startMeetingModal, setStartMeetingModal] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState("");
  const handleShareModalShow = () => setShareModal(true);
  const handleRecordingModalShow = () => setRecordingModal(true);
  const handleShareModalClose = () => {
    setShareId("");
    setShareModal(false);
  };
  const videoSubscription = getCurrentActiveSubscription(
    userActiveSubscriptions,
    "videoConferencing",
    true
  );
  const handleRecordingModalClose = () => {
    setRecordingModal(false);
  };
  const handleStartMeetingModalShow = () => {
    // add 5 min validation
    let newStart = new Date(
      tableData?.[0]?.MeetingTimes?.[0]?.start_date
    ).getTime();
    let now = new Date().getTime();
    let distance = newStart - now;
    // end

    if (distance < 1200000 && distance > 0) {
      modalNotification({
        type: "error",
        message:
          "Meetings can be initiated up to 20 minutes prior to the another scheduled meeting.",
      });
    } else {
      setStartMeetingModal(true);
    }
  };
  const handleStartMeetingModalClose = () => setStartMeetingModal(false);

  const handlePlanMeetingShow = () => setPlanMeeting(true);

  const goToPage = (pageNo) => {
    setPage(pageNo);
    window.scrollTo(0, 0);
  };
  const getMeetingList = async () => {
    setTableLoading(true);
    try {
      let activeAccount = getActiveAccount(userAccounts);
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        type: defaultKey,
        business_account_id: activeAccount?.id,
      };
      const res = await VideoConferenceService.meetingListService({
        queryParams,
      });
      const { success, message, data } = res;
      if (success === 1) {
        setTableData(data?.rows);
        setNoOfPage(data?.count > 0 ? Math.ceil(data?.count / sizePerPage) : 1);
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
    setTableLoading(false);
  };

  useEffect(() => {
    setFirstTimeFetch(true);
    const activeAcc = getActiveAccount(userAccounts);
    setIsGuest(activeAcc?.account?.includes("(Guest)"));
  }, []);

  useEffect(() => {
    getMeetingList();
  }, [defaultKey]);

  useEffect(() => {
    if (firstTimeFetch) {
      getMeetingList();
    }
  }, [page]);

  const onSubmit = async (value) => {
    setLoading(true);
    try {
      let bodyData = { ...value };
      delete bodyData.byAfter;
      let res;
      let date = "";
      let endDate = "";
      let timeZone = getTimeZoneData(timezoneData, value?.time_zone);
      if (planData?.id) {
        bodyData.start_date = momentDateTimeTimezoneFormatter(
          value?.start_date,
          timeZone?.utc?.[0],
          "YYYY-MM-DD"
        );

        bodyData.start_time =
          momentDateTimeTimezoneFormatter(value?.start_time, timeZone?.utc?.[0])
            .utc()
            .format() ===
          momentDateTimeTimezoneFormatter(
            planData?.start_date,
            timeZone?.utc?.[0]
          )
            .utc()
            .format()
            ? momentDateTimeTimezoneFormatter(
                value?.start_time,
                timeZone?.utc?.[0],
                "HH:mm"
              )
            : value?.start_time;
        date = `${bodyData.start_date} ${bodyData.start_time}`;

        bodyData.start_date = momentDateTimeTimezoneFormatter(
          date,
          timeZone?.utc?.[0]
        )
          .utc()
          .format();

        if (value?.is_recurring && !value?.end_occurrence) {
          bodyData.end_date = momentDateTimeTimezoneFormatter(
            value?.end_date,
            timeZone?.utc?.[0],
            "YYYY-MM-DD"
          );
          endDate = `${bodyData.end_date} ${bodyData.start_time}`;
          bodyData.end_date = momentDateTimeTimezoneFormatter(
            endDate,
            timeZone?.utc?.[0]
          )
            .utc()
            .format();
        }
        bodyData.seleted_time = date;
        delete bodyData.start_time;
        bodyData.isType = true;
        res = await VideoConferenceService.updatePlanMeetingsService(
          planData?.id,
          bodyData
        );
      } else {
        date = `${value?.start_date} ${value?.start_time}`;

        bodyData.start_date = momentDateTimeTimezoneFormatter(
          date,
          timeZone?.utc?.[0]
        )
          .utc()
          .format();
        if (value?.is_recurring && !value?.end_occurrence) {
          endDate = `${bodyData.end_date} ${bodyData.start_time}`;
          bodyData.end_date = momentDateTimeTimezoneFormatter(
            endDate,
            timeZone?.utc?.[0]
          )
            .utc()
            .format();
        }

        bodyData.seleted_time = date;
        delete bodyData.start_time;
        let activeAccount = getActiveAccount(userAccounts);
        bodyData.is_corporate = getIscorporateActive(userAccounts);
        bodyData.corporate_id = activeAccount?.id;
        res = await VideoConferenceService.addMeetingService(bodyData);
      }
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setPlanMeeting(false);
        getMeetingList();
        setPlanData({});
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

  const getMeetingDetail = (data) => {
    let obj = {};
    obj.invitation = [];
    data?.MeetingInvites.map((item) => {
      obj.invitation.push(item.attendee);
    });
    let timeZone = getTimeZoneData(timezoneData, data?.time_zone);
    data.start_date = momentDateTimeTimezoneFormatter(
      data?.start_date,
      timeZone?.utc?.[0]
    );
    if (data?.is_recurring && !data?.end_occurrence)
      data.end_date = momentDateTimeTimezoneFormatter(
        data?.end_date,
        timeZone?.utc?.[0]
      );
    data.start_time = momentDateTimeTimezoneFormatter(
      data?.start_date,
      timeZone?.utc?.[0]
    );
    obj = { ...obj, ...data };
    setPlanData(obj);
  };

  const deletePlan = async () => {
    setDeleteLoading(true);
    try {
      let bodyData = { status: "deleted" };
      const res = await VideoConferenceService.updatePlanMeetingsService(
        deletId,
        bodyData
      );
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setDeleteId("");
        getMeetingList();
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setDeleteLoading(false);
  };
  const deleteRecording = async () => {
    setRecordingLoading(true);
    try {
      const res = await VideoConferenceService.deleteRecordingService(deletId);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setDeleteId("");
        getMeetingList();
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setRecordingLoading(false);
  };
  const onConfirmAlert = () => {
    deletePlan();
    setIsAlertVisible(false);
    return true;
  };
  const onConfirmRecordingAlert = () => {
    deleteRecording();
    setIsAlertRecordingVisible(false);
    return true;
  };

  const tabsDetails = (
    // <div
    //   className={`purchasePlan_wrap d-flex align-items-top ${
    //     subscriptionLoading ? "justify-content-center" : ""
    //   }`}
    // >
    //   {subscriptionLoading ? (
    //     <GlobalLoader />
    //   ) : (
    <>
      {/* {subcriptionData.length > 0 ? ( */}
      {tableLoading ? (
        <GlobalLoader />
      ) : tableData?.length > 0 ? (
        <>
          {" "}
          <div className="meetingTable">
            <Table responsive className="mb-0">
              <tbody>
                {tableData.map((item, key) => {
                  return (
                    <>
                      <tr key={key}>
                        <td>
                          {dateFormatter(item?.start_date, "DD MMM YYYY")}
                        </td>
                        <td>
                          {dateFormatter(item?.start_date, "HH:mm")} <br />{" "}
                          {dateFormatter(
                            item?.is_recurring
                              ? item?.MeetingTimes?.[
                                  item?.MeetingTimes?.length - 1
                                ]?.end_time
                              : item?.MeetingTimes?.[0]?.end_time,
                            "HH:mm"
                          )}
                        </td>
                        <td>
                          {textFormatter(item?.event_name)}
                          <br /> <span className="font-rg">Host - </span>{" "}
                          {checkValidData(item?.host)}
                        </td>
                        <td>
                          {item?.is_recurring && (
                            <>
                              Untill{" "}
                              {dateFormatter(
                                item?.meeting_times_data,
                                "DD MMM YYYY, HH:mm"
                              )}
                              {/* {dateFormatter(
                                item?.MeetingTimes?.[
                                  item?.MeetingTimes?.length - 1
                                ]?.end_time,
                                "DD MMM YYYY, HH:mm"
                              )} */}
                            </>
                          )}
                        </td>
                        {defaultKey === "upcoming" && item?.id && (
                          <td className="text-end">
                            <RippleEffect>
                              <a
                                href={baseUrlGenerator(
                                  `${userRoutesMap.JITSI_MEET.path}/${encoder(
                                    item?.id
                                  )}`
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="meetingsSec_meetingIcons user"
                                aria-label="video"
                              >
                                <em className="icon-video-outline" />
                              </a>
                            </RippleEffect>
                            {!item?.is_start_now && (
                              <RippleEffect>
                                <Link
                                  to="#"
                                  className="meetingsSec_meetingIcons edit"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    getMeetingDetail(item);
                                    handlePlanMeetingShow();
                                  }}
                                >
                                  <em className="icon-edit" />
                                </Link>
                              </RippleEffect>
                            )}
                            <RippleEffect>
                              <Link
                                to="#"
                                className="meetingsSec_meetingIcons delete"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setIsAlertVisible(true);
                                  setDeleteId(item?.id);
                                }}
                              >
                                <em className="icon-delete" />
                              </Link>
                            </RippleEffect>
                            <RippleEffect>
                              <Link
                                to="#"
                                className="meetingsSec_meetingIcons share"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShareId(item?.id);
                                  handleShareModalShow();
                                }}
                              >
                                <em className="icon-share" />
                              </Link>
                            </RippleEffect>
                          </td>
                        )}
                        {defaultKey === "recorded" && (
                          <td className="text-end">
                            <RippleEffect>
                              <a
                                href={item?.recording_url}
                                className="meetingsSec_meetingIcons user"
                                target="_blank"
                                rel="noreferrer"
                                download
                              >
                                {" "}
                                <em className="icon-download" />
                              </a>
                            </RippleEffect>
                            <RippleEffect>
                              <Link
                                to="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setIsAlertRecordingVisible(true);
                                  setDeleteId(item?.id);
                                }}
                                className="meetingsSec_meetingIcons delete"
                              >
                                <em className="icon-delete" />
                              </Link>
                            </RippleEffect>
                            <RippleEffect>
                              <Link
                                to="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setRecordingUrl(
                                    baseUrlGenerator(
                                      `${
                                        userRoutesMap.VIDEO_DISPLAY.path
                                      }/${item.event_name.replace(
                                        / /g,
                                        "-"
                                      )}/share/${encoder(item?.id)}`
                                    )
                                  );
                                  handleRecordingModalShow();
                                }}
                                className="meetingsSec_meetingIcons share"
                              >
                                <em className="icon-share" />
                              </Link>
                            </RippleEffect>
                          </td>
                        )}
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </Table>{" "}
          </div>
          {count > 0 && (
            <div className="mt-3">
              <Pagination
                count={count}
                page={page}
                sizePerPage={sizePerPage}
                noOfPage={noOfPage}
                goToPage={goToPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="emptySec text-center w-100">
          <ImageElement
            source="video-conferencing-icon.svg"
            alt="No Data Found"
          />
          <h2>{t("text.common.noData")}</h2>
          <p className="mb-0">There are no meetings to show here right now.</p>
        </div>
      )}
    </>
    //   )}
    // </div>
  );
  const tabsContent = [
    {
      title: "Upcoming Meetings",
      key: "upcoming",
      content: tabsDetails,
    },
    {
      title: "Previous Meetings",
      key: "previous",
      content: tabsDetails,
    },
    {
      title: "Recorded Meetings",

      key: "recorded",
      content: tabsDetails,
    },
  ];
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
      let activeAccount = getActiveAccount(userAccounts);
      bodyData.is_corporate = getIscorporateActive(userAccounts);
      bodyData.corporate_id = activeAccount?.id;
      let res = await VideoConferenceService.addMeetingService(bodyData);
      const { success, message, data } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        if (data?.id) {
          window.open(
            baseUrlGenerator(
              `${userRoutesMap.JITSI_MEET.path}/${encoder(data?.id)}`
            )
          );
        }
        getMeetingList();
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

  const handleTabChange = (value) => {
    setDefaultKey(value);
    setPage(1);
  };
  const handleRefresh = () => {
    setPage(1);
    getMeetingList();
  };

  const name = userData?.UserProfile?.full_name?.split(" ");
  return (
    <>
      {!!videoSubscription?.id && videoSubscription?.status === "active" ? (
        <div className="videoConferencing">
          <section className="userInfo">
            <Container>
              <Row className="align-items-center">
                <Col sm="6" className="mb-2 mb-sm-0">
                  <h1 className="font-bd">
                    {t("text.videoConferencing.hello")}{" "}
                    {textFormatter(name?.[0])} !
                    {/* {nameFormatter(
                      textFormatter(userData?.first_name),
                      textFormatter(userData?.last_name)
                    )} */}
                  </h1>
                  <h4 className="font-sb">
                    {t("text.videoConferencing.whatWould")}
                  </h4>
                  <div className="d-flex justify-content-center justify-content-sm-start align-items-center userInfo_links">
                    <a
                      // href={userRoutesMap.JITSI_MEET.path}
                      href="#"
                      className="text-center ripple-effect"
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleStartMeetingModalShow();
                      }}
                    >
                      <em className="icon-video" />
                      <p className="font-bd text-white mt-2 mt-md-3 mb-0">
                        {t("text.videoConferencing.starta")} <br />{" "}
                        {t("text.videoConferencing.meeting")}
                      </p>
                    </a>
                    <Link
                      to="#"
                      onClick={() => handlePlanMeetingShow()}
                      className="text-center ripple-effect"
                    >
                      <em className="icon-meeting" />
                      <p className="font-bd text-white mt-2 mt-md-3 mb-0">
                        {t("text.videoConferencing.planA")}
                        <br /> {t("text.videoConferencing.meeting")}
                      </p>
                    </Link>
                  </div>
                </Col>
                <Col sm="6">
                  <ImageElement
                    source="video-conferencing.png"
                    alt="Video-conferencing"
                    className="img-fluid"
                  />
                </Col>
              </Row>
            </Container>
          </section>

          {/* metting */}

          <section className="meetingsSec">
            <Container>
              <div className="meetingsSec_wrap bg-white">
                <div className="meetingsSec_head d-lg-flex flex-wrap align-items-center justify-content-between">
                  <h4 className="font-bd mb-2 mb-lg-0">
                    {t("text.videoConferencing.meetings")}
                  </h4>
                  <ReloadOutlined
                    className="reloadIcon me-auto ms-2 ms-lg-4"
                    onClick={handleRefresh}
                  />
                  <Tabs
                    tabContent={tabsContent}
                    activeKey={defaultKey}
                    setActiveKey={handleTabChange}
                    navClass="border-0"
                    tabsFor="video"
                  />
                </div>
              </div>
            </Container>
          </section>
        </div>
      ) : (
        <div className="dataFound d-flex justify-content-center align-items-center flex-column">
          <div className="emptySec text-center w-100 ">
            <ImageElement
              source="translation-services.svg"
              alt="No Data Found"
            />
            <h2>{t("text.common.noData")}</h2>
            {!isGuest && (
              <Link
                to={userRoutesMap.PURCHASE_PLAN.path}
                className="btn btn-primary btn-md"
              >
                {t("text.planAndSubscription.purchasePlan")}
              </Link>
            )}
            {/* <p className="mb-0">
                  There are no Pricing Plan to show here right now.
                </p> */}
          </div>
        </div>
      )}
      <ModalComponent
        show={planMeeting}
        modalExtraClass="noHeader planMeetingModal"
        onHandleVisible={handlePlanMeetingShow}
        onHandleCancel={handleClose}
        title=""
        size="lg"
      >
        <div className="modalHeader">
          {planData?.id ? (
            <h3>{t("text.videoConferencing.editMeeting")}</h3>
          ) : (
            <h3>{t("text.videoConferencing.planMeeting")}</h3>
          )}
        </div>
        <PlanMeetingForm
          onSubmit={onSubmit}
          loading={loading}
          handleClose={handleClose}
          planData={planData}
          timezoneData={timezoneData}
          userData={userData}
        />
      </ModalComponent>
      <SweetAlert
        title={t("text.common.areYouSure")}
        text={t("text.videoConferencing.delete")}
        show={isAlertVisible}
        icon="warning"
        showCancelButton
        confirmButtonText={t("text.common.yes")}
        cancelButtonText={t("text.common.no")}
        setIsAlertVisible={setIsAlertVisible}
        showLoaderOnConfirm
        loading={deleteLoading}
        onConfirmAlert={onConfirmAlert}
      />
      <SweetAlert
        title={t("text.common.areYouSure")}
        text="You want to delete this recording"
        show={isAlertRecordingVisible}
        icon="warning"
        showCancelButton
        confirmButtonText={t("text.common.yes")}
        cancelButtonText={t("text.common.no")}
        setIsAlertVisible={setIsAlertRecordingVisible}
        showLoaderOnConfirm
        loading={recordingLoading}
        onConfirmAlert={onConfirmRecordingAlert}
      />

      <ModalComponent
        show={shareModal}
        modalExtraClass="noHeader shareModal"
        onHandleVisible={handleShareModalShow}
        onHandleCancel={handleShareModalClose}
        title=""
        size="md"
      >
        <ShareForm shareId={shareId} />
      </ModalComponent>

      <ModalComponent
        show={recordingModal}
        modalExtraClass="noHeader shareModal"
        onHandleVisible={handleRecordingModalShow}
        onHandleCancel={handleRecordingModalClose}
        title=""
        size="md"
      >
        <RecordingForm recordingUrl={recordingUrl} />
      </ModalComponent>
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
    </>
  );
}

export default VideoConferencing;
