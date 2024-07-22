import { VideoConferencing } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const VideoConferenceService = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  addMeetingService: async (bodyData) => {
    try {
      const payload = {
        ...VideoConferencing.addMeeting,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  meetingListService: async ({ queryParams }) => {
    try {
      const payload = {
        ...VideoConferencing.meetingList,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updatePlanMeetingsService: async (id, bodyData) => {
    try {
      const payload = {
        ...VideoConferencing.updatePlanMeetings(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  meetingDetailService: async (id, { queryParams }) => {
    try {
      const payload = {
        ...VideoConferencing.meetingRoomDetail(id),
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  manageAttendanceService: async (bodyData) => {
    try {
      const payload = {
        ...VideoConferencing.manageAttendance,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateManageAttendanceService: async (bodyData, id) => {
    try {
      const payload = {
        ...VideoConferencing.updateManageAttendance(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  VerifyMeetingService: async (bodyData, id) => {
    try {
      const payload = {
        ...VideoConferencing.verifyMeeting(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  meetingDetailIdService: async (id) => {
    try {
      const payload = {
        ...VideoConferencing.meetingDetail(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  deleteRecordingService: async (id) => {
    try {
      const payload = {
        ...VideoConferencing.deleteRecording(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
