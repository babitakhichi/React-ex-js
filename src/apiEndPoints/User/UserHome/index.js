const UserHome = {
  userSubscriptionListing: {
    url: "/v1.0/subscription",
    method: "GET",
  },
  userActiveSubscription: {
    url: "/v1.0/user-subscription",
    method: "GET",
  },
  unRegisterUserSubscription: {
    url: "/v1.0/admin/guest_subscription",
    method: "GET",
  },
  unRegisterUserAddMeeting: {
    url: "/v1.0/guest_meeting",
    method: "POST",
  },
  userMeetingRoomDetail: {
    url: "/v1.0/guest_meeting",
    method: "GET",
  },
  updateUserPlanMeetings: (id) => ({
    url: `/v1.0/guest_meeting/${id}`,
    method: "PUT",
  }),
};
export default UserHome;
