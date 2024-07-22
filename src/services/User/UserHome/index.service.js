import { UserHome } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const UserHomeServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  userSubscriptionListingService: async ({ queryParams }) => {
    try {
      const payload = {
        ...UserHome.userSubscriptionListing,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  userActiveSubscriptionListingService: async ({ queryParams }) => {
    try {
      const payload = {
        ...UserHome.userActiveSubscription,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  unRegisterUserSubscriptionService: async () => {
    try {
      const payload = {
        ...UserHome.unRegisterUserSubscription,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  unRegisterUseAddMeetingService: async (bodyData) => {
    try {
      const payload = {
        ...UserHome.unRegisterUserAddMeeting,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  userMeetingDetailService: async ({ queryParams }) => {
    try {
      const payload = {
        ...UserHome.userMeetingRoomDetail,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateUserPlanMeetingsService: async (id, bodyData) => {
    try {
      const payload = {
        ...UserHome.updateUserPlanMeetings(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
