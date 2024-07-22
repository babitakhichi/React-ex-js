import { JitsiMeeting } from "@jitsi/react-sdk";
import React, { useEffect, useRef, useState, useMemo } from "react";

import { useParams, useNavigate } from "react-router-dom";
import {
  GlobalLoader,
  ImageElement,
  SweetAlert,
  subscriptionpPlanFormetter,
} from "../../../components";

import { UserHomeServices, VideoConferenceService } from "../../../services";
import userRoutesMap from "../../../routeControl/userRoutes";
import {
  agoDateTime,
  baseUrlGenerator,
  beforeDateTime,
  dateFormatter,
  decoder,
  encoder,
  logger,
  modalNotification,
  momentTimeFormatter,
  momentTimezoneFormatter,
} from "../../../utils";
import config from "../../../config";

function UnRegisterJitsiMeet() {
  const apiRef = useRef();
  const navigate = useNavigate();

  const [jitsiFeatures, setJitsiFeatures] = useState({});
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState({});
  const param = useParams();
  const [participants, setParticipants] = useState(0);
  const [meetingDuration, setMeetingDuraion] = useState(0);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  let timer;

  useEffect(() => {
    if (roomData?.meetingData?.id) {
      setMeetingDuraion(roomData?.SubscriptionFeature?.meet_duration);
      let features = subscriptionpPlanFormetter(
        roomData?.data?.SubscriptionFeature
      );
      setJitsiFeatures(features);
    }
  }, [roomData]);

  let isExpired = useMemo(() => {
    if (roomData?.meetingData?.MeetingTimes?.[0]?.end_time) {
      return (
        momentTimeFormatter(
          roomData?.meetingData?.MeetingTimes?.[0]?.end_time
        ) < momentTimeFormatter(new Date())
      );
    }
  }, [roomData]);

  let startTime = useMemo(() => {
    if (roomData?.meetingData?.MeetingTimes?.[0]?.start_date) {
      return (
        momentTimeFormatter(
          roomData?.meetingData?.MeetingTimes?.[0]?.start_date
        ) >= momentTimeFormatter(new Date())
      );
    }
  }, [roomData]);

  const updateMeetingRoomStatus = async (data) => {
    try {
      let bodyData = {
        meeting_status: data,
        is_password: roomData?.meetingData?.is_password,
      };
      let startDate = momentTimezoneFormatter(new Date()).utc().format();
      if (data === "ongoing") {
        bodyData.start_date = startDate;
        bodyData.duration = roomData?.meetingData?.duration ?? meetingDuration;
        bodyData.format = "minutes";
      }
      const res = await UserHomeServices.updateUserPlanMeetingsService(
        decoder(param?.id),
        bodyData
      );
      const { success } = res;
      if (success === 1) {
        let room = { ...roomData };
        room.meetingData.MeetingTimes[0].status = data;
        room.meetingData.MeetingTimes[0].start_date = startDate;
        room.meetingData.MeetingTimes[0].end_time = agoDateTime(
          room?.meetingData?.duration ?? meetingDuration,
          "minutes",
          "YYYY-MM-DD HH:mm:ss",
          startDate
        );
        if (data === "ongoing") {
          room.meetingData.MeetingTimes[0].meeting_status = data;
        }
        setRoomData({ ...room });
      }
    } catch (error) {
      logger(error);
    }
  };

  const startTimer = (countDownDate) => {
    // let repeat = false
    let x = setInterval(function () {
      let now = new Date().getTime();
      let distance = countDownDate - now;

      if (distance < 0) {
        clearInterval(x);
        apiRef.current.getRoomsInfo().then((rooms) => {
          rooms?.rooms?.forEach((roomItem) => {
            if (roomItem?.isMainRoom) {
              roomItem?.participants?.forEach((participantsItem) => {
                if (
                  participantsItem?.role === "moderator" &&
                  participantsItem?.jid === undefined
                ) {
                  apiRef.current.executeCommand("endConference");
                  updateMeetingRoomStatus("previous");
                  window.close();
                }
              });
            }
          });
        });
      }
    }, 1000);
  };

  useEffect(() => {
    if (
      roomData?.meetingData?.id !== undefined &&
      !isExpired &&
      roomData?.meetingData?.MeetingTimes?.[0]?.meeting_status === "ongoing"
    ) {
      let start = new Date(
        roomData?.meetingData?.MeetingTimes?.[0]?.end_time
      ).getTime();
      let now = new Date().getTime();
      let distance = start - now;
      if (distance > 0) {
        startTimer(start);
      }
    }
  }, [roomData, roomData?.meetingData?.MeetingTimes?.[0]?.end_time]);

  const startTimeCounter = (count) => {
    let x = setInterval(() => {
      let now = new Date().getTime();
      let distance = count - now;
      if (distance < 0) {
        clearInterval(x);
        let room = { ...roomData };
        room.meetingData.MeetingTimes[0].start_date = momentTimezoneFormatter(
          new Date()
        )
          .utc()
          .format();
        setRoomData({ ...room });
      }
    }, 1000);
  };

  useEffect(() => {
    if (roomData?.meetingData?.MeetingTimes?.[0]?.start_date) {
      let start = beforeDateTime(
        20,
        "minutes",
        "",
        new Date(roomData?.meetingData?.MeetingTimes?.[0]?.start_date)
      );
      let newStart = new Date(start).getTime();
      let now = new Date().getTime();
      let distance = newStart - now;
      let diff =
        new Date(
          roomData?.meetingData?.MeetingTimes?.[0]?.start_date
        ).getTime() - newStart;

      if (distance > 0) {
        startTimeCounter(newStart);
      } else if (
        roomData?.meetingData?.MeetingTimes?.[0]?.meeting_status ===
          "upcoming" &&
        diff > 0
      ) {
        let room = { ...roomData };
        room.meetingData.MeetingTimes[0].start_date = momentTimezoneFormatter(
          new Date()
        )
          .utc()
          .format();
        setRoomData({ ...room });
      }
    }
  }, [roomData?.meetingData?.MeetingTimes]);

  const getRoomDetails = async () => {
    setLoading(true);
    try {
      let queryParams = {
        id: decoder(param?.id),
        start_date: momentTimezoneFormatter(new Date())
          .utc()
          .format("YYYY-MM-DD"),
      };
      const res = await UserHomeServices.userMeetingDetailService({
        queryParams,
      });
      const { success, message, data } = res;
      if (success === 1) {
        setRoomData(data);
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
    const check = Number.isNaN(Number(param?.id));
    if (!check) {
      navigate(`${userRoutesMap.JITSI_MEET.path}/${encoder(param?.id)}`);
    } else {
      getRoomDetails();
    }
  }, [param?.id]);

  const manageAttendance = async (data, type) => {
    try {
      let bodyData = {};
      bodyData.invitee_id = data?.id;
      bodyData.meeting_id = roomData?.meetingData?.MeetingTimes?.[0]?.id;
      if (type === "join") {
        bodyData.name = data?.displayName;
        bodyData.join_time = new Date();
        await VideoConferenceService.manageAttendanceService(bodyData);
      } else {
        delete bodyData.invitee_id;
        bodyData.leave_time = new Date();
        await VideoConferenceService.updateManageAttendanceService(
          bodyData,
          data?.id
        );
      }
    } catch (error) {
      logger(error);
    }
  };

  useEffect(() => {
    let end = beforeDateTime(
      5,
      "minutes",
      "",
      new Date(roomData?.meetingData?.MeetingTimes?.[0]?.end_time)
    );
    let endnewStart = new Date(end).getTime();
    let endnow = new Date().getTime();
    let enddistance = endnewStart - endnow;
    if (enddistance > 0) {
      timer = setTimeout(
        () =>
          // modalNotification({
          //   type: "warning",
          //   message: "5 mins left in your meeting",
          // })
          setIsAlertVisible(true),
        enddistance
      );
    }

    return () => {
      clearTimeout(timer);
    };
  }, [roomData?.meetingData?.MeetingTimes?.[0]?.end_time]);

  const getRoomData = (payload, type, host = false) => {
    setParticipants(apiRef.current.getNumberOfParticipants());

    apiRef.current.getRoomsInfo().then((rooms) => {
      rooms?.rooms?.forEach((roomItem) => {
        if (roomItem?.isMainRoom) {
          roomItem?.participants?.forEach((participantsItem) => {
            if (
              participantsItem?.role === "moderator" &&
              participantsItem?.jid === undefined
            ) {
              manageAttendance(host ? participantsItem : payload, type);
              // apiRef.current.executeCommand(
              //   "grantModerator",
              //   participantsItem?.id
              // );
            }
          });
        }
      });
    });
  };

  const handleApiReady = (apiObj) => {
    apiRef.current = apiObj;
    let userLeftId = {};
    apiRef.current.on("participantJoined", (payload) => {
      getRoomData(payload, "join");
    });
    apiRef.current.on("participantLeft", (payload) => {
      userLeftId = { ...payload };
      getRoomData(payload, "left");
    });
    apiRef.current.on("participantRoleChanged", (payload) => {
      if (
        !(
          momentTimeFormatter(
            roomData?.meetingData?.MeetingTimes?.[0]?.end_time
          ) < momentTimeFormatter(new Date())
        )
      ) {
        if (
          roomData?.meetingData?.MeetingTimes?.[0]?.meeting_status ===
            "upcoming" &&
          payload?.role === "moderator"
        ) {
          updateMeetingRoomStatus("ongoing");
          getRoomData(payload, "join", true);
        } else if (payload?.role === "moderator" && userLeftId?.id) {
          getRoomData(userLeftId, "left");
        }
      } else {
        window.close();
      }

      setParticipants(apiRef.current.getNumberOfParticipants());
    });
    apiRef.current.on("readyToClose", () => {
      // apiRef.current.executeCommand("hangup");
      window.open(baseUrlGenerator(`/`), "_self");
      // window.close();
    });
  };
  const onConfirmAlert = () => {
    setIsAlertVisible(false);
    return true;
  };
  useEffect(() => {
    if (participants === 2) {
      // apiRef.current.executeCommand("endConference");
      //   apiRef.current.executeCommand("setVideoQuality", 360);
    }
  }, [participants]);
  const roomName = roomData?.meetingData?.event_name.replace(/ /g, "-");
  return (
    <>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <GlobalLoader />
        </div>
      ) : roomData?.meetingData?.id &&
        roomData?.meetingData?.status === "active" ? (
        startTime ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="emptySec text-center w-100">
              <ImageElement source="daakia-logo.png" alt="No Data Found" />
              <h2>
                This meeting is scheduled for{" "}
                {dateFormatter(
                  roomData?.meetingData?.MeetingTimes?.[0]?.start_date,
                  "DD MMM YYYY, HH:mm"
                )}
                . You can start the meeting 20 mins before scheduled time.
              </h2>
            </div>
          </div>
        ) : isExpired ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="emptySec text-center w-100">
              <ImageElement source="daakia-logo.png" alt="No Data Found" />
              <h2>Room is expired</h2>
            </div>
          </div>
        ) : roomData?.meetingData?.status === "deleted" ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="emptySec text-center w-100">
              <ImageElement source="daakia-logo.png" alt="No Data Found" />
              <h2>Room is Deleted</h2>
            </div>
          </div>
        ) : (
          <JitsiMeeting
            // domain="stag-meet.daakia.co.in"
            domain={config.JITSI_URL}
            roomName={`${roomData?.meetingData.id}-${roomName}`}
            getIFrameRef={(node) => (node.style.height = "100vh")}
            userInfo={{ displayName: "" }}
            configOverwrite={{
              startWithAudioMuted: true,
              hiddenPremeetingButtons: ["invite"],
              readOnlyName: false,
              logging: {
                defaultLogLevel: "error",
              },
              prejoinPageEnabled: true,
              ...jitsiFeatures,
            }}
            onApiReady={(externalApi) => {
              handleApiReady(externalApi);
              //   externalApi.executeCommand("toggleChat");
            }}
            onReadyToClose={() => {
              // navigate(userRoutesMap.VIDEO_CONFERENCING.path);
              window.open(baseUrlGenerator(`/`), "_self");
              // window.close();
            }}
          />
        )
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="emptySec text-center w-100">
            <ImageElement source="daakia-logo.png" alt="No Data Found" />
            <h2>No Meeting Found</h2>
          </div>
        </div>
      )}
      <SweetAlert
        title="5 mins left in your meeting"
        show={isAlertVisible}
        icon="warning"
        setIsAlertVisible={setIsAlertVisible}
        showLoaderOnConfirm
        loading={loading}
        onConfirmAlert={onConfirmAlert}
        timer={10000}
      />
    </>
  );
}

export default UnRegisterJitsiMeet;
