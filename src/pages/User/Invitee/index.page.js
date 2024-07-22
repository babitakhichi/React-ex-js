import { JitsiMeeting } from "@jitsi/react-sdk";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GlobalLoader,
  ImageElement,
  PasswordProtectedForm,
  SweetAlert,
  subscriptionpPlanFormetter,
} from "../../../components";
import config from "../../../config";
import userRoutesMap from "../../../routeControl/userRoutes";
import { VideoConferenceService } from "../../../services";
import {
  agoDateTime,
  beforeDateTime,
  // beforeDateTime,
  dateFormatter,
  decoder,
  encoder,
  logger,
  modalNotification,
  momentTimeFormatter,
  momentTimezoneFormatter,
} from "../../../utils";

let interval;

function JitsiMeetInvitee() {
  const apiRef = useRef();
  const navigate = useNavigate();
  const [jitsiFeatures, setJitsiFeatures] = useState({});
  const [loading, setLoading] = useState(true);
  const [countInterval, setCountInterval] = useState();
  const [roomData, setRoomData] = useState({});
  const param = useParams();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [IsPassword, setIsPassword] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  let timer;
  // let watchedElement = useMemo(() => {
  //   return document.getElementById("jitsiRoom");
  // }, [roomData]);

  let isExpired = useMemo(() => {
    if (roomData?.meetingData?.end_max_date) {
      return (
        momentTimeFormatter(roomData?.meetingData?.end_max_date) <
        momentTimeFormatter(new Date())
      );
    }
  }, [roomData]);

  let isRoomFull = useMemo(() => {
    if (
      roomData?.meetingData?.max_attendance &&
      roomData?.meetingData?.attendance_count
    ) {
      return (
        Number(roomData?.meetingData?.max_attendance) <=
        roomData?.meetingData?.attendance_count
      );
    }
  }, [roomData]);

  let startTime = useMemo(() => {
    if (
      roomData?.meetingData?.MeetingTimes?.[0]?.start_date &&
      roomData?.meetingData?.MeetingTimes?.[0]?.meeting_status === "upcoming"
    ) {
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
      };
      let startDate = momentTimezoneFormatter(new Date()).utc().format();
      if (data === "ongoing") {
        bodyData.start_date = startDate;
        bodyData.duration =
          roomData?.meetingData?.duration ??
          roomData?.meetingData?.max_meet_duration;
        bodyData.format = "minutes";
      }
      const res = await VideoConferenceService.updatePlanMeetingsService(
        decoder(param?.id),
        bodyData
      );
      const { success } = res;
      if (success === 1) {
        let room = { ...roomData };
        room.meetingData.MeetingTimes[0].status = data;
        room.meetingData.MeetingTimes[0].start_date = startDate;
        if (!room.meetingData.is_base) {
          room.meetingData.end_max_date = agoDateTime(
            room?.meetingData?.max_meet_duration,
            "minutes",
            "YYYY-MM-DD HH:mm:ss",
            startDate
          );
        } else {
          room.meetingData.end_max_date = agoDateTime(
            room?.meetingData?.duration ?? room?.meetingData?.max_meet_duration,
            "minutes",
            "YYYY-MM-DD HH:mm:ss",
            startDate
          );
        }
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
                  updateMeetingRoomStatus("previous");
                  apiRef.current.executeCommand("endConference");
                  navigate(userRoutesMap.HOME.path);
                } else {
                  navigate(userRoutesMap.HOME.path);
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
      let start = new Date(roomData?.meetingData?.end_max_date).getTime();
      let now = new Date().getTime();
      let distance = start - now;
      if (distance > 0) {
        startTimer(start);
      }
    }
  }, [roomData, isExpired, roomData?.meetingData?.end_max_date]);

  const getRoomDetails = async () => {
    setLoading(true);
    try {
      let queryParams = {
        start_date: momentTimezoneFormatter(new Date())
          .utc()
          .format("YYYY-MM-DD"),
        is_corporate: false,
      };
      const res = await VideoConferenceService.meetingDetailService(
        decoder(param?.id),
        { queryParams }
      );
      const { success, message, data } = res;
      if (success === 1) {
        setRoomData(data);
        setIsPassword(data?.meetingData?.is_password);
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
    if (
      // watchedElement?.childElementCount !== undefined &&
      roomData?.meetingData?.event_mode === "lobby" &&
      roomData?.meetingData?.MeetingTimes?.[0]?.meeting_status === "upcoming" &&
      !isExpired
    ) {
      interval = setInterval(() => {
        getRoomDetails();
      }, 10000);
    }
    if (
      // watchedElement?.childElementCount !== undefined &&
      roomData?.meetingData?.attendance_count &&
      roomData?.meetingData?.max_attendance &&
      !isExpired &&
      Number(roomData?.meetingData?.max_attendance) <=
        roomData?.meetingData?.attendance_count
    ) {
      setCountInterval(
        setInterval(() => {
          getRoomDetails();
        }, 10000)
      );
    }
  }, [
    roomData?.meetingData?.MeetingTimes?.[0]?.meeting_status,
    roomData?.meetingData?.event_mode,
    isExpired,
  ]);

  // const startTimeCounter = (count) => {
  //   let x = setInterval(() => {
  //     let now = new Date().getTime();
  //     let distance = count - now;
  //     if (distance < 0) {
  //       clearInterval(x);
  //       let room = { ...roomData };
  //       room.meetingData.MeetingTimes[0].start_date = momentTimezoneFormatter(
  //         new Date()
  //       )
  //         .utc()
  //         .format();
  //       setRoomData({ ...room });
  //     }
  //   }, 1000);
  // };

  // useEffect(() => {
  //   if (roomData?.meetingData?.MeetingTimes?.[0]?.start_date) {
  //     let start = beforeDateTime(
  //       5,
  //       "minutes",
  //       "",
  //       new Date(roomData?.meetingData?.MeetingTimes?.[0]?.start_date)
  //     );
  //     let newStart = new Date(start).getTime();
  //     let now = new Date().getTime();
  //     let diff =
  //       new Date(
  //         roomData?.meetingData?.MeetingTimes?.[0]?.start_date
  //       ).getTime() - newStart;
  //     let distance = newStart - now;
  //     if (distance > 0) {
  //       startTimeCounter(newStart);
  //     } else if (
  //       roomData?.meetingData?.MeetingTimes?.[0]?.meeting_status ===
  //         "upcoming" &&
  //       diff > 0
  //     ) {
  //       let room = { ...roomData };
  //       room.meetingData.MeetingTimes[0].start_date = momentTimezoneFormatter(
  //         new Date()
  //       )
  //         .utc()
  //         .format();
  //       setRoomData({ ...room });
  //     }
  //   }
  // }, [roomData?.meetingData?.MeetingTimes]);

  useEffect(() => {
    if (
      roomData?.meetingData?.MeetingTimes?.[0]?.meeting_status === "ongoing"
    ) {
      clearInterval(interval);
    }
    if (
      roomData?.meetingData?.attendance_count &&
      roomData?.meetingData?.max_attendance &&
      Number(roomData?.meetingData?.max_attendance) >
        roomData?.meetingData?.attendance_count
    ) {
      clearInterval(countInterval);
    }
  }, [
    roomData?.meetingData?.MeetingTimes?.[0]?.meeting_status,
    roomData?.meetingData?.attendance_count,
  ]);

  useEffect(() => {
    const check = Number.isNaN(Number(param?.id));
    if (!check) {
      navigate(`${userRoutesMap.JITSI_INVITEE.path}/${encoder(param?.id)}`);
    } else {
      getRoomDetails();
    }
  }, [param?.id]);

  useEffect(() => {
    if (roomData?.meetingData?.id) {
      let features = subscriptionpPlanFormetter(
        roomData?.data?.SubscriptionFeature
      );
      setJitsiFeatures(features);
    }
  }, [roomData]);

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
    if (roomData?.meetingData?.is_base) {
      let end = beforeDateTime(
        5,
        "minutes",
        "",
        new Date(roomData?.meetingData?.end_max_date)
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
    }
  }, [roomData?.meetingData?.end_max_date]);
  const getRoomData = (payload, type, host = false) => {
    apiRef.current.getRoomsInfo().then((rooms) => {
      rooms?.rooms?.forEach((roomItem) => {
        if (roomItem?.isMainRoom) {
          roomItem?.participants?.forEach((participantsItem) => {
            if (
              participantsItem?.role === "moderator" &&
              participantsItem?.jid === undefined
            ) {
              manageAttendance(host ? participantsItem : payload, type);
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
      getRoomData(payload, "left");
      userLeftId = { ...payload };
    });
    apiRef.current.on("participantRoleChanged", (payload) => {
      // need to add api for status update of room
      if (
        !(
          momentTimeFormatter(roomData?.meetingData?.end_max_date) <
          momentTimeFormatter(new Date())
        )
      ) {
        if (
          roomData?.meetingData?.MeetingTimes?.[0]?.meeting_status ===
            "upcoming" &&
          payload?.role === "moderator"
        ) {
          getRoomData(payload, "join", true);
          updateMeetingRoomStatus("ongoing");
        } else if (payload?.role === "moderator" && userLeftId?.id) {
          getRoomData(userLeftId, "left");
        }
      } else {
        navigate(userRoutesMap.HOME.path);
      }
    });
    apiRef.current.on("readyToClose", () => {
      // apiRef.current.executeCommand("hangup");
      navigate(userRoutesMap.HOME.path);
      window.close();
    });
  };
  const onSubmit = async (value) => {
    setPasswordLoading(true);
    try {
      let bodyData = {
        ...value,
      };

      let res = await VideoConferenceService.VerifyMeetingService(
        bodyData,
        decoder(param?.id)
      );
      const { success, message } = res;
      if (success === 1) {
        setIsPassword(false);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setPasswordLoading(false);
  };
  const onConfirmAlert = () => {
    setIsAlertVisible(false);
    return true;
  };
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
      ) : roomData?.meetingData?.id ? (
        <div id="jitsiRoom">
          {isExpired ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100vh" }}
            >
              <div className="emptySec text-center w-100">
                <ImageElement source="daakia-logo.png" alt="No Data Found" />
                <h2>Room is expired</h2>
              </div>
            </div>
          ) : startTime ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100vh" }}
            >
              <div className="emptySec text-center w-100">
                <ImageElement source="daakia-logo.png" alt="No Data Found" />
                <h2>
                  This meeting is scheduled at{" "}
                  {dateFormatter(
                    roomData?.meetingData?.MeetingTimes?.[0]?.start_date,
                    "DD MMM YYYY, HH:mm"
                  )}
                  . Please wait for the host to start the meeting
                </h2>
              </div>
            </div>
          ) : roomData?.meetingData?.MeetingTimes?.[0]?.meeting_status ===
              "upcoming" && roomData?.meetingData?.event_mode === "lobby" ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100vh" }}
            >
              <div className="emptySec text-center w-100">
                <ImageElement source="daakia-logo.png" alt="No Data Found" />
                <h2>Please wait for the host to start the meeting</h2>
              </div>
            </div>
          ) : isRoomFull ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100vh" }}
            >
              <div className="emptySec text-center w-100">
                <ImageElement source="daakia-logo.png" alt="No Data Found" />
                <h2>Room is Full</h2>
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
          ) : IsPassword ? (
            <PasswordProtectedForm
              onSubmit={onSubmit}
              loading={passwordLoading}
            />
          ) : (
            <JitsiMeeting
              // domain="stag-meet.daakia.co.in"
              domain={config.JITSI_URL}
              roomName={`${roomData?.meetingData.id}-${roomName}`}
              getIFrameRef={(node) => (node.style.height = "100vh")}
              // userInfo={{ displayName: "" }}
              configOverwrite={{
                startWithAudioMuted: true,
                hiddenPremeetingButtons: ["invite"],
                logging: {
                  defaultLogLevel: "error",
                },
                prejoinPageEnabled: true,
                ...jitsiFeatures,
              }}
              onApiReady={(externalApi) => {
                handleApiReady(externalApi);
              }}
              onReadyToClose={() => {
                navigate(userRoutesMap.HOME.path);
              }}
            />
          )}
        </div>
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

export default JitsiMeetInvitee;
