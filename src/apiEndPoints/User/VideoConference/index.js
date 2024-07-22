const VideoConferencing = {
  addMeeting: {
    url: `/v1.0/meeting`,
    method: "POST",
  },
  meetingList: {
    url: `/v1.0/meeting`,
    method: "GET",
  },
  updatePlanMeetings: (id) => ({
    url: `/v1.0/meeting/${id}`,
    method: "PUT",
  }),
  meetingRoomDetail: (id) => ({
    url: `/v1.0/basic-plan/${id}`,
    method: "GET",
  }),
  manageAttendance: {
    url: `/v1.0/attendance`,
    method: "POST",
  },
  updateManageAttendance: (id) => ({
    url: `/v1.0/attendance/${id}`,
    method: "PUT",
  }),
  verifyMeeting: (id) => ({
    url: `/v1.0/verify-meeting/${id}`,
    method: "POST",
  }),
  meetingDetail: (id) => ({
    url: `/v1.0/get-meeting/${id}`,
    method: "GET",
  }),
  deleteRecording: (id) => ({
    url: `/v1.0/remove-meeting-rec/${id}`,
    method: "PUT",
  }),
};

export default VideoConferencing;
