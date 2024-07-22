import { Users } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const UsersServices = {
  getUserListService: async ({ queryParams }) => {
    try {
      const payload = {
        ...Users.getUserList,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  UpdateUserStatusService: async (bodyData) => {
    try {
      const payload = {
        ...Users.updateUserStatus,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  AddEmailNotificationService: async (bodyData) => {
    try {
      const payload = {
        ...Users.addNotifications,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  getUserDetailsService: async (id) => {
    try {
      const payload = {
        ...Users.getUserDetails(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
