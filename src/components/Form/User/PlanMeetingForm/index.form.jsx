import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import React, { useState, useMemo, useEffect } from "react";
import { Radio, TimePicker } from "antd";
import { Col, Row } from "react-bootstrap";
import { t } from "i18next";
import moment from "moment";
import {
  Input as TextInput,
  CommonButton,
  AntSelect,
  Popovers,
  AntRadio,
  DatePicker,
  Checkbox,
  AntTextArea,
  RippleEffect,
  MultipleInput,
} from "../../../index";
import validation from "./validation";
import { dateFormateWithSlash } from "../../../../helpers";

import {
  dateFormatter,
  disabledPastDate,
  disabledPastTime,
  getTimeZoneData,
  momentDateTimeTimezoneFormatter,
  getCurrentActiveSubscription,
  agoDateTime,
  modalNotification,
  // getTimezoneList,
} from "../../../../utils";
import { selectSubscriptionData } from "../../../../redux/UserSlice/index.slice";

function PlanMeetingForm({
  onSubmit,
  loading,
  handleClose,
  planData,
  timezoneData,
  userData,
}) {
  const [value, setValue] = useState({});
  const [startDate, setStartDate] = useState(moment(new Date()));
  const [reccuringData, setRecurringData] = useState({
    endDate: "",
    occurrence: 0,
  });

  const [durationData, setDurationData] = useState([]);
  const [isProtected, setIsProtected] = useState(false);

  const userActiveSubscription = useSelector(selectSubscriptionData);
  const initialValues = {
    invitation: planData ? planData.invitation : undefined,
    event_type: planData?.event_type || undefined,
    event_name: planData?.event_name || "",
    host: planData?.host || userData?.UserProfile?.full_name,
    topic: planData?.topic || "",
    location: planData?.location || "",
    time_zone: planData?.time_zone || undefined,
    event_mode: planData?.event_mode || "lobby",
    end_occurrence: planData?.end_occurrence || undefined,
    description: planData?.description || "",
    is_recurring: planData?.is_recurring || false,
    start_date: planData?.start_date || "",
    start_time: planData?.start_time || "",
    duration: planData?.duration || undefined,
    recurring_type: planData?.recurring_type || undefined,
    recurring_interval: planData?.recurring_interval || undefined,
    end_date: planData?.end_date || "",
    byAfter: planData?.end_occurrence ? "2" : "1",
    subject: planData?.subject || "",
    sub_topic: planData?.sub_topic || "",
    chapter: planData?.chapter || "",
    format: "minutes",
    is_password: planData?.is_password || false,
  };
  function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0 && minutes > 0) {
      return ` ${hours} hour ${minutes} mins`;
    }
    if (hours > 0 && minutes <= 0) {
      return ` ${hours} hour`;
    } else {
      return `${minutes} mins`;
    }
  }
  useEffect(() => {
    if (userActiveSubscription?.length > 0) {
      const subscriptionData = getCurrentActiveSubscription(
        userActiveSubscription,
        "videoConferencing",
        true
      );

      let maxDurations =
        subscriptionData?.Subscription?.SubscriptionFeature?.meet_duration;
      let meetDuration;
      if (maxDurations < 30) {
        meetDuration = 30;
      } else {
        meetDuration = maxDurations;
      }
      let arr = [];
      for (let i = 15; i <= meetDuration; i += 15) {
        arr.push({ name: toHoursAndMinutes(i), id: i });
      }
      setDurationData(arr);
      setIsProtected(
        subscriptionData?.Subscription?.SubscriptionFeature?.protected_meeting
      );
    }
  }, [userActiveSubscription]);

  useEffect(() => {
    if (planData?.start_date) {
      let timeZone = getTimeZoneData(timezoneData, planData?.time_zone);
      setStartDate(
        momentDateTimeTimezoneFormatter(new Date(), timeZone?.utc?.[0])
      );
    }
  }, [planData?.start_date]);

  const getRecurringCount = (values) => {
    let data = { ...values };
    let timeZone = getTimeZoneData(timezoneData, data?.time_zone);
    let newDate = momentDateTimeTimezoneFormatter(
      data?.start_date,
      timeZone?.utc?.[0],
      "YYYY-MM-DD"
    );
    let endDate = momentDateTimeTimezoneFormatter(
      data?.end_date,
      timeZone?.utc?.[0],
      "YYYY-MM-DD"
    );
    if (data?.is_recurring && timeZone?.utc?.[0] && data?.start_date) {
      let count = 0;
      let newStartDate = newDate;
      let untilDate;
      if (
        (data?.end_occurrence === "" && data?.end_occurrence === undefined) ||
        (data?.byAfter === "1" &&
          data?.end_date &&
          data?.recurring_interval !== "" &&
          data?.recurring_interval !== undefined &&
          data?.recurring_type !== "" &&
          data?.recurring_type !== undefined)
      ) {
        count = 0;
        while (
          momentDateTimeTimezoneFormatter(newStartDate, timeZone?.utc?.[0]) <=
          momentDateTimeTimezoneFormatter(endDate, timeZone?.utc?.[0])
        ) {
          count += 1;
          untilDate = newStartDate;
          newStartDate = agoDateTime(
            data?.recurring_interval,
            data?.recurring_type,
            "YYYY-MM-DD",
            newStartDate
          );
        }
      } else if (
        data?.end_occurrence !== "" &&
        data?.end_occurrence !== undefined &&
        data?.recurring_interval !== "" &&
        data?.recurring_interval !== undefined &&
        data?.recurring_type !== "" &&
        data?.recurring_type !== undefined
      ) {
        count = 0;
        while (count < Number(data.end_occurrence)) {
          untilDate = newStartDate;
          newStartDate = agoDateTime(
            data?.recurring_interval,
            data?.recurring_type,
            "YYYY-MM-DD",
            newStartDate
          );
          count += 1;
        }
      }
      setRecurringData({
        endDate: momentDateTimeTimezoneFormatter(
          untilDate,
          timeZone?.utc?.[0],
          "DD MMM, YYYY"
        ),
        occurrence: count,
      });
    }
  };

  let recurringType = {
    days: "Day(s)",
    weeks: "Week(s)",
    months: "Month(s)",
  };

  useEffect(() => {
    if (planData?.id) {
      getRecurringCount(planData);
      setValue(initialValues);
    }
  }, [planData]);

  const timezoneList = useMemo(() => {
    return timezoneData;
  }, []);

  const eventType = useMemo(() => {
    return ["Conference", "Class", "Webinar", "TeleMed", "Panel Discussion"];
  }, []);
  // const durationData = [
  //   {
  //     id: 30,
  //     name: "30 mins",
  //   },
  //   {
  //     id: 45,
  //     name: "45 mins",
  //   },
  //   {
  //     id: 60,
  //     name: "1 hour",
  //   },
  // ];
  const recurrenceData = [
    {
      id: "days",
      name: "Daily",
    },
    {
      id: "weeks",
      name: "Weekly",
    },
    {
      id: "months",
      name: "Monthly",
    },
  ];
  const repeatEveryDayData = [
    {
      id: "1",
      name: "1",
    },
    {
      id: "2",
      name: "2",
    },
    {
      id: "3",
      name: "3",
    },
    {
      id: "4",
      name: "4",
    },
    {
      id: "5",
      name: "5",
    },
    {
      id: "6",
      name: "6",
    },
    {
      id: "7",
      name: "7",
    },
    {
      id: "8",
      name: "8",
    },
    {
      id: "9",
      name: "9",
    },
    {
      id: "10",
      name: "10",
    },
    {
      id: "11",
      name: "11",
    },
    {
      id: "12",
      name: "12",
    },
    {
      id: "13",
      name: "13",
    },
    {
      id: "14",
      name: "14",
    },
    {
      id: "15",
      name: "15",
    },
  ];

  const format = "HH:mm";
  useEffect(() => {
    if (value.is_recurring) {
      getRecurringCount(value);
    }
  }, [
    value.is_recurring,
    value.recurring_interval,
    value.recurring_type,
    value.end_occurrence,
  ]);

  const eventNameLabel = useMemo(() => {
    return {
      Conference: {
        eventName: "Event Name",
        hostName: "Host Name",
        topic: "Topic",
      },
      Class: {
        eventName: "Class Name",
        hostName: "Teacher Name",
        topic: "Topic",
      },
      Webinar: { eventName: "Title", hostName: "Speaker", topic: "Topic" },
      TeleMed: {
        eventName: "Patient’s Name",
        hostName: "Doctor’s Name",
        topic: "Department",
        startDate: "Appointment Date",
        startTime: "Time",
      },
      "Panel Discussion": {
        eventName: "Event Name",
        hostName: "Host Name",
        topic: "Moderator",
      },
    };
  }, []);

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation(value)}
      onSubmit={(values) => {
        let data = { ...values };
        data.end_date_occurrence = reccuringData?.occurrence;
        onSubmit(data);
      }}
      enableReinitialize
      validate={(e) => {
        setValue(e);
      }}
    >
      {(props) => {
        let { values } = props;

        return (
          <Form>
            <div className="modalForm">
              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label font-bd">
                      {" "}
                      {t("text.videoConferencing.eventType")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="form-control-wrap">
                      <AntSelect
                        getPopupContainer={(trigger) => trigger.parentElement}
                        placeholder={t(
                          "text.videoConferencing.eventTypePlaceholder"
                        )}
                        name="event_type"
                        setFieldValue={props.handleChange}
                        icon={
                          <div className="form-icon form-icon-left">
                            <em className="icon-event-type" />
                          </div>
                        }
                        validateField
                        callField={props}
                      >
                        {eventType.map((item, key) => {
                          return (
                            <option value={item} key={key}>
                              {item}
                            </option>
                          );
                        })}
                      </AntSelect>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label font-bd">
                      {eventNameLabel?.[values.event_type]?.eventName
                        ? eventNameLabel?.[values.event_type]?.eventName
                        : t("text.videoConferencing.eventName")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="form-control-wrap">
                      <TextInput
                        className="form-control"
                        type="text"
                        name="event_name"
                        placeholder={
                          eventNameLabel?.[values.event_type]?.eventName
                            ? eventNameLabel?.[values.event_type]?.eventName
                            : t("text.videoConferencing.eventName")
                        }
                        setFieldValue={props.handleChange}
                        icon={
                          <div className="form-icon form-icon-left">
                            <em className="icon-event" />
                          </div>
                        }
                      />
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label font-bd">
                      {eventNameLabel?.[values.event_type]?.hostName
                        ? eventNameLabel?.[values.event_type]?.hostName
                        : t("text.videoConferencing.hostName")}{" "}
                      <span className="text-danger">*</span>
                      {/* <span className="font-rg">
                        ({t("text.videoConferencing.optional")})
                      </span> */}
                    </label>
                    <div className="form-control-wrap">
                      <TextInput
                        className="form-control"
                        type="text"
                        name="host"
                        placeholder={
                          eventNameLabel?.[values.event_type]?.hostName
                            ? eventNameLabel?.[values.event_type]?.hostName
                            : t("text.videoConferencing.hostName")
                        }
                        setFieldValue={props.handleChange}
                        icon={
                          <div className="form-icon form-icon-left">
                            <em className="icon-user-host" />
                          </div>
                        }
                      />
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label font-bd">
                      {eventNameLabel?.[values.event_type]?.topic
                        ? eventNameLabel?.[values.event_type]?.topic
                        : t("text.videoConferencing.topic")}{" "}
                      {eventNameLabel?.[values.event_type]?.topic !== "Topic" &&
                      eventNameLabel?.[values.event_type]?.topic !==
                        undefined ? (
                        <span className="text-danger">*</span>
                      ) : (
                        <span className="font-rg">
                          ({t("text.videoConferencing.optional")})
                        </span>
                      )}
                    </label>
                    <div className="form-control-wrap">
                      <TextInput
                        className="form-control"
                        type="text"
                        name="topic"
                        placeholder={
                          eventNameLabel?.[values.event_type]?.topic
                            ? eventNameLabel?.[values.event_type]?.topic
                            : t("text.videoConferencing.topic")
                        }
                        setFieldValue={props.handleChange}
                        icon={
                          <div className="form-icon form-icon-left">
                            <em className="icon-topic" />
                          </div>
                        }
                      />
                    </div>
                  </div>
                </Col>
                {values.event_type === "Class" && (
                  <>
                    <Col md={6}>
                      <div className="form-group">
                        <label className="form-label font-bd">
                          {t("text.videoConferencing.subject")}{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="form-control-wrap">
                          <TextInput
                            className="form-control"
                            type="text"
                            name="subject"
                            placeholder={t("text.videoConferencing.subject")}
                            setFieldValue={props.handleChange}
                            icon={
                              <div className="form-icon form-icon-left">
                                <em className="icon-topic" />
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group">
                        <label className="form-label font-bd">
                          {t("text.videoConferencing.chapter")}{" "}
                          <span className="font-rg">
                            ({t("text.videoConferencing.optional")})
                          </span>
                        </label>
                        <div className="form-control-wrap">
                          <TextInput
                            className="form-control"
                            type="text"
                            name="chapter"
                            placeholder={t("text.videoConferencing.chapter")}
                            setFieldValue={props.handleChange}
                            icon={
                              <div className="form-icon form-icon-left">
                                <em className="icon-topic" />
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group">
                        <label className="form-label font-bd">
                          {t("text.videoConferencing.subTopic")}{" "}
                          <span className="font-rg">
                            ({t("text.videoConferencing.optional")})
                          </span>
                        </label>
                        <div className="form-control-wrap">
                          <TextInput
                            className="form-control"
                            type="text"
                            name="sub_topic"
                            placeholder={t("text.videoConferencing.subTopic")}
                            setFieldValue={props.handleChange}
                            icon={
                              <div className="form-icon form-icon-left">
                                <em className="icon-topic" />
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </Col>
                  </>
                )}
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label font-bd">
                      {t("text.videoConferencing.location")}{" "}
                      <span className="font-rg">
                        ({t("text.videoConferencing.optional")})
                      </span>
                    </label>
                    <div className="form-control-wrap">
                      <TextInput
                        className="form-control"
                        type="text"
                        name="location"
                        setFieldValue={props.handleChange}
                        placeholder={t("text.videoConferencing.location")}
                        icon={
                          <div className="form-icon form-icon-left">
                            <em className="icon-location" />
                          </div>
                        }
                      />
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label font-bd">
                      {t("text.videoConferencing.timeZone")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="form-control-wrap">
                      <AntSelect
                        getPopupContainer={(trigger) => trigger.parentElement}
                        name="time_zone"
                        setFieldValue={props.handleChange}
                        onSelect={(e) => {
                          props.setFieldValue("time_zone", e?.split("|")?.[0]);
                          props.setFieldValue("start_date", "");
                          props.setFieldValue("start_time", "");
                          props.setFieldValue("end_date", "");
                          setStartDate(
                            momentDateTimeTimezoneFormatter(
                              new Date(),
                              e?.split("|")?.[1]
                            )
                          );
                        }}
                        placeholder={t("text.videoConferencing.timeZone")}
                        icon={
                          <div className="form-icon form-icon-left">
                            <em className="icon-time" />
                          </div>
                        }
                        showSearch
                      >
                        {timezoneList?.map((item, key) => {
                          return (
                            <option
                              value={`${item?.text}|${item?.utc?.[0]}`}
                              key={key}
                            >
                              {item?.text}
                            </option>
                          );
                        })}
                      </AntSelect>
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="form-group d-flex align-items-center flex-wrap">
                    <label className="form-label font-bd mb-0  me-2 me-xl-4">
                      {t("text.videoConferencing.eventMode")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="form-control-wrap">
                      <Radio.Group
                        name="event_mode"
                        defaultValue={values?.event_mode}
                        onChange={props.handleChange}
                        className="d-flex"
                      >
                        <AntRadio value="lobby">
                          <div className="d-flex align-items-center ">
                            {t("text.videoConferencing.lobbyMode")}
                            <Popovers
                              getPopupContainer={(trigger) =>
                                trigger.parentElement
                              }
                              overlayClassName="renewalInfo"
                              content={
                                <>
                                  <p>
                                    Participants will be waiting in the lobby
                                    before meeting starts
                                  </p>
                                </>
                              }
                            >
                              <em className="icon-info paymentBox_infoIcon me-auto ms-2" />
                            </Popovers>
                          </div>
                        </AntRadio>

                        <AntRadio className="ms-2 ms-xl-4" value="follow">
                          <div className="d-flex align-items-center ">
                            {t("text.videoConferencing.followMode")}
                            <Popovers
                              getPopupContainer={(trigger) =>
                                trigger.parentElement
                              }
                              overlayClassName="renewalInfo"
                              content={
                                <>
                                  <p>
                                    Participants will see their own screen or
                                    the screen of the user whose Follow Me mode
                                    is enabled
                                  </p>
                                </>
                              }
                            >
                              <em className="icon-info paymentBox_infoIcon me-auto ms-2" />
                            </Popovers>
                          </div>
                        </AntRadio>
                      </Radio.Group>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex">
                    <div className="form-group startDate">
                      <label className="form-label font-bd">
                        {eventNameLabel?.[values.event_type]?.startDate ??
                          t("text.videoConferencing.startDate")}{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="form-control-wrap">
                        <DatePicker
                          getPopupContainer={(trigger) => trigger.parentElement}
                          className="form-control"
                          placeholder="DD-MM-YYYY"
                          defaultValue={
                            planData?.start_date ? planData?.start_time : ""
                          }
                          value={
                            values.start_date === ""
                              ? ""
                              : moment(values.start_date, dateFormateWithSlash)
                          }
                          onSelectChange={(e) => {
                            props.setFieldValue(
                              "start_date",
                              dateFormatter(e, dateFormateWithSlash)
                            );
                            props.setFieldValue("end_date", "");
                            let data = { ...values };
                            data.start_date = dateFormatter(
                              e,
                              dateFormateWithSlash
                            );
                            data.end_date = "";
                            getRecurringCount(data);
                            if (values?.start_time)
                              props.setFieldValue("start_time", "");
                          }}
                          requiredDateTimeFormat={dateFormateWithSlash}
                          validation
                          name="start_date"
                          allowClear={false}
                          suffixIcon={
                            <div className="form-icon form-icon-left">
                              <em className="icon-date" />
                            </div>
                          }
                          disabledDate={(e) => disabledPastDate(e, startDate)}
                          // defaultPickerValue={dateValidationForDOB(365)}
                        />
                      </div>
                    </div>
                    <div className="form-group startTime ms-2">
                      <label className="form-label font-bd">
                        {eventNameLabel?.[values.event_type]?.startTime ??
                          t("text.videoConferencing.startTime")}{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="form-control-wrap">
                        <TimePicker
                          getPopupContainer={(trigger) => trigger.parentElement}
                          className="form-control"
                          placeholder="HH:MM"
                          // defaultValue={
                          //   planData?.start_date
                          //     ? momentTimezoneFormatter(planData?.start_date)
                          //     : ""
                          // }
                          showNow={false}
                          value={
                            values.start_time === ""
                              ? ""
                              : moment(values.start_time, "HH:mm")
                          }
                          name="start_time"
                          onChange={(time, timeString) => {
                            let date = `${props.values.start_date} ${
                              timeString ?? props.values.start_time
                            }`;
                            if (
                              moment(startDate).format("YYYY-MM-DD HH:mm") >
                              date
                            ) {
                              // props.setFieldError("start_time", "test");
                              modalNotification({
                                type: "warning",
                                message: "You cannot select past time.",
                              });
                              props.setFieldValue("start_time", "");
                            } else {
                              props.setFieldValue("start_time", timeString);
                            }
                            props.setFieldTouched("start_time", true, false);
                            // props.setFieldError("start_time", "test");
                            // props.setFieldTouched("start_time", true, false);
                          }}
                          format={format}
                          suffixIcon={
                            <div className="form-icon form-icon-left">
                              <em className="icon-time" />
                            </div>
                          }
                          disabledTime={() =>
                            disabledPastTime(values.start_date, startDate)
                          }
                        />
                        {props.touched.start_time && props.errors.start_time ? (
                          <div className="ant-form-item-explain-error">
                            {props.errors.start_time}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label className="form-label font-bd">
                      {t("text.videoConferencing.duration")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="form-control-wrap">
                      <AntSelect
                        getPopupContainer={(trigger) => trigger.parentElement}
                        setFieldValue={props.handleChange}
                        placeholder="Select"
                        name="duration"
                        arrayOfData={durationData}
                        icon={
                          <div className="form-icon form-icon-left">
                            <em className="icon-duration" />
                          </div>
                        }
                      />
                    </div>
                  </div>
                </Col>

                <Col md={12}>
                  <div className="form-group d-flex align-items-center flex-wrap">
                    {isProtected && (
                      <Checkbox
                        onChange={(e) => {
                          props.setFieldValue("is_password", e.target.checked);
                        }}
                        className="font-bd f-14 me-2 me-xl-4"
                        name="is_password"
                        checked={values?.is_password}
                      >
                        Password Protected
                      </Checkbox>
                    )}
                    <Checkbox
                      onChange={(e) => {
                        props.setFieldValue("is_recurring", e.target.checked);
                      }}
                      className="font-bd f-14 me-2 me-xl-4"
                      name="is_recurring"
                      checked={values?.is_recurring}
                    >
                      {t("text.videoConferencing.recurring")}
                    </Checkbox>
                    {values.is_recurring &&
                      values.recurring_interval &&
                      values.recurring_type &&
                      values.time_zone &&
                      values.start_date &&
                      (values.end_date || values.end_occurrence) && (
                        <>
                          <p className="font-bd mb-0 text-500">
                            Every day, until {reccuringData?.endDate},{" "}
                            {reccuringData?.occurrence} occurrence(s)
                          </p>
                        </>
                      )}
                  </div>
                </Col>
                {values.is_recurring && (
                  <>
                    <Col md={6}>
                      <div className="form-group">
                        <label className="form-label font-bd">
                          {t("text.videoConferencing.recurrence")}{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="form-control-wrap">
                          <AntSelect
                            getPopupContainer={(trigger) =>
                              trigger.parentElement
                            }
                            setFieldValue={props.handleChange}
                            name="recurring_type"
                            placeholder="Select"
                            arrayOfData={recurrenceData}
                            icon={
                              <div className="form-icon form-icon-left">
                                <em className="icon-time" />
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group">
                        <label className="form-label font-bd">
                          {t("text.videoConferencing.repeat")}{" "}
                          {recurringType?.[values?.recurring_type] ??
                            recurringType?.days}{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="form-control-wrap">
                          <AntSelect
                            getPopupContainer={(trigger) =>
                              trigger.parentElement
                            }
                            placeholder="Select"
                            name="recurring_interval"
                            setFieldValue={props.handleChange}
                            arrayOfData={repeatEveryDayData}
                            icon={
                              <div className="form-icon form-icon-left">
                                <em className="icon-date" />
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="form-group">
                        <label className="form-label font-bd">
                          {t("text.videoConferencing.endDate")}{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <Radio.Group
                          className="w-100"
                          name="byAfter"
                          defaultValue={values?.byAfter}
                          onChange={(e) => {
                            props.handleChange(e);
                            if (e.target.value === "1") {
                              props.setFieldValue("end_occurrence", undefined);
                            } else {
                              props.setFieldValue("end_date", "");
                            }
                          }}
                        >
                          <Row>
                            <Col sm={5} md={6}>
                              <div className="d-flex align-items-center">
                                <AntRadio value="1">
                                  {t("text.videoConferencing.by")}
                                </AntRadio>
                                <div className="form-control-wrap flex-grow-1">
                                  <DatePicker
                                    getPopupContainer={(trigger) =>
                                      trigger.parentElement
                                    }
                                    defaultValue={
                                      planData?.end_date
                                        ? planData?.end_date
                                        : ""
                                    }
                                    className="form-control"
                                    placeholder="DD-MM-YY"
                                    onSelectChange={(e) => {
                                      props.setFieldValue(
                                        "end_date",
                                        dateFormatter(e, dateFormateWithSlash)
                                      );
                                      props.setFieldValue(
                                        "end_occurrence",
                                        undefined
                                      );
                                      let data = { ...values };
                                      data.end_date = dateFormatter(
                                        e,
                                        dateFormateWithSlash
                                      );
                                      data.end_occurrence = "";
                                      getRecurringCount(data);
                                    }}
                                    value={
                                      values?.end_date
                                        ? moment(values?.end_date)
                                        : ""
                                    }
                                    // defaultValue={moment(values?.end_date)}
                                    requiredDateTimeFormat={
                                      dateFormateWithSlash
                                    }
                                    disabled={!(values?.byAfter === "1")}
                                    validation
                                    name="end_date"
                                    allowClear={false}
                                    suffixIcon={
                                      <div className="form-icon form-icon-left">
                                        <em className="icon-date" />
                                      </div>
                                    }
                                    disabledDate={(e) =>
                                      disabledPastDate(
                                        e,
                                        values.start_date || startDate
                                      )
                                    }
                                    // disabledDate={disabledDobDate}
                                    // defaultPickerValue={dateValidationForDOB(365)}
                                  />
                                </div>
                              </div>
                            </Col>
                            <Col sm={7} md={6} className="mt-2 mt-sm-0">
                              <div className="d-flex align-items-center flex-wrap">
                                <AntRadio value="2">
                                  {t("text.videoConferencing.after")}
                                </AntRadio>
                                <div className="form-control-wrap flex-grow-1">
                                  <AntSelect
                                    getPopupContainer={(trigger) =>
                                      trigger.parentElement
                                    }
                                    name="end_occurrence"
                                    disabled={!(values?.byAfter === "2")}
                                    placeholder="Select"
                                    arrayOfData={repeatEveryDayData}
                                    icon={
                                      <div className="form-icon form-icon-left">
                                        <em className="icon-date" />
                                      </div>
                                    }
                                  />
                                </div>
                                <label className="form-label font-bd ms-2 ms-xl-3">
                                  {t("text.videoConferencing.occurrences")}
                                </label>
                              </div>
                            </Col>
                          </Row>
                        </Radio.Group>
                      </div>
                    </Col>
                  </>
                )}
                <Col md={12}>
                  <div className="form-group">
                    <label className="form-label font-bd">
                      {t("text.videoConferencing.invite")}
                    </label>
                    <div className="form-control-wrap">
                      <MultipleInput
                        setFieldValue={props.handleChange}
                        defaultValue={planData?.invitation}
                        className="form-control"
                        type="text"
                        name="invitation"
                        placeholder={t(
                          "text.adminForgetPassword.emailPlaceholder"
                        )}
                        icon={
                          <div className="form-icon form-icon-left">
                            <em className="icon-mail" />
                          </div>
                        }
                      />
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="form-group">
                    <label className="form-label font-bd">
                      {t("text.userPayment.description")}
                    </label>
                    <div className="form-control-wrap">
                      <AntTextArea
                        setFieldValue={props.handleChange}
                        rows="4"
                        name="description"
                        className="form-control"
                        type="text"
                        placeholder={t("text.userPayment.description")}
                        icon={
                          <div className="form-icon form-icon-left">
                            <em className="icon-company" />
                          </div>
                        }
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="text-end modalFooter">
                <RippleEffect extraClassName="me-2 me-sm-3" type="light">
                  <CommonButton onClick={() => handleClose()} variant="info">
                    {t("text.common.cancel")}
                  </CommonButton>
                </RippleEffect>
                <RippleEffect>
                  <CommonButton
                    htmltype="button"
                    type="submit"
                    variant="primary"
                    loading={loading}
                  >
                    {planData?.id
                      ? t("text.common.update")
                      : t("text.videoConferencing.schedule")}
                  </CommonButton>
                </RippleEffect>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default React.memo(PlanMeetingForm);
